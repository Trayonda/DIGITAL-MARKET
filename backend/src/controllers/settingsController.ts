import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';
import { logAudit } from '../utils/auditLogger.js';

export const settingsUpdateSchema = z.object({
  body: z.object({
    businessName: z.string().min(2).optional(),
    businessTagline: z.string().optional().nullable(),
    logoUrl: z.string().optional().nullable(),
    whatsappNumber: z.string().min(10, 'Valid WhatsApp phone number required').optional(),
    contactPhone: z.string().optional().nullable(),
    contactEmail: z.string().email().optional().nullable(),
    address: z.string().optional().nullable(),
    googleMapsUrl: z.string().optional().nullable(),
    currencySymbol: z.string().default('₹'),
    defaultWarrantyText: z.string().optional().nullable(),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    socialLinks: z.record(z.any()).optional(),
  }),
});

export const getPublicSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await prisma.storeSetting.findUnique({
      where: { id: 'STORE_CONFIG' },
    });

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 'STORE_CONFIG',
          businessName: 'DIGITAL MARKET',
          whatsappNumber: '919650624535',
        },
      });
    }

    let parsedSocial = {};
    try {
      parsedSocial = typeof settings.socialLinks === 'string' ? JSON.parse(settings.socialLinks) : settings.socialLinks;
    } catch {
      parsedSocial = {};
    }

    res.json({
      success: true,
      data: {
        businessName: settings.businessName,
        businessTagline: settings.businessTagline,
        logoUrl: settings.logoUrl,
        whatsappNumber: settings.whatsappNumber,
        contactPhone: settings.contactPhone,
        contactEmail: settings.contactEmail,
        address: settings.address,
        googleMapsUrl: settings.googleMapsUrl,
        currencySymbol: settings.currencySymbol,
        defaultWarrantyText: settings.defaultWarrantyText,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        socialLinks: parsedSocial,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await prisma.storeSetting.findUnique({
      where: { id: 'STORE_CONFIG' },
    });

    let parsedSocial = {};
    try {
      parsedSocial = typeof settings?.socialLinks === 'string' ? JSON.parse(settings.socialLinks) : settings?.socialLinks;
    } catch {
      parsedSocial = {};
    }

    res.json({
      success: true,
      data: {
        ...settings,
        socialLinks: parsedSocial,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body;

    // Clean WhatsApp number
    let cleanWhatsApp = data.whatsappNumber ? data.whatsappNumber.replace(/[^0-9]/g, '') : undefined;
    if (cleanWhatsApp && cleanWhatsApp.length === 10) {
      cleanWhatsApp = `91${cleanWhatsApp}`; // Auto-prepend Indian country code if 10 digits
    }

    const updated = await prisma.storeSetting.upsert({
      where: { id: 'STORE_CONFIG' },
      update: {
        businessName: data.businessName,
        businessTagline: data.businessTagline,
        logoUrl: data.logoUrl,
        whatsappNumber: cleanWhatsApp,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        address: data.address,
        googleMapsUrl: data.googleMapsUrl,
        currencySymbol: data.currencySymbol,
        defaultWarrantyText: data.defaultWarrantyText,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : undefined,
      },
      create: {
        id: 'STORE_CONFIG',
        businessName: data.businessName || 'DIGITAL MARKET',
        whatsappNumber: cleanWhatsApp || '919650624535',
        socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : '{}',
      },
    });

    await logAudit(req.admin?.id, 'UPDATE_SETTINGS', 'StoreSetting', 'STORE_CONFIG', {
      updatedFields: Object.keys(data),
    });

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
