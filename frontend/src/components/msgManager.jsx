import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
});

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        },
      },
    },
  },
});

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    editable: false,
  },
  {
    field: 'message',
    headerName: 'Message',
    width: 300,
    editable: false,
  },
  {
    field: 'created_at',
    headerName: 'Date',
    width: 150,
    editable: false,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleString();
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    editable: false,
  }
];

const MsgManager = (props) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/contacts');
        if (response.data && Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleRowClick = (params) => {
    const clickedRow = params.row;
    props.pass(clickedRow);
    props.bool();
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={messages}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MsgManager;
