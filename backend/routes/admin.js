const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const db = require('../db');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        user_id,
        email,
        first_name as "firstName",
        last_name as "lastName",
        role,
        created_at,
        last_login_at as last_login,
        CASE 
          WHEN is_active = true THEN 'active'
          ELSE 'inactive'
        END as status
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/users/:userId/role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if this is the last admin
    if (role !== 'admin') {
      const adminCount = await db.query(
        'SELECT COUNT(*) as count FROM users WHERE role = $1',
        ['admin']
      );
      
      const currentUser = await db.query(
        'SELECT role FROM users WHERE user_id = $1',
        [userId]
      );

      if (adminCount.rows[0].count === 1 && currentUser.rows[0]?.role === 'admin') {
        return res.status(400).json({ 
          message: 'Cannot change role: This is the last admin user'
        });
      }
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (active/inactive) (admin only)
router.put('/users/:userId/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const result = await db.query(
      'UPDATE users SET is_active = $1 WHERE user_id = $2 RETURNING *',
      [isActive, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
