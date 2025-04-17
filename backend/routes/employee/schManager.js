const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', (req, res) => {

    const sql = `SELECT DISTINCT D.doctorID, E.firstName, E.lastName
                 FROM doctorschedule S
                 JOIN doctors  D ON S.doctorID   = D.doctorID
                 JOIN employee E ON D.employeeID = E.employeeID`; // SELECT * FROM doctorschedule
    db.query(sql, (err, results) => {
      if (err)
      {
        console.error("Error retrieving from database", err);
        return res.status(500).json({ error: "Database error. Please try again later."});
      }

      const columns = results.map(room => ({
        id: room.doctorID,
        name: room.firstName + ' ' + room.lastName,

      })

      )
         
      res.json(columns);
    });



});

// Save event
router.post('/', (req, res) => {
  const { sid, did, lid, dow, start, end } = req.body;

  const sql = `INSERT INTO doctorschedule (scheduleID, doctorID, locationID, dayOfWeek, startTime, endTime)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [sid, did, lid, dow, start, end], (err) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).send("Error saving event");
    }
    res.status(200).send("Event saved");
  });
});

// Get all events for rendering
router.get('/all', (req, res) => {
  const sql = `SELECT * FROM doctorschedule`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving events:', err);
      return res.status(500).send("Error loading events");
    }
    res.json(results);
  });
});

router.get('/options', (req, res) => {
  const locationsSql = `SELECT locationID, name FROM location`;
  const doctorsSql = `
    SELECT D.doctorID, E.firstName, E.lastName
    FROM doctors D
    JOIN employee E ON D.employeeID = E.employeeID
  `;

  db.query(locationsSql, (err1, locations) => {
    if (err1) {
      console.error("Error retrieving locations:", err1);
      return res.status(500).json({ error: "Database error (locations)." });
    }

    db.query(doctorsSql, (err2, doctors) => {
      if (err2) {
        console.error("Error retrieving doctors:", err2);
        return res.status(500).json({ error: "Database error (doctors)." });
      }

      // Return both lists in one JSON object
      res.json({
        locations: locations.map(loc => ({
          id: loc.locationID,
          name: loc.name
        })),
        doctors: doctors.map(doc => ({
          id: doc.doctorID,
          name: `${doc.firstName} ${doc.lastName}`
        }))
      });
    });
  });
});




module.exports = router;