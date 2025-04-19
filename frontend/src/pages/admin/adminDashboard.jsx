import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Grid container spacing={3} padding={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Admin Dashboard</Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Manage Staff</Typography>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              Go to Staff Management
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Manage Frames</Typography>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Manage Contacts</Typography>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              View Contact Submissions
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Manage Services</Typography>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              Edit Services
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Reports</Typography>
            <Button 
              component={Link}
              to="/admin/reports"
              variant="outlined" 
              fullWidth 
              sx={{ mt: 1 }}
            >
              Generate/View Reports
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
