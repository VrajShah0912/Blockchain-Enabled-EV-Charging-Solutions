const db = require('../config/db');

class ChargingStation {
  static async create({
    name, location, latitude, longitude, voltage, price, availablePorts, totalPorts
  }) {
    const [result] = await db.query(
      `INSERT INTO charging_stations 
      (name, location, latitude, longitude, voltage, price, available_ports, total_ports) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, location, latitude, longitude, voltage, price, availablePorts, totalPorts]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM charging_stations');
    return rows;
  }

  static async findById(stationId) {
    const [rows] = await db.query('SELECT * FROM charging_stations WHERE station_id = ?', [stationId]);
    return rows[0];
  }

  static async update(stationId, updateData) {
    const setString = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(stationId);

    await db.query(
      `UPDATE charging_stations SET ${setString} WHERE station_id = ?`,
      values
    );
  }

  static async delete(stationId) {
    await db.query('DELETE FROM charging_stations WHERE station_id = ?', [stationId]);
  }

  static async findNearby(latitude, longitude, radius = 10) {
    const [rows] = await db.query(
      `SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
      sin(radians(latitude)))) AS distance 
      FROM charging_stations 
      HAVING distance < ? 
      ORDER BY distance`,
      [latitude, longitude, latitude, radius]
    );
    return rows;
  }
}

module.exports = ChargingStation;