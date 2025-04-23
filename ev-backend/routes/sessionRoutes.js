const express = require('express');
const sessionController = require('../controllers/sessionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', sessionController.startChargingSession);
router.get('/', sessionController.getUserSessions);
router.get('/:id', sessionController.getSession);
router.patch('/:id/end', sessionController.endChargingSession);

module.exports = router;