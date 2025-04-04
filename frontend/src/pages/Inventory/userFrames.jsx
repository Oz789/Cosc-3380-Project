import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import "../admin/frames/adminFrames.css";
import UserFramesModal from "./userFramesModal";
import UsernavBar from "../../components/navBar";

const UserFrames = () => {
  const [frames, setFrames] = useState([]);

  const fetchFrames = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/frames");
      setFrames(res.data);
    } catch (error) {
      console.error("Failed to fetch frames", error);
    }
  };

  useEffect(() => {
    fetchFrames();
  }, []);

  const [viewModal, setViewModal] = useState(false);
const [selectedFrame, setSelectedFrame] = useState(null);

const handleFrameClick = (frame) => {
    setSelectedFrame(frame);
    setViewModal(true);
  };

  return (
<>
    <UsernavBar/>
    <div>
      

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ padding: 2 }}
      >
        {frames.map((frame) => (
          <Grid item key={frame.id}>
            <Card className="admin-frame-card">
              <CardActionArea onClick={() => handleFrameClick(frame)}>
                <CardMedia
                  component="img"
                  image="/Images/brevik.webp"
                  alt="Eyeglass"
                  className="admin-frame-image"
                />
                <div className="admin-frame-details">
                  <Typography variant="h6" fontFamily="Roboto">
                    {frame.name}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ${parseFloat(frame.price).toFixed(2)}
                  </Typography>
                </div>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {viewModal && selectedFrame && (
    
    <UserFramesModal
        data={selectedFrame}
        onClose={() => setViewModal(false)}
        onPurchase={() => {
        console.log("Purchased frame:", selectedFrame.name);
        setViewModal(false);
    }}
  />
)}

    </div>
</>
  );
};

export default UserFrames;
