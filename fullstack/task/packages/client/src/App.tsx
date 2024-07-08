import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { client } from './graphql';
import { ExchangeRates } from './components';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
});

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div style={{ height: '100vh' }}>
                    <ExchangeRates />
                </div>
            </ThemeProvider>
        </ApolloProvider>
    );
};

export default App;
