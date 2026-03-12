import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({ 'string.empty': 'Name is required' }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({ 'string.email': 'Please enter a valid email' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),
  phone: Joi.string().trim().allow(''),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
    .messages({ 'string.email': 'Please enter a valid email' }),
  password: Joi.string().required()
    .messages({ 'string.empty': 'Password is required' }),
});
