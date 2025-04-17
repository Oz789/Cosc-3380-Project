import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import '../doctor/doctorAppointments.css'; // you're already using this
import './receptionistPatientEdit.css'
import PatientFormViewer from '../patientPortal/patientFormViewer';

import RecApp from '../appointments/receptionistApp';



const NPatientEdit = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedPatientFirst, setPatientFirst] = useState('');
  const [selectedPatientLast,  setPatientLast] = useState('');
  const [viewMode, setViewMode] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/allPatients');
        setPatients(res.data);
      } catch (err) {
        console.error(' Failed to fetch patients:', err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((pat) =>
    `${pat.firstName} ${pat.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="appointment-wrapper">
      <div className="appointment-left">
        <h2 className="appointments-title">All Patients</h2>

        <input
          type="text"
          placeholder="Search by name..."
          className="search-filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />

        {filteredPatients.map((pat) => (
          <div key={pat.patientID} className="appointment-card">
            <div className="appointment-info">
              <div className="appointment-name">
                {pat.firstName} {pat.lastName}
              </div>
              <div className="appointment-status">ID: {pat.patientID}</div>
            </div>
            <button
              className="appointment-button"
              onClick={() => {setSelectedPatientID(pat.patientID); setPatientFirst(pat.firstName);  setPatientLast(pat.lastName); setViewMode("view")} }
            >
              View Form
            </button>

            <button
              className="appointment-button"
              onClick={() => {setSelectedPatientID(pat.patientID); setPatientFirst(pat.firstName);  setPatientLast(pat.lastName); setViewMode("edit");} }
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      <div
        className={`appointment-right `}
      >
        {selectedPatientID ? (
          viewMode === "view" ? (
          <PatientFormViewer patientID={selectedPatientID}  onClose={() => {setSelectedPatientID(null); setViewMode(null);}}/>
          ) :
          (<RecApp patientId={selectedPatientID} patientFirst = {selectedPatientFirst} patientLast={selectedPatientLast} onClose={() => {setSelectedPatientID(null); setViewMode(null);}}/>)
          
        ) : (
          <div className="mock-placeholder">
            Select a patient to view their form
          </div>
        )}
      </div>
    </div>
  );
};

export default NPatientEdit;