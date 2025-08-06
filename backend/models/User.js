const pool = require('../db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, firstName, lastName, username = null }) {
    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, username, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING user_id, email, first_name, last_name, username, role, is_email_verified, created_at
      `;
      
      const values = [email, hashedPassword, firstName, lastName, username];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(userId) {
    try {
      const query = 'SELECT * FROM users WHERE user_id = $1';
      const result = await pool.query(query, [userId]);
      
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET last_login_at = NOW(), updated_at = NOW()
        WHERE user_id = $1
      `;
      
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(userId) {
    try {
      const query = `
        UPDATE users 
        SET is_email_verified = TRUE, updated_at = NOW()
        WHERE user_id = $1
        RETURNING user_id, email, is_email_verified
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updates) {
    try {
      const allowedFields = ['first_name', 'last_name', 'username', 'profile_picture_url', 'timezone'];
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      if (setClause.length === 0) {
        throw new Error('No valid fields to update');
      }

      setClause.push(`updated_at = NOW()`);
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${setClause.join(', ')}
        WHERE user_id = $${paramIndex}
        RETURNING user_id, email, first_name, last_name, username, role, profile_picture_url, timezone, updated_at
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
