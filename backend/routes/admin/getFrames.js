/*
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/frames', (req, res) => {
  const query = 'SELECT * FROM frames';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching frames:', err);
      return res.status(500).json({ error: 'Failed to retrieve frames' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/frames', (req, res) => {
  const query = `
    SELECT
      f.frameID,
      f.name,
      f.price,
      f.brand,
      f.color,
      f.model,
      f.material,
      f.lensWidth,
      f.bridgeWidth,
      f.templeLength,
      f.img,
      i.stockCount
    FROM frames f
    JOIN inventory i ON f.frameID = i.frameID;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching frames with stock:', err);
      return res.status(500).json({ error: 'Failed to retrieve frames with stock' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
