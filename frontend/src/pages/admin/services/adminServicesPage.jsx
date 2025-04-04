import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import AdminNavbar from "../../../components/navBar";
import AdminCreateService from "./adminCreateService";
import AdminEditService from "./adminEditService";


    const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [viewModal, setViewModal] = useState(false);
const [selectedService, setSelectedService] = useState(null);


  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleCreate = async (newService) => {
    try {
      await axios.post("http://localhost:5001/api/createService", newService);
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Failed to create service:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/services/${id}`);
      setViewModal(false);
      fetchServices();
      console.log("Deleted service:", id);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <Grid sx={{ padding: 4 }}>
        <Typography variant="h3">Admin: Services</Typography>
        <Typography variant="h6">Showing {services.length} Services</Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => setModalOpen(true)}
        >
          + Add New Service
        </Button>
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ padding: 2 }}>
        {services.map((service) => (
          <Grid item key={service.serviceID} xs={12} sm={6} md={3}>
            <Card className="service-card">
            <CardActionArea onClick={() => {
                setSelectedService(service);
                setViewModal(true);}}>
                <CardMedia
                  component="img"
                  height="150"
                  image="/Images/exams.jpg"
                  alt={service.serviceName}
                  className="service-image"
                />
                <CardContent>
                  <Typography variant="h6" className="service-title">
                    {service.serviceName}
                  </Typography>
                  <Typography variant="body2" className="service-description">
                    {service.description}
                  </Typography>
                  <Typography fontWeight="bold">${parseFloat(service.price).toFixed(2)}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

       {modalOpen && (
        <AdminCreateService
          toggleModal={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
      {viewModal && selectedService && (
        <AdminEditService
            data={selectedService}
        onClose={() => setViewModal(false)}
        onEdit={() => console.log("Edit", selectedService.serviceID)}
            onDelete={handleDelete}
  />
)}

    
    </div>
  );
};

export default AdminServices;
