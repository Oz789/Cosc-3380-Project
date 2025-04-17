import React, { useState, useEffect } from "react";

const PatientFormViewer = ({ patientID }) => {
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!patientID)
       {console.log("nothing here") 
        return;
       }

    const fetchPatientData = async () => {
      try {
        console.log(patientID + "   HEdjdRE");
        const res = await fetch(`http://localhost:5001/api/patients/${patientID}`);
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();
        setPatientData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, [patientID]);

  if (!patientData) return <p>Loading medical form...</p>;

  const {
    generalInfo = {},
    medicalInfo = {},
    appointments = []
  } = patientData;
  
  const {
    firstName,
    lastName,
    DOB,
    sex,
    address,
    phoneNumber,
    email,
    occupation
  } = generalInfo;
  
  const medicalForm = medicalInfo;

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Patient Medical Form</h2>

      <h4>Basic Info</h4>
      <p><strong>Name:</strong> {firstName} {lastName}</p>
      <p><strong>DOB:</strong> {DOB?.slice(0, 10)}</p>
      <p><strong>Sex:</strong> {sex}</p>
      <p><strong>Occupation:</strong> {occupation || 'N/A'}</p>
      <p><strong>Phone:</strong> {phoneNumber}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Address:</strong> {address}</p>

      <hr />

      <h4>Medical Details</h4>
      <p><strong>Visit Date:</strong> {medicalForm?.visitDate?.slice(0, 10)}</p>
      <p><strong>Corrective Lenses:</strong> {medicalForm?.usesCorrectiveLenses ? "Yes" : "No"}</p>
      <p><strong>Contacts:</strong> {medicalForm?.usesContacts ? "Yes" : "No"}</p>
      <p><strong>Lenses Prescription:</strong> {medicalForm?.LensesPrescription || "N/A"}</p>
      <p><strong>Contacts Prescription:</strong> {medicalForm?.ContactsPrescription || "N/A"}</p>
      <p><strong>Last Rx Date:</strong> {medicalForm?.lastPrescriptionDate?.slice(0, 10) || "N/A"}</p>

      <hr />

      <p><strong>Health Concerns:</strong> {medicalForm?.healthConcerns || "None"}</p>
      <p><strong>Other Concerns:</strong> {medicalForm?.otherConcerns || "None"}</p>
      <p><strong>Conditions:</strong> {medicalForm?.conditions || "None"}</p>
      <p><strong>Other Conditions:</strong> {medicalForm?.otherConditions || "None"}</p>
      <p><strong>Had Surgery:</strong> {medicalForm?.hadSurgery ? "Yes" : "No"}</p>
      <p><strong>Surgeries:</strong> {medicalForm?.surgeries || "None"}</p>
      <p><strong>Other Surgeries:</strong> {medicalForm?.otherSurgeries || "None"}</p>
      <p><strong>Allergies:</strong> {medicalForm?.allergies || "None"}</p>
      <p><strong>Additional Notes:</strong> {medicalForm?.additionalDetails || "None"}</p>

      <hr />

      {appointments?.length > 0 && (
        <>
          <h4>Upcoming Appointments</h4>
          <ul>
            {appointments.map((appt, idx) => (
              <li key={idx}>
                {new Date(appt.appointmentDate).toDateString()} at {appt.appointmentTime}<br />
                Doctor: Dr. {appt.doctorFirstName} {appt.doctorLastName}<br />
                Service: {appt.serviceName}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PatientFormViewer;
