import React, { useEffect, useState } from "react";
import axios from "axios";
import "./frames.css"; 
import UsernavBar from "../../components/navBar";
import UserFramesModal from "./userFramesModal"; 

const UserFrames = () => {
  const [frames, setFrames] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/frames");
        setFrames(res.data);
      } catch (error) {
        console.error("Failed to fetch frames", error);
      }
    };

    fetchFrames();
  }, []);

  const handleFrameClick = (frame) => {
    setSelectedFrame(frame);
    setViewModal(true);
  };

  return (
    <>
      <UsernavBar />
      <div className="frames-container">
        <h2 className="frames-title">Eyeglass Frames</h2>
        <p className="frames-count">Showing {frames.length} Products</p>

        <div className="frames-grid">
          {frames.map((frame) => (
            <div
              className="frame-card"
              key={frame.id}
              onClick={() => handleFrameClick(frame)}
            >
              <img
                src={frame.image || "/Images/brevik.webp"}
                alt={frame.name}
                className="frame-image"
              />
              <div className="frame-info">
                <span className="brand">Cartier</span>
                <span className="model">{frame.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

         
         {viewModal && selectedFrame && (
        <UserFramesModal
          data={selectedFrame}
          onClose={() => setViewModal(false)}
        />
      )}
    </>
  );
};

export default UserFrames;

