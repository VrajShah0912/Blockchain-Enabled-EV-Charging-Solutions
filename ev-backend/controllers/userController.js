// controllers/userController.js
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

console.log('UserController loaded'); // At top of userController.js

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Filter out unwanted fields
  const filteredBody = {};
  if (req.body.name) filteredBody.name = req.body.name;
  if (req.body.email) filteredBody.email = req.body.email;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  if (newPassword !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

// Export all controller methods
module.exports = {
  getMe: exports.getMe,
  updateMe: exports.updateMe,
  deleteMe: exports.deleteMe,
  updatePassword: exports.updatePassword,
  // Add other exports here if needed
};