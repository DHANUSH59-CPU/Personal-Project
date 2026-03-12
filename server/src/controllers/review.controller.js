import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, reviews));
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  // Check if user already reviewed
  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) throw new ApiError(400, 'You have already reviewed this product');

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  // Update product's average rating
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  }

  res.status(201).json(new ApiResponse(201, review, 'Review added'));
});
