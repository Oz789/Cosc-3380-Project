const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patientId = req.params.id;

    const [patientResult] = await db.promise().query(
      'SELECT * FROM patient WHERE patientID = ?',
      [patientId]
    );

    if (patientResult.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const [medicalFormResult] = await db.promise().query(
      'SELECT * FROM patientform WHERE patientID = ? ORDER BY visitDate DESC LIMIT 1',
      [patientId]
    );

    const [appointmentsResult] = await db.promise().query(
      `SELECT 
         a.appointmentDate,
         TIME_FORMAT(a.appointmentTime, '%H:%i') AS appointmentTime,
         e.firstName AS doctorFirstName,
         e.lastName AS doctorLastName,
         s.serviceName
       FROM appointments a
       JOIN doctors d ON a.doctorId = d.doctorID
       JOIN employee e ON d.employeeID = e.employeeID
       JOIN services s ON a.service1ID = s.serviceID
       WHERE a.patientId = ?
       ORDER BY a.appointmentDate, a.appointmentTime`,
      [patientId]
    );
    

    const patientData = {
      ...patientResult[0],
      medicalForm: medicalFormResult[0] || {},
      appointments: appointmentsResult || []
    };

    res.json(patientData);
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).json({ error: 'Failed to fetch patient data' });
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

    const [result] = await db.promise().query(patientQuery, patientValues);
    const patientId = result.insertId;

    // Insert medical form data
    const medicalFormQuery = `
      INSERT INTO patientform (
        patientID, visitDate, lastExamDate, usesCorrectiveLenses, usesContacts, 
        LensesPrescription, ContactsPrescription, lastPrescriptionDate,
        healthConcerns, otherConcerns, conditions, otherConditions, 
        hadSurgery, surgeries, otherSurgeries, allergies, additionalDetails
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    // Get patient's appointments with doctor and service info
    const appointmentsQuery = `
      SELECT 
        a.appointmentDate,
        TIME_FORMAT(a.appointmentTime, '%H:%i') AS appointmentTime,
        e.firstName AS doctorFirstName,
        e.lastName AS doctorLastName,
        s.serviceName
        FROM appointments a
        JOIN doctors d ON a.doctorId = d.doctorID
        JOIN employee e ON d.employeeID = e.employeeID
        JOIN services s ON a.service1ID = s.serviceID
        WHERE a.patientId = ?
        ORDER BY a.appointmentDate, a.appointmentTime
`;


    //const [appointmentsResult] = await db.promise().query(appointmentsQuery, [patientId]);


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
      additionalDetails
    ];
    

    await db.promise().query(medicalFormQuery, medicalFormValues);

    // Insert emergency contacts
    /*if (emergencyContacts && emergencyContacts.length > 0) {
      const contactQuery = `
        INSERT INTO emergency_contacts (patient_id, name, phone)
        VALUES (?, ?, ?)
      `;

      for (const contact of emergencyContacts) {
        if (contact.name && contact.phone) {
          await db.promise().query(contactQuery, [patientId, contact.name, contact.phone]);
        }
      }
    }*/

    res.status(201).json({ message: 'Patient record created successfully', patientId });
  } catch (error) {
    console.error('Error creating patient record:', error);
    res.status(500).json({ error: 'Failed to create patient record' });
  }

});

module.exports = router;
