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

const PatientDemographicsReport = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedHealthConcern, setSelectedHealthConcern] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const [showGraphs, setShowGraphs] = useState(false);
  const [showHealthAnalysis, setShowHealthAnalysis] = useState(false);
  const [locationStats, setLocationStats] = useState([]);
  const [ageStats, setAgeStats] = useState([]);
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
  const [occupationStats, setOccupationStats] = useState([]);

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
      const age = calculateAge(patient.DOB);
      const matchesDate = selectedDate ? patient.appointmentDate === selectedDate : true;
      const matchesLocation = selectedLocation ? patient.locationName === selectedLocation : true;
      const matchesDoctor = selectedDoctor ? patient.doctorName === selectedDoctor : true;
      const matchesHealthConcern = selectedHealthConcern 
        ? patient.healthConcerns?.includes(selectedHealthConcern) 
        : true;
      const matchesAgeRange = age >= minAge && age <= maxAge;
      
      return matchesDate && matchesLocation && matchesDoctor && 
             matchesHealthConcern && matchesAgeRange;
    });
  }, [patients, selectedDate, selectedLocation, selectedDoctor, 
      selectedHealthConcern, minAge, maxAge]);

  const processStats = (data) => {
    processLocationStats(data);
    processAgeStats(data);
    processHealthConcernStats(data);
    processOccupationStats(data);
  };

  const processLocationStats = (data) => {
    const locationData = data.reduce((acc, patient) => {
      const location = patient.locationName;
      if (location && location !== 'Not specified') {
        acc[location] = (acc[location] || 0) + 1;
      }
      return acc;
    }, {});
    
    const total = data.length;
    setLocationStats(Object.entries(locationData).map(([name, value]) => ({
      name,
      value,
      percentage: (value / total * 100).toFixed(1)
    })));
  };

  const processAgeStats = (data) => {
    const ageGroups = {
      '0-18': 0,
      '19-34': 0,
      '35-64': 0,
      '65+': 0
    };

    data.forEach(patient => {
      const age = calculateAge(patient.DOB);
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 34) ageGroups['19-34']++;
      else if (age <= 64) ageGroups['35-64']++;
      else ageGroups['65+']++;
    });

    const total = data.length;
    setAgeStats(Object.entries(ageGroups).map(([name, value]) => ({
      name,
      value,
      percentage: (value / total * 100).toFixed(1)
    })));
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

  const processOccupationStats = (data) => {
    const occupationData = data.reduce((acc, patient) => {
      const occupation = patient.occupation;
      if (occupation && occupation !== 'Not specified') {
        acc[occupation] = (acc[occupation] || 0) + 1;
      }
      return acc;
    }, {});
    
    setOccupationStats(Object.entries(occupationData)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / data.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5));
  };

  const processInsuranceStats = (data) => {
    // Insurance by age group
    const insuranceByAge = {
      '0-18': {},
      '19-34': {},
      '35-64': {},
      '65+': {}
    };

    // Insurance by location
    const insuranceByLocation = {};

    // Insurance by health concern
    const insuranceByHealthConcern = {};

    data.forEach(patient => {
      const age = calculateAge(patient.DOB);
      const ageGroup = age <= 18 ? '0-18' : 
                      age <= 34 ? '19-34' : 
                      age <= 64 ? '35-64' : '65+';
      
      const insurance = patient.insuranceProvider || 'None';
      
      // Process by age group
      insuranceByAge[ageGroup][insurance] = (insuranceByAge[ageGroup][insurance] || 0) + 1;
      
      // Process by location
      const location = patient.locationName;
      if (location) {
        if (!insuranceByLocation[location]) {
          insuranceByLocation[location] = {};
        }
        insuranceByLocation[location][insurance] = (insuranceByLocation[location][insurance] || 0) + 1;
      }
      
      // Process by health concern
      if (patient.healthConcerns) {
        patient.healthConcerns.forEach(concern => {
          if (!insuranceByHealthConcern[concern]) {
            insuranceByHealthConcern[concern] = {};
          }
          insuranceByHealthConcern[concern][insurance] = (insuranceByHealthConcern[concern][insurance] || 0) + 1;
        });
      }
    });

    // Convert to chart data format
    const insuranceAgeData = Object.entries(insuranceByAge).map(([ageGroup, providers]) => ({
      ageGroup,
      ...Object.entries(providers).reduce((acc, [provider, count]) => {
        acc[provider] = count;
        return acc;
      }, {})
    }));

    const insuranceLocationData = Object.entries(insuranceByLocation).map(([location, providers]) => ({
      location,
      ...Object.entries(providers).reduce((acc, [provider, count]) => {
        acc[provider] = count;
        return acc;
      }, {})
    }));

    const insuranceHealthConcernData = Object.entries(insuranceByHealthConcern).map(([concern, providers]) => ({
      concern,
      ...Object.entries(providers).reduce((acc, [provider, count]) => {
        acc[provider] = count;
        return acc;
      }, {})
    }));

    return {
      byAge: insuranceAgeData,
      byLocation: insuranceLocationData,
      byHealthConcern: insuranceHealthConcernData
    };
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
      const response = await axios.get("http://localhost:5001/api/patientReport/");
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

  const calculatePercentage = (count, total) => {
    return ((count / total) * 100).toFixed(1);
  };

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
        Patient Demographics Report
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

        <Grid item xs={12} sm={4}>
          <Box>
            <Typography gutterBottom>Age Range: {minAge} - {maxAge}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Min Age</InputLabel>
                  <Select
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    label="Min Age"
                  >
                    {[...Array(101)].map((_, i) => (
                      <MenuItem key={i} value={i}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Max Age</InputLabel>
                  <Select
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    label="Max Age"
                  >
                    {[...Array(101)].map((_, i) => (
                      <MenuItem key={i} value={i}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowGraphs(!showGraphs)}
            fullWidth
          >
            {showGraphs ? 'Hide Insurance Analytics' : 'Show Insurance Analytics'}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
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

      <Box mt={2}>
        <Typography variant="h6" fontFamily={"Serif"}>
          Total Patients: {filteredPatients.length}
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom fontFamily={"Serif"}>
          Age Distribution
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Age Distribution</Typography>
              {ageStats.length > 0 ? (
                <Box>
                  {ageStats.map((group) => (
                    <Box key={group.name} mb={2}>
                      <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                        <strong>{group.name}:</strong> {group.value} patients ({group.percentage}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>No age data available</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="chart-paper">
              <Typography variant="h6" gutterBottom>Clinic Distribution</Typography>
              {locationStats.length > 0 ? (
                <Box>
                  {locationStats.map((location) => (
                    <Box key={location.name} mb={2}>
                      <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
                        <strong>{location.name}:</strong> {location.value} patients ({location.percentage}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>No location data available</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {showGraphs && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom fontFamily={"Serif"}>
            Insurance Provider Analysis
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Insurance Distribution by Age Group</Typography>
                    {processInsuranceStats(filteredPatients).byAge.length > 0 ? (
                      <BarChart width={600} height={400} data={processInsuranceStats(filteredPatients).byAge}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(processInsuranceStats(filteredPatients).byAge[0]).filter(key => key !== 'ageGroup').map((provider, index) => (
                          <Bar key={provider} dataKey={provider} stackId="a" fill={COLORS[index % COLORS.length]} />
                        ))}
                      </BarChart>
                    ) : (
                      <Typography>No insurance data available</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Breakdown by Age Group</Typography>
                    {processInsuranceStats(filteredPatients).byAge.map((ageGroup) => {
                      const total = Object.entries(ageGroup)
                        .filter(([key]) => key !== 'ageGroup')
                        .reduce((sum, [_, count]) => sum + count, 0);
                      
                      return (
                        <Box key={ageGroup.ageGroup} mb={2}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{ageGroup.ageGroup}</strong>
                          </Typography>
                          {Object.entries(ageGroup)
                            .filter(([key]) => key !== 'ageGroup')
                            .map(([provider, count]) => (
                              <Typography key={provider} variant="body2">
                                {provider}: {count} patients ({calculatePercentage(count, total)}%)
                              </Typography>
                          ))}
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Insurance Distribution by Location</Typography>
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                      <BarChart width={800} height={400} data={processInsuranceStats(filteredPatients).byLocation}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(processInsuranceStats(filteredPatients).byLocation[0]).filter(key => key !== 'location').map((provider, index) => (
                          <Bar key={provider} dataKey={provider} stackId="a" fill={COLORS[index % COLORS.length]} />
                        ))}
                      </BarChart>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Breakdown by Location</Typography>
                    {processInsuranceStats(filteredPatients).byLocation.map((location) => {
                      const total = Object.entries(location)
                        .filter(([key]) => key !== 'location')
                        .reduce((sum, [_, count]) => sum + count, 0);
                      
                      return (
                        <Box key={location.location} mb={3}>
                          <Typography variant="h6" gutterBottom>
                            <strong>{location.location}</strong>
                          </Typography>
                          {Object.entries(location)
                            .filter(([key]) => key !== 'location')
                            .map(([provider, count]) => (
                              <Typography key={provider} variant="body1" style={{ fontSize: '1.1rem' }}>
                                {provider}: {count} patients ({calculatePercentage(count, total)}%)
                              </Typography>
                          ))}
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className="chart-paper">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Insurance Distribution by Health Concern</Typography>
                    {processInsuranceStats(filteredPatients).byHealthConcern.length > 0 ? (
                      <BarChart width={600} height={400} data={processInsuranceStats(filteredPatients).byHealthConcern}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="concern" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(processInsuranceStats(filteredPatients).byHealthConcern[0]).filter(key => key !== 'concern').map((provider, index) => (
                          <Bar key={provider} dataKey={provider} stackId="a" fill={COLORS[index % COLORS.length]} />
                        ))}
                      </BarChart>
                    ) : (
                      <Typography>No insurance data available</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>Breakdown by Health Concern</Typography>
                    {processInsuranceStats(filteredPatients).byHealthConcern.map((concern) => {
                      const total = Object.entries(concern)
                        .filter(([key]) => key !== 'concern')
                        .reduce((sum, [_, count]) => sum + count, 0);
                      
                      return (
                        <Box key={concern.concern} mb={2}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{concern.concern}</strong>
                          </Typography>
                          {Object.entries(concern)
                            .filter(([key]) => key !== 'concern')
                            .map(([provider, count]) => (
                              <Typography key={provider} variant="body2">
                                {provider}: {count} patients ({calculatePercentage(count, total)}%)
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

      <Box mt={4}>
        <Typography variant="h5" gutterBottom fontFamily={"Serif"}>
          Patient Details
        </Typography>
        <TableContainer component={Paper} className="patient-report-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Age</b></TableCell>
                <TableCell><b>Occupation</b></TableCell>
                <TableCell><b>Visit Date</b></TableCell>
                <TableCell><b>Location</b></TableCell>
                <TableCell><b>Doctor</b></TableCell>
                <TableCell><b>Health Concerns</b></TableCell>
                <TableCell><b>Insurance</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient, index) => (
                <TableRow key={index}>
                  <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                  <TableCell>{calculateAge(patient.DOB)}</TableCell>
                  <TableCell>{patient.occupation || 'Not specified'}</TableCell>
                  <TableCell>{new Date(patient.appointmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.locationName}</TableCell>
                  <TableCell>{patient.doctorName}</TableCell>
                  <TableCell>{patient.healthConcerns?.join(', ') || 'None'}</TableCell>
                  <TableCell>{patient.insuranceProvider || 'None'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PatientDemographicsReport; 