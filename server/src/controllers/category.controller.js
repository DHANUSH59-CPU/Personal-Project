import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Category from '../models/Category.js';
import { createSlug } from '../utils/helpers.js';
import ApiError from '../utils/ApiError.js';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, categories));
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, category));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const slug = createSlug(name);

  const category = await Category.create({ name, slug, description });
  res.status(201).json(new ApiResponse(201, category, 'Category created'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (updates.name) updates.slug = createSlug(updates.name);

  const category = await Category.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, category, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, null, 'Category deleted'));
});
