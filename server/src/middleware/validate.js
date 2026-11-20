export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = new Error(result.error.errors.map(e => e.message).join(', '));
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      return next(err);
    }
    req.validated = result.data;
    next();
  };
}
