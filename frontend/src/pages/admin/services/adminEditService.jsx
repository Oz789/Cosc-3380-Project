import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  Button
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import "../../services/services.css";

const AdminEditService = ({ data, onClose, onEdit, onDelete }) => {
  const {
    serviceID,
    serviceName,
    description,
    price,
    img
  } = data;

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} sm={6}>
            <img
              src={img || "/images/default.jpg"}
              alt={serviceName}
              className="service-image"
              style={{ border: "2px solid black" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" className="service-title">{serviceName}</Typography>
            <Typography variant="body1" className="service-description">{description}</Typography>
            <Typography fontWeight="bold" sx={{ marginTop: 1 }}>
              ${parseFloat(price).toFixed(2)}
            </Typography>

            <Grid container spacing={2} sx={{ marginTop: 4 }}>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={onEdit}>
                  Edit
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="error" onClick={() => onDelete(serviceID)}>
            Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <IconButton className="shifter" onClick={onClose}>
          <CancelPresentationIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default AdminEditService;
