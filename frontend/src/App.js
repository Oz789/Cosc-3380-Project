import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import AboutP from "./pages/about/aboutPage";
import ContactP from "./pages/contact/contactUs";
import MultiStepForm from "./pages/appointments/MultiStepForm";
import Services from "./pages/services/services";
import PatientProfile from "./pages/patientPortal/patientProfile";
import Login from "./pages/logIn/login";
import UserFrames from "./pages/Inventory/userFrames";
import AdminProfile from "./pages/admin/adminProfile";
import EmployeeProfilePage from "./pages/employeePortal/receptionistProfile";
import EmployeeForm from "./pages/employeePortal/employeeForm";
import AdminFrames from "./pages/admin/frames/adminFrames";
import AdminContacts from "./pages/admin/contacts/adminContactsPage";
import AdminServices from "./pages/admin/services/adminServicesPage";
import AdminStaff from "./pages/admin/employee/manageStaff";
import AdminProfilePage from "./pages/admin/adminProfile2";
import InventoryReport from "./pages/admin/reports/inventoryReport";
import DoctorProfilePage from "./pages/doctor/doctorProfilePage";
import AdminReports from "./pages/admin/reports/adminReportsPage";
import PatientReport from "./pages/admin/reports/patientReport";
import PatientDemographicsReport from "./pages/admin/reports/patientDemographicsReport";
import PatientPrescriptionReport from "./pages/admin/reports/patientPrescriptionReport";
import PatientFormViewer from "./pages/patientPortal/patientFormViewer";
import RegisterPatient from "./pages/logIn/register";
import ScheduleAppointment from "./pages/appointments/ScheduleAppointment";
import NurseProfilePage from "./pages/employeePortal/nurseProfile";
import NurseExamPage from "./pages/employeePortal/nurseExamPage";
import DoctorExamForm from './pages/doctor/doctorExamForm';
import StockMonitor from './pages/admin/reports/StockMonitor';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutP />} />
          <Route path="/contact" element={<ContactP />} />
          <Route path="/book-appointment" element={<MultiStepForm />} />
          <Route path="/services" element={<Services />} />
          <Route path="/userProfile/:patientID" element={<PatientProfile />} />
          <Route path="/employeeProfile/:employeeID" element={<EmployeeProfilePage />} />
          <Route path="/frames" element={<UserFrames />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminProfile />} />
          <Route path="/onboard-employee" element={<EmployeeForm />} />
          <Route path="/doctorProfile/:doctorID" element={<DoctorProfilePage />} />
          <Route path="/admin/admin-frames" element={<AdminFrames />} />
          <Route path="/admin/admin-eyeContacts" element={<AdminContacts />} />
          <Route path="/admin/admin-services" element={<AdminServices />} />
          <Route path="/admin/manageStaff" element={<AdminStaff />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/adminProfile/:employeeID" element={<AdminProfilePage />} />
          <Route path="/inventory-report" element={<InventoryReport />} />
          <Route path="/patient-report" element={<PatientReport />} />
          <Route path="/patientDemographicsReport" element={<PatientDemographicsReport />} />
          <Route path="/patientPrescriptionReport" element={<PatientPrescriptionReport />} />
          <Route path="/patientViewer/:id" element={<PatientFormViewer />} />
          <Route path="/register" element={<RegisterPatient/>}/>
          <Route path="/appt" element={<ScheduleAppointment/>}/>
          <Route path="/nurseProfile/:id" element={<NurseProfilePage />} />
          <Route path="/nurseExamPage/:id" element={<NurseExamPage />} />
          <Route path="/doctorexamform/:appointmentID/:patientID" element={<DoctorExamForm />} />
          <Route path="/stock-monitor" element={<StockMonitor />} />
        </Routes>
      </Router>
  );
}

export default App;
