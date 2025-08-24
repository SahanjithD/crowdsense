const validateFeedback = (req, res, next) => {
  const { location, rating, issues } = req.body;

  // Validate location
  if (!location || !location.coordinates || !location.spaceType) {
    return res.status(400).json({ 
      message: 'Invalid location data. Must include coordinates and space type.' 
    });
  }

  // Validate coordinates
  if (typeof location.coordinates.lat !== 'number' || 
      typeof location.coordinates.lng !== 'number' ||
      location.coordinates.lat < -90 || location.coordinates.lat > 90 ||
      location.coordinates.lng < -180 || location.coordinates.lng > 180) {
    return res.status(400).json({ 
      message: 'Invalid coordinates.' 
    });
  }

  // Validate rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      message: 'Rating must be an integer between 1 and 5.' 
    });
  }

  // Validate issues array if provided
  if (issues && (!Array.isArray(issues) || !issues.every(issue => typeof issue === 'string'))) {
    return res.status(400).json({ 
      message: 'Issues must be an array of strings.' 
    });
  }

  // Validate space type
  const validSpaceTypes = ['toilet', 'park', 'station', 'bus_stop', 'mall', 'other'];
  if (!validSpaceTypes.includes(location.spaceType)) {
    return res.status(400).json({ 
      message: 'Invalid space type.' 
    });
  }

  next();
};

module.exports = { validateFeedback };
