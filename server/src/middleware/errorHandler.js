export function notFound(_req, res) {
  res.status(404).json({ success: false, message: 'Route not found.', code: 'NOT_FOUND' });
}

export function errorHandler(err, _req, res, _next) {
  if (err.validationError) {
    const issues = err.validationError.issues || err.validationError.errors || [];
    return res.status(400).json({
      success: false,
      message: issues.map((e) => e.message).join(', ') || 'Validation error.',
      code: 'VALIDATION_ERROR',
    });
  }
  const status = err.status || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error.' : err.message,
    code,
  });
}
