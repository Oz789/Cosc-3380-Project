const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;


if (!SECRET_KEY) throw new Error("JWT_SECRET not defined!");

router.get("/test", (req, res) => {
    res.send("login.js route file is active");
  });
  

router.post("/employee", (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const employeeSQL = "SELECT * FROM Employee WHERE email = ?";
  
    db.query(employeeSQL, [email], async (err, result) => {
      if (err){
        console.error("Database error: ", err.message);
        return res.status(500).send("Internal server error");
        }
  
      if (result.length === 0){
        console.log("No user found with that email.");
        return res.status(401).send("Invalid email or password");
        }

        console.log("Employee found. Checking password...");
        console.log("Stored hash:", result[0].password);
console.log("Plain input password:", password);


      const match = await bcrypt.compare(password, result[0].password);
      if (!match) return res.status(401).send("Invalid email or password");
  
      if (result[0].isAdmin) {
        const token = jwt.sign(
          { id: result[0].employeeID, role: "admin" },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ token, role: "admin", user: result[0] });
      }
  
    
    const dooctorSQL = "SELECT * FROM Doctors WHERE employeeID = ?";

      db.query(dooctorSQL, [result[0].employeeID], (err, docResult) => {
        if (err) return res.status(500).send("Internal server error");
        if (docResult.length > 0) {
          const token = jwt.sign(
  { id: result[0].employeeID, role: "doctor" },
  SECRET_KEY,
  { expiresIn: "1h" }
);
return res.status(200).json({ token, role: "doctor", user: result[0], doctorInfo: docResult[0] });

        } else {
          const token = jwt.sign(
            { id: result[0].employeeID, role: "employee" },
            SECRET_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({ token, role: "employee", user: result[0] });
          
        }
        });
   });
});

  router.post("/patient", (req, res) => {

    const { email, password } = req.body;
    console.log(" Patient login attempt for:", email); 

        const sql = "SELECT * FROM Patient WHERE email = ?";
  
    db.query(sql, [email], async (err, result) => {
      if (err){
        console.error("Database error: ", err.message);
        return res.status(500).send("Internal server error");}
  
      if (result.length === 0){
        return res.status(401).send("Invalid email or password");
        }
  
      const match = await bcrypt.compare(password, result[0].password);
      if (!match) return res.status(401).send("Invalid email or password");
  
      const token = jwt.sign(
        { id: result[0].patientID, role: "patient" },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, role: "patient", user: result[0] });
      
    });
  });
  

module.exports = router;
