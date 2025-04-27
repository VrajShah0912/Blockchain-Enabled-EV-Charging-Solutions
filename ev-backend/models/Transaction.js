const db = require('../config/db');
const Blockchain = require('../blockchain/Blockchain');
const Wallet = require('../blockchain/wallet');

// Initialize blockchain
const evChain = new Blockchain();

class Transaction {
  static async create({ userId, stationId, amount, status = 'Pending', sessionData }) {
    // In a real app, you'd have wallets associated with users and stations
    const userWallet = new Wallet(); // This should be fetched from user's wallet in reality
    const stationWallet = new Wallet(); // This should be the station's wallet
    
    // Create blockchain transaction
    const tx = userWallet.createTransaction(
      stationWallet.publicKey,
      amount,
      { sessionData, userId, stationId }
    );
    
    // Add to pending transactions
    evChain.addTransaction(tx);
    
    // Mine the block (in reality, this would be done at intervals)
    evChain.minePendingTransactions(process.env.MINING_WALLET);
    
    // Also store in database for quick access
    const [result] = await db.query(
      `INSERT INTO transactions 
      (user_id, station_id, amount, status, blockchain_hash) 
      VALUES (?, ?, ?, ?, ?)`,
      [userId, stationId, amount, status, tx.hash]
    );
    
    return {
      transactionId: result.insertId,
      blockchainHash: tx.hash
    };
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT t.*, s.name as station_name 
      FROM transactions t
      JOIN charging_stations s ON t.station_id = s.station_id
      WHERE user_id = ? ORDER BY timestamp DESC`,
      [userId]
    );
    
    // Verify each transaction on the blockchain
    const verifiedRows = await Promise.all(rows.map(async row => {
      const verified = await this.verifyOnBlockchain(row.blockchain_hash);
      return { ...row, blockchain_verified: verified };
    }));
    
    return verifiedRows;
  }

  static async verifyOnBlockchain(txHash) {
    for (const block of evChain.chain) {
      for (const tx of block.transactions) {
        if (tx.hash === txHash) {
          return tx.isValid();
        }
      }
    }
    return false;
  }
}

module.exports = Transaction;