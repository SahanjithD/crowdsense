const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const db = require('../db');

// Get user profile
router.get('/profile', authenticateToken, async function(req, res) {
  try {
    const userId = req.user.id;
    const query = 'SELECT first_name, last_name, email FROM users WHERE user_id = $1';
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const query = 'UPDATE users SET first_name = $1, last_name = $2 WHERE user_id = $3 RETURNING first_name, last_name, email';
    const result = await db.query(query, [firstName, lastName, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
