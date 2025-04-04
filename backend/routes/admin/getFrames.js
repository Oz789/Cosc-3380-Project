const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/frames', (req, res) => {
  const query = 'SELECT * FROM frames';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching frames:', err);
      return res.status(500).json({ error: 'Failed to retrieve frames' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
