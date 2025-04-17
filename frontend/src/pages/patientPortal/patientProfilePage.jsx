import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate } from 'react-router-dom';

const PatientProfilePage = () => {
  const { patientID } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/patients/${patientID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientID]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return <Typography>Patient not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Patient Profile
          </Typography>
          <IconButton
            color="primary"
            onClick={() => navigate(`/patient-profile/${patientID}/edit`)}
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              First Name
            </Typography>
            <Typography variant="body1">
              {patient.firstName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Last Name
            </Typography>
            <Typography variant="body1">
              {patient.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Date of Birth
            </Typography>
            <Typography variant="body1">
              {new Date(patient.DOB).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">
              {patient.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Phone Number
            </Typography>
            <Typography variant="body1">
              {patient.phoneNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Address
            </Typography>
            <Typography variant="body1">
              {patient.address}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Sex
            </Typography>
            <Typography variant="body1">
              {patient.sex}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Occupation
            </Typography>
            <Typography variant="body1">
              {patient.occupation}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PatientProfilePage; 