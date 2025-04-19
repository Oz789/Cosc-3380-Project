const express = require('express');
const router = express.Router();
const db = require('../db');

// Get sales data for a specific item
router.get('/item/:itemID/:itemType', async (req, res) => {
  const { itemID, itemType } = req.params;
  const { patientID, month, locationID } = req.query;

  let itemColumn, priceColumn, joinTable, joinColumn;

  if (itemType === 'frame') {
    itemColumn = 'itemID';
    priceColumn = 'price';
    joinTable = 'frames';
    joinColumn = 'frameID';
  } else if (itemType === 'contact') {
    itemColumn = 'itemID';
    priceColumn = 'price';
    joinTable = 'eyecontacts';
    joinColumn = 'contactID';
  } else if (itemType === 'service') {
    itemColumn = 'itemID';
    priceColumn = 'price';
    joinTable = 'services';
    joinColumn = 'serviceID';
  } else {
    return res.status(400).json({ error: "Invalid item type" });
  }

  try {
    const connection = await db.getConnection();
    try {
      let query = `
        SELECT
          si.saleItemID,
          s.saleID,
          s.saleDate,
          s.locationID,
          si.quantity,
          s.patientID,
          p.firstName,
          p.lastName,
          i.${priceColumn} AS unitPrice
        FROM saleItems si
        JOIN sales s ON si.saleID = s.saleID
        JOIN ${joinTable} i ON si.${itemColumn} = i.${joinColumn}
        JOIN patient p ON s.patientID = p.patientID
        WHERE si.${itemColumn} = ? AND si.itemType = ?
      `;

      const params = [itemID, itemType];

      if (patientID) {
        query += ` AND s.patientID = ?`;
        params.push(patientID);
      }

      if (month) {
        query += ` AND MONTH(s.saleDate) = ?`;
        params.push(month);
      }

      if (locationID) {
        query += ` AND s.locationID = ?`;
        params.push(locationID);
      }

      const [salesData] = await connection.query(query, params);
      res.json(salesData);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Failed to fetch sales:", err);
    res.status(500).json({ 
      error: "Failed to fetch sales data",
      details: err.message 
    });
  }
});

module.exports = router; 