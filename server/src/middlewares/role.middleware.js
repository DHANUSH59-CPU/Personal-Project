import ApiError from '../utils/ApiError.js';

/**
 * Middleware factory to restrict access to specific roles.
 * Usage: authorize('admin') or authorize('admin', 'manager')
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role '${req.user.role}' is not allowed to access this resource`);
    }

    next();
  };
};
