import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', authenticate, createReview);

export default router;
