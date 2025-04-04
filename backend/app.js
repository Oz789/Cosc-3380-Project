const express = require('express');
const cors = require('cors');

const db = require("./db"); // Import the database connection

const createContacts = require('./routes/patient/createContacts');
const employeeRoutes = require("./routes/employee/newEmployee");
const loginRoutes = require("./login/login");
const createDoctorRoute = require("./routes/doctor/createDoctor");
const getDoctorRoute = require("./routes/doctor/getDoctor");
const patientRoutes = require("./routes/patientRoutes");
const messageRoutes = require("./routes/message/getMessage");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/employees", employeeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/doctor", createDoctorRoute);
app.use("/api", getDoctorRoute);
app.use("/api/patients", patientRoutes);
app.use("/api/messages", messageRoutes);
app.use("/", createContacts);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));