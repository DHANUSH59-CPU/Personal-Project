export const API_BASE_URL = '/api';

export const PRODUCT_SIZES = ['Regular', 'Large', 'XL', 'XXL'];
export const ABSORBENCY_LEVELS = ['Light', 'Medium', 'Heavy', 'Overnight'];
export const MATERIALS = ['Cotton', 'Organic Cotton', 'Bamboo Fiber', 'Ultra-Soft Top Sheet'];

export const ORDER_STATUSES = {
  processing: { label: 'Processing', color: '#FF9800' },
  confirmed: { label: 'Confirmed', color: '#2196F3' },
  shipped: { label: 'Shipped', color: '#9C27B0' },
  out_for_delivery: { label: 'Out for Delivery', color: '#00BCD4' },
  delivered: { label: 'Delivered', color: '#4CAF50' },
  cancelled: { label: 'Cancelled', color: '#F44336' },
};

export const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: '#FF9800' },
  paid: { label: 'Paid', color: '#4CAF50' },
  failed: { label: 'Failed', color: '#F44336' },
  refunded: { label: 'Refunded', color: '#9E9E9E' },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export const FREE_SHIPPING_THRESHOLD = 499;
export const SHIPPING_COST = 49;
