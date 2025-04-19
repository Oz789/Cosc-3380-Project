const express = require('express');
const router = express.Router();
const db = require('../../db');

// Fetch inventory items including frames, contacts, and services
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    console.log("Database connection established");

    const [frames] = await connection.query(`
      SELECT frameID AS id, name, brand, model, 'frame' AS type, stockCount, price
      FROM frames
    `);
    console.log("Frames fetched:", frames.length);

    const [contacts] = await connection.query(`
      SELECT contactID AS id, name, brand, model, 'contact' AS type, stockCount, price
      FROM eyecontacts
    `);
    console.log("Contacts fetched:", contacts.length);

    const [services] = await connection.query(`
      SELECT serviceID AS id, serviceName AS name, '' AS brand, '' AS model, 'service' AS type, 100 AS stockCount, price
      FROM services
    `);
    console.log("Services fetched:", services.length);

    const allItems = [...frames, ...contacts, ...services];
    res.json(allItems);
  } catch (err) {
    console.error("Failed to fetch inventory:", err);
    console.error("Error code:", err.code);
    console.error("Error state:", err.sqlState);
    console.error("Error message:", err.message);
    res.status(500).json({ 
      error: "Internal server error",
      details: err.message,
      code: err.code,
      state: err.sqlState
    });
  } finally {
    if (connection) {
      connection.release();
      console.log("Database connection released");
    }
  }
});

// Fetch all patients
router.get('/patients', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [patients] = await connection.query(`
      SELECT patientID, firstName, lastName
      FROM patient
    `);
    res.json(patients);
  } catch (err) {
    console.error("Failed to fetch patients:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

// Fetch all clinic locations
router.get('/locations', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [locations] = await connection.query(`
      SELECT locationID, name
      FROM location
    `);
    res.json(locations);
  } catch (err) {
    console.error("Failed to fetch locations:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

// Fetch sales records filtered by item
router.get('/sales/item/:itemID/:itemType', async (req, res) => {
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

  let connection;
  try {
    connection = await db.getConnection();
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
  } catch (err) {
    console.error("Failed to fetch sales:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
