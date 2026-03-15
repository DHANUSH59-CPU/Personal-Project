import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as orderService from '../services/order.service.js';
import * as paymentService from '../services/payment.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const data = await orderService.getUserOrders(req.user._id, page, limit);
  res.status(200).json(new ApiResponse(200, data));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, order));
});

// Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const data = await orderService.getAllOrders(req.query);
  res.status(200).json(new ApiResponse(200, data));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.orderStatus);
  res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, order, 'Order cancelled successfully'));
});

// Payment
export const initiatePayment = asyncHandler(async (req, res) => {
  const paymentData = await paymentService.createRazorpayOrder(req.params.orderId);
  res.status(200).json(new ApiResponse(200, paymentData));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await paymentService.verifyPayment(req.body);
  res.status(200).json(new ApiResponse(200, order, 'Payment verified'));
});
