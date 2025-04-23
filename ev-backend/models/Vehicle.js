const db = require('../config/db');

class Vehicle {
  static async create({
    userId, make, model, year, batteryCapacity, chargingPortType, imageUrl
  }) {
    const [result] = await db.query(
      `INSERT INTO user_vehicles 
      (user_id, make, model, year, battery_capacity, charging_port_type, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, make, model, year, batteryCapacity, chargingPortType, imageUrl]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM user_vehicles WHERE user_id = ?', [userId]);
    return rows;
  }

  static async findById(vehicleId) {
    const [rows] = await db.query('SELECT * FROM user_vehicles WHERE id = ?', [vehicleId]);
    return rows[0];
  }

  static async update(vehicleId, updateData) {
    const setString = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(vehicleId);

    await db.query(
      `UPDATE user_vehicles SET ${setString} WHERE id = ?`,
      values
    );
  }

  static async delete(vehicleId) {
    await db.query('DELETE FROM user_vehicles WHERE id = ?', [vehicleId]);
  }
}

module.exports = Vehicle;