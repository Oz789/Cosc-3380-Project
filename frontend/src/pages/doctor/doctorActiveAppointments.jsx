import React, { useState, useEffect } from 'react';
import '../doctor/doctorAppointments.css';
import { useNavigate } from "react-router-dom";

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

const DocActiveAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const doctorID = localStorage.getItem("doctorID");
  const role = localStorage.getItem("userRole");
  const locationID = localStorage.getItem("userLocation");

  useEffect(() => {
    const fetchAppointments = async () => {
      let url = "";

      if (role === "doctor" && doctorID) {
        url = `http://localhost:5001/api/appointments/clinicAppointments/any?doctorID=${doctorID}`;
      } else if (locationID) {
        url = `http://localhost:5001/api/appointments/clinicAppointments/${locationID}`;
      } else {
        return;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        const formatted = data.map(appt => {
          const dateObj = new Date(appt.appointmentDate);
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const rawDate = `${yyyy}-${mm}-${dd}`;
          const cleanTime = appt.appointmentTime?.slice(0, 5);

          return {
            appointmentID: appt.appointmentNumber,
            doctorID: appt.doctorID,
            patientID: appt.patientID,
            patientName: `${appt.patientFirstName} ${appt.patientLastName}`.trim(),
            doctorName: `${appt.doctorFirstName} ${appt.doctorLastName}`,
            appointmentDate: rawDate,
            appointmentTime: cleanTime,
            status: appt.status
          };
        });

        const checkedInOnly = formatted.filter(appt => appt.status === "Checked In");
        const inProgressOnly = formatted.filter(appt => appt.status === "In Progress");

        setAppointments(checkedInOnly);
        setActiveAppointments(inProgressOnly);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, [doctorID, locationID, role]);

  const filtered = appointments.filter(appt =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = groupByDate(filtered);
  const groupedActive = groupByDate(activeAppointments);
  
  
  const handleEndAppointment = async (appt) => {
    console.log("Full appointment object:", appt);
  
    // Safely extract the appointment number (adjust if your data uses a different field)
    const id = appt.appointmentNumber || appt.appointmentID;
  
    if (!id) {
      alert("No valid appointment ID found.");
      return;
    }
  
    console.log("Resolved appointment ID:", id);
  
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/end/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
      });
  
      if (res.ok) {
        alert("Appointment ended successfully.");
        // Optionally remove the ended appointment from UI
        setActiveAppointments(prev => prev.filter(a => a.appointmentNumber !== id));
      } else {
        alert("Failed to end appointment.");
      }
    } catch (err) {
      console.error("End appointment error:", err);
      alert("Server error ending appointment.");
    }
  };
  
  
  
  
  
  
  

  const handleBeginExam = async (appt) => {
    try {
      const res = await fetch(`http://localhost:5001/api/appointments/update-status/${appt.appointmentID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "In Progress" }),
      });

      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.appointmentID !== appt.appointmentID));
        setActiveAppointments(prev => [...prev, { ...appt, status: "In Progress" }]);
        navigate(`/nurseExamPage/${appt.patientID}`);
      } else {
        alert("Failed to begin exam");
      }
    } catch (err) {
      console.error("Begin exam error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="appointment-wrapper">
      {/* LEFT PANEL: CHECKED IN */}
      <div className="appointment-left">
        <h2 className="appointments-title">Checked-In Appointments</h2>

        <input
          type="text"
          placeholder="Search by patient or doctor..."
          className="search-filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="appointment-doctor">Doctor: {appt.doctorName}</div>
                  </div>

                  <button
                    className="appointment-button"
                    onClick={() => handleBeginExam(appt)}
                  >
                    Begin Exam
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* RIGHT PANEL: IN PROGRESS */}
      <div className="appointment-right">
        <h2 className="appointments-title">In Progress Appointments</h2>

        {Object.entries(groupedActive).length === 0 ? (
          <div className="mock-placeholder">No active appointments</div>
        ) : (
          Object.entries(groupedActive).map(([date, appts]) => (
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
                  <div
                    className="appointment-card"
                    key={appt.appointmentID}
                    onClick={() => navigate(`/doctorexamform/${appt.appointmentID}/${appt.patientID}`)}

                    style={{ cursor: 'pointer' }}
                  >
                    <div className="appointment-date-box">
                      <div className="appointment-month">{monthShort}</div>
                      <div className="appointment-day">{day}</div>
                    </div>

                    <div className="appointment-info">
                      <div className="appointment-name">
                        {appt.patientName} - <span className="appointment-status">{appt.status}</span>
                      </div>
                      <div className="appointment-time">{timeStr}</div>
                      <div className="appointment-doctor">Doctor: {appt.doctorName}</div>
                    </div>
                    <button onClick={() => handleEndAppointment(appt)}>
  End Appointment
</button>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocActiveAppointments;
