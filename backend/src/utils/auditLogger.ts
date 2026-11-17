import { prisma } from '../config/db.js';

export const logAudit = async (
  adminId: string | undefined,
  action: string,
  entity: string,
  entityId: string,
  meta: Record<string, any> = {}
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: adminId || null,
        action,
        entity,
        entityId,
        meta: JSON.stringify(meta),
      },
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
};
