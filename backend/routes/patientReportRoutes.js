const express = require('express');
const router = express.Router();
const db = require('../db');

// Get patient report data
router.get('/', async (req, res) => {
  try {
    console.log('Starting patient report query...');
    const query = `
      SELECT DISTINCT
        p.patientID,
        p.firstName,
        p.lastName,
        p.DOB,
        i.insuranceProvider,
        a.paymentStatus,
        pf.usesCorrectiveLenses,
        pf.usesContacts,
        pf.healthConcerns,
        pf.conditions,
        pf.surgeries,
        pf.LensesPrescription,
        pf.ContactsPrescription,
        DATE_FORMAT(a.appointmentDate, '%Y-%m-%d') as appointmentDate,
        l.Name as locationName,
        l.address as locationAddress,
        CONCAT(e.firstName, ' ', e.lastName) as doctorName
      FROM patient p
      INNER JOIN appointments a ON p.patientID = a.patientID
      LEFT JOIN patientForm pf ON p.patientID = pf.patientID
      LEFT JOIN insurance i ON pf.insuranceID = i.insuranceID
      LEFT JOIN location l ON a.locationID = l.locationID
      LEFT JOIN doctors d ON a.doctorID = d.doctorID
      LEFT JOIN employee e ON d.employeeID = e.employeeID
      WHERE a.appointmentDate IS NOT NULL 
        AND a.appointmentDate != ''
        AND a.status != 'Cancelled'
      ORDER BY a.appointmentDate DESC
    `;

    console.log('Executing query:', query);
    const [results] = await db.query(query);
    console.log('Query successful, processing results...');
    console.log('Number of results:', results.length);
    console.log('Sample result:', results[0]);

    const processedResults = results.map(row => {
      try {
        console.log('Processing row:', row.patientID);

        let healthConcerns = [];
        let conditions = [];
        let surgeries = [];

        if (row.healthConcerns) {
          try {
            const parsed = JSON.parse(row.healthConcerns);
            healthConcerns = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing healthConcerns:', e);
            healthConcerns = row.healthConcerns.split(',').map(item => item.trim());
          }
        }

        if (row.conditions) {
          try {
            const parsed = JSON.parse(row.conditions);
            conditions = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing conditions:', e);
            conditions = row.conditions.split(',').map(item => item.trim());
          }
        }

        if (row.surgeries) {
          try {
            const parsed = JSON.parse(row.surgeries);
            surgeries = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error('Error parsing surgeries:', e);
            surgeries = row.surgeries.split(',').map(item => item.trim());
          }
        }

        return {
          ...row,
          healthConcerns: healthConcerns,
          conditions: conditions,
          surgeries: surgeries,
          locationName: row.locationName || 'Not specified',
          locationAddress: row.locationAddress || 'Not specified',
          doctorName: row.doctorName || 'Not specified',
          insuranceProvider: row.insuranceProvider || 'Not specified',
          paymentStatus: row.paymentStatus || 'Not specified',
          LensesPrescription: row.LensesPrescription || 'N/A',
          ContactsPrescription: row.ContactsPrescription || 'N/A'
        };
      } catch (error) {
        console.error('Error processing row:', error);
        console.error('Row data:', row);
        return {
          ...row,
          healthConcerns: [],
          conditions: [],
          surgeries: [],
          locationName: row.locationName || 'Not specified',
          locationAddress: row.locationAddress || 'Not specified',
          doctorName: row.doctorName || 'Not specified',
          insuranceProvider: row.insuranceProvider || 'Not specified',
          paymentStatus: row.paymentStatus || 'Not specified',
          LensesPrescription: 'N/A',
          ContactsPrescription: 'N/A'
        };
      }
    });

    console.log('Sending response with processed results');
    res.json(processedResults);
  } catch (err) {
    console.error('Database error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Failed to fetch patient report',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router; 