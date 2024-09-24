const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = User;
