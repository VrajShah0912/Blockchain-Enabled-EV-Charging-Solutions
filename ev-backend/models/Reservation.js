const db = require('../config/db');

class Reservation {
  static async create({ userId, stationId, reservationTime }) {
    const [result] = await db.query(
      `INSERT INTO reservations 
      (user_id, station_id, reservation_time, status) 
      VALUES (?, ?, ?, 'pending')`,
      [userId, stationId, reservationTime]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT r.*, s.name as station_name 
      FROM reservations r
      JOIN charging_stations s ON r.station_id = s.station_id
      WHERE user_id = ? ORDER BY reservation_time DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(reservationId) {
    const [rows] = await db.query('SELECT * FROM reservations WHERE reservation_id = ?', [reservationId]);
    return rows[0];
  }

  static async updateStatus(reservationId, status) {
    await db.query(
      'UPDATE reservations SET status = ? WHERE reservation_id = ?',
      [status, reservationId]
    );
  }

  static async delete(reservationId) {
    await db.query('DELETE FROM reservations WHERE reservation_id = ?', [reservationId]);
  }
}

module.exports = Reservation;