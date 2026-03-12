import Joi from 'joi';

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  publicId: Joi.string().allow('', null),
});

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(120).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  price: Joi.number().min(0).required(),
  mrp: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required(), // ObjectId as string
  size: Joi.string().valid('Regular', 'Large', 'XL', 'XXL').required(),
  absorbency: Joi.string().valid('Light', 'Medium', 'Heavy', 'Overnight').required(),
  material: Joi.string().valid('Cotton', 'Organic Cotton', 'Bamboo Fiber', 'Ultra-Soft Top Sheet'),
  features: Joi.array().items(Joi.string().trim()),
  images: Joi.array().items(imageSchema),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(120),
  description: Joi.string().trim().min(10).max(2000),
  price: Joi.number().min(0),
  mrp: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  category: Joi.string(),
  size: Joi.string().valid('Regular', 'Large', 'XL', 'XXL'),
  absorbency: Joi.string().valid('Light', 'Medium', 'Heavy', 'Overnight'),
  material: Joi.string().valid('Cotton', 'Organic Cotton', 'Bamboo Fiber', 'Ultra-Soft Top Sheet'),
  features: Joi.array().items(Joi.string().trim()),
  images: Joi.array().items(imageSchema),
  isActive: Joi.boolean(),
}).min(1);

