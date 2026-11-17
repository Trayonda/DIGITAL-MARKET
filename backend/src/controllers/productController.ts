import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';
import { generateSKU, generateSlug } from '../utils/skuGenerator.js';
import { logAudit } from '../utils/auditLogger.js';

// Validation Schemas
export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters').trim(),
    brand: z.string().min(1, 'Brand is required').trim(),
    model: z.string().min(1, 'Model is required').trim(),
    categoryId: z.string().uuid('Valid Category ID is required'),
    condition: z.enum(['BRAND_NEW', 'OPEN_BOX', 'EXCELLENT_REFURBISHED', 'VERY_GOOD', 'GOOD']),
    description: z.string().min(10, 'Description must be at least 10 characters').trim(),
    specifications: z.record(z.any()).default({}),
    internalCostPrice: z.number().min(0, 'Internal cost price must be positive'),
    sellingPrice: z.number().min(1, 'Selling price must be greater than zero'),
    originalPrice: z.number().optional().nullable(),
    warranty: z.string().optional().nullable(),
    stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').default(1),
    availabilityStatus: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'SOLD', 'RESERVED']).default('AVAILABLE'),
    publishStatus: z.enum(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']).default('PUBLISHED'),
    isFeatured: z.boolean().default(false),
    images: z.array(z.object({
      url: z.string().url('Valid image URL required'),
      publicId: z.string().optional().nullable(),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    })).min(1, 'At least one product image is required'),
  }),
});

export const productUpdateSchema = z.object({
  body: productCreateSchema.shape.body.partial(),
});

// Helper: Parse JSON string if stored as string (SQLite compatibility)
const parseSpecs = (specs: any) => {
  if (typeof specs === 'string') {
    try {
      return JSON.parse(specs);
    } catch {
      return {};
    }
  }
  return specs || {};
};

// -----------------------------------------------------------------------------
// PUBLIC CONTROLLERS (Customer Facing)
// -----------------------------------------------------------------------------

export const getPublicProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search,
      category,
      brand,
      condition,
      minPrice,
      maxPrice,
      availability,
      isFeatured,
      sortBy = 'newest',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // Filter construction
    const where: any = {
      publishStatus: 'PUBLISHED',
      deletedAt: null,
    };

    if (category) {
      where.category = {
        OR: [
          { slug: category as string },
          { id: category as string },
        ],
      };
    }

    if (brand) {
      where.brand = {
        equals: brand as string,
      };
    }

    if (condition) {
      where.condition = condition as string;
    }

    if (availability) {
      where.availabilityStatus = availability as string;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) where.sellingPrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.sellingPrice.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      const q = (search as string).trim();
      where.OR = [
        { name: { contains: q } },
        { brand: { contains: q } },
        { model: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
        { specifications: { contains: q } },
      ];
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { sellingPrice: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { sellingPrice: 'desc' };
    } else if (sortBy === 'popular') {
      orderBy = { viewsCount: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        select: {
          id: true,
          sku: true,
          slug: true,
          name: true,
          brand: true,
          model: true,
          condition: true,
          description: true,
          specifications: true,
          sellingPrice: true,
          originalPrice: true,
          warranty: true,
          stockQuantity: true,
          availabilityStatus: true,
          isFeatured: true,
          viewsCount: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            select: { id: true, url: true, isPrimary: true, sortOrder: true },
          },
          createdAt: true,
          // internalCostPrice is strictly omitted!
        },
      }),
    ]);

    // Format specifications
    const formattedProducts = products.map((p) => ({
      ...p,
      specifications: parseSpecs(p.specifications),
    }));

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        publishStatus: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        sku: true,
        slug: true,
        name: true,
        brand: true,
        model: true,
        condition: true,
        description: true,
        specifications: true,
        sellingPrice: true,
        originalPrice: true,
        warranty: true,
        stockQuantity: true,
        availabilityStatus: true,
        isFeatured: true,
        viewsCount: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          select: { id: true, url: true, isPrimary: true, sortOrder: true },
        },
        createdAt: true,
        // internalCostPrice strictly omitted!
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found or is currently unavailable',
      });
      return;
    }

    // Increment view count asynchronously
    prisma.product.update({
      where: { id: product.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        publishStatus: 'PUBLISHED',
        deletedAt: null,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sku: true,
        slug: true,
        name: true,
        brand: true,
        model: true,
        condition: true,
        sellingPrice: true,
        originalPrice: true,
        availabilityStatus: true,
        specifications: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...product,
        specifications: parseSpecs(product.specifications),
      },
      related: relatedProducts.map((p) => ({
        ...p,
        specifications: parseSpecs(p.specifications),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// ADMIN CONTROLLERS (Private & Authorized)
// -----------------------------------------------------------------------------

export const getAdminProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search,
      category,
      brand,
      status,
      availability,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      deletedAt: null,
    };

    if (category) {
      where.categoryId = category as string;
    }

    if (brand) {
      where.brand = brand as string;
    }

    if (status) {
      where.publishStatus = status as string;
    }

    if (availability) {
      where.availabilityStatus = availability as string;
    }

    if (search) {
      const q = (search as string).trim();
      where.OR = [
        { name: { contains: q } },
        { brand: { contains: q } },
        { model: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        },
      }),
    ]);

    res.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        specifications: parseSpecs(p.specifications),
      })),
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

export const getAdminProductById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
    });

    if (!product || product.deletedAt !== null) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...product,
        specifications: parseSpecs(product.specifications),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body;

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      res.status(400).json({ success: false, message: 'Selected category does not exist' });
      return;
    }

    const sku = generateSKU(category.slug, data.brand, data.model);
    const slug = generateSlug(data.name);

    const product = await prisma.product.create({
      data: {
        sku,
        slug,
        name: data.name,
        brand: data.brand,
        model: data.model,
        categoryId: data.categoryId,
        condition: data.condition,
        description: data.description,
        specifications: typeof data.specifications === 'string' ? data.specifications : JSON.stringify(data.specifications || {}),
        internalCostPrice: data.internalCostPrice,
        sellingPrice: data.sellingPrice,
        originalPrice: data.originalPrice || null,
        warranty: data.warranty || null,
        stockQuantity: data.stockQuantity !== undefined ? data.stockQuantity : 1,
        availabilityStatus: data.availabilityStatus || 'AVAILABLE',
        publishStatus: data.publishStatus || 'PUBLISHED',
        isFeatured: data.isFeatured || false,
        images: {
          create: (data.images || []).map((img: any, idx: number) => ({
            url: img.url,
            publicId: img.publicId || null,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            sortOrder: img.sortOrder !== undefined ? img.sortOrder : idx,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    await logAudit(req.admin?.id, 'CREATE_PRODUCT', 'Product', product.id, {
      name: product.name,
      sku: product.sku,
      sellingPrice: product.sellingPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product,
        specifications: parseSpecs(product.specifications),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing || existing.deletedAt !== null) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Auto-update availability if stock is 0
    let availability = data.availabilityStatus !== undefined ? data.availabilityStatus : existing.availabilityStatus;
    if (data.stockQuantity !== undefined && data.stockQuantity === 0 && availability === 'AVAILABLE') {
      availability = 'OUT_OF_STOCK';
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        brand: data.brand !== undefined ? data.brand : undefined,
        model: data.model !== undefined ? data.model : undefined,
        categoryId: data.categoryId !== undefined ? data.categoryId : undefined,
        condition: data.condition !== undefined ? data.condition : undefined,
        description: data.description !== undefined ? data.description : undefined,
        specifications: data.specifications !== undefined ? (typeof data.specifications === 'string' ? data.specifications : JSON.stringify(data.specifications)) : undefined,
        internalCostPrice: data.internalCostPrice !== undefined ? data.internalCostPrice : undefined,
        sellingPrice: data.sellingPrice !== undefined ? data.sellingPrice : undefined,
        originalPrice: data.originalPrice !== undefined ? data.originalPrice : undefined,
        warranty: data.warranty !== undefined ? data.warranty : undefined,
        stockQuantity: data.stockQuantity !== undefined ? data.stockQuantity : undefined,
        availabilityStatus: availability,
        publishStatus: data.publishStatus !== undefined ? data.publishStatus : undefined,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Handle Image Updates if provided
    if (Array.isArray(data.images)) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      await prisma.productImage.createMany({
        data: data.images.map((img: any, idx: number) => ({
          productId: id,
          url: img.url,
          publicId: img.publicId || null,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          sortOrder: img.sortOrder !== undefined ? img.sortOrder : idx,
        })),
      });
    }

    await logAudit(req.admin?.id, 'UPDATE_PRODUCT', 'Product', id, {
      diff: data,
    });

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...finalProduct,
        specifications: parseSpecs(finalProduct?.specifications),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Soft delete to protect historical enquiry references
    await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        publishStatus: 'UNPUBLISHED',
        availabilityStatus: 'SOLD',
      },
    });

    await logAudit(req.admin?.id, 'DELETE_PRODUCT_SOFT', 'Product', id, {
      name: existing.name,
      sku: existing.sku,
    });

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const source = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    if (!source) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const newSku = generateSKU(source.category.slug, source.brand, source.model);
    const newName = `${source.name} (Copy)`;
    const newSlug = generateSlug(newName);

    const duplicate = await prisma.product.create({
      data: {
        sku: newSku,
        slug: newSlug,
        name: newName,
        brand: source.brand,
        model: source.model,
        categoryId: source.categoryId,
        condition: source.condition,
        description: source.description,
        specifications: source.specifications,
        internalCostPrice: source.internalCostPrice,
        sellingPrice: source.sellingPrice,
        originalPrice: source.originalPrice,
        warranty: source.warranty,
        stockQuantity: 1,
        availabilityStatus: 'AVAILABLE',
        publishStatus: 'DRAFT', // Duplicate starts as DRAFT
        isFeatured: false,
        images: {
          create: source.images.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    await logAudit(req.admin?.id, 'DUPLICATE_PRODUCT', 'Product', duplicate.id, {
      sourceId: source.id,
      newSku: duplicate.sku,
    });

    res.status(201).json({
      success: true,
      message: 'Product duplicated successfully as Draft',
      data: {
        ...duplicate,
        specifications: parseSpecs(duplicate.specifications),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFeatured = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    });

    res.json({
      success: true,
      message: `Product ${updated.isFeatured ? 'featured on homepage' : 'unfeatured'}`,
      isFeatured: updated.isFeatured,
    });
  } catch (error) {
    next(error);
  }
};
