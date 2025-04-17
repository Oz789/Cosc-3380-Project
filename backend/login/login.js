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

router.post("/employee", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // Query employee
    const [employees] = await db.query("SELECT * FROM Employee WHERE email = ?", [email]);
    
    if (employees.length === 0) {
      console.log("No user found with that email.");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const employee = employees[0];
    
    // Verify password
    const match = await bcrypt.compare(password, employee.password);
    if (!match) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if admin
    if (employee.isAdmin) {
      const token = jwt.sign(
        { id: employee.employeeID, role: "admin" },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token, role: "admin", user: employee });
    }

    // Check if doctor
    const [doctors] = await db.query("SELECT * FROM Doctors WHERE employeeID = ?", [employee.employeeID]);
    
    if (doctors.length > 0) {
      const token = jwt.sign(
        { id: employee.employeeID, role: "doctor" },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ 
        token, 
        role: "doctor", 
        user: employee, 
        doctorInfo: doctors[0] 
      });
    }

    // Regular employee
    const token = jwt.sign(
      { id: employee.employeeID, role: "employee" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token, role: "employee", user: employee });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/patient", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Patient login attempt for:", email);

    // Query patient
    const [patients] = await db.query("SELECT * FROM Patient WHERE email = ?", [email]);
    
    if (patients.length === 0) {
      console.log("No patient found with that email.");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const patient = patients[0];
    
    // Verify password
    const match = await bcrypt.compare(password, patient.password);
    if (!match) {
      console.log("Password mismatch for patient:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: patient.patientID, role: "patient" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    
    return res.status(200).json({ token, role: "patient", user: patient });

  } catch (error) {
    console.error("Patient login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
