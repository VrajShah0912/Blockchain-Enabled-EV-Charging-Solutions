const db = require('../config/db');

class ChargingPort {
  static async findByStationId(stationId) {
    const [rows] = await db.query('SELECT * FROM charging_ports WHERE station_id = ?', [stationId]);
    return rows;
  }

  static async updateAvailability(portId, available) {
    await db.query('UPDATE charging_ports SET available = ? WHERE id = ?', [available, portId]);
  }

  static async getById(portId) {
    const [rows] = await db.query('SELECT * FROM charging_ports WHERE id = ?', [portId]);
    return rows[0];
  }
}

module.exports = ChargingPort;