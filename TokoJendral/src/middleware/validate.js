const { validationResult } = require('express-validator');

/**
 * Express-validator error handler middleware.
 * Place after validation chains to catch and format validation errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

module.exports = { handleValidationErrors };
