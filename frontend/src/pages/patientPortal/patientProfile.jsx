import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./patientProfile.css";
import NavBar from "../../components/navBar";

const PatientProfile = () => {
  const { patientID } = useParams();
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    dob: "",
    sex: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}`);
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();

        setPatientData({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email || "",
          dob: data.DOB ? data.DOB.slice(0, 10) : "",
          sex: data.sex || "",
          address: data.address || "",
          phone: data.phoneNumber || "",
        });
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, [patientID]);

  return (
    <>
    <NavBar/>
    <div className="patient-profile-wrapper">
  <div className="patient-profile-card">
    <img
      src="/Images/patient-avatar.png"
      alt="Patient Avatar"
      className="profile-avatar"
    />
    <h2 className="profile-name">{patientData.name}</h2>
    <p className="profile-role">Patient</p>
    <div className="profile-info">
      <p><strong>Email:</strong> {patientData.email}</p>
      <p><strong>DOB:</strong> {patientData.dob}</p>
      <p><strong>Sex:</strong> {patientData.sex}</p>
      <p><strong>Address:</strong> {patientData.address}</p>
      <p><strong>Phone:</strong> {patientData.phone}</p>
    </div>
  </div>
</div>

    </>
  );
};

export default PatientProfile;











