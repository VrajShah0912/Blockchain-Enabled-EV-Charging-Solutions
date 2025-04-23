const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');

exports.getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findByUserId(req.user.user_id);
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(new AppError('No transaction found with that ID', 404));
    }

    if (transaction.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to view this transaction', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (err) {
    next(err);
  }
};