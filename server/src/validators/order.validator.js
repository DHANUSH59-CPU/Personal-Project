import Joi from 'joi';

export const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    line1: Joi.string().trim().required(),
    line2: Joi.string().trim().allow(''),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    pincode: Joi.string().trim().pattern(/^\d{6}$/).required()
      .messages({ 'string.pattern.base': 'Please enter a valid 6-digit pincode' }),
  }).required(),
  paymentMethod: Joi.string().valid('razorpay', 'cod').default('razorpay'),
  couponCode: Joi.string().trim().uppercase().allow(''),
  notes: Joi.string().trim().max(500).allow(''),
});

export const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string()
    .valid('processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')
    .required(),
});
