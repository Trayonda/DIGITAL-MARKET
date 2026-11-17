import { Router } from 'express';
import authRoutes from './authRoutes.js';
import { publicProductRouter, adminProductRouter } from './productRoutes.js';
import { publicCategoryRouter, adminCategoryRouter } from './categoryRoutes.js';
import { publicEnquiryRouter, adminEnquiryRouter } from './enquiryRoutes.js';
import { publicSettingsRouter, adminSettingsRouter } from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const apiRouter = Router();

// Public routes
apiRouter.use('/products', publicProductRouter);
apiRouter.use('/categories', publicCategoryRouter);
apiRouter.use('/enquiries', publicEnquiryRouter);
apiRouter.use('/store-settings', publicSettingsRouter);

// Admin routes
apiRouter.use('/admin', authRoutes);
apiRouter.use('/admin/dashboard', dashboardRoutes);
apiRouter.use('/admin/products', adminProductRouter);
apiRouter.use('/admin/categories', adminCategoryRouter);
apiRouter.use('/admin/enquiries', adminEnquiryRouter);
apiRouter.use('/admin/settings', adminSettingsRouter);
apiRouter.use('/admin/upload', uploadRoutes);

export default apiRouter;
