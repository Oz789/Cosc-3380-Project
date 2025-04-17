import "./login.css";
import UserNavBar from "../../components/navBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Sending login for:", email, password);
    localStorage.clear();

    try {
      const res = await fetch("http://localhost:5001/api/login/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const data = await res.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userID", data.user.employeeID);
        localStorage.setItem("userLocation", data.user.locationID);
  
        if (data.role === "admin") {
          return navigate("/admin-dashboard");
        } else if (data.role === "doctor") {
          localStorage.setItem("doctorID", data.doctorInfo.doctorID);
          console.log("DOCTOR INFO:", data.doctorInfo);

          return navigate(`/doctorProfile/${data.doctorInfo.doctorID}`);
        } if (data.role === "employee") {
          if (data.user.role === "Nurse") {
            localStorage.setItem("userRole", "nurse"); 
            return navigate(`/nurseProfile/${data.user.employeeID}`);
          } else {
            localStorage.setItem("userRole", "Receptionist");
            return navigate(`/employeeProfile/${data.user.employeeID}`);
          }
        }
      }
      
      const resPatient = await fetch("http://localhost:5001/api/login/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (resPatient.ok) {
        const data = await resPatient.json();
  
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userID", data.user.patientID);
  
        return navigate(`/userProfile/${data.user.patientID}`);
      }
  
      alert("Invalid credentials");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed.");
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h2 className="login-title">Welcome Back</h2>
            <div className="input-row">
              <p>Email:</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-row">
              <p>Password:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-button" onClick={handleLogin}>Log In</button>

            <p className="forgot-password">
              <a href="#">Forgot Password?</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;