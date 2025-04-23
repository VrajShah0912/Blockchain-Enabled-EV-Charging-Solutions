const User = require('../models/User');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user_id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // Filter out unwanted fields
    const filteredBody = {};
    if (req.body.name) filteredBody.name = req.body.name;
    if (req.body.email) filteredBody.email = req.body.email;

    const updatedUser = await User.update(req.user.user_id, filteredBody);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.update(req.user.user_id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, passwordConfirm } = req.body;

    if (newPassword !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    const user = await User.findById(req.user.user_id);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return next(new AppError('Your current password is wrong', 401));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.update(req.user.user_id, { password: hashedPassword });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.addFavoriteStation = async (req, res, next) => {
  try {
    const { stationId } = req.body;
    await User.addFavorite(req.user.user_id, stationId);
    res.status(200).json({
      status: 'success',
      message: 'Station added to favorites'
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFavoriteStation = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    await User.removeFavorite(req.user.user_id, stationId);
    res.status(200).json({
      status: 'success',
      message: 'Station removed from favorites'
    });
  } catch (err) {
    next(err);
  }
};

exports.getFavoriteStations = async (req, res, next) => {
  try {
    const favorites = await User.getFavorites(req.user.user_id);
    res.status(200).json({
      status: 'success',
      results: favorites.length,
      data: {
        favorites
      }
    });
  } catch (err) {
    next(err);
  }
};