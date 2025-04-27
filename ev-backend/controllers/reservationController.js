const Reservation = require('../models/Reservation');
const ChargingStation = require('../models/ChargingStation');
const AppError = require('../utils/appError');

exports.createReservation = async (req, res, next) => {
  try {
    const { stationId, reservationTime } = req.body;
    const userId = req.user.user_id;

    const station = await ChargingStation.findById(stationId);
    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    if (station.available_ports <= 0) {
      return next(new AppError('No available ports at this station', 400));
    }

    const newReservation = await Reservation.create({
      userId,
      stationId,
      reservationTime
    });

    // Update available ports
    await ChargingStation.update(stationId, {
      available_ports: station.available_ports - 1
    });

    res.status(201).json({
      status: 'success',
      data: {
        reservation: newReservation
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.findByUserId(req.user.user_id);
    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: {
        reservations
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return next(new AppError('No reservation found with that ID', 404));
    }

    if (reservation.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to view this reservation', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        reservation
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return next(new AppError('No reservation found with that ID', 404));
    }

    if (reservation.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to cancel this reservation', 403));
    }

    if (reservation.status === 'cancelled') {
      return next(new AppError('Reservation is already cancelled', 400));
    }

    await Reservation.updateStatus(req.params.id, 'cancelled');

    // Update available ports
    const station = await ChargingStation.findById(reservation.station_id);
    await ChargingStation.update(reservation.station_id, {
      available_ports: station.available_ports + 1
    });

    res.status(200).json({
      status: 'success',
      data: {
        reservation: await Reservation.findById(req.params.id)
      }
    });
  } catch (err) {
    next(err);
  }
};