const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/employees', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Employee');
    res.json(results);
  } catch (err) {
    console.error('Error fetching employees:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      stack: err.stack
    });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT * FROM Employee WHERE employeeID = ?', [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;