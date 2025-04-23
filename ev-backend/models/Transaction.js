const db = require('../config/db');

class Transaction {
  static async create({ userId, stationId, amount, status = 'Pending' }) {
    const [result] = await db.query(
      `INSERT INTO transactions 
      (user_id, station_id, amount, status) 
      VALUES (?, ?, ?, ?)`,
      [userId, stationId, amount, status]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT t.*, s.name as station_name 
      FROM transactions t
      JOIN charging_stations s ON t.station_id = s.station_id
      WHERE user_id = ? ORDER BY timestamp DESC`,
      [userId]
    );
    return rows;
  }

  static async updateStatus(transactionId, status) {
    await db.query(
      'UPDATE transactions SET status = ? WHERE transaction_id = ?',
      [status, transactionId]
    );
  }
}

module.exports = Transaction;