import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';

export default function ScheduleAppointment({ prevStep, patientId }) {
  const [appointments, setAppointments] = useState({});
  const [selected, setSelected] = useState({ date: '', time: '', doctorId: ''});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const navigate = useNavigate();
  const daysToShow = 7;

  useEffect(() => {
    console.log("Appointments state changed:", appointments);
  }, [appointments]);
  // ---------------- TIME HELPERS ----------------
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
  
    if (modifier === 'PM' && hours !== '12') hours = String(+hours + 12);
    if (modifier === 'AM' && hours === '12') hours = '00';
  
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const getFormattedDate = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('en-CA');
  };

  const getDayName = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    while (sh < eh || (sh === eh && sm < em)) {
      const time = new Date(0, 0, 0, sh, sm).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      slots.push(time);
      sm += 60;
      if (sm >= 60) {
        sh++;
        sm = 0;
      }
    }
    return slots;
  };

  // ---------------- DATA FETCHING ----------------
  const fetchLocations = async () => {
    const res = await fetch('http://localhost:5001/api/locations');
    const data = await res.json();
    setLocations(data);
  };

  const fetchSchedules = async (locationID) => {
    const res = await fetch(`http://localhost:5001/api/schedule/location/${locationID}`);
    const data = await res.json();
    setDoctorSchedules(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch(`http://localhost:5001/api/appointments?locationID=${selectedLocation}`);
    const data = await res.json();
  
    console.log("📦 Raw API data:", data); // ← FULL object
  
    const map = {};
    data.forEach(({ appointmentDate, appointmentTime }) => {
      const dateStr = appointmentDate.substring(0, 10);
      const timeStr = appointmentTime.trim().padStart(8, '0');
  
      console.log(`Extracted date: ${dateStr}, time: ${timeStr}`); // ← Track parsed values
  
      if (!map[dateStr]) map[dateStr] = new Set();
      map[dateStr].add(timeStr);
      console.log(`Mapped DB date → ${appointmentDate} → ${dateStr} with time ${timeStr}`);
    });
  
    console.log("Final Appointments Before Set:", map);
    setAppointments(map);
  };
  
  

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchSchedules(selectedLocation);
      fetchAppointments();
    }
  }, [selectedLocation]);

  // ---------------- ACTIONS ----------------
  const handleSelect = (date, time, doctorId) => {
    setSelected({ date, time, doctorId});
  };

  const handleConfirm = async () => {
    const { date, time, doctorId} = selected;
    if (!date || !time || !doctorId) {
      console.log("Missing fields:", selected);
      return;
    }
  
    const time24 = convertTo24Hour(time);
    console.log("Submitting appointment:", { date, time: time24, doctorId, patientId });
  
    try {
      const res = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time: time24,
          patientId,
          doctorId,
          service1ID: 4
        }),
      });
  
      const text = await res.text(); // Show raw response in console
      console.log("Server response:", res.status, text);
  
      if (res.ok) {
        alert('Appointment scheduled!');
        navigate(`/userProfile/${patientId}`);
      } else {
        alert('That time is no longer available or server error.');
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Something went wrong");
    }
  };
  

  // ---------------- DISPLAY ----------------
  const scheduleMap = {};
  doctorSchedules.forEach((entry) => {
    if (!scheduleMap[entry.dayOfWeek]) scheduleMap[entry.dayOfWeek] = [];
    scheduleMap[entry.dayOfWeek].push(entry);
  });

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Schedule Appointment</h2>

          {/* SELECT LOCATION */}
          <div className="input-row">
            <p>Select Location:</p>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.locationID} value={loc.locationID}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* TIME SLOT PICKER */}
          {selectedLocation && (
            <div className="appointment-grid" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daysToShow}, 1fr)` }}>
              
              {(() => {
        const baseDate = new Date();
baseDate.setHours(12); 

        return [...Array(daysToShow)].map((_, idx) => {
          const dateObj = new Date(baseDate);
          dateObj.setDate(baseDate.getDate() + idx);

          const dateStr = dateObj.toISOString().split('T')[0];
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          const readableDate = dateObj.toDateString();

          const schedules = scheduleMap[dayName] || [];

          return (
            <div key={dateStr}>
              <h4 style={{ fontWeight: 'bold', color: '#00796B' }}>
                {dayName}<br />
                {readableDate}
              </h4>

              {schedules.map((sched) => {
                const slots = generateTimeSlots(sched.startTime, sched.endTime);

                return (
                  <div key={`${sched.doctorID}-${sched.scheduleID}`} style={{ marginBottom: '1rem' }}>
                    <small style={{ color: '#444', fontStyle: 'italic' }}>
                      {sched.doctorName} – {sched.serviceName}
                    </small>

                    {slots.map((hour) => {
                      const hour24 = convertTo24Hour(hour);
                      const isBooked = appointments[dateStr]?.has(hour24);
                      const isSelected =
                        selected.date === dateStr &&
                        convertTo24Hour(selected.time) === hour24 &&
                        selected.doctorId === sched.doctorID;

                      return (
                        <button
                        key={hour}
                        onClick={() =>
                          handleSelect(dateStr, hour, sched.doctorID)
                        }
                        disabled={isBooked}
                        style={{
                          backgroundColor: isSelected
                            ? '#28a745'
                            : isBooked
                            ? '#f0f0f0'
                            : '#ffffff',
                          color: isBooked ? '#aaa' : '#00796B',
                          border: isSelected
                            ? '2px solid #28a745'
                            : '2px solid #00796B',
                          margin: '4px',
                          padding: '6px',
                          width: '100%',
                          borderRadius: '6px',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          opacity: isBooked ? 0.5 : 1,
                          transition: '0.2s ease',
                        }}
                      >
                        {hour}
                      </button>
                      
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        });
      })()}

    </div>
          {/* CONFIRM BUTTON */}
          <div className="nav-buttons" style={{ marginTop: '2rem' }}>
            <button onClick={prevStep}>Back</button>
            <button type="button" onClick={handleConfirm}>Confirm Appointment</button>
          </div>
  </div>
)}

        </div>
      </div>
      <button onClick={() => alert("Clicked!")}>Test Click</button>
    </div>
  );
}
