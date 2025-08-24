const db = require('../db');
const { v4: uuidv4 } = require('uuid');

class Feedback {
  async create({
    spaceId,
    userId,
    categoryId,
    status = 'mixed',
    severity = 'medium',
    rating,
    comment,
    userLatitude,
    userLongitude,
    isAnonymous = false,
    deviceInfo = {}
  }) {
    try {
      const feedbackId = uuidv4();
      const result = await db.query(
        `INSERT INTO feedback (
          feedback_id, space_id, user_id, category_id, 
          status, severity, rating, comment,
          user_latitude, user_longitude,
          is_anonymous, device_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          feedbackId,
          spaceId,
          userId,
          categoryId,
          status,
          severity,
          rating,
          comment,
          userLatitude,
          userLongitude,
          isAnonymous,
          JSON.stringify(deviceInfo)
        ]
      );

      // Update public_spaces statistics
      await db.query(
        `UPDATE public_spaces 
         SET total_feedback_count = total_feedback_count + 1,
             avg_rating = (avg_rating * total_feedback_count + $1) / (total_feedback_count + 1),
             last_feedback_at = NOW()
         WHERE space_id = $2`,
        [rating, spaceId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  }

  async getBySpaceId(spaceId, limit = 10, offset = 0) {
    try {
      const result = await db.query(
        `SELECT f.*, u.username, fc.name as category_name
         FROM feedback f
         LEFT JOIN users u ON f.user_id = u.user_id
         LEFT JOIN feedback_categories fc ON f.category_id = fc.category_id
         WHERE f.space_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [spaceId, limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw error;
    }
  }

  async getFeedbackCategories() {
    try {
      const result = await db.query(
        'SELECT * FROM feedback_categories WHERE is_active = true ORDER BY sort_order'
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting feedback categories:', error);
      throw error;
    }
  }
}

module.exports = Feedback;
