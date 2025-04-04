import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import './adminFrames.css';


// These are the SQL table attributes
const AdminFrameModal = ({ toggleModal, onSubmit }) => {
  const [form, setForm] = useState({ 
    name: '',
    price: '',
    brand: '',
    color: '',
    model: '',
    material: '',
    lensWidth: '',
    lensHeight: '',
    bridgeWidth: '',
    templeLength: '',
    img: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    toggleModal();
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <Grid container spacing={2} direction="column" padding={2}>
          <Typography variant="h4">Create New Frame</Typography>

          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="price"
            label="Price (e.g. $99.99)"
            value={form.price}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="img"
            label="Image Path (e.g. /Images/Brescia.webp)"
            value={form.img}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField name="brand" label="Brand" value={form.brand} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="model" label="Model" value={form.model} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="material" label="Material" value={form.material} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="color" label="Color" value={form.color} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>

          <Grid container spacing={2} paddingTop={2}>
            <Grid item xs={6}>
              <TextField name="lensWidth" label="Lens Width (mm)" value={form.lensWidth} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="lensHeight" label="Lens Height (mm)" value={form.lensHeight} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="bridgeWidth" label="Bridge Width (mm)" value={form.bridgeWidth} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="templeLength" label="Temple Length (mm)" value={form.templeLength} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>

          <Button variant="contained" sx={{ marginTop: 3 }} onClick={handleSubmit}>
            Create Frame
          </Button>
        </Grid>

        <IconButton className="shifter" onClick={toggleModal}>
          <CancelPresentationIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default AdminFrameModal;


