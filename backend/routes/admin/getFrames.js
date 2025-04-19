/*
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/frames', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM frames');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching frames:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Failed to retrieve frames',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/frames', async (req, res) => {
  try {
    const connection = await db.getConnection();
    try {
      const query = `
        SELECT
          frameID,
          name,
          price,
          brand,
          color,
          model,
          material,
          lensWidth,
          bridgeWidth,
          templeLength,
          img,
          stockCount
        FROM frames;
      `;
      
      const [results] = await connection.query(query);
      res.status(200).json(results);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error fetching frames:', err);
    console.error('Error code:', err.code);
    console.error('Error state:', err.sqlState);
    console.error('Error message:', err.message);
    res.status(500).json({ 
      error: 'Failed to retrieve frames',
      details: err.message
    });
  }
});

module.exports = router;
