const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    console.log('Fetching patient with ID:', patientId);

    const connection = await db.getConnection();
    try {
      // Get patient basic information
      const [patientResult] = await connection.query(
        'SELECT * FROM patient WHERE patientID = ?',
        [patientId]
      );

      console.log('Patient query result:', patientResult);

      if (!patientResult || patientResult.length === 0) {
        console.log('No patient found with ID:', patientId);
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Get appointments with filtering options
      const { showPast, serviceType } = req.query;
      let appointmentsQuery = `
        SELECT 
          a.appointmentNumber,
          DATE_FORMAT(a.appointmentDate, '%M %d, %Y') AS appointmentDate,
          TIME_FORMAT(a.appointmentTime, '%h:%i %p') AS appointmentTime,
          e.firstName AS doctorFirstName,
          e.lastName AS doctorLastName,
          s.serviceName,
          l.name AS locationName,
          a.status
        FROM appointments a
        JOIN doctors d ON a.doctorId = d.doctorID
        JOIN employee e ON d.employeeID = e.employeeID
        JOIN services s ON a.service1ID = s.serviceID
        JOIN location l ON a.locationID = l.locationID
        WHERE a.patientId = ?
      `;

      const queryParams = [patientId];

      // Add date filter
      if (showPast === 'false') {
        appointmentsQuery += ' AND a.appointmentDate >= CURDATE()';
      }

      // Add service type filter
      if (serviceType) {
        appointmentsQuery += ' AND a.service1ID = ?';
        queryParams.push(serviceType);
      }

      appointmentsQuery += ' ORDER BY a.appointmentDate, a.appointmentTime';

      console.log('Appointments query:', appointmentsQuery);
      console.log('Query params:', queryParams);

      const [appointmentsResult] = await connection.query(appointmentsQuery, queryParams);
      console.log('Appointments result:', appointmentsResult);

      // Combine all results
      const response = {
        generalInfo: {
          ...patientResult[0],
          password: undefined // Don't send password
        },
        appointments: appointmentsResult || []
      };

      console.log('Final response:', response);
      res.json(response);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in patient route:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message
    });
  }
});


// Create patient record
router.post('/submit', async (req, res) => {
  const {
    firstName,
    lastName,
    DOB,
    email,
    password,
    phoneNumber,
    address,
    sex,
    occupation,
    insuranceID,
    lastExamDate,
    usesCorrectiveLenses,
    usesContacts,
    LensesPrescription,
    ContactsPrescription,
    lastPrescriptionDate,
    healthConcerns,
    otherConcerns,
    conditions,
    otherConditions,
    hadSurgery,
    surgeries,
    otherSurgeries,
    allergies,
    additionalDetails
  } = req.body;

  try {
    console.log('Received sex value:', sex);
    console.log('Sex value type:', typeof sex);
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Available valid values:', ['Male', 'Female', 'Other']);
    console.log('Is sex included in valid values?', ['Male', 'Female', 'Other'].includes(sex));
    // Validate sex value
    if (!['Male', 'Female', 'Other'].includes(sex) || sex === "") {
      return res.status(400).json({ error: 'Invalid sex value. Must be "Male", "Female", or "Other"' });
    }

    // Validate healthConcerns values
    const allowedHealthConcerns = [
      'General Pain', 'Blurry Vision', 'Burning Sensation', 'Difficulty Reading',
      'Dizziness', 'Double Vision', 'Eye Strain', 'Headaches', 'Itchy Eyes',
      'Light Sensitivity', 'Lumps', 'Tunnel Vision', 'Watery Eyes'
    ];

    if (healthConcerns && !Array.isArray(healthConcerns)) {
      return res.status(400).json({ error: 'healthConcerns must be an array' });
    }

    const invalidConcerns = healthConcerns.filter(concern => !allowedHealthConcerns.includes(concern));
    if (invalidConcerns.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid health concerns', 
        invalidValues: invalidConcerns,
        allowedValues: allowedHealthConcerns 
      });
    }

    const connection = await db.getConnection();
    try {
      // Insert into patient table
      const patientQuery = `
        INSERT INTO patient (
          firstName, lastName, DOB, sex, occupation, address, phoneNumber, email, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const hashedPassword = await bcrypt.hash(password, 10);
      const patientValues = [
        firstName, lastName, DOB, sex, occupation, address, phoneNumber, email, hashedPassword
      ];

      const [result] = await connection.query(patientQuery, patientValues);
      const patientId = result.insertId;

      // Insert medical form data
      const medicalFormQuery = `
        INSERT INTO patientform (
          patientID, visitDate, lastExamDate, usesCorrectiveLenses, usesContacts, 
          LensesPrescription, ContactsPrescription, lastPrescriptionDate,
          healthConcerns, otherConcerns, conditions, otherConditions, 
          hadSurgery, surgeries, otherSurgeries, allergies, additionalDetails,
          insuranceID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const medicalFormValues = [
        patientId,
        new Date(),
        lastExamDate,
        usesCorrectiveLenses,
        usesContacts,
        LensesPrescription,
        ContactsPrescription,
        lastPrescriptionDate,
        (healthConcerns || []).join(','),
        otherConcerns,
        (conditions || []).join(','),
        otherConditions,
        hadSurgery,
        (surgeries || []).join(','), 
        otherSurgeries,
        allergies,
        additionalDetails,
        insuranceID
      ];

      await connection.query(medicalFormQuery, medicalFormValues);

      res.status(201).json({ message: 'Patient record created successfully', patientId });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating patient record:', error);
    res.status(500).json({ 
      error: 'Failed to create patient record',
      details: error.message 
    });
  }
});

// Update patient information
router.patch('/:id', async (req, res) => {
  const patientId = req.params.id;
  const {
    firstName,
    lastName,
    DOB,
    email,
    phoneNumber,
    address,
    sex,
    occupation
  } = req.body;

  try {
    const connection = await db.getConnection();
    try {
      // Validate date format
      if (DOB && !/^\d{4}-\d{2}-\d{2}$/.test(DOB)) {
        return res.status(400).json({ error: 'Invalid date format. Must be yyyy-MM-dd' });
      }

      const updateSQL = `
        UPDATE patient SET
          firstName = ?,
          lastName = ?,
          DOB = ?,
          email = ?,
          phoneNumber = ?,
          address = ?,
          sex = ?,
          occupation = ?
        WHERE patientID = ?
      `;

      const values = [
        firstName,
        lastName,
        DOB || null, // Handle empty dates
        email,
        phoneNumber,
        address,
        sex,
        occupation,
        patientId
      ];

      const [result] = await connection.query(updateSQL, values);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.status(200).json({ message: 'Patient information updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient information' });
  }
});

module.exports = router;
