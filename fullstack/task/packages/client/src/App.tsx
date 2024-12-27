import React from 'react';
import ExchangeRatesTable from './components/ExchangeRatesTable';
import {
  Container,
  Typography,
} from '@mui/material';

const App: React.FC = () => {
  return (
    <Container >
        <Typography variant="h3" gutterBottom sx={{ml: 3}}>
        Exchange Rates
          </Typography>
      <ExchangeRatesTable />
    </Container>
  );
};

export default App;
