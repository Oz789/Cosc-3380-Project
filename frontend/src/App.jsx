import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/reports/adminReportsPage";
import PatientReport from "./pages/admin/reports/patientReport";
import PatientDemographicsReport from "./pages/admin/reports/patientDemographicsReport";
import PatientPrescriptionReport from "./pages/admin/reports/patientPrescriptionReport";
import InventoryReport from "./pages/admin/reports/inventoryReport";
import StaffReport from "./pages/admin/reports/staffReport";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminSettings from "./pages/admin/AdminSettings";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientProfile from "./pages/patientPortal/patientProfile";
import PatientSettings from "./pages/patient/PatientSettings";
import ScheduleAppointment from "./pages/patient/ScheduleAppointment";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffAppointments from "./pages/staff/StaffAppointments";
import StaffPatients from "./pages/staff/StaffPatients";
import StaffSettings from "./pages/staff/StaffSettings";
import NotFound from "./pages/NotFound";
import EditPatientProfile from './pages/patientPortal/editPatientProfile';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/patient-report" element={<PatientReport />} />
        <Route path="/patientDemographicsReport" element={<PatientDemographicsReport />} />
        <Route path="/patientPrescriptionReport" element={<PatientPrescriptionReport />} />
        <Route path="/inventory-report" element={<InventoryReport />} />
        <Route path="/staff-report" element={<StaffReport />} />
        <Route path="/admin-appointments" element={<AdminAppointments />} />
        <Route path="/admin-inventory" element={<AdminInventory />} />
        <Route path="/admin-staff" element={<AdminStaff />} />
        <Route path="/admin-patients" element={<AdminPatients />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
        <Route path="/patient-profile/:patientID/edit" element={<EditPatientProfile />} />
        <Route path="/patient-profile/:patientID" element={<PatientProfile />} />
        <Route path="/patient-settings" element={<PatientSettings />} />
        <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/staff-appointments" element={<StaffAppointments />} />
        <Route path="/staff-patients" element={<StaffPatients />} />
        <Route path="/staff-settings" element={<StaffSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;