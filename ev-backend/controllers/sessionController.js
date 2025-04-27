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

    // Create charging session
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

    // Create blockchain transaction with session details
    await Transaction.create({
      userId,
      stationId,
      amount: cost,
      status: 'Pending',
      sessionData: {
        sessionId: newSession.id,
        energyUsed,
        duration: estimatedDuration,
        portType,
        power
      }
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
