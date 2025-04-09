import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Services from "./pages/services/services";
import PatientProfile from "./pages/patientPortal/patientProfile";
import Home from "./pages/home/home";
import Login from "./pages/logIn/login";
import Frames from "./pages/Inventory/frames";
//import CreateAppointment from "./pages/appointments/createAppointment";
import MultiStepForm from "./pages/appointments/MultiStepForm";
import ProfileTemplate from "./components/profileTemplate";
import AdminProfile from "./pages/admin/adminProfile";
import AdminDashboard from "./pages/admin/adminDashboard";
import DoctorProfilePage from "./pages/doctor/doctorProfilePage";
import ContactP from "./pages/contact/contactUs";
import AboutP from "./pages/about/aboutPage";
import EmployeeProfile from "./pages/employeePortal/employeeProfile";

import EmployeeForm from "./pages/employeePortal/employeeForm";
//import PaymentForm from "./pages/Inventory/PaymentForm"; // Import PaymentForm
import AdminFrames from "./pages/admin/frames/adminFrames";
import AdminContacts from "./pages/admin/contacts/adminContactsPage";
import AdminServices from "./pages/admin/services/adminServicesPage";
import AdminStaff from "./pages/admin/employee/manageStaff";
import UserFrames from "./pages/Inventory/userFrames";
import AdminProfilePage from "./pages/admin/adminProfile2";
import InventoryReport from "./pages/admin/reports/inventoryReport";
import PaymentForm from "./pages/billing/paymentForm";

import EmployeeProfilePage from "./pages/employeePortal/employeeProfile2";

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

        <Route path="/employeeProfile" element={<EmployeeProfilePage/>} />
        <Route path="/frames" element={<UserFrames/>} />
        <Route path="/log-in" element={<Login/>}/>
        <Route path="/admin-dashboard" element={<AdminProfile/>}/>
        <Route path="/employeeForm" element={<EmployeeForm/>}/>
        <Route path="/doctorProfile/:doctorID" element={<DoctorProfilePage/>}/>
        <Route path="/admin/admin-frames" element={<AdminFrames />} />
        <Route path="/admin/admin-eyeContacts" element={<AdminContacts />} />
        <Route path="/admin/admin-services" element={<AdminServices />} />
        <Route path="/admin/manageStaff" element={<AdminStaff />} />
        <Route path="/admin-profile" element={<AdminProfilePage />} />
        <Route path="/inventory-report" element={<InventoryReport/>} />
        <Route path="/payment" element={<PaymentForm/>}/>
        




        
        
        <Route path="/payment" element={<PaymentForm />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;