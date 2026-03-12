import { Router } from 'express';
import { createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus, initiatePayment, verifyPayment } from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';

const router = Router();

router.use(authenticate); // All order routes need auth

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

// Payment
router.post('/:orderId/pay', initiatePayment);
router.post('/verify-payment', verifyPayment);

// Admin
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
