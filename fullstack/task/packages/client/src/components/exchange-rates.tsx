import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExchangeRatesData, ExchangeRatesVars } from '../types';
import { EXCHANGE_RATES_QUERY } from '../graphql';
import { usePagination } from '../hooks';
import { ExchangeRatesTable } from './exchange-rates-table';
import { DataFetchRow } from './data-fetch-row';
import { ExchangeRatesTableSkeleton } from './exchange-rates-table.skeleton';

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

            <DataFetchRow
                loading={loading}
                data={data}
                handleRefetch={handleRefetch}
                handleLanguageChange={handleLanguageChange}
                language={language}
            />

            {!data || loading ? (
                <ExchangeRatesTableSkeleton rows={rowsPerPage} />
            ) : (
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
