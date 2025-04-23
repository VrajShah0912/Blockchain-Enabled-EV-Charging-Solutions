const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.protect, authController.restrictTo('admin'), adminController.createAdmin);
router.get('/', authController.protect, authController.restrictTo('admin'), adminController.getAllAdmins);

module.exports = router;