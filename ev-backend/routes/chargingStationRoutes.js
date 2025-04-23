const express = require('express');
const stationController = require('../controllers/chargingStationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', stationController.getAllStations);
router.get('/nearby', stationController.getNearbyStations);

router.use(authController.protect);

router.post('/', authController.restrictTo('admin'), stationController.createStation);
router.get('/:id', stationController.getStation);
router.patch('/:id', authController.restrictTo('admin'), stationController.updateStation);
router.delete('/:id', authController.restrictTo('admin'), stationController.deleteStation);

module.exports = router;