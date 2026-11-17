import { Router } from 'express';
import {
  getPublicSettings,
  getAdminSettings,
  updateAdminSettings,
  settingsUpdateSchema,
} from '../controllers/settingsController.js';
import { requireAdmin } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';

export const publicSettingsRouter = Router();
publicSettingsRouter.get('/', getPublicSettings);

export const adminSettingsRouter = Router();
adminSettingsRouter.use(requireAdmin);
adminSettingsRouter.get('/', getAdminSettings);
adminSettingsRouter.put('/', validateRequest(settingsUpdateSchema), updateAdminSettings);
