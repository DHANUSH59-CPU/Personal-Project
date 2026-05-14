import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from a string.
 */
export const createSlug = (text) => {
  return slugify(text, { lower: true, strict: true });
};

/**
 * Escape regex special characters to prevent ReDoS / NoSQL injection.
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build pagination metadata for list responses.
 */
export const getPagination = (page, limit, totalDocs) => {
  const currentPage = parseInt(page, 10) || 1;
  const perPage = parseInt(limit, 10) || 12;
  const totalPages = Math.ceil(totalDocs / perPage);

  return {
    currentPage,
    perPage,
    totalDocs,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Build Mongoose filter object from query params for products.
 */
export const buildProductFilter = (query) => {
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.size) filter.size = query.size;
  if (query.absorbency) filter.absorbency = query.absorbency;
  if (query.material) filter.material = query.material;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    const safeSearch = escapeRegex(query.search.trim());
    filter.$or = [
      { name: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  return filter;
};

/**
 * Build Mongoose sort object from query param.
 */
export const buildSortOption = (sortBy) => {
  const sortOptions = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'newest': { createdAt: -1 },
    'rating': { avgRating: -1 },
    'name-asc': { name: 1 },
    'name-desc': { name: -1 },
  };

  return sortOptions[sortBy] || { createdAt: -1 };
};
