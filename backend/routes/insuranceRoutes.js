const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all insurance providers
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all insurance providers...');
    const [results] = await db.promise().query('SELECT * FROM insurance');
    console.log('Insurance providers found:', results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching insurance providers:', err);
    res.status(500).json({ error: 'Failed to fetch insurance providers' });
  }
});

// Get insurance by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.promise().query(
      'SELECT * FROM insurance WHERE insuranceID = ?',
      [req.params.id]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Insurance provider not found' });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching insurance provider:', err);
    res.status(500).json({ error: 'Failed to fetch insurance provider' });
  }
});

module.exports = router; 