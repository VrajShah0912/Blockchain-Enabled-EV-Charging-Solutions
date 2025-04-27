const User = require('../models/User');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // <-- Add this

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('User with this email already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, isAdmin } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    let user;
    if (isAdmin) {
      user = await Admin.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return next(new AppError('Incorrect email or password', 401));
      }
    } else {
      user = await User.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
      }
    }

    // Record login
    if (!isAdmin) {
      await User.recordLogin(user.user_id);
    }

    // Create token
    const token = jwt.sign(
      { id: user.user_id || user.admin_id, role: isAdmin ? 'admin' : 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.user_id || user.admin_id,
          name: user.name,
          email: user.email,
          role: isAdmin ? 'admin' : 'user'
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    let currentUser;
    if (decoded.role === 'admin') {
      currentUser = await Admin.findByEmail(decoded.id);
    } else {
      currentUser = await User.findById(decoded.id);
    }

    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// At the bottom of authController.js
