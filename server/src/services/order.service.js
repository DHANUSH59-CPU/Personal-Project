import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/helpers.js';

/**
 * Create a new order from the user's cart.
 */
export const createOrder = async (userId, orderData) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  // Validate stock and build order items
  const items = [];
  let itemsTotal = 0;
  const stockUpdates = [];

  for (const cartItem of cart.items) {
    const product = cartItem.product;
    if (!product || !product.isActive) {
      throw new ApiError(400, `Product "${product?.name || 'Unknown'}" is unavailable`);
    }
    if (product.stock < cartItem.quantity) {
      throw new ApiError(400, `"${product.name}" has only ${product.stock} in stock`);
    }

    items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      quantity: cartItem.quantity,
    });

    itemsTotal += product.price * cartItem.quantity;

    // Prepare atomic stock update
    stockUpdates.push({
      updateOne: {
        filter: { _id: product._id, stock: { $gte: cartItem.quantity } },
        update: { $inc: { stock: -cartItem.quantity } },
      },
    });
  }

  // Apply coupon if provided (atomic to prevent race condition)
  let discount = 0;
  let couponId = null;

  if (orderData.couponCode) {
    // Atomic: find coupon and increment usage in one operation
    const coupon = await Coupon.findOneAndUpdate(
      {
        code: orderData.couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
        $or: [
          { usageLimit: { $exists: false } },
          { usageLimit: 0 },
          { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
        ],
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) throw new ApiError(400, 'Invalid, expired, or fully used coupon');
    if (itemsTotal < coupon.minOrderAmount) {
      // Rollback coupon usage
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: -1 } });
      throw new ApiError(400, `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
    }

    if (coupon.type === 'percentage') {
      discount = (itemsTotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    couponId = coupon._id;
  }

  // Calculate shipping (free above ₹499)
  const shippingCost = itemsTotal >= 499 ? 0 : 49;
  const totalAmount = itemsTotal - discount + shippingCost;

  // Atomic stock deduction via bulkWrite (prevents overselling)
  const stockResult = await Product.bulkWrite(stockUpdates);
  if (stockResult.modifiedCount !== stockUpdates.length) {
    // Some products went out of stock between check and update — rollback
    // Restore any stock that was decremented
    const restoreOps = stockUpdates.map((op) => ({
      updateOne: {
        filter: { _id: op.updateOne.filter._id },
        update: { $inc: { stock: Math.abs(op.updateOne.update.$inc.stock) } },
      },
    }));
    await Product.bulkWrite(restoreOps);

    // Rollback coupon if used
    if (couponId) {
      await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: -1 } });
    }
    throw new ApiError(400, 'Some items went out of stock. Please refresh and try again.');
  }

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    itemsTotal,
    shippingCost,
    discount,
    totalAmount,
    coupon: couponId,
    notes: orderData.notes,
  });

  // Clear cart
  cart.items = [];
  await cart.save();

  return order;
};

/**
 * Get user's orders.
 */
export const getUserOrders = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, totalDocs] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);

  const pagination = getPagination(page, limit, totalDocs);
  return { orders, pagination };
};

/**
 * Get order by ID (user or admin).
 */
export const getOrderById = async (orderId, userId = null) => {
  const query = { _id: orderId };
  if (userId) query.user = userId;

  const order = await Order.findOne(query).populate('user', 'name email').lean();
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

/**
 * Update order status (admin).
 */
export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  order.orderStatus = status;
  if (status === 'delivered') {
    order.paymentStatus = 'paid';
    order.deliveredAt = new Date();
  }
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    // Restore stock atomically via bulkWrite
    const restoreOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      },
    }));
    await Product.bulkWrite(restoreOps);
  }

  await order.save();
  return order;
};

/**
 * Get all orders (admin).
 */
export const getAllOrders = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.orderStatus) filter.orderStatus = query.orderStatus;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;

  const [orders, totalDocs] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const pagination = getPagination(page, limit, totalDocs);
  return { orders, pagination };
};

/**
 * Cancel an order (user) — only allowed for processing/confirmed orders.
 */
export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');

  const cancellableStatuses = ['processing', 'confirmed'];
  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw new ApiError(400, `Order cannot be cancelled once it is "${order.orderStatus}"`);
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();

  // Restore stock atomically via bulkWrite
  const restoreOps = order.items.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: item.quantity } },
    },
  }));
  await Product.bulkWrite(restoreOps);

  await order.save();
  return order;
};
