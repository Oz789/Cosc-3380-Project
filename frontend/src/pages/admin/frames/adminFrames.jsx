import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid2,
  Typography,
  Button,
  Box
} from "@mui/material";
import axios from "axios";

import AdminFrameModal from "./adminCreateFrameModal";
import AdminNavbar from "../../../components/navBar"; 
import AdminEditFrameModal from "./adminEditFrames";
import "./adminFrames.css";

const AdminFrames = () => {
  const [frames, setFrames] = useState([]);
  const [modal, setModal] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const fetchFrames = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/frames"); //fix this 
      setFrames(res.data);
    } catch (error) {
      console.error("Failed to fetch frames", error);
    }
  };

  useEffect(() => {
    fetchFrames();
  }, []);

  const handleClick = (frame) => {
    setBuffer(frame);
    setModal(true);
  };

  const handleFramesClick = (frame) => {
    setSelectedFrame(frame);
    setViewModal(true);
  };

  const handleCreate = async (newFrame) => {
    try {
      await axios.post("http://localhost:5001/api/createFrame", newFrame);
        setModal(false); 
      fetchFrames(); 
        console.log("Adding new frame:", newFrame);

    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/frames/${id}`);
      setViewModal(false);         // Close the modal
      fetchFrames();              
      console.log("Deleted frame ID:", id);
    } catch (error) {
      console.error("Error deleting frame:", error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <Grid2

  sx={{ paddingX: 4, paddingTop: 2 }}
>

  <div>
  <Typography
    variant="subtitle1"
    sx={{
      fontFamily: "Serif",
      fontSize: "20px",
      textAlign: "center",
      flexGrow: 1
    }}
  >
    Showing {frames.length} Products
  </Typography>
  </div>

  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => setModal(true)}
      sx={{
        minWidth: 0,
        width: 48,
        height: 48,
        borderRadius: "50%",
        fontSize: "1.5rem",
        fontWeight: "bold",
        lineHeight: 1,
        boxShadow: 2,
      }}
    >
      +
    </Button>
    <Typography
      variant="subtitle1"
      sx={{ fontFamily: "Bell MT, serif", fontWeight: 500 }}
    >Add a Frame
    </Typography>
  </Box>
</Grid2>


      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ padding: 2 }}
      >
  {frames.map((frame) => (
    <Grid2 item key={frame.frameID}>
      <Card className="admin-frame-card">
        <CardActionArea onClick={() => handleFramesClick(frame)}>
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
              {parseFloat(frame.price).toFixed(2)} 
            </Typography>
          </div>
        </CardActionArea>
      </Card>
    </Grid2>
  ))}
</Grid2>

      {modal && (
        <AdminFrameModal
        onClose={() => setModal(false)}
          onSubmit={handleCreate}
        />
      )}


      {viewModal && selectedFrame && (
    <AdminEditFrameModal
    data={selectedFrame}
    onClose={() => setViewModal(false)}
    onEdit={() => console.log("Edit", selectedFrame.frameID)}
    onDelete={handleDelete}
  />
)}

    </div>
  );
};

export default AdminFrames;
