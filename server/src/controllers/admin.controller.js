import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [totalProducts, totalUsers, orderStats] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]),
  ]);

  const stats = {
    totalProducts,
    totalUsers,
    totalOrders: orderStats[0]?.totalOrders || 0,
    totalRevenue: orderStats[0]?.totalRevenue || 0,
  };

  res.status(200).json(new ApiResponse(200, stats));
});
