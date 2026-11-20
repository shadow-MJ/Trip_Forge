import ApiError from '../utils/apiError.js';

export function tripCreator(req, _res, next) {
  if (req.membership.role !== 'Trip Creator') return next(new ApiError(403, 'Only the Trip Creator can perform this action.', 'FORBIDDEN'));
  next();
}
