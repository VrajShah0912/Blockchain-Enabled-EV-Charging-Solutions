const express = require('express');
const reservationController = require('../controllers/reservationController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', reservationController.createReservation);
router.get('/', reservationController.getUserReservations);
router.get('/:id', reservationController.getReservation);
router.patch('/:id/cancel', reservationController.cancelReservation);

module.exports = router;