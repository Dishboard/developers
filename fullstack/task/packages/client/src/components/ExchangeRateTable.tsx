import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_EXCHANGE_RATES } from '../graphql/queries';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, Box, Paper } from '@mui/material';
import dayjs from 'dayjs'; 

const ExchangeRateTable: React.FC = () => {
  const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);
  console.log('data', data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const rows = data.exchangeRates.map((rate: any, index: number) => ({
    id: index, 
    amount: rate.amount || 'N/A',
    code: rate.code || 'N/A',
    country: rate.country || 'N/A',
    currency: rate.currency,
    rate: rate.rate,
  }));

  const columns = [
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'currency', headerName: 'Currency', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'code', headerName: 'Code', width: 150 },
    { field: 'rate', headerName: 'Rate', width: 100 },
  ];

  const lastFetched = dayjs(data.exchangeRates[0]?.updatedAtUtc).format(
    'MMMM D, YYYY h:mm A'
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Paper
        sx={{
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            marginBottom: 2,
            padding: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <Typography variant="subtitle1" color="textSecondary">
            <strong>Last Fetched:</strong> {lastFetched}
          </Typography>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
        />
      </Paper>
    </Box>
  );
};

export default ExchangeRateTable;
