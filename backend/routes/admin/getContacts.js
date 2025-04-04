const express = require('express');
const router = express.Router();
const db = require('../../db');
router.get('/eyeContacts', (req, res) => {
  const query = 'SELECT * FROM eyeContacts';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      return res.status(500).json({ error: "Failed to retrieve contacts" });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
