
const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', async (req, res) => {
  const { items /*, patientID */ } = req.body;


  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid checkout data' });
  }


  let totalPrice = 0;
  const frameIDs = items.filter(i => i.frameID).map(i => i.frameID);
  const contactIDs = items.filter(i => i.contactID).map(i => i.contactID);


  const priceMap = new Map();
  const stockMap = new Map();


  try {
    // Helper function to execute queries
    const queryAsync = (sql, values) => {
      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        });
      });
    };


    await new Promise(resolve => db.beginTransaction(() => resolve()));


    // Fetch frame prices
    if (frameIDs.length) {
      const placeholders = frameIDs.map(() => '?').join(',');
      const rows = await queryAsync(
        `SELECT frameID, price FROM frames WHERE frameID IN (${placeholders})`,
        frameIDs
      );
      for (const row of rows) {
        let price = row.price;
        if (typeof price === 'string') {
          price = parseFloat(price);
        }
        priceMap.set(row.frameID, price);
      }
    }


    // Fetch contact prices
    if (contactIDs.length) {
      const placeholders = contactIDs.map(() => '?').join(',');
      const rows = await queryAsync(
        `SELECT contactID, price FROM eyecontacts WHERE contactID IN (${placeholders})`,
        contactIDs
      );
      for (const row of rows) {
        let price = row.price;
        if (typeof price === 'string') {
          price = parseFloat(price);
        }
        priceMap.set(row.contactID, price);
      }
    }


    // Fetch frame inventory
    if (frameIDs.length) {
      const placeholders = frameIDs.map(() => '?').join(',');
      const rows = await queryAsync(
        `SELECT frameID, stockCount FROM inventory WHERE frameID IN (${placeholders})`,
        frameIDs
      );
      for (const row of rows) stockMap.set(row.frameID, row.stockCount);
    }


    // Fetch contact inventory
    if (contactIDs.length) {
      const placeholders = contactIDs.map(() => '?').join(',');
      const rows = await queryAsync(
        `SELECT contactID, stockCount FROM inventory WHERE contactID IN (${placeholders})`,
        contactIDs
      );
      for (const row of rows) stockMap.set(row.contactID, row.stockCount);
    }


    // Validate all items before proceeding
    for (const item of items) {
      const id = item.frameID || item.contactID;
      let price = priceMap.get(id);
      const stock = stockMap.get(id);


      console.log(`Item ID: ${id}, Price (before check): ${price}, Type: ${typeof price}`);


      if (typeof price === 'string') {
        price = parseFloat(price);
        console.log(`Item ID: ${id}, Price (after conversion): ${price}, Type: ${typeof price}`);
      }


      if (price == null || isNaN(price) || stock == null || stock <= 0) {
        await new Promise(resolve => db.rollback(() => resolve()));
        return res.status(400).json({ error: `Item ${id} has an invalid price or is out of stock.` });
      }
      totalPrice += price;
    }
    console.log('Total price before response:', totalPrice, typeof totalPrice);


    // All items are in stock, proceed with stock updates
    for (const item of items) {
      const id = item.frameID || item.contactID;
      const isFrame = !!item.frameID;


      // Update inventory
      const updateQuery = isFrame
        ? `UPDATE inventory SET stockCount = stockCount - 1 WHERE frameID = ? AND stockCount > 0`
        : `UPDATE inventory SET stockCount = stockCount - 1 WHERE contactID = ? AND stockCount > 0`;


      const updateResult = await queryAsync(updateQuery, [id]);


      if (updateResult.affectedRows === 0) {
        await new Promise(resolve => db.rollback(() => resolve()));
        return res.status(400).json({ error: `Stock update failed for item ${id}` });
      }


      // Optional: log successful update
      console.log(`Stock updated for ${isFrame ? 'frameID' : 'contactID'} ${id}`);
    }


    await new Promise(resolve => db.commit(() => resolve()));
    res.status(200).json({ message: 'Checkout successful', totalPrice });


  } catch (err) {
    console.error('Checkout error:', err);
    await new Promise(resolve => db.rollback(() => resolve()));
    res.status(500).json({ error: 'Checkout failed' });
  } finally {
    // You cannot release a single connection obtained with createConnection()
    // The connection is closed when the Node.js process exits.
    // If you were using a pool, you would release the connection here.
  }
});


module.exports = router;
