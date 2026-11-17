import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.use(requireAdmin);
router.get('/', getDashboardMetrics);

export default router;
