const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

// Public routes
router.post('/login', AuthController.loginValidation, handleValidationErrors, AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.get('/users', authenticate, authorize('owner'), AuthController.listUsers);
router.post('/register', authenticate, authorize('owner'), AuthController.registerValidation, handleValidationErrors, AuthController.register);

module.exports = router;
