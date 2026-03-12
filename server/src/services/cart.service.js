import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get user's cart, populated with product details.
 */
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate('items.product', 'name price mrp images stock isActive slug');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

/**
 * Add item to cart.
 */
export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found or unavailable');
  }

  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} items available in stock`);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > product.stock) {
      throw new ApiError(400, `Only ${product.stock} items available in stock`);
    }
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  return Cart.findOne({ user: userId })
    .populate('items.product', 'name price mrp images stock isActive slug');
};

/**
 * Update cart item quantity.
 */
export const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.id(itemId);
  if (!item) throw new ApiError(404, 'Item not found in cart');

  const product = await Product.findById(item.product);
  if (quantity > product.stock) {
    throw new ApiError(400, `Only ${product.stock} items available in stock`);
  }

  item.quantity = quantity;
  await cart.save();

  return Cart.findOne({ user: userId })
    .populate('items.product', 'name price mrp images stock isActive slug');
};

/**
 * Remove item from cart.
 */
export const removeCartItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  await cart.save();

  return Cart.findOne({ user: userId })
    .populate('items.product', 'name price mrp images stock isActive slug');
};

/**
 * Clear entire cart.
 */
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = [];
  await cart.save();

  return cart;
};
