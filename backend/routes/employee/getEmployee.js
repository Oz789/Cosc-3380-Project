const express = require('express');
const router = express.Router();
const db = require('../../db');



router.get('/employees', (req, res) => {
  db.query('SELECT * FROM Employee', (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
module.exports = router;