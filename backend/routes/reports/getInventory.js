/*
const express = require('express');
const router = express.Router();
const db = require('../../db');

// Fetch inventory items
router.get('/inventory', async (req, res) => {
  try {
    const [frames] = await db.promise().query(`
      SELECT frameID AS id, name, brand, model, 'frame' AS type, stockCount, price
      FROM frames
    `);

    const [contacts] = await db.promise().query(`
      SELECT contactID AS id, name, brand, model, 'contact' AS type, stockCount, price
      FROM eyecontacts
    `);

    res.json([...frames, ...contacts]);
  } catch (err) {
    console.error("Inventory fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch patients
router.get('/patients', async (req, res) => {
  try {
    const [patients] = await db.promise().query(`
      SELECT patientID, firstName, lastName FROM patient
    `);
    res.json(patients);
  } catch (err) {
    console.error("Patients fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch locations
router.get('/locations', async (req, res) => {
  try {
    const [locations] = await db.promise().query(`
      SELECT locationID, name FROM location
    `);
    res.json(locations);
  } catch (err) {
    console.error("Locations fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch sales per item
router.get('/sales/item/:itemID/:itemType', async (req, res) => {
  const { itemID, itemType } = req.params;
  const { patientID, month, locationID } = req.query;

  const isFrame = itemType === 'frame';
  const joinTable = isFrame ? 'frames' : 'eyecontacts';
  const joinColumn = isFrame ? 'frameID' : 'contactID';
  const itemColumn = 'itemID';
  const priceColumn = 'price';

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

    const [salesData] = await db.promise().query(query, params);
    res.json(salesData);
  } catch (err) {
    console.error("Sales fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const db = require('../../db');

// Fetch inventory items including frames, contacts, and services
router.get('/inventory', async (req, res) => {
  try {
    const [frames] = await db.promise().query(`
      SELECT frameID AS id, name, brand, model, 'frame' AS type, stockCount, price
      FROM frames
    `);

    const [contacts] = await db.promise().query(`
      SELECT contactID AS id, name, brand, model, 'contact' AS type, stockCount, price
      FROM eyecontacts
    `);

    const [services] = await db.promise().query(`
      SELECT serviceID AS id, serviceName AS name, '' AS brand, '' AS model, 'service' AS type, 100 AS stockCount, price
      FROM services
    `);

    const allItems = [...frames, ...contacts, ...services];
    res.json(allItems);
  } catch (err) {
    console.error("Failed to fetch inventory for dropdown:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all patients
router.get('/patients', async (req, res) => {
  try {
    const [patients] = await db.promise().query(`
      SELECT patientID, firstName, lastName
      FROM patient
    `);
    res.json(patients);
  } catch (err) {
    console.error("Failed to fetch patients:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all clinic locations
router.get('/locations', async (req, res) => {
  try {
    const [locations] = await db.promise().query(`
      SELECT locationID, name
      FROM location
    `);
    res.json(locations);
  } catch (err) {
    console.error("Failed to fetch locations:", err);
    res.status(500).json({ error: "Internal server error" });
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
    return res.status(400).json({ error: "Invalid itemType" });
  }

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

    const [salesData] = await db.promise().query(query, params);
    res.json(salesData);
  } catch (err) {
    console.error("Error fetching sales data with filters:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
