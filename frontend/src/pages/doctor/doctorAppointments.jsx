import React, { useState, useEffect } from 'react';
import './doctorAppointments.css';
import PatientFormViewer from '../patientPortal/patientFormViewer';
import { useParams } from "react-router-dom";

const groupByDate = (appointments) => {
  return appointments.reduce((acc, appt) => {
    const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
    const dateStr = dt.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    acc[dateStr] = acc[dateStr] || [];
    acc[dateStr].push(appt);
    return acc;
  }, {});
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { doctorID } = useParams();
  useEffect(() => {
    


    fetch(`http://localhost:5001/api/doctors/${doctorID}/appointments`)
      .then(res => res.json())
      .then(data => {
        console.log("📦 Raw appointment data from API:", data);
        const formatted = data.map(appt => {
          const dateObj = new Date(appt.appointmentDate);
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const rawDate = `${yyyy}-${mm}-${dd}`;

          const cleanTime = appt.appointmentTime?.slice(0, 5); // 'HH:MM'

          return {
            appointmentID: appt.appointmentNumber,
            patientID: appt.patientID,
            patientName: `${appt.firstName} ${appt.lastName}`.trim(),
            appointmentDate: rawDate,
            appointmentTime: cleanTime,
            status: appt.status
          };
        });

        setAppointments(formatted);
      })
      .catch(err => {
        console.error("Failed to fetch appointments:", err);
      });
  }, []);

  const filtered = appointments.filter(appt =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [showAll, setShowAll] = useState(false);
  const grouped = groupByDate(filtered);

  return (
    <div className="appointment-wrapper">
      <div className="appointment-left">
        <h2 className="appointments-title">Upcoming Appointments</h2>

        <input
          type="text"
          placeholder="Search by patient name..."
          className="search-filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date} className="appointments-section">
            <h3 className="appointments-date">{date}</h3>
            {appts.map((appt) => {
              const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
              const timeStr = dt.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const monthShort = dt.toLocaleString('default', { month: 'short' });
              const day = dt.getDate();

              return (
                <div className="appointment-card" key={appt.appointmentID}>
                  <div className="appointment-date-box">
                    <div className="appointment-month">{monthShort}</div>
                    <div className="appointment-day">{day}</div>
                  </div>

                  <div className="appointment-info">
                    <div className="appointment-name">
                      {appt.patientName} - <span className="appointment-status">{appt.status}</span>
                    </div>
                    <div className="appointment-time">{timeStr}</div>
                  </div>

                  <button
                    className="appointment-button"
                    onClick={() => setSelectedPatientID(appt.patientID)}
                  >
                    View Form
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="appointment-right">
        {selectedPatientID ? (
          <PatientFormViewer patientID={selectedPatientID} />
        ) : (
          <div className="mock-placeholder">Select an appointment to view the form</div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;















