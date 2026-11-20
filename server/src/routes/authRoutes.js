import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { registerSchema, loginSchema, profileSchema } from '../services/authService.js';
import * as controller from '../controllers/authController.js';

const router = Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
router.post('/register', authLimit, validate(registerSchema), controller.register);
router.post('/login', authLimit, validate(loginSchema), controller.login);
router.get('/me', auth, controller.me);
router.patch('/profile', auth, validate(profileSchema), controller.updateProfile);
export default router;
