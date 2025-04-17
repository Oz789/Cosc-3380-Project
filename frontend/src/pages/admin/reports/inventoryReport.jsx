/*
import React, { useEffect, useState } from "react";
import "./inventoryReport.css";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InventoryReport = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedItemID, setSelectedItemID] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortField, setSortField] = useState("quantity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    fetchInventoryItems();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (inventoryItems.length > 0) {
      fetchSalesData();
    }
  }, [inventoryItems, selectedItemID, selectedItemType, selectedMonth, selectedLocation]);

  const fetchInventoryItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setInventoryItems(res.data);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchSalesData = async () => {
    try {
      const allSales = [];

      for (let item of inventoryItems) {
        if (
          selectedItemID &&
          selectedItemType &&
          (item.id.toString() !== selectedItemID || item.type !== selectedItemType)
        ) {
          continue;
        }

        const params = {};
        if (selectedMonth) params.month = selectedMonth;
        if (selectedLocation) params.locationID = selectedLocation;

        const res = await axios.get(
          `http://localhost:5001/api/sales/item/${item.id}/${item.type}`,
          { params }
        );

        const salesWithDetails = res.data.map((sale) => ({
          ...sale,
          itemDetails: item,
        }));

        allSales.push(...salesWithDetails);
      }

      setSalesData(allSales);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setSalesData([]);
    }
  };

  const getItemDisplayName = (item) => {
    if (item.type === "frame") {
      return `Frame - ${item.brand} - ${item.name} - ${item.model}`;
    } else if (item.type === "contact") {
      return `Contact - ${item.brand} - ${item.name} - ${item.model}`;
    } else if (item.type === "service") {
      return `Service - ${item.name}`;
    } else {
      return item.name;
    }
  };

  const getPatientName = (sale) => {
    return sale.firstName && sale.lastName
      ? `${sale.firstName} ${sale.lastName}`
      : "Unknown Patient";
  };

  const getLocationName = (locationID) => {
    const loc = locations.find((l) => l.locationID === locationID);
    return loc ? loc.name : "Unknown";
  };

  const sortedSalesData = [...salesData].sort((a, b) => {
    const getRevenue = (sale) =>
      parseFloat(sale.unitPrice) * parseInt(sale.quantity, 10);

    let valA = sortField === "quantity" ? parseInt(a.quantity, 10) : getRevenue(a);
    let valB = sortField === "quantity" ? parseInt(b.quantity, 10) : getRevenue(b);

    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const getChartDataByLocation = () => {
    const chartMap = {};

    salesData.forEach((sale) => {
      const loc = getLocationName(sale.locationID);
      if (!chartMap[loc]) {
        chartMap[loc] = { location: loc, frame: 0, contact: 0 };
      }

      const quantity = parseInt(sale.quantity, 10);
      if (sale.itemDetails.type === "frame") {
        chartMap[loc].frame += quantity;
      } else if (sale.itemDetails.type === "contact") {
        chartMap[loc].contact += quantity;
      }
    });

    return Object.values(chartMap);
  };

  const totalRevenue = salesData.reduce((sum, sale) => {
    const unitPrice = parseFloat(sale.unitPrice);
    const quantity = parseInt(sale.quantity, 10);
    return sum + (isNaN(unitPrice) ? 0 : unitPrice * quantity);
  }, 0);

  const itemSalesSummary = {};
  salesData.forEach((sale) => {
    const key = `${sale.itemDetails.id}-${sale.itemDetails.type}`;
    if (!itemSalesSummary[key]) {
      itemSalesSummary[key] = {
        item: sale.itemDetails,
        quantity: 0,
        revenue: 0,
      };
    }
    const quantity = parseInt(sale.quantity, 10);
    const unitPrice = parseFloat(sale.unitPrice);
    itemSalesSummary[key].quantity += quantity;
    itemSalesSummary[key].revenue += unitPrice * quantity;
  });

  const summaryArray = Object.values(itemSalesSummary);

  const mostPurchasedItem = summaryArray
    .filter((item) => item.item.type === "frame" || item.item.type === "contact")
    .reduce((max, item) => (item.quantity > max.quantity ? item : max), { quantity: 0 });

  const leastPurchasedItem = summaryArray
    .filter(
      (item) =>
        (item.item.type === "frame" || item.item.type === "contact") &&
        item.quantity > 0
    )
    .reduce((min, item) => (item.quantity < min.quantity ? item : min), { quantity: Infinity });

  const mostPurchasedService = summaryArray
    .filter((item) => item.item.type === "service")
    .reduce((max, item) => (item.quantity > max.quantity ? item : max), { quantity: 0 });

  const topRevenueItem = summaryArray.reduce(
    (max, item) => (item.revenue > max.revenue ? item : max),
    { revenue: 0 }
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <Select
              value={selectedItemID && selectedItemType ? `${selectedItemID}-${selectedItemType}` : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setSelectedItemID("");
                  setSelectedItemType("");
                } else {
                  const [id, type] = val.split("-");
                  setSelectedItemID(id);
                  setSelectedItemType(type);
                }
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Items</em>
              </MenuItem>
              {inventoryItems.map((item) => (
                <MenuItem key={`${item.id}-${item.type}`} value={`${item.id}-${item.type}`}>
                  {getItemDisplayName(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Months</em>
              </MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Locations</em>
              </MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc.locationID} value={loc.locationID}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              displayEmpty
            >
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="revenue">Revenue</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              displayEmpty
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setShowChart(!showChart)}
            sx={{ height: "100%" }}
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Most Purchased (Frame/Contact):</strong><br />
            {mostPurchasedItem.item
              ? `${getItemDisplayName(mostPurchasedItem.item)} (${mostPurchasedItem.quantity} sold)`
              : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Least Purchased (Frame/Contact):</strong><br />
            {leastPurchasedItem.item
              ? `${getItemDisplayName(leastPurchasedItem.item)} (${leastPurchasedItem.quantity} sold)`
              : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Most Purchased (Service):</strong><br />
            {mostPurchasedService.item
              ? `${getItemDisplayName(mostPurchasedService.item)} (${mostPurchasedService.quantity} sold)`
              : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Top Revenue Item:</strong><br />
            {topRevenueItem.item
              ? `${getItemDisplayName(topRevenueItem.item)} ($${topRevenueItem.revenue.toFixed(2)})`
              : "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Total Revenue: ${totalRevenue.toFixed(2)}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sale ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSalesData.map((sale) => (
              <TableRow key={sale.saleItemID}>
                <TableCell>{sale.saleID}</TableCell>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>{getPatientName(sale)}</TableCell>
                <TableCell>{getItemDisplayName(sale.itemDetails)}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${parseFloat(sale.unitPrice).toFixed(2)}</TableCell>
                <TableCell>
                  ${(parseFloat(sale.unitPrice) * parseInt(sale.quantity, 10)).toFixed(2)}
                </TableCell>
                <TableCell>{getLocationName(sale.locationID)}</TableCell>
              </TableRow>
            ))}
            {sortedSalesData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No sales data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {showChart && (
  <>
    <Typography variant="h6" sx={{ mt: 4 }}>
      Frame vs Contact Sales by Location
    </Typography>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={getChartDataByLocation()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="frame" fill="#4f98ca" name="Frame Sales" />
        <Bar dataKey="contact" fill="#82ca9d" name="Contact Sales" />
      </BarChart>
    </ResponsiveContainer>
  </>
)}

    </Box>
  );
};

export default InventoryReport;
*/
import React, { useEffect, useState } from "react";
import "./inventoryReport.css";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InventoryReport = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedItemID, setSelectedItemID] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortField, setSortField] = useState("quantity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showChart, setShowChart] = useState(true);
  const [itemCategoryFilter, setItemCategoryFilter] = useState("");

  useEffect(() => {
    fetchInventoryItems();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (inventoryItems.length > 0) {
      fetchSalesData();
    }
  }, [inventoryItems, selectedItemID, selectedItemType, selectedMonth, selectedLocation]);

  const fetchInventoryItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setInventoryItems(res.data);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchSalesData = async () => {
    try {
      const allSales = [];

      for (let item of inventoryItems) {
        if (
          selectedItemID &&
          selectedItemType &&
          (item.id.toString() !== selectedItemID || item.type !== selectedItemType)
        ) {
          continue;
        }

        const params = {};
        if (selectedMonth) params.month = selectedMonth;
        if (selectedLocation) params.locationID = selectedLocation;

        const res = await axios.get(
          `http://localhost:5001/api/sales/item/${item.id}/${item.type}`,
          { params }
        );

        const salesWithDetails = res.data.map((sale) => ({
          ...sale,
          itemDetails: item,
        }));

        allSales.push(...salesWithDetails);
      }

      setSalesData(allSales);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setSalesData([]);
    }
  };

  const getItemDisplayName = (item) => {
    if (item.type === "frame") {
      return `Frame - ${item.brand} - ${item.name} - ${item.model}`;
    } else if (item.type === "contact") {
      return `Contact - ${item.brand} - ${item.name} - ${item.model}`;
    } else if (item.type === "service") {
      return `Service - ${item.name}`;
    } else {
      return item.name;
    }
  };

  const getPatientName = (sale) => {
    return sale.firstName && sale.lastName
      ? `${sale.firstName} ${sale.lastName}`
      : "Unknown Patient";
  };

  const getLocationName = (locationID) => {
    const loc = locations.find((l) => l.locationID === locationID);
    return loc ? loc.name : "Unknown";
  };

  const sortedSalesData = [...salesData].sort((a, b) => {
    const getRevenue = (sale) =>
      parseFloat(sale.unitPrice) * parseInt(sale.quantity, 10);

    let valA = sortField === "quantity" ? parseInt(a.quantity, 10) : getRevenue(a);
    let valB = sortField === "quantity" ? parseInt(b.quantity, 10) : getRevenue(b);

    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const getChartDataByLocation = () => {
    const chartMap = {};

    salesData.forEach((sale) => {
      const loc = getLocationName(sale.locationID);
      if (!chartMap[loc]) {
        chartMap[loc] = { location: loc, frame: 0, contact: 0 };
      }

      const quantity = parseInt(sale.quantity, 10);
      if (sale.itemDetails.type === "frame") {
        chartMap[loc].frame += quantity;
      } else if (sale.itemDetails.type === "contact") {
        chartMap[loc].contact += quantity;
      }
    });

    return Object.values(chartMap);
  };

  const totalRevenue = salesData.reduce((sum, sale) => {
    const unitPrice = parseFloat(sale.unitPrice);
    const quantity = parseInt(sale.quantity, 10);
    return sum + (isNaN(unitPrice) ? 0 : unitPrice * quantity);
  }, 0);

  const itemSalesSummary = {};
  salesData.forEach((sale) => {
    const key = `${sale.itemDetails.id}-${sale.itemDetails.type}`;
    if (!itemSalesSummary[key]) {
      itemSalesSummary[key] = {
        item: sale.itemDetails,
        quantity: 0,
        revenue: 0,
      };
    }
    const quantity = parseInt(sale.quantity, 10);
    const unitPrice = parseFloat(sale.unitPrice);
    itemSalesSummary[key].quantity += quantity;
    itemSalesSummary[key].revenue += unitPrice * quantity;
  });

  const summaryArray = Object.values(itemSalesSummary);

  const mostPurchasedItem = summaryArray
    .filter((item) => item.item.type === "frame" || item.item.type === "contact")
    .reduce((max, item) => (item.quantity > max.quantity ? item : max), { quantity: 0 });

  const leastPurchasedItem = summaryArray
    .filter(
      (item) =>
        (item.item.type === "frame" || item.item.type === "contact") &&
        item.quantity > 0
    )
    .reduce((min, item) => (item.quantity < min.quantity ? item : min), { quantity: Infinity });

  const mostPurchasedService = summaryArray
    .filter((item) => item.item.type === "service")
    .reduce((max, item) => (item.quantity > max.quantity ? item : max), { quantity: 0 });

  const topRevenueItem = summaryArray.reduce(
    (max, item) => (item.revenue > max.revenue ? item : max),
    { revenue: 0 }
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={itemCategoryFilter}
              onChange={(e) => {
                setItemCategoryFilter(e.target.value);
                setSelectedItemID("");
                setSelectedItemType("");
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              <MenuItem value="frame">Frames</MenuItem>
              <MenuItem value="contact">Contacts</MenuItem>
              <MenuItem value="service">Services</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <Select
              value={selectedItemID && selectedItemType ? `${selectedItemID}-${selectedItemType}` : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setSelectedItemID("");
                  setSelectedItemType("");
                } else {
                  const [id, type] = val.split("-");
                  setSelectedItemID(id);
                  setSelectedItemType(type);
                }
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Items</em>
              </MenuItem>
              {inventoryItems
                .filter((item) => !itemCategoryFilter || item.type === itemCategoryFilter)
                .map((item) => (
                  <MenuItem key={`${item.id}-${item.type}`} value={`${item.id}-${item.type}`}>
                    {getItemDisplayName(item)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Months</em>
              </MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>All Locations</em>
              </MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc.locationID} value={loc.locationID}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              displayEmpty
            >
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="revenue">Revenue</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setShowChart(!showChart)}
            sx={{ height: "100%" }}
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Most Purchased (Frame/Contact):</strong><br />
            {mostPurchasedItem.item
              ? `${getItemDisplayName(mostPurchasedItem.item)} (${mostPurchasedItem.quantity} sold)`
              : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Least Purchased (Frame/Contact):</strong><br />
            {leastPurchasedItem.item
              ? `${getItemDisplayName(leastPurchasedItem.item)} (${leastPurchasedItem.quantity} sold)`
              : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Most Purchased (Service):</strong><br />
            {mostPurchasedService.item
              ? `${getItemDisplayName(mostPurchasedService.item)} (${mostPurchasedService.quantity} sold)`
              : "N/A"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1">
            <strong>Top Revenue Item:</strong><br />
            {topRevenueItem.item
              ? `${getItemDisplayName(topRevenueItem.item)} ($${topRevenueItem.revenue.toFixed(2)})`
              : "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Total Revenue: ${totalRevenue.toFixed(2)}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sale ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSalesData.map((sale) => (
              <TableRow key={sale.saleItemID}>
                <TableCell>{sale.saleID}</TableCell>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>{getPatientName(sale)}</TableCell>
                <TableCell>{getItemDisplayName(sale.itemDetails)}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${parseFloat(sale.unitPrice).toFixed(2)}</TableCell>
                <TableCell>
                  ${(parseFloat(sale.unitPrice) * parseInt(sale.quantity, 10)).toFixed(2)}
                </TableCell>
                <TableCell>{getLocationName(sale.locationID)}</TableCell>
              </TableRow>
            ))}
            {sortedSalesData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No sales data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showChart && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Frame vs Contact Sales by Location
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartDataByLocation()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frame" fill="#4f98ca" name="Frame Sales" />
              <Bar dataKey="contact" fill="#82ca9d" name="Contact Sales" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Box>
  );
};

export default InventoryReport;
