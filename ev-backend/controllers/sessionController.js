const ChargingSession = require('../models/ChargingSession');
const ChargingStation = require('../models/ChargingStation');
const ChargingPort = require('../models/ChargingPort');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');

exports.startChargingSession = async (req, res, next) => {
  try {
    const { stationId, vehicleId, portType, power, estimatedDuration } = req.body;
    const userId = req.user.user_id;

    // Check if station exists
    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    // Check if port is available
    const ports = await ChargingPort.findByStationId(stationId);
    const availablePort = ports.find(p => p.type === portType && p.available > 0);
    if (!availablePort) {
      return next(new AppError('No available ports of this type at the station', 400));
    }

    // Calculate cost
    const energyUsed = (parseFloat(power) * estimatedDuration) / 60; // Convert minutes to hours
    const cost = energyUsed * station.price;

    // Create session
    const newSession = await ChargingSession.create({
      userId,
      vehicleId,
      stationId,
      portType,
      power,
      duration: estimatedDuration,
      energyUsed,
      cost
    });

    // Update port availability
    await ChargingPort.updateAvailability(availablePort.id, availablePort.available - 1);

    // Create transaction
    await Transaction.create({
      userId,
      stationId,
      amount: cost,
      status: 'Pending'
    });

    res.status(201).json({
      status: 'success',
      data: {
        session: newSession
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.endChargingSession = async (req, res, next) => {
  try {
    const session = await ChargingSession.findById(req.params.id);
    if (!session) {
      return next(new AppError('No session found with that ID', 404));
    }

    if (session.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to end this session', 403));
    }

    // Update port availability
    const ports = await ChargingPort.findByStationId(session.station_id);
    const port = ports.find(p => p.type === session.port_type);
    if (port) {
      await ChargingPort.updateAvailability(port.id, port.available + 1);
    }

    // Update transaction status
    const transactions = await Transaction.findByUserId(session.user_id);
    const transaction = transactions.find(t => t.station_id === session.station_id && t.status === 'Pending');
    if (transaction) {
      await Transaction.updateStatus(transaction.transaction_id, 'Completed');
    }

    res.status(200).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserSessions = async (req, res, next) => {
  try {
    const sessions = await ChargingSession.findByUserId(req.user.user_id);
    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const session = await ChargingSession.findById(req.params.id);
    if (!session) {
      return next(new AppError('No session found with that ID', 404));
    }

    if (session.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to view this session', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (err) {
    next(err);
  }
};