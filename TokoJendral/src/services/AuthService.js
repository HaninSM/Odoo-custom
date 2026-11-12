const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

class AuthService {
  /**
   * Register a new user. Only owners can create new accounts.
   */
  static async register({ name, email, password, role }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw Object.assign(new Error('Email sudah terdaftar.'), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await UserModel.create({ name, email, passwordHash, role });
    return { id, name, email, role };
  }

  /**
   * Authenticate user and return JWT token.
   */
  static async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user || !user.is_active) {
      throw Object.assign(new Error('Email atau password salah.'), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw Object.assign(new Error('Email atau password salah.'), { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }
}

module.exports = AuthService;
