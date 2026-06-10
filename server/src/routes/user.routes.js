import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getAllUsers } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

// Admin
router.get('/', authenticate, authorize('admin'), getAllUsers);

export default router;
