import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  Button
} from "@mui/material";
import axios from "axios";
import AdminCreateContactModal from "./adminCreateContacts";
import AdminNavbar from "../../../components/navBar";
import AdminEditContacts from "./adminEditContacts";
import "./adminContactsPage.css";


const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [modal, setModal] = useState(false);
    
    
    const [viewModal, setViewModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/eyeContacts");
          setContacts(res.data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  const handleCreate = async (newContact) => {
    try {
      await axios.post("http://localhost:5001/api/createContact", newContact);
      
      
      setModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/contacts/${id}`);
      setViewModal(false);

      fetchContacts();
      console.log("Deleted contact lens:", id);
    } catch (error) {
      console.error("Error deleting contact lens:", error);
    }
  };
  

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <Grid sx={{ paddingLeft: 4, paddingTop: 2 }}>
          <Typography variant="h3">Contact Lenses</Typography>
        <Typography variant="h6">Showing {contacts.length} Products</Typography>


      <Button variant="contained" color="primary"
          sx={{ marginTop: 2 }} onClick={() => setModal(true)}> + Add New Contact Lens
        </Button>

      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ padding: 2 }}>

        {contacts.map((lens) => (
          <Grid item key={lens.contactID} minWidth={100}>
            <Card className="admin-contact-card">
  <CardActionArea onClick={() => {
    setSelectedContact(lens);
    setViewModal(true);
  }}>
    <CardMedia
      component="img"
      image="/Images/1_DAY_ACUVUE_MOIST_90_Pack.avif" 
      alt="Contact Lens"
      className="admin-contact-image"
    />
    <div className="admin-contact-details">
      <Typography variant="h6" fontFamily="Roboto">
        {lens.name}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        ${parseFloat(lens.price).toFixed(2)}
      </Typography>
    </div>
  </CardActionArea>
</Card>

          </Grid>
        ))}
      </Grid>

      {modal && (
        <AdminCreateContactModal
          toggleModal={() => setModal(false)}
          onSubmit={handleCreate}
        />
      )}

{viewModal && selectedContact && (
  <AdminEditContacts
    data={selectedContact}
    onClose={() => setViewModal(false)}
    onEdit={() => console.log("Edit", selectedContact.contactID)} 
    onDelete={handleDelete}
  />
)}

    </div>
  );
};

export default AdminContacts;
