const express = require('express');
const router = express.Router();
const FeedbackClass = require('../models/Feedback');
const authenticateToken = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');
const db = require('../db');

let client;
const Feedback = new FeedbackClass();

// Helper function to get or create space
async function findOrCreateSpace(location) {
  try {
    // Find existing space
    const existingSpace = await db.query(
      `SELECT space_id FROM public_spaces 
       WHERE latitude = $1 AND longitude = $2 AND space_type = $3`,
      [location.coordinates.lat, location.coordinates.lng, location.spaceType]
    );

    if (existingSpace.rows[0]) {
      return existingSpace.rows[0].space_id;
    }

    // Create new space
    const newSpace = await db.query(
      `INSERT INTO public_spaces (
        name, space_type, latitude, longitude, address, description
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING space_id`,
      [
        location.name || `${location.spaceType} at ${location.coordinates.lat}, ${location.coordinates.lng}`,
        location.spaceType,
        location.coordinates.lat,
        location.coordinates.lng,
        location.address || null,
        location.description || null
      ]
    );
    return newSpace.rows[0].space_id;
  } catch (error) {
    console.error('Error in findOrCreateSpace:', error);
    throw error;
  }
}

// Get feedback categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Feedback.getFeedbackCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit feedback
router.post('/', authenticateToken, validateFeedback, async (req, res) => {
  try {
    const { 
      location,
      rating,
      issues,
      comments
    } = req.body;

    // First, ensure we have all required data
    if (!location?.coordinates || !location?.spaceType || !rating) {
      return res.status(400).json({ 
        message: 'Missing required fields: location coordinates, space type, or rating' 
      });
    }

    // Get or create space
    const spaceId = await findOrCreateSpace(location);
    
    // Create feedback entry/entries
    let feedbackEntries = [];
    
    if (issues && issues.length > 0) {
      // Convert issues to lowercase to match our schema
      const normalizedIssues = issues.map(issue => issue.toLowerCase());
      
      // Get category IDs for the issues
      const categoryIds = await Promise.all(normalizedIssues.map(async (issueId) => {
        const result = await db.query(
          'SELECT category_id FROM feedback_categories WHERE name = $1',
          [issueId]
        );
        return result.rows[0]?.category_id;
      }));

      // Create a feedback entry for each valid category
      feedbackEntries = categoryIds.filter(id => id);
    } 
    
    // If no valid categories or no issues provided, create one feedback without category
    if (feedbackEntries.length === 0) {
      feedbackEntries = [null];
    }

    // Create feedback entries
    const feedbackPromises = feedbackEntries.map(categoryId =>
      Feedback.create({
        userId: req.user.id, // from auth middleware
        spaceId: spaceId, // from our space lookup
        categoryId,
        rating,
        comment: comments,
        userLatitude: location.coordinates.lat,
        userLongitude: location.coordinates.lng,
        deviceInfo: {
          userAgent: req.headers['user-agent'],
          platform: req.headers['sec-ch-ua-platform']
        }
      })
    );

    await Promise.all(feedbackPromises);

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback. Full error:', error);
    console.error('Stack trace:', error.stack);
    console.error('Request body:', req.body);
    console.error('User:', req.user);
    res.status(500).json({ 
      message: 'Error submitting feedback',
      error: error.message 
    });
  }
});

// Get feedback for a space
router.get('/space/:spaceId', async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const feedback = await Feedback.getBySpaceId(spaceId, limit, offset);
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get space by coordinates
router.get('/space-by-location', async (req, res) => {
  try {
    const { lat, lng, type } = req.query;
    
    const result = await db.query(
      `SELECT * FROM public_spaces 
       WHERE latitude = $1 AND longitude = $2 AND space_type = $3`,
      [lat, lng, type]
    );
    
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Space not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error finding space:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all spaces
router.get('/spaces', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT space_id, name, space_type, latitude, longitude, 
              address, avg_rating, total_feedback_count, last_feedback_at
       FROM public_spaces 
       WHERE is_active = true
       ORDER BY last_feedback_at DESC NULLS LAST
       LIMIT 100`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
