/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Usage: authorize('owner', 'cashier') — allows only those roles.
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Autentikasi diperlukan.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya role [${allowedRoles.join(', ')}] yang diizinkan.`
      });
    }
    next();
  };
}

module.exports = { authorize };
