import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  IconButton
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const AdminCreateService = ({ toggleModal, onSubmit }) => {
  const [form, setForm] = useState({
    serviceName: "",
    price: "",
    description: "",
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
          <Typography variant="h4">Create New Service</Typography>

          <TextField
            name="serviceName"
            label="Service Name"
            value={form.serviceName}
            onChange={handleChange}
          />
          <TextField
            name="price"
            label="Price (e.g. 49.99)"
            value={form.price}
            onChange={handleChange}
          />
          <TextField
            name="img"
            label="/Image/exams.jpg"
            value={form.img}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            sx={{ marginTop: 3 }}
            onClick={handleSubmit}
          >
            Create Service
          </Button>
        </Grid>

        <IconButton className="shifter" onClick={toggleModal}>
          <CancelPresentationIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default AdminCreateService;
