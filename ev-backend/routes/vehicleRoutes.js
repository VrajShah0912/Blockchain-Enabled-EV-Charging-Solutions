const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getUserVehicles);
router.get('/:id', vehicleController.getVehicle);
router.patch('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;