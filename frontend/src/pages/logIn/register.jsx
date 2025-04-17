import "./login.css";
import UserNavBar from "../../components/navBar";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientID = searchParams.get('patientID');
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    if (patientID) {
      setIsEditing(true);
      // Fetch patient data
      const fetchPatientData = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/patients/${patientID}`);
          if (!response.ok) {
            throw new Error('Failed to fetch patient data');
          }
          const data = await response.json();
          // Format the date to yyyy-MM-dd
          const formattedDate = data.generalInfo.DOB ? new Date(data.generalInfo.DOB).toISOString().split('T')[0] : '';
          setForm(prev => ({
            ...prev,
            ...data.generalInfo,
            DOB: formattedDate,
            password: "" // Don't pre-fill password
          }));
        } catch (error) {
          console.error('Error fetching patient data:', error);
          alert('Failed to load patient information');
        }
      };
      fetchPatientData();
    }
  }, [patientID]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Format the date to yyyy-MM-dd
      const formattedForm = {
        ...form,
        DOB: form.DOB ? new Date(form.DOB).toISOString().split('T')[0] : ''
      };

      if (isEditing) {
        // Update existing patient
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedForm),
        });

        if (res.ok) {
          alert("Patient information updated successfully.");
          navigate(`/userProfile/${patientID}`);
        } else {
          const err = await res.json();
          alert(`Error: ${err.message}`);
        }
      } else {
        // Register new patient
        const res = await fetch("http://localhost:5001/api/register-patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedForm),
        });

        if (res.ok) {
          alert("Patient registered successfully.");
          navigate("/");
        } else {
          const err = await res.json();
          alert(`Error: ${err.message}`);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Operation failed.");
    }
  };

  return (
    <>
      <UserNavBar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h2 className="login-title">
              {isEditing ? "Edit Patient Information" : "Create Patient Account"}
            </h2>

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
              ...(isEditing ? [] : [{ label: "Password", name: "password", type: "password" }]),
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

            <button className="login-button" onClick={handleSubmit}>
              {isEditing ? "Update" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPatient;
