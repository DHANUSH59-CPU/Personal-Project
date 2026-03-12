import ApiError from '../utils/ApiError.js';

/**
 * Middleware factory that validates request body/query/params against a Joi schema.
 * Usage: validate(myJoiSchema, 'body')
 */
const validate = (schema, property = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      throw new ApiError(400, 'Validation error', messages);
    }

    // Replace with sanitized values
    req[property] = value;
    next();
  };
};

export default validate;
