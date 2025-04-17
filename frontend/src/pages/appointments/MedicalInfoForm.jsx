import React from 'react';

const healthOptions = ['General Pain', 'Blurry Vision', 'Burning Sensation', 'Difficulty Reading', 'Dizziness', 'Double Vision', 'Eye Strain', 'Headaches', 'Itchy Eyes', 'Light Sensitivity', 'Lumps', 'Tunnel Vision', 'Watery Eyes'];
const conditionOptions = ['Cataracts', 'Corneal Abrasion', 'Crossed Eyes', 'Diabetic Retinopathy', 'Dry Eyes', 'Floaters', 'Glaucoma', 'Inflammation', 'Pink Eye', 'Retinal Detachment', 'Uveitis'];
const surgeryOptions = ['Cataract Surgery', 'Corneal Transplant', 'Eyelid Surgery', 'Eye Cancer Surgery', 'Glaucoma Surgery', 'Implants', 'LASIK', 'Orbital Surgery', 'Photorefractive Surgery', 'Retinal Repair', 'Vitrectomy'];

export default function MedicalInfoForm({ nextStep, prevStep, handleChange, values }) {
  const handleMultiSelect = (key, event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    handleChange({ [key]: selectedOptions });
  };

  return (
    <div className="form-container">
      <h2>Medical Information</h2>

      <div className="form-group">
        <label>Last Exam Date:</label>
        <input type="date" value={values.lastExamDate} onChange={(e) => handleChange({ lastExamDate: e.target.value })} />
      </div>

      <h3>Vision Correction</h3>
      <div className="form-group">
        <div className="checkbox-row">
          <span>Uses Corrective Lenses</span>
          <input type="checkbox" checked={values.usesCorrectiveLenses} onChange={(e) => handleChange({ usesCorrectiveLenses: e.target.checked })} />
        </div>
      </div>
      {values.usesCorrectiveLenses && (
        <div className="form-group">
          <input placeholder="Lenses Prescription" value={values.LensesPrescription} onChange={(e) => handleChange({ LensesPrescription: e.target.value })} />
        </div>
      )}

      <div className="form-group">
        <div className="checkbox-row">
          <span>Uses Contacts</span>
          <input type="checkbox" checked={values.usesContacts} onChange={(e) => handleChange({ usesContacts: e.target.checked })} />
        </div>
      </div>
      {values.usesContacts && (
        <div className="form-group">
          <input placeholder="Contacts Prescription" value={values.ContactsPrescription} onChange={(e) => handleChange({ ContactsPrescription: e.target.value })} />
        </div>
      )}

      <div className="form-group">
        <label>Last Prescription Date:</label>
        <input type="date" value={values.lastPrescriptionDate} onChange={(e) => handleChange({ lastPrescriptionDate: e.target.value })} />
      </div>

      <h3>Health Concerns</h3>
      <div className="form-group">
        <label>Select Health Concerns (Hold Ctrl/Cmd to select multiple)</label>
        <select
          multiple
          className="multi-select"
          value={values.healthConcerns}
          onChange={(e) => handleMultiSelect('healthConcerns', e)}
        >
          {healthOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input placeholder="Other Concerns" value={values.otherConcerns} onChange={(e) => handleChange({ otherConcerns: e.target.value })} />
      </div>

      <h3>Conditions</h3>
      <div className="form-group">
        <label>Select Conditions (Hold Ctrl/Cmd to select multiple)</label>
        <select
          multiple
          className="multi-select"
          value={values.conditions}
          onChange={(e) => handleMultiSelect('conditions', e)}
        >
          {conditionOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input placeholder="Other Conditions" value={values.otherConditions} onChange={(e) => handleChange({ otherConditions: e.target.value })} />
      </div>

      <h3>Surgeries</h3>
      <div className="form-group">
        <div className="checkbox-row">
          <span>Had Surgery</span>
          <input type="checkbox" checked={values.hadSurgery} onChange={(e) => handleChange({ hadSurgery: e.target.checked })} />
        </div>
      </div>
      {values.hadSurgery && (
        <>
          <div className="form-group">
            <label>Select Surgeries (Hold Ctrl/Cmd to select multiple)</label>
            <select
              multiple
              className="multi-select"
              value={values.surgeries}
              onChange={(e) => handleMultiSelect('surgeries', e)}
            >
              {surgeryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input placeholder="Other Surgeries" value={values.otherSurgeries} onChange={(e) => handleChange({ otherSurgeries: e.target.value })} />
          </div>
        </>
      )}

      <div className="nav-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}
