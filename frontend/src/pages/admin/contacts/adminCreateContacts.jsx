import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  IconButton
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import "./adminContactsModal.css";

const AdminCreateContactModal = ({ toggleModal, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    model: "",
    visionType: "",
    use: "",
    daysSupply: "",
    waterContent: "",
    img: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      
      <div className="modal-content">
        <Grid container spacing={2} direction="column" padding={2}>
          <Typography variant="h4">Create New Contact Lens</Typography>

          <TextField name="name" label="Name" value={form.name} onChange={handleChange} />
          <TextField name="price" label="Price (e.g. $99.99)" value={form.price} onChange={handleChange} />
          <TextField name="img" label="Image Path (e.g. /Images/example.webp)" value={form.img} onChange={handleChange} />

          <Grid container spacing={2}>
              <Grid item xs={6}><TextField name="brand" label="Brand" value={form.brand} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={6}><TextField name="model" label="Model" value={form.model} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6}><TextField name="visionType" label="Vision Type" value={form.visionType} onChange={handleChange} fullWidth /></Grid>
            < Grid item xs={6}><TextField name="use" label="Use (Daily, Monthly...)" value={form.use} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6}><TextField name="daysSupply" label="Days Supply" value={form.daysSupply} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6}><TextField name="waterContent" label="Water Content" value={form.waterContent} onChange={handleChange} fullWidth /></Grid>
          </Grid>

          <Button variant="contained" sx={{ marginTop: 3 }} onClick={handleSubmit}>
            Create Contact Lens
          </Button>
        </Grid>

        <IconButton className="shifter" onClick={toggleModal}>
          <CancelPresentationIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default AdminCreateContactModal;
