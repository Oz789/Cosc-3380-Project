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

router.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Employee WHERE employeeID = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(results[0]);
  });
});
module.exports = router;