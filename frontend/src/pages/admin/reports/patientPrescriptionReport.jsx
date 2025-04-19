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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import "./patientReport.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PatientPrescriptionReport = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedHealthConcern, setSelectedHealthConcern] = useState('');
  const [showGraphs, setShowGraphs] = useState(false);
  const [showHealthAnalysis, setShowHealthAnalysis] = useState(false);
  const [locationStats, setLocationStats] = useState([]);
  const [prescriptionStats, setPrescriptionStats] = useState([]);
  const [healthConcernStats, setHealthConcernStats] = useState({
    byAge: {
      '0-18': {},
      '19-34': {},
      '35-64': {},
      '65+': {}
    },
    byLocation: {},
    overall: []
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesDate = selectedDate ? patient.appointmentDate === selectedDate : true;
      const matchesLocation = selectedLocation ? patient.locationName === selectedLocation : true;
      const matchesDoctor = selectedDoctor ? patient.doctorName === selectedDoctor : true;
      const matchesHealthConcern = selectedHealthConcern 
        ? patient.healthConcerns?.includes(selectedHealthConcern) 
        : true;
      
      return matchesDate && matchesLocation && matchesDoctor && matchesHealthConcern;
    });
  }, [patients, selectedDate, selectedLocation, selectedDoctor, selectedHealthConcern]);

  const processStats = (data) => {
    processLocationStats(data);
    processPrescriptionStats(data);
    processHealthConcernStats(data);
  };

  const processLocationStats = (data) => {
    const locationData = data.reduce((acc, patient) => {
      const location = patient.locationName;
      if (location && location !== 'Not specified') {
        if (!acc[location]) {
          acc[location] = {
            total: 0,
            withLenses: 0,
            withContacts: 0,
            withNeither: 0
          };
        }
        acc[location].total++;
        
        if (patient.usesCorrectiveLenses === '1' || patient.usesCorrectiveLenses === 1) {
          acc[location].withLenses++;
        }
        if (patient.usesContacts === '1' || patient.usesContacts === 1) {
          acc[location].withContacts++;
        }
        if ((patient.usesCorrectiveLenses !== '1' && patient.usesCorrectiveLenses !== 1) && 
            (patient.usesContacts !== '1' && patient.usesContacts !== 1)) {
          acc[location].withNeither++;
        }
      }
      return acc;
    }, {});
    
    setLocationStats(Object.entries(locationData).map(([name, stats]) => ({
      name,
      total: stats.total,
      withLenses: stats.withLenses,
      withContacts: stats.withContacts,
      withNeither: stats.withNeither,
      lensesPercentage: (stats.withLenses / stats.total * 100).toFixed(1),
      contactsPercentage: (stats.withContacts / stats.total * 100).toFixed(1),
      neitherPercentage: (stats.withNeither / stats.total * 100).toFixed(1)
    })));
  };

  const processPrescriptionStats = (data) => {
    console.log('Raw patient data:', JSON.stringify(data, null, 2)); // Pretty print the data
    
    const stats = {
      withLenses: data.filter(p => p.usesCorrectiveLenses === '1' || p.usesCorrectiveLenses === 1).length,
      withContacts: data.filter(p => p.usesContacts === '1' || p.usesContacts === 1).length,
      total: data.length
    };
    
    console.log('Calculated stats:', {
      totalPatients: stats.total,
      patientsWithLenses: stats.withLenses,
      patientsWithContacts: stats.withContacts,
      percentageWithLenses: ((stats.withLenses / stats.total) * 100).toFixed(2) + '%',
      percentageWithContacts: ((stats.withContacts / stats.total) * 100).toFixed(2) + '%'
    });
    
    // Calculate patients with neither lenses nor contacts
    const withNeither = data.filter(p => 
      p.usesCorrectiveLenses !== '1' && p.usesCorrectiveLenses !== 1 && 
      p.usesContacts !== '1' && p.usesContacts !== 1
    ).length;
    
    const prescriptionData = [
      { name: 'With Lenses', value: stats.withLenses, percentage: (stats.withLenses / stats.total * 100).toFixed(1) },
      { name: 'With Contacts', value: stats.withContacts, percentage: (stats.withContacts / stats.total * 100).toFixed(1) },
      { name: 'Neither', value: withNeither, percentage: (withNeither / stats.total * 100).toFixed(1) }
    ];

    console.log('Final prescription data:', JSON.stringify(prescriptionData, null, 2));
    setPrescriptionStats(prescriptionData);
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

    const overallStats = Object.entries(concerns)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / data.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Process health concerns by age group
    const healthConcernsByAge = {
      '0-18': {},
      '19-34': {},
      '35-64': {},
      '65+': {}
    };

    // Process health concerns by location
    const healthConcernsByLocation = {};

    data.forEach(patient => {
      const age = calculateAge(patient.DOB);
      const ageGroup = age <= 18 ? '0-18' : 
                      age <= 34 ? '19-34' : 
                      age <= 64 ? '35-64' : '65+';
      
      const location = patient.locationName || 'Not specified';
      
      if (patient.healthConcerns) {
        patient.healthConcerns.forEach(concern => {
          if (concern && concern !== 'Not specified') {
            // Process by age group
            healthConcernsByAge[ageGroup][concern] = (healthConcernsByAge[ageGroup][concern] || 0) + 1;
            
            // Process by location
            if (!healthConcernsByLocation[location]) {
              healthConcernsByLocation[location] = {};
            }
            healthConcernsByLocation[location][concern] = (healthConcernsByLocation[location][concern] || 0) + 1;
          }
        });
      }
    });

    setHealthConcernStats({
      byAge: healthConcernsByAge,
      byLocation: healthConcernsByLocation,
      overall: overallStats
    });
  };

  const calculatePercentage = (count, total) => {
    return ((count / total) * 100).toFixed(1);
  };

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
      const response = await axios.get("http://localhost:5001/api/patientReport");
      const data = response.data;
      
      if (data.length === 0) {
        setError("No patient data available");
        return;
      }

      setPatients(data);
      processStats(data);
      
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
        Patient Prescription Report
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
              <MenuItem key="all-dates" value="">All Dates</MenuItem>
              {uniqueDates.map(date => (
                <MenuItem key={`date-${date}`} value={date}>
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
              <MenuItem key="all-locations" value="">All Locations</MenuItem>
              {uniqueLocations.map(location => (
                <MenuItem key={`location-${location}`} value={location}>{location}</MenuItem>
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
              <MenuItem key="all-doctors" value="">All Doctors</MenuItem>
              {uniqueDoctors.map(doctor => (
                <MenuItem key={`doctor-${doctor}`} value={doctor}>{doctor}</MenuItem>
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
              <MenuItem key="all-concerns" value="">All Concerns</MenuItem>
              {uniqueHealthConcerns.map(concern => (
                <MenuItem key={`concern-${concern}`} value={concern}>{concern}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowGraphs(!showGraphs)}
                fullWidth
              >
                {showGraphs ? 'Hide Prescription Analytics' : 'Show Prescription Analytics'}
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowHealthAnalysis(!showHealthAnalysis)}
                fullWidth
              >
                {showHealthAnalysis ? 'Hide Health Analytics' : 'Show Health Analytics'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography variant="h6" fontFamily={"Serif"}>
          Total Patients: {filteredPatients.length}
        </Typography>
      </Box>

      {showGraphs && (
        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Prescription Distribution by Clinic</Typography>
              {locationStats.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <BarChart width={500} height={300} data={locationStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="withLenses" name="With Lenses" fill="#8884d8" />
                      <Bar dataKey="withContacts" name="With Contacts" fill="#82ca9d" />
                      <Bar dataKey="withNeither" name="Neither" fill="#ffc658" />
                    </BarChart>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {locationStats.map((location) => (
                      <Box key={location.name} mb={3}>
                        <Typography variant="h6" gutterBottom>
                          <strong>{location.name}</strong>
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                          With Lenses: {location.withLenses} patients ({location.lensesPercentage}%)
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                          With Contacts: {location.withContacts} patients ({location.contactsPercentage}%)
                        </Typography>
                        <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                          Neither: {location.withNeither} patients ({location.neitherPercentage}%)
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              ) : (
                <Typography>No location data available</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Prescription Statistics</Typography>
              {prescriptionStats.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
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
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} patients (${props.payload.percentage}%)`,
                          name
                        ]}
                      />
                    </PieChart>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Breakdown</Typography>
                    {prescriptionStats.map((stat, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                          <strong>{stat.name}:</strong> {stat.value} patients ({stat.percentage}%)
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              ) : (
                <Typography>No prescription data available</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {showHealthAnalysis && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom fontFamily={"Serif"}>
            Health Analytics
          </Typography>
          <Grid container spacing={3}>
            {/* Health Concerns by Age Group */}
            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Health Concerns by Age Group</Typography>
                    {Object.entries(healthConcernStats.byAge || {}).map(([ageGroup, concerns]) => {
                      const total = Object.values(concerns || {}).reduce((sum, count) => sum + count, 0);
                      return (
                        <Box key={ageGroup} mb={3}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{ageGroup}</strong>
                          </Typography>
                          {Object.entries(concerns || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([concern, count]) => (
                              <Typography key={concern} variant="body2">
                                {concern}: {count} patients ({calculatePercentage(count, total)}%)
                              </Typography>
                          ))}
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Health Concerns by Location */}
            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Health Concerns by Eye Clinic</Typography>
                    {Object.entries(healthConcernStats.byLocation || {}).map(([location, concerns]) => {
                      const total = Object.values(concerns || {}).reduce((sum, count) => sum + count, 0);
                      return (
                        <Box key={location} mb={3}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{location}</strong>
                          </Typography>
                          {Object.entries(concerns || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([concern, count]) => (
                              <Typography key={concern} variant="body2">
                                {concern}: {count} patients ({calculatePercentage(count, total)}%)
                              </Typography>
                          ))}
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      <TableContainer component={Paper} className="patient-report-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Visit Date</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Doctor</b></TableCell>
              <TableCell><b>Health Concerns</b></TableCell>
              <TableCell><b>Lenses</b></TableCell>
              <TableCell><b>Contacts</b></TableCell>
              <TableCell><b>Lenses Rx</b></TableCell>
              <TableCell><b>Contacts Rx</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                <TableCell>
                  {patient.appointmentDate ? 
                    new Date(patient.appointmentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }) : 'No Date'}
                </TableCell>
                <TableCell>{patient.locationName || 'Not Specified'}</TableCell>
                <TableCell>{patient.doctorName || 'Not Assigned'}</TableCell>
                <TableCell>{Array.isArray(patient.healthConcerns) ? patient.healthConcerns.join(', ') : 'None'}</TableCell>
                <TableCell>{patient.usesCorrectiveLenses === '1' || patient.usesCorrectiveLenses === 1 ? 'Yes' : 'No'}</TableCell>
                <TableCell>{patient.usesContacts === '1' || patient.usesContacts === 1 ? 'Yes' : 'No'}</TableCell>
                <TableCell>{patient.LensesPrescription || 'N/A'}</TableCell>
                <TableCell>{patient.ContactsPrescription || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientPrescriptionReport; 