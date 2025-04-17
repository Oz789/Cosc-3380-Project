const express = require('express');
const router = express.Router();
const db = require('../db');

// Check table structure
router.get('/check-tables', async (req, res) => {
  try {
    const query = `
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME IN ('sales', 'saleitems', 'Appointments')
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `;
    
    const [columns] = await db.query(query, [process.env.DB_NAME]);
    console.log('Table structure:', columns);
    res.json(columns);
  } catch (error) {
    console.error('Error checking table structure:', error);
    res.status(500).json({ error: 'Failed to check table structure', details: error.message });
  }
});

// Get billing history for a specific patient
router.get('/history/:patientID', async (req, res) => {
  try {
    const { patientID } = req.params;
    console.log('Fetching billing history for patient:', patientID);
    
    // First, verify the tables exist
    const checkTablesQuery = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('sales', 'saleitems', 'Appointments')
    `;
    
    const [tables] = await db.query(checkTablesQuery, [process.env.DB_NAME]);
    console.log('Available tables:', tables);
    
    if (tables.length < 3) {
      const missingTables = ['sales', 'saleitems', 'Appointments'].filter(
        table => !tables.some(t => t.TABLE_NAME === table)
      );
      return res.status(500).json({ error: 'Missing tables', details: `Missing required tables: ${missingTables.join(', ')}` });
    }

    // Check if patient exists
    const checkPatientQuery = 'SELECT patientID FROM patient WHERE patientID = ?';
    const [patient] = await db.query(checkPatientQuery, [patientID]);
    console.log('Patient check result:', patient);
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ error: 'Patient not found', details: `Patient with ID ${patientID} not found` });
    }

    // Query to get sales, sale items, and appointment information
    const query = `
      SELECT 
        s.saleID,
        s.saleDate,
        CAST(s.totalAmount AS DECIMAL(10,2)) as totalAmount,
        s.appointmentNumber,
        si.saleItemID,
        si.itemID,
        si.itemType,
        si.quantity,
        CAST(si.price AS DECIMAL(10,2)) as price,
        a.appointmentDate,
        a.appointmentTime,
        a.service1ID
      FROM sales s
      LEFT JOIN saleitems si ON s.saleID = si.saleID
      LEFT JOIN Appointments a ON s.appointmentNumber = a.appointmentNumber
      WHERE s.patientID = ?
      ORDER BY s.saleDate DESC
    `;
    
    console.log('Executing main query:', query);
    console.log('With patientID:', patientID);
    
    const [billingHistory] = await db.query(query, [patientID]);
    console.log('Query results:', billingHistory);
    
    if (!billingHistory || billingHistory.length === 0) {
      console.log('No billing history found for patient:', patientID);
      return res.json([]);
    }
    
    // Group items by sale
    const groupedBilling = billingHistory.reduce((acc, item) => {
      if (!acc[item.saleID]) {
        acc[item.saleID] = {
          saleID: item.saleID,
          saleDate: item.saleDate,
          totalAmount: Number(item.totalAmount),
          appointmentNumber: item.appointmentNumber,
          appointmentDate: item.appointmentDate,
          appointmentTime: item.appointmentTime,
          serviceID: item.service1ID,
          items: []
        };
      }
      
      if (item.saleItemID) {
        acc[item.saleID].items.push({
          saleItemID: item.saleItemID,
          itemID: item.itemID,
          itemType: item.itemType,
          quantity: Number(item.quantity),
          price: Number(item.price)
        });
      }
      
      return acc;
    }, {});
    
    // Convert to array
    const result = Object.values(groupedBilling);
    console.log('Grouped billing history:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Error in billing history route:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message
    });
  }
});

module.exports = router; 