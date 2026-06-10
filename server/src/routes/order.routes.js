import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus, cancelOrder, initiatePayment, verifyPayment } from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';

const router = Router();

// Strict limit on payment endpoints — prevent payment abuse
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many payment attempts, please try again later' },
});

router.use(authenticate); // All order routes need auth

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

// Payment
router.post('/:orderId/pay', paymentLimiter, initiatePayment);
router.post('/verify-payment', paymentLimiter, verifyPayment);

// Admin
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
