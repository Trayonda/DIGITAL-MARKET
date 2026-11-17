import { Router } from 'express';
import {
  createEnquiry,
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatus,
  enquiryCreateSchema,
  enquiryStatusUpdateSchema,
} from '../controllers/enquiryController.js';
import { requireAdmin } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { enquiryLimiter } from '../middlewares/rateLimiter.js';

export const publicEnquiryRouter = Router();
publicEnquiryRouter.post('/', enquiryLimiter, validateRequest(enquiryCreateSchema), createEnquiry);

export const adminEnquiryRouter = Router();
adminEnquiryRouter.use(requireAdmin);
adminEnquiryRouter.get('/', getAdminEnquiries);
adminEnquiryRouter.get('/:id', getAdminEnquiryById);
adminEnquiryRouter.put('/:id', validateRequest(enquiryStatusUpdateSchema), updateEnquiryStatus);
