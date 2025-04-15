const express = require('express');
const router = express.Router();
const db = require('../../db'); 

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Location';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(' Failed to fetch locations:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});

module.exports = router;
