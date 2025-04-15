import "./login.css";
import UserNavBar from "../../components/navBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    sex: "Male",
    occupation: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/register-patient", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Patient registered successfully.");
        navigate("/"); 
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Failed to register.");
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h2 className="login-title">Create Patient Account</h2>

            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "DOB", name: "DOB", type: "date" },
              {
                label: "Sex",
                name: "sex",
                type: "select",
                options: ["Male", "Female", "Other"],
              },
              { label: "Occupation", name: "occupation" },
              { label: "Address", name: "address" },
              { label: "Phone Number", name: "phoneNumber" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
            ].map(({ label, name, type = "text", options }) => (
              <div key={name} className="input-row">
                <p>{label}:</p>
                {type === "select" ? (
                  <select name={name} value={form[name]} onChange={handleChange} className="input-field">
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}

            <button className="login-button" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPatient;
