const Vehicle = require('../models/Vehicle');
const AppError = require('../utils/appError');

exports.createVehicle = async (req, res, next) => {
  try {
    const {
      make, model, year, batteryCapacity, chargingPortType, imageUrl
    } = req.body;

    const newVehicle = await Vehicle.create({
      userId: req.user.user_id,
      make,
      model,
      year,
      batteryCapacity,
      chargingPortType,
      imageUrl
    });

    res.status(201).json({
      status: 'success',
      data: {
        vehicle: newVehicle
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findByUserId(req.user.user_id);
    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: {
        vehicles
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    if (vehicle.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to view this vehicle', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    if (vehicle.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to update this vehicle', 403));
    }

    await Vehicle.update(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        vehicle: await Vehicle.findById(req.params.id)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return next(new AppError('No vehicle found with that ID', 404));
    }

    if (vehicle.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to delete this vehicle', 403));
    }

    await Vehicle.delete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};