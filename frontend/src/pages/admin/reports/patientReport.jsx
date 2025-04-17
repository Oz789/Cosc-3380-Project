import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import "./patientReport.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PatientReport = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedHealthConcern, setSelectedHealthConcern] = useState('');
  const [showGraphs, setShowGraphs] = useState(false);
  const [locationStats, setLocationStats] = useState([]);
  const [prescriptionStats, setPrescriptionStats] = useState([]);
  const [healthConcernStats, setHealthConcernStats] = useState([]);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesDate = selectedDate ? patient.appointmentDate === selectedDate : true;
      const matchesLocation = selectedLocation ? patient.locationName === selectedLocation : true;
      const matchesDoctor = selectedDoctor ? patient.doctorName === selectedDoctor : true;
      const matchesPaymentStatus = selectedPaymentStatus ? patient.paymentStatus === selectedPaymentStatus : true;
      const matchesInsurance = selectedInsurance ? patient.insuranceProvider === selectedInsurance : true;
      const matchesHealthConcern = selectedHealthConcern 
        ? patient.healthConcerns?.includes(selectedHealthConcern) 
        : true;
      
      return matchesDate && matchesLocation && matchesDoctor && 
             matchesPaymentStatus && matchesInsurance && matchesHealthConcern;
    });
  }, [patients, selectedDate, selectedLocation, selectedDoctor, selectedPaymentStatus, selectedInsurance, selectedHealthConcern]);

  const processStats = (data) => {
    // Only process stats for the filtered data
    processLocationStats(data);
    processPrescriptionStats(data);
    processHealthConcernStats(data);
  };

  const processLocationStats = (data) => {
    const locationData = data.reduce((acc, patient) => {
      const location = patient.locationName;
      if (location && location !== 'Not specified') {
        acc[location] = (acc[location] || 0) + 1;
      }
      return acc;
    }, {});
    
    setLocationStats(Object.entries(locationData).map(([name, value]) => ({
      name,
      value,
      percentage: (value / data.length * 100).toFixed(1)
    })));
  };

  const processPrescriptionStats = (data) => {
    const stats = {
      withLenses: data.filter(p => p.usesCorrectiveLenses === 'Y').length,
      withContacts: data.filter(p => p.usesContacts === 'Y').length,
      total: data.length
    };
    
    setPrescriptionStats([
      { name: 'With Lenses', value: stats.withLenses, percentage: (stats.withLenses / stats.total * 100).toFixed(1) },
      { name: 'With Contacts', value: stats.withContacts, percentage: (stats.withContacts / stats.total * 100).toFixed(1) },
      { name: 'Neither', value: stats.total - stats.withLenses - stats.withContacts, 
        percentage: ((stats.total - stats.withLenses - stats.withContacts) / stats.total * 100).toFixed(1) }
    ]);
  };

  const processHealthConcernStats = (data) => {
    const concerns = data.reduce((acc, patient) => {
      if (patient.healthConcerns && Array.isArray(patient.healthConcerns) && patient.healthConcerns.length > 0) {
        patient.healthConcerns.forEach(concern => {
          if (concern && concern !== 'Not specified') {
            acc[concern] = (acc[concern] || 0) + 1;
          }
        });
      }
      return acc;
    }, {});
    
    setHealthConcernStats(Object.entries(concerns)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / data.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5));
  };

  // Update stats when filters change
  useEffect(() => {
    if (filteredPatients.length > 0) {
      processStats(filteredPatients);
    }
  }, [filteredPatients]);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5001/api/patientReport");
      const data = res.data;
      
      if (data.length === 0) {
        setError("No patient data available");
        return;
      }

      setPatients(data);
      processStats(data);
      
      // Set initial selected date to the most recent date
      if (data.length > 0) {
        setSelectedDate(data[0].appointmentDate);
      }
    } catch (err) {
      console.error("Error fetching patient report:", err);
      setError(err.response?.data?.error || "Failed to fetch patient data");
    } finally {
      setLoading(false);
    }
  };

  const uniqueLocations = [...new Set(patients.map(p => p.locationName))];
  const uniqueDates = [...new Set(patients.map(p => p.appointmentDate))].sort();
  const uniqueDoctors = [...new Set(patients.map(p => p.doctorName))].sort();
  const uniquePaymentStatuses = [...new Set(patients.map(p => p.paymentStatus))].sort();
  const uniqueInsuranceProviders = [...new Set(patients.map(p => p.insuranceProvider))].sort();
  const uniqueHealthConcerns = [...new Set(patients.flatMap(p => p.healthConcerns || []))].sort();

  if (loading) {
    return (
      <Box className="patient-report-container" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="patient-report-container">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="patient-report-container">
      <Typography variant="h4" gutterBottom fontFamily={"Serif"} fontWeight={"Bold"}>
        Patient Report
      </Typography>

      <Grid container spacing={2} marginBottom={1}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Date</InputLabel>
            <Select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              label="Date"
            >
              <MenuItem value="">All Dates</MenuItem>
              {uniqueDates.map(date => (
                <MenuItem key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              label="Location"
            >
              <MenuItem value="">All Locations</MenuItem>
              {uniqueLocations.map(location => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              label="Doctor"
            >
              <MenuItem value="">All Doctors</MenuItem>
              {uniqueDoctors.map(doctor => (
                <MenuItem key={doctor} value={doctor}>{doctor}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              label="Payment Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {uniquePaymentStatuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Insurance Provider</InputLabel>
            <Select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              label="Insurance Provider"
            >
              <MenuItem value="">All Providers</MenuItem>
              {uniqueInsuranceProviders.map(provider => (
                <MenuItem key={provider} value={provider}>{provider}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Health Concern</InputLabel>
            <Select
              value={selectedHealthConcern}
              onChange={(e) => setSelectedHealthConcern(e.target.value)}
              label="Health Concern"
            >
              <MenuItem value="">All Concerns</MenuItem>
              {uniqueHealthConcerns.map(concern => (
                <MenuItem key={concern} value={concern}>{concern}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowGraphs(!showGraphs)}
            fullWidth
          >
            {showGraphs ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography variant="h6" fontFamily={"Serif"}>
          Total Patients: {filteredPatients.length}
        </Typography>
      </Box>

      <TableContainer component={Paper} className="patient-report-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>DOB</b></TableCell>
              <TableCell><b>Visit Date</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Doctor</b></TableCell>
              <TableCell><b>Insurance</b></TableCell>
              <TableCell><b>Payment Status</b></TableCell>
              <TableCell><b>Health Concerns</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                <TableCell>{new Date(patient.DOB).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(patient.appointmentDate).toLocaleDateString()}</TableCell>
                <TableCell>{patient.locationName}</TableCell>
                <TableCell>{patient.doctorName}</TableCell>
                <TableCell>{patient.insuranceProvider}</TableCell>
                <TableCell>{patient.paymentStatus}</TableCell>
                <TableCell>{patient.healthConcerns?.join(', ') || 'None'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showGraphs && (
        <Grid container spacing={3} mt={4}>
          {/* Location Comparison */}
          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Patient Distribution by Location</Typography>
              {locationStats.length > 0 ? (
                <BarChart width={500} height={300} data={locationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              ) : (
                <Typography>No location data available</Typography>
              )}
            </Paper>
          </Grid>

          {/* Prescription Statistics */}
          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Prescription Statistics</Typography>
              {prescriptionStats.length > 0 ? (
                <PieChart width={500} height={300}>
                  <Pie
                    data={prescriptionStats}
                    cx={250}
                    cy={150}
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prescriptionStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <Typography>No prescription data available</Typography>
              )}
            </Paper>
          </Grid>

          {/* Health Concerns */}
          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Top Health Concerns</Typography>
              {healthConcernStats.length > 0 ? (
                <BarChart width={500} height={300} data={healthConcernStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              ) : (
                <Typography>No health concern data available</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PatientReport;
