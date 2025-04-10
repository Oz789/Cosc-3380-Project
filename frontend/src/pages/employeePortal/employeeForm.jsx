import React, { useState, useEffect} from "react";
import ProfileTemplate from "../../components/profileTemplate";
import { useParams } from "react-router-dom";
import './employeeForm.css'
import {Grid2, TextField, Box} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider} from '@mui/material/styles';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              paddingTop: "0px", // Remove top padding from the input wrapper
            },
            "& .MuiInputLabel-root": {
              top: "-4px", // Move the label closer to the input
            },
            "& .MuiOutlinedInput-notchedOutline": {
              top: "0px", // Ensure the outline stays aligned properly
            },
          },
        },
      },
    },
  });

const EmployeeForm = () =>
{
    const { id } = useParams();  // grabbing patient ID from URL param
  
    const [patientData, setPatientData] = useState({
      name: "",
      email: "",
      dob: "",
      sex: "",
      address: "",
      phone: "",
      lastExamDate: "",
      usesCorrectiveLenses: "",
      usesContacts: "",
      lensesPrescription: "",
      contactsPrescription: "",
      lastPrescriptionDate: "",
      healthConcerns: "",
      otherConcerns: "",
      conditions: "",
      otherConditions: "",
      hadSurgery: "",
      surgeries: "",
      otherSurgeries: "",
      allergies: "",
      additionalDetails: "",
    });
    const [isEditing, setIsEditing] = useState(false);
  
    
    useEffect(() => {
      const fetchPatientData = async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/patients/${id}`);
          if (!res.ok) throw new Error("Failed to fetch patient");
          const data = await res.json();
  
          setPatientData({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            dob: data.dob,
            sex: data.sex,
            address: data.address,
            phone: data.phoneNumber,
            lastExamDate: data.medicalForm.lastExamDate,
            usesCorrectiveLenses: data.medicalForm.usesCorrectiveLenses ? "Yes" : "No",
            usesContacts: data.medicalForm.usesContacts ? "Yes" : "No",
            lensesPrescription: data.medicalForm.LensesPrescription,
            contactsPrescription: data.medicalForm.ContactsPrescription,
            lastPrescriptionDate: data.medicalForm.lastPrescriptionDate,
            healthConcerns: data.medicalForm.healthConcerns,
            otherConcerns: data.medicalForm.otherConcerns,
            conditions: data.medicalForm.conditions,
            otherConditions: data.medicalForm.otherConditions,
            hadSurgery: data.medicalForm.hadSurgery ? "Yes" : "No",
            surgeries: data.medicalForm.surgeries,
            otherSurgeries: data.medicalForm.otherSurgeries,
            allergies: data.medicalForm.allergies,
            additionalDetails: data.medicalForm.additionalDetails,
          });
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      };
  
      fetchPatientData();
    }, [id]);
  
    //const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = React.useState('');

  const handleChangeRadio = (event) => {
    setValue(event.target.value);
  };
  
    const handleChange = (e) => {
      setPatientData({ ...patientData, [e.target.name]: e.target.value });
    };

   
        const [age, setAge] = React.useState('');
        const [age2, setAge2] = React.useState('');
        const [age3, setAge3] = React.useState('');
        const [age4, setAge4] = React.useState('');
        const [age5, setAge5] = React.useState('');
        const [age6, setAge6] = React.useState('');
        const [age7, setAge7] = React.useState('');
      
        const handleChangeDrop = (event) => {
          setAge(event.target.value);
        };

        const handleChangeDrop2 = (event) => {
            setAge2(event.target.value);
          };

          const handleChangeDrop3 = (event) => {
            setAge3(event.target.value);
          };

          const handleChangeDrop4 = (event) => {
            setAge4(event.target.value);
          };

          const handleChangeDrop5 = (event) => {
            setAge5(event.target.value);
          };

          const handleChangeDrop6 = (event) => {
            setAge6(event.target.value);
          };

          const handleChangeDrop7 = (event) => {
            setAge7(event.target.value);
          };
      

    return(
        <ProfileTemplate
        /* Left Sidebar (Patient Information) */
        sidebarContent={
          <div className="cont">
        <Grid2 container spacing={2} sx={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
        {/* Section Title */}
        <Grid2 xs={12} className="test">
            <h2 className="section-title">Employee Information</h2>
        </Grid2>

            {/* Name Field */}
            <Grid2 xs={12}>
                <TextField
                fullWidth
                label="Name"
                type="text"
                name="name"
                value={patientData.name}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                />
            </Grid2>

            {/* Email Field */}
            <Grid2 xs={12}>
                <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={patientData.email}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditing }}
                />
            </Grid2>

            <Grid2 xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}> 
                <DatePicker label="Date of Birth" />
                </DemoContainer>
            </LocalizationProvider>
            </Grid2>
            <Grid2>
            <FormControl>
                <FormLabel id="gender-radio-buttons-group-label">Gender</FormLabel>

                <RadioGroup
                    aria-labelledby="gender-radio-buttons-group-label"
                    name="gender-radio-buttons-group"
                    value={value}
                    onChange={handleChangeRadio}
                >
                    <Grid2 container direction="row">
                        <Grid2>
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </Grid2>
                    <Grid2>
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </Grid2>
                    </Grid2>
                </RadioGroup>
                </FormControl>
            
            </Grid2>
  
            <Grid2>
            <TextField
                fullWidth
                label="Address"
                type="text"
                />
            </Grid2>
            
            <Grid2>
            <TextField
                fullWidth
                label="Phone"
                type="text"
                />
            </Grid2>
            </Grid2>
          </div>
        }
  
        /* Center Section (Medical Form Data) */
        mainContent={
          <div className="e">
        <Grid2 container direction="row" spacing={2} >
        {/* Section Title */}
        <Grid2  className="test" marginRight={40}>
            <h2 className="section-title">Onboarding Information</h2>
        </Grid2>

            {/* Name Field */}
            <Grid2 >
                <TextField
                fullWidth
                label="Password"
                type="text"
                />
            </Grid2>

            {/* Email Field */}
            <Grid2 >
                <TextField
                fullWidth
                label="Confirm Password"
                type="text"
                />
            </Grid2>

            <Grid2 >
                <TextField
                fullWidth
                label="Role"
                type="text"
                />
            </Grid2>

            <Grid2 s>
                <ThemeProvider theme={theme} >
            <LocalizationProvider   dateAdapter={AdapterDayjs}>
            <Box
        sx={{

        }}
      >
                <DatePicker  label="Start Date"          />
                </Box>
            </LocalizationProvider>
            </ThemeProvider>
            </Grid2>
            
            <Grid2 className="big1">
            {/* <TextField
                className="big2"
                placeholder=" Tell us about yourself. This will serve as your employee page's bio."
                multiline
                rows={5}
                maxRows={6}
                />
                </Grid2>

            <Grid2> */}
            {/* Buttons */}
            <div className="button-group">
              {/* {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="save-btn">Save</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-btn">Save</button>
              )} */
                <button className="save-btn">Save</button>
              }
            </div>
            </Grid2>
            </Grid2>
          </div>
        }
  
        /* Right Section (Extra Content, Placeholder for Now) */
        extraContent={
            <Grid2>
          <h2> Select Schedule </h2>

          <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>S:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="demo-simple-select-label6">Shifts</InputLabel>
            <Select
                labelId="demo-simple-select-label6"
                id="demo-simple-select6"
                value={age6}
                label="Shifts"
                onChange={handleChangeDrop6}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>

            <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>M:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="test">Shifts</InputLabel>
            <Select
                labelId="name"
                id="test"
                value={age}
                label="Shifts"
                onChange={handleChangeDrop}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>

            <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>T:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="demo-simple-select-label">Shifts</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age2}
                label="Shifts"
                onChange={handleChangeDrop2}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>

            <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>W:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="demo-simple-select-label3">Shifts</InputLabel>
            <Select
                labelId="demo-simple-select-label3"
                id="demo-simple-select3"
                value={age3}
                label="Shifts"
                onChange={handleChangeDrop3}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>

            <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>T:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="demo-simple-select-label4">Shifts</InputLabel>
            <Select
                labelId="demo-simple-select-label4"
                id="demo-simple-select4"
                value={age4}
                label="Shifts"
                onChange={handleChangeDrop4}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>

            <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>F:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="demo-simple-select-label5">Shifts</InputLabel>
            <Select
                labelId="demo-simple-select-label5"
                id="demo-simple-select5"
                value={age5}
                label="Shifts"
                onChange={handleChangeDrop5}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>

            <Grid2 container spacing={2} direction="row" >
                <Grid2 className="day">
                    <h3>S:</h3>
                </Grid2>
                <Grid2 className="drops">
                    <FormControl className="big1">
            <InputLabel id="demo-simple-select-label7">Shifts</InputLabel>
            <Select
                labelId="demo-simple-select-label7"
                id="demo-simple-select7"
                value={age7}
                label="Shifts"
                onChange={handleChangeDrop7}
            >
                <MenuItem value={10}>6:00am - 2:00pm</MenuItem>
                <MenuItem value={20}>2:00pm - 10pm</MenuItem>
                <MenuItem value={30}>Take Both</MenuItem>
                <MenuItem value={40}>n/a</MenuItem>
                
            </Select>
            </FormControl>
            </Grid2>

            </Grid2>



            


            </Grid2>
        }
      />
    );
}

export default EmployeeForm;