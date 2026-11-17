import { Router } from 'express';
import { uploadImages, uploadMiddleware } from '../controllers/uploadController.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.use(requireAdmin);
router.post('/', uploadMiddleware.array('images', 10), uploadImages);

export default router;
