const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/' , async (req, res) => {

    try {
        const [rows] = await db.promise().query(
          `SELECT * FROM patient
          ORDER BY firstName ASC`,
        );
    
        res.json(rows);
      } catch (err) {
        console.error(' Error fetching doctor appointments:', err);
        res.status(500).json({ error: 'Failed to fetch doctor appointments' });
      }
});

module.exports = router;
