const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create({ name, email, password, role = 'user' }) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  }

  static async findById(userId) {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async update(userId, updateData) {
    const setString = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(userId);

    await db.query(
      `UPDATE users SET ${setString} WHERE user_id = ?`,
      values
    );
  }

  static async recordLogin(userId) {
    await db.query(
      'INSERT INTO user_login (user_id) VALUES (?)',
      [userId]
    );
  }

  static async addFavorite(userId, stationId) {
    await db.query(
      'INSERT INTO user_favorites (user_id, station_id) VALUES (?, ?)',
      [userId, stationId]
    );
  }

  static async removeFavorite(userId, stationId) {
    await db.query(
      'DELETE FROM user_favorites WHERE user_id = ? AND station_id = ?',
      [userId, stationId]
    );
  }

  static async getFavorites(userId) {
    const [rows] = await db.query(
      `SELECT s.* 
      FROM user_favorites uf
      JOIN charging_stations s ON uf.station_id = s.station_id
      WHERE uf.user_id = ?`,
      [userId]
    );
    return rows;
  }
}

module.exports = User;