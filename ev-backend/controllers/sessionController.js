const ChargingSession = require('../models/ChargingSession');
const ChargingStation = require('../models/ChargingStation');
const ChargingPort = require('../models/ChargingPort');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');

// Start a charging session
exports.startChargingSession = async (req, res, next) => {
  try {
    const { stationId, vehicleId, portType, power, estimatedDuration } = req.body;
    const userId = req.user.user_id;

    const station = await ChargingStation.findById(stationId);
    if (!station) return next(new AppError('No station found with that ID', 404));

    const ports = await ChargingPort.findByStationId(stationId);
    const availablePort = ports.find(p => p.type === portType && p.available > 0);
    if (!availablePort) return next(new AppError('No available ports of this type at the station', 400));

    const energyUsed = (parseFloat(power) * estimatedDuration) / 60;
    const cost = energyUsed * station.price;

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

    await ChargingPort.updateAvailability(availablePort.id, availablePort.available - 1);

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
      data: { session: newSession }
    });
  } catch (err) {
    next(err);
  }
};

// Get all sessions for the logged-in user
exports.getUserSessions = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const sessions = await ChargingSession.findByUserId(userId);

    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: { sessions }
    });
  } catch (err) {
    next(err);
  }
};

// Get a specific session by ID
exports.getSession = async (req, res, next) => {
  try {
    const session = await ChargingSession.findById(req.params.id);

    if (!session) return next(new AppError('No session found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: { session }
    });
  } catch (err) {
    next(err);
  }
};

// End a charging session
exports.endChargingSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const session = await ChargingSession.findById(sessionId);

    if (!session) return next(new AppError('No session found with that ID', 404));

    if (session.status === 'Ended') {
      return next(new AppError('Session already ended', 400));
    }

    session.status = 'Ended';
    await session.save();

    await ChargingPort.updateAvailabilityByType(session.stationId, session.portType, 1);

    await Transaction.updateStatusBySessionId(sessionId, 'Completed');

    res.status(200).json({
      status: 'success',
      message: 'Charging session ended successfully'
    });
  } catch (err) {
    next(err);
  }
};
