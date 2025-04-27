const db = require('../config/db');

class ChargingSession {
  static async create({
    userId, vehicleId, stationId, portType, power, duration, energyUsed, cost
  }) {
    const [result] = await db.query(
      `INSERT INTO charging_sessions 
      (user_id, vehicle_id, station_id, port_type, power, duration, energy_used, cost) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, vehicleId, stationId, portType, power, duration, energyUsed, cost]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT cs.*, cs.name as station_name 
      FROM charging_sessions cs
      JOIN charging_stations s ON cs.station_id = s.station_id
      WHERE user_id = ? ORDER BY session_date DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(sessionId) {
    const [rows] = await db.query('SELECT * FROM charging_sessions WHERE id = ?', [sessionId]);
    return rows[0];
  }
}

module.exports = ChargingSession;