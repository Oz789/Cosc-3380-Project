const express = require('express');
const router = express.Router();
const db = require('../../db');

router.patch('/frames/:id', (req, res) => {
  const frameID = req.params.id;
  const {
    name, price, brand, model, material, shape,frameType, lensWidth, lensHeight, bridgeWidth, templeLength, img
  } = req.body;

  const query = `
    UPDATE frames SET name = ?, price = ?, brand = ?, model = ?, material = ?, shape = ?,
        frameType = ?, lensWidth = ?, lensHeight = ?, bridgeWidth = ?, templeLength = ?, img = ? WHERE frameID = ? `;

  db.query(query, [
    name, price, brand, model, material, shape,
    frameType, lensWidth, lensHeight, bridgeWidth, templeLength, img, frameID
  ], (err, result) => {
    if (err) {
      console.error('Error updating frame:', err);
      return res.status(500).json({ error: 'Failed to update frame' });
    }

    res.status(200).json({ message: 'Frame updated successfully' });
  });
});

module.exports = router;
