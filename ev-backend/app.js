const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');

// Route imports
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const stationRoutes = require('./routes/chargingStationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.options('*', cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/stations', stationRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/auth', authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;