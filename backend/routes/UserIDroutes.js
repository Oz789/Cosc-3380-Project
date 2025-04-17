// UserIDroutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/user/:userID/patient', async (req, res) => {
  const { userID } = req.params;
  console.log('Received userID:', userID);

  if (!userID) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const patientQuery = 'SELECT patientID, firstName, lastName FROM patient WHERE patientID = ?';

    db.query(patientQuery, [userID], (err, patientResults) => {
      console.log('Database error (patient):', err);
      console.log('Database results (patient):', patientResults);
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch patient data from the database.' });
      }

      if (patientResults.length > 0) {
        const patient = patientResults[0];
        const patientID = patient.patientID;

        const appointmentQuery = `
          SELECT service1ID
          FROM appointments
          WHERE patientID = ?
        `;

        db.query(appointmentQuery, [patientID], (err, appointmentResults) => {
          console.log('Database error (appointment):', err);
          console.log('Database results (appointment):', appointmentResults);
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch appointment service ID.' });
          }

          let service1ID = null;
          if (appointmentResults.length > 0) {
            service1ID = appointmentResults[0].service1ID;
          }

          patient.service1ID = service1ID;

          if (service1ID) {
            const serviceQuery = `
              SELECT price
              FROM services
              WHERE serviceID = ?
            `;

            db.query(serviceQuery, [service1ID], (err, serviceResults) => {
              if (err) {
                console.error('Database error (service):', err);
                return res.status(500).json({ error: 'Failed to fetch service price.' });
              }
              if (serviceResults.length > 0) {
                patient.servicePrice = serviceResults[0].price;
              } else {
                patient.servicePrice = 'N/A';
              }

              const patientFormQuery = `
                SELECT LensesPrescription, ContactsPrescription
                FROM patientform
                WHERE PatientID = ?
              `;
              db.query(patientFormQuery, [patientID], (err, patientFormResults) => {
                if (err) {
                  console.error('Database error (patientform):', err);
                  return res.status(500).json({ error: 'Failed to fetch prescription data.' });
                }
                if (patientFormResults.length > 0) {
                  patient.lensesPrescription = patientFormResults[0].LensesPrescription;
                  patient.contactsPrescription = patientFormResults[0].ContactsPrescription;
                } else {
                  patient.lensesPrescription = 'N/A';
                  patient.contactsPrescription = 'N/A';
                }
                res.json(patient);
              });
            });
          } else {
            patient.servicePrice = 'N/A';
            const patientFormQuery = `
                SELECT LensesPrescription, ContactsPrescription
                FROM patientform
                WHERE PatientID = ?
              `;
            db.query(patientFormQuery, [patientID], (err, patientFormResults) => {
              if (err) {
                console.error('Database error (patientform):', err);
                return res.status(500).json({ error: 'Failed to fetch prescription data.' });
              }
              if (patientFormResults.length > 0) {
                patient.lensesPrescription = patientFormResults[0].LensesPrescription;
                patient.contactsPrescription = patientFormResults[0].ContactsPrescription;
              } else {
                patient.lensesPrescription = 'N/A';
                patient.contactsPrescription = 'N/A';
              }
              res.json(patient);
            });
          }
        });
      } else {
        res.status(404).json({ message: 'Patient not found for this User ID.' });
      }
    });
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
