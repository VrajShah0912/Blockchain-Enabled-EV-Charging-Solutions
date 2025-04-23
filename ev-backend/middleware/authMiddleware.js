const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const config = require('../config/config');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.user_id || user.admin_id, user.role || 'admin');
  
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
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
    req.user.role = decoded.role;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again!', 401));
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

exports.login = async (req, res, next) => {
  try {
    const { email, password, isAdmin } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    let user;
    if (isAdmin) {
      user = await Admin.findByEmail(email);
      if (!user) return next(new AppError('Incorrect email or password', 401));
      
      const correct = await bcrypt.compare(password, user.password_hash);
      if (!correct) return next(new AppError('Incorrect email or password', 401));
    } else {
      user = await User.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
      }
    }

    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};