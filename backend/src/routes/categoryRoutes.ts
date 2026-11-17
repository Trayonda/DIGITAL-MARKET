import { Router } from 'express';
import {
  getPublicCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  categorySchema,
} from '../controllers/categoryController.js';
import { requireAdmin } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';

export const publicCategoryRouter = Router();
publicCategoryRouter.get('/', getPublicCategories);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(requireAdmin);
adminCategoryRouter.get('/', getAdminCategories);
adminCategoryRouter.post('/', validateRequest(categorySchema), createCategory);
adminCategoryRouter.put('/:id', validateRequest(categorySchema), updateCategory);
adminCategoryRouter.delete('/:id', deleteCategory);
