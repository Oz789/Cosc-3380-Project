
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // in case you're using this via route
import './patientFormViewer.css';

const PatientFormViews = ({ patientID: propID }) => {
  const { id: routeID } = useParams();
  const patientID = propID || routeID;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!patientID) return;

    fetch(`http://localhost:5001/api/patient/${patientID}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading patient data:', err));
  }, [patientID]);

  if (!data) return <p className="form-loading">Loading patient data...</p>;

  const {
    firstName, lastName, DOB, sex, email, phoneNumber, address, occupation,
    medicalForm, appointments
  } = data;

  return (
    <div className="form-viewer">
      <h2>Patient Profile</h2>
      <p><strong>Name:</strong> {firstName} {lastName}</p>
      <p><strong>Date of Birth:</strong> {DOB}</p>
      <p><strong>Sex:</strong> {sex}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phoneNumber}</p>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Occupation:</strong> {occupation || 'N/A'}</p>

      <hr />

      <h3>Latest Medical Form</h3>
      {medicalForm ? (
        <>
          <p><strong>Visit Date:</strong> {medicalForm.visitDate}</p>
          <p><strong>Corrective Lenses:</strong> {medicalForm.usesCorrectiveLenses ? 'Yes' : 'No'}</p>
          <p><strong>Contacts:</strong> {medicalForm.usesContacts ? 'Yes' : 'No'}</p>
          <p><strong>Lenses Rx:</strong> {medicalForm.LensesPrescription || 'N/A'}</p>
          <p><strong>Contacts Rx:</strong> {medicalForm.ContactsPrescription || 'N/A'}</p>
          <p><strong>Last Rx Date:</strong> {medicalForm.lastPrescriptionDate || 'N/A'}</p>
          <p><strong>Health Concerns:</strong> {medicalForm.healthConcerns || 'None'}</p>
          <p><strong>Conditions:</strong> {medicalForm.conditions || 'None'}</p>
          <p><strong>Surgeries:</strong> {medicalForm.surgeries || 'None'}</p>
          <p><strong>Allergies:</strong> {medicalForm.allergies || 'None'}</p>
          <p><strong>Notes:</strong> {medicalForm.additionalDetails || 'None'}</p>
        </>
      ) : (
        <p>No medical form found.</p>
      )}

      <hr />

      <h3>Appointment History</h3>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appt, idx) => (
            <li key={idx}>
              <strong>{appt.appointmentDate} @ {appt.appointmentTime}</strong> – {appt.serviceName} with Dr. {appt.doctorFirstName} {appt.doctorLastName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default PatientFormViews;
