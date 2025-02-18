import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserNavbar from "./Components/userNavBar";

function App() {
  return (
    

    <Router>
      <UserNavbar />
      <Routes>
        <Route path="/about" element={<h1>About Us Page</h1>} />
        <Route path="/contact" element={<h1>Contact Us Page</h1>} />
        <Route path="/book-appointment" element={<h1>Book Appointment Page</h1>} />
      </Routes>
        <h1>"Hello World"</h1> 
    </Router>


  );
}

export default App;