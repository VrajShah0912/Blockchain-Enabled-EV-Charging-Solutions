const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return next(new AppError('Admin with this email already exists', 400));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const adminId = await Admin.create({ email, passwordHash });

    res.status(201).json({
      status: 'success',
      data: {
        adminId
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    const [admins] = await db.query('SELECT * FROM admin_login');
    res.status(200).json({
      status: 'success',
      results: admins.length,
      data: {
        admins
      }
    });
  } catch (err) {
    next(err);
  }
};