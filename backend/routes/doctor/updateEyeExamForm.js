const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/', async (req, res) => {
  const {
    appointmentNumber,
    dateOfExam,
    chiefComplaint,
    ocularHistory,
    medicalHistory,
    drugAllergies,
    uvacDistanceRight, uvacDistanceLeft, uvacDistanceBoth, uvacNearBoth,
    bvacDistanceRight, bvacDistanceLeft, bvacDistanceBoth, bvacNearBoth,
    refractionOD, refractionOS,
    iopOD, iopOS,
    lids, cornea, anteriorChamber, iris, lens,
    opticDisc, macula, vessels, retina,
    diagnosis, treatmentPlan,
    referral,  
    patientID
  } = req.body;

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();
    const examSql = `
      INSERT INTO EyeExam (
        appointmentNumber, dateOfExam, chiefComplaint,
        ocularHistory, medicalHistory, drugAllergies,
        uvacDistanceRight, uvacDistanceLeft, uvacDistanceBoth, uvacNearBoth,
        bvacDistanceRight, bvacDistanceLeft, bvacDistanceBoth, bvacNearBoth,
        refractionOD, refractionOS,
        iopOD, iopOS,
        lids, cornea, anteriorChamber, iris, lens,
        opticDisc, macula, vessels, retina,
        diagnosis, treatmentPlan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const examValues = [
      appointmentNumber, dateOfExam, chiefComplaint,
      ocularHistory, medicalHistory, drugAllergies,
      uvacDistanceRight, uvacDistanceLeft, uvacDistanceBoth, uvacNearBoth,
      bvacDistanceRight, bvacDistanceLeft, bvacDistanceBoth, bvacNearBoth,
      refractionOD, refractionOS,
      iopOD, iopOS,
      lids, cornea, anteriorChamber, iris, lens,
      opticDisc, macula, vessels, retina,
      diagnosis, treatmentPlan
    ];

    await connection.query(examSql, examValues);

   
    if (referral) {
        const referralSql = `
        INSERT INTO Referrals (
          appointmentNumber, patientID, doctorID, referralDate,
          specialistType, referralReason, urgencyLevel,
          referredToClinic, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const referralValues = [
        appointmentNumber,
        patientID,
        referral.doctorID,           
        dateOfExam,
        referral.specialty,
        referral.reason,
        referral.urgency || 'Routine',
        referral.referredTo,
        referral.additionalNotes
      ];

      await connection.query(referralSql, referralValues);
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Exam and referral saved' });

  } catch (err) {
    await connection.rollback();
    console.error('Transaction error:', err);
    res.status(500).json({ success: false, message: 'Failed to save exam and referral' });

  } finally {
    connection.release();
  }
});

module.exports = router;

