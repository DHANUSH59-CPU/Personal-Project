import { Router } from 'express';
import { createCoupon, getCoupons, validateCoupon, deleteCoupon } from '../controllers/coupon.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/validate/:code', authenticate, validateCoupon);

// Admin
router.post('/', authenticate, authorize('admin'), createCoupon);
router.get('/', authenticate, authorize('admin'), getCoupons);
router.delete('/:id', authenticate, authorize('admin'), deleteCoupon);

export default router;
