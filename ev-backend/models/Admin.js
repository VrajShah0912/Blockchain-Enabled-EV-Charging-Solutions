const db = require('../config/db');

class Admin {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM admin_login WHERE email = ?', [email]);
    return rows[0];
  }

  static async create({ email, passwordHash }) {
    const [result] = await db.query(
      'INSERT INTO admin_login (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return result.insertId;
  }
}

module.exports = Admin;