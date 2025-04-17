import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProfileTemplate from "../../components/profileTemplate";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; 
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const DoctorProfile = () => {
  const { doctorID } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [patients, setPatients] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);

  const analytics = {
    patientsThisWeek: 14,
    upcomingAppointments: 5
  };

  const notifications = [
    "New message from Dr. Lee",
    "Patient Jane Doe added new history note",
    "Lab results uploaded for Alex Smith"
  ];

  const fetchDoctorData = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/doctors/${doctorID}`);
      if (!res.ok) {
        throw new Error('Failed to fetch doctor data');
      }
      const data = await res.json();
      setDoctor(data);
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError(err.message);
    }
  }, [doctorID]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/doctors/${doctorID}/appointments`);
      if (!res.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    }
  }, [doctorID]);

  useEffect(() => {
    fetchDoctorData();
    fetchAppointments();
  }, [fetchDoctorData, fetchAppointments]);

  const sidebar = (
    <div className="sidebar-section">
      <h2>{doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Loading...'}</h2>
      <p><strong>Phone:</strong> {doctor?.phone || 'Loading...'}</p>
      <p><strong>Email:</strong> {doctor?.email || 'Loading...'}</p>
      <p><strong>Specialization:</strong> {doctor?.specialization || 'Loading...'}</p>
  
      <div className="profile-pic-container">
        <img 
          src="" 
          alt="Doctor Profile"
          className="profile-pic"
        />
      </div>
    </div>
  );
  
  const mainContent = (
    <>
      <h3>Upcoming Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.appointmentID}>
              {appt.appointmentDate} @ {appt.appointmentTime} — {appt.patientName} ({appt.appointmentType})
            </li>
          ))}
        </ul>
      )}

      <h3>Upcoming Patients</h3>
      {patients.length === 0 ? (
        <p>No upcoming patients found.</p>
      ) : (
        <ul>
          {patients.map((p) => (
            <li key={p.patientID}>{p.fullName} — {p.email}</li>
          ))}
        </ul>
      )}
    </>
  );

  const extraContent = (
    <div className="extra-dashboard">
      <div className="calendar-toggle" onClick={() => setShowSchedule(!showSchedule)}>
        <CalendarMonthIcon style={{ cursor: "pointer", fontSize: "2rem", color: "#0077cc" }} />
        <span style={{ marginLeft: "8px", cursor: "pointer" }}>
          {showSchedule ? "Hide Schedule" : "View Work Schedule"}
        </span>
      </div>

      <div className="notifications-toggle" onClick={() => setShowNotifications(!showNotifications)}>
        <NotificationsNoneIcon style={{ cursor: "pointer", fontSize: "2rem", color: "#e67e22" }} />
        <span style={{ marginLeft: "8px", cursor: "pointer" }}>
          {showNotifications ? "Hide Notifications" : "Show Notifications"}
        </span>
      </div>
      <h3>Analytics</h3>
      <p><strong>Patients This Week:</strong> {analytics.patientsThisWeek}</p>
      <p><strong>Upcoming Appointments:</strong> {analytics.upcomingAppointments}</p>

      {showNotifications && (
        <div className="notification-card">
          <ul>
            {notifications.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <>
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          marginBottom: '10px', 
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <ProfileTemplate 
        sidebarContent={sidebar} 
        mainContent={mainContent} 
        extraContent={extraContent} 
      />
    </>
  );
};

export default DoctorProfile;
