const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    try {
      const [locations] = await connection.query(`
        SELECT locationID, name, address, phone
        FROM location
        ORDER BY name
      `);
      res.json(locations);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Failed to fetch locations:', err);
    res.status(500).json({ 
      error: 'Failed to fetch locations',
      details: err.message 
    });
  }
});

module.exports = router; 