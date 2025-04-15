/*
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require("./db");
const createContacts = require('./routes/patient/createContacts');
const employeeRoutes = require('./routes/employee/newEmployee');
const loginRoutes = require('./login/login');
const createDoctorRoute = require('./routes/doctor/createDoctor');
const getDoctorRoute = require('./routes/doctor/getDoctor');
const patientRoutes = require('./routes/patientRoutes');
const messageRoutes = require('./routes/message/getMessage');
//const formRoutes = require('./routes/patients/createContacts');
const createFramesRoute = require('./routes/admin/createFrames');
const getFramesRoute = require('./routes/admin/getFrames');
const deleteFrameRoute = require('./routes/admin/deleteFrames');
const updateFrameRoute = require('./routes/admin/updateFrames');
const createContactRoute = require('./routes/admin/createContacts');
const getContactsRoute = require('./routes/admin/getContacts');
const deleteContactsRoute = require('./routes/admin/deleteContacts');
const createServiceRoute = require('./routes/admin/createService');
const getServicesRoute = require('./routes/admin/getService');
const deleteServiceRoute = require('./routes/admin/deleteService');
const deleteEmployeeRoute = require('./routes/employee/deleteEmployee');
const getEmployeeRoute = require('./routes/employee/getEmployee');
const updateContactsRoute = require('./routes/admin/updateContacts');
const updateServicesRoute = require('./routes/admin/updateServices');
const getInventoryRoute = require('./routes/reports/getInventory');
const appointmentRoutes = require('./routes/appointmentRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const authenticateToken = require('./middleware/auth');
const updateEmployee = require('./routes/employee/updateEmployee');






const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Access granted to protected route ",
    user: req.user
  });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/doctor", createDoctorRoute);
app.use("/api", getDoctorRoute);
app.use("/api/patients", patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/", createContacts);
app.use("/api/checkout", checkoutRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/doctor', createDoctorRoute);
app.use('/api', getDoctorRoute);
app.use('/api/patients', patientRoutes);
app.use('/api/messages', messageRoutes);
//app.use('/api/submit-form', formRoutes);
app.use('/', createContacts);
app.use('/api', createFramesRoute);
app.use('/api', getFramesRoute);
app.use('/api', deleteFrameRoute);
app.use('/api', updateFrameRoute);
app.use('/api', createContactRoute);
app.use('/api', getContactsRoute);
app.use('/api', updateContactsRoute);
app.use('/api', deleteContactsRoute);
app.use('/api', createServiceRoute);
app.use('/api', getServicesRoute);
app.use('/api', deleteServiceRoute);
app.use('/api/employees', deleteEmployeeRoute);
app.use('/api', getEmployeeRoute);
app.use('/api/employees', updateEmployee);
app.use('/api', updateServicesRoute);
app.use('/api', getInventoryRoute);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require("./db");
const createContacts = require('./routes/patient/createContacts');
const employeeRoutes = require('./routes/employee/newEmployee');
const loginRoutes = require('./login/login');
const createDoctorRoute = require('./routes/doctor/createDoctor');
const getDoctorRoute = require('./routes/doctor/getDoctor');
const patientRoutes = require('./routes/patientRoutes');
const messageRoutes = require('./routes/message/getMessage');
const createFramesRoute = require('./routes/admin/createFrames');
const getFramesRoute = require('./routes/admin/getFrames');
const deleteFrameRoute = require('./routes/admin/deleteFrames');
const updateFrameRoute = require('./routes/admin/updateFrames');
const createContactRoute = require('./routes/admin/createContacts');
const getContactsRoute = require('./routes/admin/getContacts');
const deleteContactsRoute = require('./routes/admin/deleteContacts');
const createServiceRoute = require('./routes/admin/createService');
const getServicesRoute = require('./routes/admin/getService');
const deleteServiceRoute = require('./routes/admin/deleteService');
const deleteEmployeeRoute = require('./routes/employee/deleteEmployee');
const getEmployeeRoute = require('./routes/employee/getEmployee');
const updateContactsRoute = require('./routes/admin/updateContacts');
const updateServicesRoute = require('./routes/admin/updateServices');
const getInventoryRoute = require('./routes/reports/getInventory');
const appointmentRoutes = require('./routes/appointmentRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const authenticateToken = require('./middleware/auth');
const updateEmployee = require('./routes/employee/updateEmployee');
const UserIDroutes = require('./routes/UserIDroutes'); // IMPORT THE NEW ROUTE FILE


const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/protected", authenticateToken, (req, res) => {
 res.json({
  message: "Access granted to protected route ",
  user: req.user
 });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/doctor", createDoctorRoute);
app.use("/api", getDoctorRoute);
app.use("/api/patients", patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/", createContacts);
app.use("/api/checkout", checkoutRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/doctor', createDoctorRoute);
app.use('/api', getDoctorRoute);
app.use('/api/patients', patientRoutes);
app.use('/api/messages', messageRoutes);
app.use('/', createContacts);
app.use('/api', createFramesRoute);
app.use('/api', getFramesRoute);
app.use('/api', deleteFrameRoute);
app.use('/api', updateFrameRoute);
app.use('/api', createContactRoute);
app.use('/api', getContactsRoute);
app.use('/api', updateContactsRoute);
app.use('/api', deleteContactsRoute);
app.use('/api', createServiceRoute);
app.use('/api', getServicesRoute);
app.use('/api', deleteServiceRoute);
app.use('/api/employees', deleteEmployeeRoute);
app.use('/api', getEmployeeRoute);
app.use('/api/employees', updateEmployee);
app.use('/api', updateServicesRoute);
app.use('/api', getInventoryRoute);
app.use('/api', UserIDroutes); // USE THE NEW ROUTE FILE


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));