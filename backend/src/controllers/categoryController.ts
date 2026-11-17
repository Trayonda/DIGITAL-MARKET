import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';
import { generateSlug } from '../utils/skuGenerator.js';
import { logAudit } from '../utils/auditLogger.js';

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters').trim(),
    slug: z.string().optional(),
    description: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

export const getPublicCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { publishStatus: 'PUBLISHED', deletedAt: null },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
      },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, slug, description, icon, sortOrder, isActive } = req.body;
    const finalSlug = slug ? generateSlug(slug) : generateSlug(name);

    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug: finalSlug }, { name }] },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'Category with this name or slug already exists' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        icon: icon || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    await logAudit(req.admin?.id, 'CREATE_CATEGORY', 'Category', category.id, { name: category.name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, sortOrder, isActive } = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug: slug !== undefined ? generateSlug(slug) : undefined,
        description: description !== undefined ? description : undefined,
        icon: icon !== undefined ? icon : undefined,
        sortOrder: sortOrder !== undefined ? sortOrder : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    await logAudit(req.admin?.id, 'UPDATE_CATEGORY', 'Category', id, { diff: req.body });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const productsCount = await prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (productsCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${productsCount} active products assigned to it. Please reassign or delete them first.`,
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    await logAudit(req.admin?.id, 'DELETE_CATEGORY', 'Category', id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
