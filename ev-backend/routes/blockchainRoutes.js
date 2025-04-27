// routes/blockchainRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get user transactions
router.get('/transactions/user/:userId', authController.protect, async (req, res) => {
  try {
    const transactions = await Transaction.findByUserId(req.params.userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// SSE endpoint for real-time updates
router.get('/transactions/stream', authController.protect, (req, res) => {
  const userId = req.query.userId;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // In a real app, you'd use a pub/sub system or database change streams
  const sendTransaction = (tx) => {
    if (tx.userId === userId) {
      res.write(`data: ${JSON.stringify(tx)}\n\n`);
    }
  };
  
  // Simulate new transactions (replace with real event listener)
  const interval = setInterval(() => {
    // This is just for demo - in reality you'd listen to blockchain events
    if (Math.random() > 0.8) {
      sendTransaction({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        type: Math.random() > 0.5 ? 'charging' : 'token',
        stationId: Math.random() > 0.3 ? `station-${Math.floor(Math.random() * 10)}` : undefined,
        stationName: Math.random() > 0.3 ? `Station #${Math.floor(Math.random() * 100)}` : undefined,
        amount: Math.random() * 20,
        energy: Math.random() > 0.3 ? Math.random() * 20 : undefined,
        status: ['pending', 'confirmed', 'confirmed', 'confirmed', 'failed'][Math.floor(Math.random() * 5)],
        tokenAmount: Math.floor(Math.random() * 50)
      });
    }
  }, 5000);
  
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Get blockchain stats for user
router.get('/stats/:userId', authController.protect, async (req, res) => {
  try {
    const transactions = await Transaction.findByUserId(req.params.userId);
    
    const chargingTxs = transactions.filter(tx => tx.type === 'charging');
    const totalSpent = chargingTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const energyConsumed = chargingTxs.reduce((sum, tx) => sum + (tx.energy || 0), 0);
    const avgCostPerKwh = energyConsumed > 0 ? totalSpent / energyConsumed : 0;
    
    const tokenTxs = transactions.filter(tx => tx.type === 'token');
    const tokensEarned = tokenTxs.reduce((sum, tx) => sum + (tx.tokenAmount || 0), 0);
    
    res.status(200).json({
      totalSpent,
      energyConsumed,
      tokensEarned,
      avgCostPerKwh
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;