const express = require('express');
const router = express.Router();
const db = require('../../db'); 

router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    try {
      const [results] = await connection.query('SELECT * FROM Location');
      res.json(results);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Failed to fetch locations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
