import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '../config/env.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

// Lazy init — only created when a payment is actually triggered
const getRazorpay = () => {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET ||
      env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
    throw new ApiError(503, 'Online payment is not configured. Please use Cash on Delivery.');
  }
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * Create a Razorpay order for payment.
 */
export const createRazorpayOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const razorpayOrder = await getRazorpay().orders.create({
    amount: Math.round(order.totalAmount * 100), // Razorpay uses paise
    currency: 'INR',
    receipt: orderId.toString(),
    notes: {
      orderId: orderId.toString(),
    },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: env.RAZORPAY_KEY_ID,
  };
};

/**
 * Verify Razorpay payment signature and update order.
 */
export const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Payment verification failed');
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) throw new ApiError(404, 'Order not found');

  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  await order.save();

  return order;
};
