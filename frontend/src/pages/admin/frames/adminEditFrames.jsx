import React from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import './adminFrames.css';

const AdminEditFrameModal = ({ data, onClose, onEdit, onDelete }) => {
  const {
    name, price, img,
    brand, model, material, shape,
    frameType, lensWidth, lensHeight, bridgeWidth, templeLength
  } = data;

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <Grid container spacing={2} padding={2}>
     
          <Grid item xs={12} sm={6}>
            <img src="/images/brevik.webp" alt="Eyeglass" className="item-image" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h6">${parseFloat(price).toFixed(2)}</Typography>

            <Grid container spacing={2} paddingTop={4}>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={onEdit}>Edit</Button>
              </Grid>
              <Grid item>
              <Button
    variant="outlined"
    color="error"
    onClick={() => onDelete(data.frameID)}  // pass frameID
  >
    Delete
  </Button>
              </Grid>
            </Grid>
          </Grid>

    
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Dimensions</Typography>
                  <Typography><b>Lens Width:</b> {lensWidth}mm</Typography>
                  <Typography><b>Lens Height:</b> {lensHeight}mm</Typography>
                <Typography><b>Bridge Width:</b> {bridgeWidth}mm</Typography>
                    <Typography><b>Temple Length:</b> {templeLength}mm</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Specifications</Typography>
                <Typography><b>Brand:</b> {brand}</Typography>
                  <Typography><b>Model:</b> {model}</Typography>
                <Typography><b>Material:</b> {material}</Typography>
                <Typography><b>Shape:</b> {shape}</Typography>
                <Typography><b>Frame Type:</b> {frameType}</Typography>
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

export default AdminEditFrameModal;
