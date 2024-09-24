const db = require('../config/db');
const fs = require('fs');
const path = require('path');

class Photo {
  static async upload(userId, filename) {
    const [result] = await db.execute('INSERT INTO photos (user_id, filename) VALUES (?, ?)', [userId, filename]);
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM photos WHERE user_id = ?', [userId]);
    return rows;
  }

  static async getById(photoId) {
    const [rows] = await db.execute('SELECT * FROM photos WHERE id = ?', [photoId]);
    return rows[0]; // Assuming each ID is unique, so we return the first row
  }

  static async deleteById(photoId) {
    // First, fetch the photo details to get the filename
    const photo = await this.getById(photoId);
    if (photo) {
      // Remove the file from the uploads directory
      const filePath = path.join(__dirname, '../uploads', photo.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
      
      // Then delete the record from the database
      await db.execute('DELETE FROM photos WHERE id = ?', [photoId]);
    }
  }
}

module.exports = Photo;
