import ApiError from '../utils/apiError.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const message = issues.map((issue) => issue.message).join(', ') || 'Invalid request payload.';
      return next(new ApiError(400, message, 'VALIDATION_ERROR'));
    }
    req.validated = result.data;
    next();
  };
}
