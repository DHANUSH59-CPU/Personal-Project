import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '../config/env.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order for payment.
 */
export const createRazorpayOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const razorpayOrder = await razorpay.orders.create({
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
