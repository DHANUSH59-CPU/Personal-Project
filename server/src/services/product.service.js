import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { createSlug, buildProductFilter, buildSortOption, getPagination } from '../utils/helpers.js';

/**
 * Get products with filtering, searching, sorting, and pagination.
 */
export const getProducts = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = buildProductFilter(query);
  const sort = buildSortOption(query.sort || query.sortBy);

  const [products, totalDocs] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  const pagination = getPagination(page, limit, totalDocs);

  return { products, pagination };
};

/**
 * Get single product by slug.
 */
export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug');

  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

/**
 * Get single product by ID.
 */
export const getProductById = async (id) => {
  const product = await Product.findById(id).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

/**
 * Create a new product (admin).
 */
export const createProduct = async (data) => {
  data.slug = createSlug(data.name);

  // Ensure unique slug
  const existingSlug = await Product.findOne({ slug: data.slug });
  if (existingSlug) {
    data.slug = `${data.slug}-${Date.now()}`;
  }

  const product = await Product.create(data);
  return product;
};

/**
 * Update a product (admin).
 */
export const updateProduct = async (id, data) => {
  if (data.name) {
    data.slug = createSlug(data.name);
    const existingSlug = await Product.findOne({ slug: data.slug, _id: { $ne: id } });
    if (existingSlug) {
      data.slug = `${data.slug}-${Date.now()}`;
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

/**
 * Soft-delete a product (admin).
 */
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};
