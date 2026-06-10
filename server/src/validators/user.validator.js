import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  phone: Joi.string().trim().pattern(/^[6-9]\d{9}$/).allow('')
    .messages({ 'string.pattern.base': 'Please enter a valid 10-digit mobile number' }),
  avatar: Joi.string().uri().allow(''),
}).min(1).messages({ 'object.min': 'Nothing to update' });

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'New password must be at least 6 characters' }),
});
