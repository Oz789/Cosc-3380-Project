import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';

const hours = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM'
];

const serviceNames = {
  2: 'Eye Exam',
  3: 'Lasik'
};



const getFormattedDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

export default function ScheduleAppointment({ prevStep, patientId }) {
  const [appointments, setAppointments] = useState({});
  const [selected, setSelected] = useState({ date: '', time: '' });
  const daysToShow = 7;

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5001/api/appointments');
    const data = await res.json();
    const map = {};
    data.forEach(({ date, time }) => {
      if (!map[date]) map[date] = new Set();
      map[date].add(time);
    });
    setAppointments(map);
  };

  const handleSelect = (date, time, doctorId) => {
    const dayName = getDayName(date);
    const service1ID = ['Monday', 'Wednesday', 'Friday'].includes(dayName) ? 4 : 6;
    setSelected({ date, time, doctorId, service1ID });
  };  

  const doctorSchedule = {
    'Monday': 2,    // Doctor A (eye exam)
    'Wednesday': 2,
    'Friday': 2,
    'Tuesday': 3,   // Doctor B (Lasik)
    'Thursday': 3
  };

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
  
    if (modifier === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
  
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };
  
  const handleConfirm = async () => {
    const { date, time, doctorId, service1ID } = selected;
    if (!date || !time || !doctorId  || !service1ID ) return;
  
    const time24 = convertTo24Hour(time);
  
    const res = await fetch('http://localhost:5001/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        time: time24,
        patientId,
        doctorId,
        service1ID
      }),
    });
  
    if (res.ok) {
      alert('Appointment scheduled!');
      navigate(`/userProfile/${patientId}`);
    }    
     else {
      alert('That time is no longer available.');
    }
  };
  
  

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="form-container">
      <h2>Schedule Appointment</h2>
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${daysToShow}, 1fr)` }}>
        {[...Array(daysToShow)].map((_, idx) => {
          const date = getFormattedDate(idx);
          const dayName = getDayName(date);
          const doctorId = doctorSchedule[dayName];

          if (!doctorId) return null; // skip weekends or unscheduled days

          return (
            <div key={date}>
              <h3>
                {dayName}<br />
                {new Date(date).toDateString()}<br />
                <small style={{ color: '#555', fontSize: '0.9em' }}>
                  Service: {serviceNames[doctorId]}
                </small>
              </h3>
              {hours.map(hour => {
                const isBooked = appointments[date]?.has(hour);
                const isSelected = selected.date === date && selected.time === hour;
                return (
                  <button
                    key={hour}
                    onClick={() => handleSelect(date, hour, doctorId)}
                    disabled={isBooked}
                    style={{
                      backgroundColor: isSelected ? '#28a745' : isBooked ? '#ccc' : '#007bff',
                      color: '#fff',
                      margin: '5px',
                      padding: '8px',
                      width: '100%',
                      borderRadius: '5px',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
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

      <div className="nav-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={handleConfirm} disabled={!selected.date || !selected.time}>
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}
