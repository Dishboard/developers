import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { ExchangeRatesData, ExchangeRatesVars } from '../types';
import { EXCHANGE_RATES_QUERY } from '../graphql';
import { usePagination } from '../hooks';
import { LanguageToggle } from './language-toggle';
import { ExchangeRatesTable } from './exchange-rates-table';

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export const ExchangeRates: React.FC = () => {
    const [language, setLanguage] = useState<'EN' | 'CZ'>('EN');
    const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
    const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination();

    const { loading, error, data, refetch } = useQuery<ExchangeRatesData, ExchangeRatesVars>(
        EXCHANGE_RATES_QUERY,
        {
            variables: { language },
            notifyOnNetworkStatusChange: true,
        }
    );

    const handleLanguageChange = (newLanguage: 'EN' | 'CZ') => {
        setLanguage(newLanguage);
    };

    const handleRefetch = useCallback(() => {
        refetch({ language });
    }, [refetch, language]);

    useEffect(() => {
        if (data && data.exchangeRates.timestamp !== lastTimestamp) {
            setLastTimestamp(data.exchangeRates.timestamp);
        }
    }, [data, lastTimestamp]);

    if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
    }

    return (
        <MainBox>
            <Typography variant="h4" gutterBottom>
                Exchange Rates
            </Typography>

            {data && (
                <Typography color="gray" variant="subtitle1" sx={{ mt: 2 }}>
                    Last updated: {format(new Date(data.exchangeRates.timestamp), 'PPpp')}
                </Typography>
            )}

            <Grid container>
                <Grid item xs={12} sm={6}>
                    {import.meta.env.VITE_MULTIPLE_LANGUAGE_SUPPORT && (
                        <LanguageToggle
                            language={language}
                            onLanguageChange={handleLanguageChange}
                        />
                    )}
                </Grid>

                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                    <StyledButton variant="contained" onClick={handleRefetch} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Refetch'}
                    </StyledButton>
                </Grid>
            </Grid>

            {data && (
                <ExchangeRatesTable
                    rates={data.exchangeRates.rates}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            )}
        </MainBox>
    );
};

const MainBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 1000,
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing(2),
}));
