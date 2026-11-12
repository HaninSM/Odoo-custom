const jwt = require('jsonwebtoken');

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header (Bearer <token>),
 * verifies it, and attaches decoded user to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan. Silakan login.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
}

module.exports = { authenticate };
