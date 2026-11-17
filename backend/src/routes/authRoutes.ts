import { Router } from 'express';
import { login, logout, getMe, changePassword, loginSchema, changePasswordSchema } from '../controllers/authController.js';
import { requireAdmin } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/login', loginLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);
router.put('/change-password', requireAdmin, validateRequest(changePasswordSchema), changePassword);

export default router;
