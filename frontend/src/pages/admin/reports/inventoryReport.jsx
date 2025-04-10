import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import "./inventoryReport.css";

const InventoryReport = () => {
  const [inventory, setInventory] = useState([]);
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const filtered = inventory.filter((item) => {
    const inType = type ? item.type === type : true;
    const inBrand = brand ? item.brand === brand : true;
    const inPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    return inType && inBrand && inPrice;
  });

  const uniqueBrands = [...new Set(inventory.map((item) => item.brand))];

  return (
    <Box className="inventory-container">
      <Typography variant="h4" gutterBottom fontFamily={"Serif"} fontWeight={"Bold"}>
        Inventory Report
      </Typography>
      <Grid container spacing={2} marginBottom={1}>
        <Grid item xs={10} sm={3}>
          <FormControl fullWidth >
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
              <MenuItem value="" fontFamily={""}>All</MenuItem>
              <MenuItem value="Frame">Frame</MenuItem>
              <MenuItem value="Contact">Contact</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3 }>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select value={brand} onChange={(e) => setBrand(e.target.value)} label="Brand">
              <MenuItem value="">All</MenuItem>
              {uniqueBrands.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography gutterBottom>Price Range (${priceRange[0]} - ${priceRange[1]})</Typography>
          <Slider className="custom-slider" value={priceRange}
         onChange={(e, newVal) => setPriceRange(newVal)}
        min={0} max={1000}
/>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" fontFamily={"Serif"}>Total Items Displayed: {filtered.length}</Typography>
       
      </Box>

      <TableContainer component={Paper} className="inventory-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Brand</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Model</b></TableCell>
              <TableCell><b>Material / Vision</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>In Stock</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.itemID}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>{item.type === 'Frame' ? item.material : item.visionType}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>{item.stockCount}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

     
    </Box>
  );
};

export default InventoryReport;

