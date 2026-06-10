import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator.js';

const router = Router();

router.use(authenticate); // All cart routes need auth

router.get('/', getCart);
router.post('/', validate(addToCartSchema), addToCart);
router.put('/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;
