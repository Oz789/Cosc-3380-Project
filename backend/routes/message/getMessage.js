const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  try {
    const sql = "SELECT * FROM messages";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error retrieving from database:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      error: "Database error. Please try again later.",
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;