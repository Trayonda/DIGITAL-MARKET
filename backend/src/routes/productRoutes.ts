import { Router } from 'express';
import {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  toggleFeatured,
  productCreateSchema,
  productUpdateSchema,
} from '../controllers/productController.js';
import { requireAdmin } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';

export const publicProductRouter = Router();
publicProductRouter.get('/', getPublicProducts);
publicProductRouter.get('/:slug', getPublicProductBySlug);

export const adminProductRouter = Router();
adminProductRouter.use(requireAdmin);
adminProductRouter.get('/', getAdminProducts);
adminProductRouter.get('/:id', getAdminProductById);
adminProductRouter.post('/', validateRequest(productCreateSchema), createProduct);
adminProductRouter.put('/:id', validateRequest(productUpdateSchema), updateProduct);
adminProductRouter.delete('/:id', deleteProduct);
adminProductRouter.post('/:id/duplicate', duplicateProduct);
adminProductRouter.patch('/:id/toggle-featured', toggleFeatured);
