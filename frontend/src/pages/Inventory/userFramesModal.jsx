import React from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import '../admin/frames/adminFrames.css';
import './userFramesModal.css';

const UserFramesModal = ({ data, onClose }) => {
  const { name, price, img, brand, model, material, shape, frameType, lensWidth, lensHeight, bridgeWidth, templeLength, stockCount } = data;
  const [outOfStock, setOutOfStock] = React.useState(stockCount <= 0);

  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-content">
        <IconButton className="shifter" onClick={onClose}>
          <CancelPresentationIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h6">${parseFloat(price).toFixed(2)}</Typography>
            <Typography variant="body2"><b>Stock:</b> {stockCount}</Typography>

            <Grid container spacing={2} paddingTop={4}>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  disabled={stockCount <= 0}
                >
                  {stockCount > 0 ? 'View Details' : 'Out of Stock'}
                </Button>
              </Grid>
              {outOfStock && (
                <Grid item>
                  <Typography color="error">This item is currently out of stock.</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <img
              src={img || "/Images/default-frame.png"}
              alt="Eyeglass"
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 8px 18px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Dimensions</Typography>
                <Typography><b>Lens Width:</b> {lensWidth}</Typography>
                <Typography><b>Bridge Width:</b> {bridgeWidth}</Typography>
                <Typography><b>Temple Length:</b> {templeLength}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Specifications</Typography>
                <Typography><b>Brand:</b> {brand}</Typography>
                <Typography><b>Model:</b> {model}</Typography>
                <Typography><b>Material:</b> {material}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default UserFramesModal;