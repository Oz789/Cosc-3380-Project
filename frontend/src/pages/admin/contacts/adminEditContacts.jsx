import React from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import './adminContactsModal.css'; 

const AdminEditContacts = ({ data, onClose, onEdit, onDelete }) => {
  const {
    name, price, img,
    brand, model, visionType, use,
    daysSupply, waterContent
  } = data;

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
          {/* Left: Image */}
          <Grid item xs={12} sm={6}>
            <img src={img} alt="Contact Lens" className="item-image" />
          </Grid>

          {/* Right: Name, Price, Actions */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h6">${parseFloat(price).toFixed(2)}</Typography>

            <Grid container spacing={2} paddingTop={4}>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={onEdit}>
                  Edit
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="error" onClick={() => onDelete(data.contactID)}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Bottom: Details */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Lens Details</Typography>
                <Typography><b>Brand:</b> {brand}</Typography>
                <Typography><b>Model:</b> {model}</Typography>
                <Typography><b>Use:</b> {use}</Typography>
                <Typography><b>Vision Type:</b> {visionType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Additional Info</Typography>
                <Typography><b>Days Supply:</b> {daysSupply}</Typography>
                <Typography><b>Water Content:</b> {waterContent}</Typography>
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

export default AdminEditContacts;
