const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/services", async (req, res) => {
  try {
    // First check if the services table exists
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'services'
    `, [process.env.DB_NAME]);

    if (tables.length === 0) {
      return res.status(500).json({ 
        error: "Services table does not exist",
        details: "The services table is missing from the database"
      });
    }

    // If table exists, proceed with the query
    const [results] = await db.query("SELECT * FROM services");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching services:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      error: "Failed to fetch services",
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
