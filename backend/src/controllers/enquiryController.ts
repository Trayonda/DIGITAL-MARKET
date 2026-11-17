import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';
import { generateEnquiryRef } from '../utils/skuGenerator.js';
import { generateWhatsAppMessage, createWhatsAppUrl } from '../services/whatsappService.js';
import { logAudit } from '../utils/auditLogger.js';

export const enquiryCreateSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Name must be at least 2 characters').trim(),
    customerPhone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    customerCity: z.string().min(2, 'City is required').trim(),
    customerMessage: z.string().max(500, 'Message cannot exceed 500 characters').optional().nullable(),
    items: z.array(z.object({
      productId: z.string().uuid('Valid Product ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })).min(1, 'Cart is empty. Add at least one product.'),
  }),
});

export const enquiryStatusUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['NEW', 'CONTACTED', 'NEGOTIATION', 'CONVERTED', 'CLOSED']).optional(),
    internalNotes: z.string().max(1000).optional().nullable(),
  }),
});

export const createEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customerName, customerPhone, customerCity, customerMessage, items } = req.body;

    // 1. Fetch products from DB to strictly verify availability and real selling prices
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });

    const productMap = new Map<string, typeof dbProducts[0]>();
    dbProducts.forEach((p) => productMap.set(p.id, p));

    // 2. Validate availability and stock constraints
    let calculatedSubtotal = 0;
    const validatedItemsData: any[] = [];
    const whatsappItems: any[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product || product.publishStatus !== 'PUBLISHED') {
        res.status(400).json({
          success: false,
          message: `One of the products in your cart is no longer available. Please refresh your cart.`,
        });
        return;
      }

      if (product.availabilityStatus !== 'AVAILABLE' || product.stockQuantity <= 0) {
        res.status(400).json({
          success: false,
          message: `"${product.name}" is sold out. Please remove it from your cart before sending enquiry.`,
        });
        return;
      }

      if (item.quantity > product.stockQuantity) {
        res.status(400).json({
          success: false,
          message: `Requested quantity (${item.quantity}) for "${product.name}" exceeds available stock (${product.stockQuantity}).`,
        });
        return;
      }

      const unitPrice = Number(product.sellingPrice);
      calculatedSubtotal += unitPrice * item.quantity;

      // Create snapshot data
      validatedItemsData.push({
        productId: product.id,
        productSku: product.sku,
        productName: product.name,
        unitPrice: unitPrice,
        quantity: item.quantity,
        specSnapshot: typeof product.specifications === 'string' ? product.specifications : JSON.stringify(product.specifications || {}),
      });

      // Prepare specs summary for WhatsApp message
      let specsSummary = '';
      try {
        const specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
        if (specs && typeof specs === 'object') {
          const parts = [];
          if (specs.processor) parts.push(specs.processor);
          if (specs.ram) parts.push(specs.ram);
          if (specs.storageCapacity) parts.push(`${specs.storageCapacity} ${specs.storageType || ''}`);
          specsSummary = parts.join(', ');
        }
      } catch {
        specsSummary = '';
      }

      whatsappItems.push({
        name: product.name,
        sku: product.sku,
        specsSummary,
        quantity: item.quantity,
        unitPrice,
      });
    }

    const estimatedTotal = calculatedSubtotal;
    const enquiryRef = generateEnquiryRef();

    // 3. Fetch Store Settings for WhatsApp number
    const settings = await prisma.storeSetting.findUnique({
      where: { id: 'STORE_CONFIG' },
    });

    const businessWhatsApp = settings?.whatsappNumber || '919650624535';
    const businessName = settings?.businessName || 'DIGITAL MARKET';

    // 4. Save Enquiry and Items in DB transaction
    const enquiry = await prisma.$transaction(async (tx) => {
      const created = await tx.enquiry.create({
        data: {
          enquiryRef,
          customerName,
          customerPhone,
          customerCity,
          customerMessage: customerMessage || null,
          status: 'NEW',
          subtotal: calculatedSubtotal,
          estimatedTotal,
          ipAddress: req.ip || null,
          items: {
            create: validatedItemsData.map((d) => ({
              productId: d.productId,
              productSku: d.productSku,
              productName: d.productName,
              unitPrice: d.unitPrice,
              quantity: d.quantity,
              specSnapshot: d.specSnapshot,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return created;
    });

    // 5. Generate formatted WhatsApp Message & Link
    const messageText = generateWhatsAppMessage({
      enquiryRef,
      customerName,
      customerPhone,
      customerCity,
      customerMessage,
      items: whatsappItems,
      estimatedTotal,
      businessWhatsApp,
      businessName,
    });

    const whatsappUrl = createWhatsAppUrl(businessWhatsApp, messageText);

    res.status(201).json({
      success: true,
      message: 'Enquiry created successfully',
      data: {
        enquiryRef: enquiry.enquiryRef,
        customerName: enquiry.customerName,
        subtotal: calculatedSubtotal,
        estimatedTotal,
        itemsCount: enquiry.items.length,
        whatsappUrl,
        messageText,
        businessWhatsApp,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminEnquiries = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    if (search) {
      const q = (search as string).trim();
      where.OR = [
        { enquiryRef: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { customerCity: { contains: q } },
      ];
    }

    const [total, enquiries] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          items: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminEnquiryById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
      },
      include: { items: true },
    });

    await logAudit(req.admin?.id, 'UPDATE_ENQUIRY_STATUS', 'Enquiry', id, {
      oldStatus: existing.status,
      newStatus: status,
      notesUpdated: internalNotes !== undefined,
    });

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
