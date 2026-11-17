import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getDashboardMetrics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalProducts,
      availableProducts,
      soldProducts,
      unpublishedProducts,
      totalEnquiries,
      newEnquiries,
      recentEnquiries,
      recentProducts,
      categories,
    ] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { availabilityStatus: 'AVAILABLE', publishStatus: 'PUBLISHED', deletedAt: null } }),
      prisma.product.count({ where: { availabilityStatus: 'SOLD', deletedAt: null } }),
      prisma.product.count({ where: { publishStatus: { in: ['DRAFT', 'UNPUBLISHED'] }, deletedAt: null } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: { where: { deletedAt: null } } } },
        },
      }),
    ]);

    // Calculate total enquiry pipeline value
    const allEnquiries = await prisma.enquiry.findMany({
      select: { estimatedTotal: true },
    });
    const totalPipelineValue = allEnquiries.reduce((acc, curr) => acc + Number(curr.estimatedTotal), 0);

    res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          available: availableProducts,
          sold: soldProducts,
          unpublished: unpublishedProducts,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          totalPipelineValue,
        },
        recentEnquiries,
        recentProducts,
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          productCount: c._count.products,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
