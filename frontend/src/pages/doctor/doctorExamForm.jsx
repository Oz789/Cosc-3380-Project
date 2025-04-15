import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './doctorExamForm.css';

const DoctorExamForm = () => {
  const navigate = useNavigate();
  const { appointmentID, patientID } = useParams();
  const [editing, setEditing] = useState(true);

  const [examForm, setExamForm] = useState({
    chiefComplaint: '',
    ocularHistory: '',
    medicalHistory: '',
    drugAllergies: '',
    uvacDistanceRight: '', uvacDistanceLeft: '', uvacDistanceBoth: '', uvacNearBoth: '',
    bvacDistanceRight: '', bvacDistanceLeft: '', bvacDistanceBoth: '', bvacNearBoth: '',
    refractionOD: '', refractionOS: '',
    iopOD: '', iopOS: '',
    lids: '', cornea: '', anteriorChamber: '', iris: '', lens: '',
    opticDisc: '', macula: '', vessels: '', retina: '',
    diagnosis: '', treatmentPlan: '',
    referralNeeded: false
  });

  const [referralForm, setReferralForm] = useState({
    specialty: '',
    reason: '',
    urgency: 'Routine',
    referredTo: '',
    additionalNotes: ''
  });

  const handleExamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExamForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleReferralChange = (e) => {
    const { name, value } = e.target;
    setReferralForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...examForm,
        appointmentNumber: appointmentID,
        dateOfExam: new Date().toISOString().slice(0, 10),
        referral: examForm.referralNeeded
          ? {
              ...referralForm,
              doctorID: localStorage.getItem("doctorID") 
            }
          : null,
        patientID
      };

      const res = await fetch('http://localhost:5001/api/examReports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Exam report submitted.');
        navigate('/doctorProfile/' + localStorage.getItem("doctorID"));
      } else {
        alert('Failed to submit report.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>Doctor Exam Form</h2>

      <label>Chief Complaint</label>
      <textarea name="chiefComplaint" value={examForm.chiefComplaint} onChange={handleExamChange} disabled={!editing} />

      <h3>History</h3>
      <input name="ocularHistory" placeholder="Ocular History" value={examForm.ocularHistory} onChange={handleExamChange} disabled={!editing} />
      <input name="medicalHistory" placeholder="Medical History" value={examForm.medicalHistory} onChange={handleExamChange} disabled={!editing} />
      <input name="drugAllergies" placeholder="Drug Allergies" value={examForm.drugAllergies} onChange={handleExamChange} disabled={!editing} />

      <h3>Visual Acuity - Unaided</h3>
      <input name="uvacDistanceRight" placeholder="Distance OD" value={examForm.uvacDistanceRight} onChange={handleExamChange} disabled={!editing} />
      <input name="uvacDistanceLeft" placeholder="Distance OS" value={examForm.uvacDistanceLeft} onChange={handleExamChange} disabled={!editing} />
      <input name="uvacDistanceBoth" placeholder="Distance OU" value={examForm.uvacDistanceBoth} onChange={handleExamChange} disabled={!editing} />
      <input name="uvacNearBoth" placeholder="Near OU" value={examForm.uvacNearBoth} onChange={handleExamChange} disabled={!editing} />

      <h3>Visual Acuity - Best Corrected</h3>
      <input name="bvacDistanceRight" placeholder="Distance OD" value={examForm.bvacDistanceRight} onChange={handleExamChange} disabled={!editing} />
      <input name="bvacDistanceLeft" placeholder="Distance OS" value={examForm.bvacDistanceLeft} onChange={handleExamChange} disabled={!editing} />
      <input name="bvacDistanceBoth" placeholder="Distance OU" value={examForm.bvacDistanceBoth} onChange={handleExamChange} disabled={!editing} />
      <input name="bvacNearBoth" placeholder="Near OU" value={examForm.bvacNearBoth} onChange={handleExamChange} disabled={!editing} />

      <h3>Refraction</h3>
      <input name="refractionOD" placeholder="OD" value={examForm.refractionOD} onChange={handleExamChange} disabled={!editing} />
      <input name="refractionOS" placeholder="OS" value={examForm.refractionOS} onChange={handleExamChange} disabled={!editing} />

      <h3>Intraocular Pressure</h3>
      <input name="iopOD" placeholder="IOP OD" value={examForm.iopOD} onChange={handleExamChange} disabled={!editing} />
      <input name="iopOS" placeholder="IOP OS" value={examForm.iopOS} onChange={handleExamChange} disabled={!editing} />

      <h3>Slit Lamp</h3>
      <input name="lids" placeholder="Lids" value={examForm.lids} onChange={handleExamChange} disabled={!editing} />
      <input name="cornea" placeholder="Cornea" value={examForm.cornea} onChange={handleExamChange} disabled={!editing} />
      <input name="anteriorChamber" placeholder="Anterior Chamber" value={examForm.anteriorChamber} onChange={handleExamChange} disabled={!editing} />
      <input name="iris" placeholder="Iris" value={examForm.iris} onChange={handleExamChange} disabled={!editing} />
      <input name="lens" placeholder="Lens" value={examForm.lens} onChange={handleExamChange} disabled={!editing} />

      <h3>Fundus</h3>
      <input name="opticDisc" placeholder="Optic Disc" value={examForm.opticDisc} onChange={handleExamChange} disabled={!editing} />
      <input name="macula" placeholder="Macula" value={examForm.macula} onChange={handleExamChange} disabled={!editing} />
      <input name="vessels" placeholder="Vessels" value={examForm.vessels} onChange={handleExamChange} disabled={!editing} />
      <input name="retina" placeholder="Retina" value={examForm.retina} onChange={handleExamChange} disabled={!editing} />

      <h3>Diagnosis & Plan</h3>
      <textarea name="diagnosis" placeholder="Diagnosis" value={examForm.diagnosis} onChange={handleExamChange} disabled={!editing} />
      <textarea name="treatmentPlan" placeholder="Treatment Plan" value={examForm.treatmentPlan} onChange={handleExamChange} disabled={!editing} />


     

      {examForm.referralNeeded && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1.5rem' }}>
          <h3>Referral Details</h3>

          <input name="specialty" placeholder="Specialty" value={referralForm.specialty} onChange={handleReferralChange} disabled={!editing} />
          <textarea name="reason" placeholder="Reason" value={referralForm.reason} onChange={handleReferralChange} disabled={!editing} rows={3} />
          <select name="urgency" value={referralForm.urgency} onChange={handleReferralChange} disabled={!editing}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input name="referredTo" placeholder="Referred To" value={referralForm.referredTo} onChange={handleReferralChange} disabled={!editing} />
          <textarea name="additionalNotes" placeholder="Additional Notes" value={referralForm.additionalNotes} onChange={handleReferralChange} disabled={!editing} rows={2} />
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {editing ? (
          <button className="exam-button secondary-button" onClick={() => setEditing(false)}>Save</button>
        ) : (
          <button className="exam-button" onClick={() => setEditing(true)}>Re-edit</button>
        )}

        <button className="exam-button" onClick={handleSubmit}>
          Confirm & Return
        </button>
        <button
  onClick={() => setExamForm(prev => ({ ...prev, referralNeeded: !prev.referralNeeded }))}
  style={{
    background: 'none',
    border: 'none',
    color: '#1976d2',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '500',
    paddingLeft: '1rem'
  }}
>
  Referral
</button>
      </div>
    </div>
  );
};

export default DoctorExamForm;


