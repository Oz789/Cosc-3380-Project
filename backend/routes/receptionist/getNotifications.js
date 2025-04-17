const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/stock-alerts?employeeID=123
router.get('/stock-alerts', async (req, res) => {
  const { employeeID } = req.query;

  if (!employeeID) {
    return res.status(400).json({ error: "Missing employeeID" });
  }

  try {
    const [alerts] = await db.promise().query(
      `SELECT id, message, link, createdAt
       FROM stock_alerts
       WHERE employeeID = ?
       ORDER BY createdAt DESC`,
      [employeeID]
    );

    res.json(alerts);
  } catch (err) {
    console.error("Error fetching stock alerts:", err);
    res.status(500).json({ error: "Failed to fetch stock alerts" });
  }
});

module.exports = router;
