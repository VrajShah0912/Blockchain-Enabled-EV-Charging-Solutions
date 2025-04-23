const ChargingStation = require('../models/ChargingStation');
const ChargingPort = require('../models/ChargingPort');
const AppError = require('../utils/appError');

exports.getAllStations = async (req, res, next) => {
  try {
    const stations = await ChargingStation.findAll();
    res.status(200).json({
      status: 'success',
      results: stations.length,
      data: {
        stations
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getStation = async (req, res, next) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    const ports = await ChargingPort.findByStationId(req.params.id);
    station.ports = ports;

    res.status(200).json({
      status: 'success',
      data: {
        station
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createStation = async (req, res, next) => {
  try {
    const {
      name, location, latitude, longitude, voltage, price, availablePorts, totalPorts
    } = req.body;

    const newStation = await ChargingStation.create({
      name,
      location,
      latitude,
      longitude,
      voltage,
      price,
      availablePorts,
      totalPorts
    });

    res.status(201).json({
      status: 'success',
      data: {
        station: newStation
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStation = async (req, res, next) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    await ChargingStation.update(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        station: await ChargingStation.findById(req.params.id)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStation = async (req, res, next) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return next(new AppError('No station found with that ID', 404));
    }

    await ChargingStation.delete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.getNearbyStations = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    if (!latitude || !longitude) {
      return next(new AppError('Please provide latitude and longitude', 400));
    }

    const stations = await ChargingStation.findNearby(latitude, longitude, radius);
    res.status(200).json({
      status: 'success',
      results: stations.length,
      data: {
        stations
      }
    });
  } catch (err) {
    next(err);
  }
};