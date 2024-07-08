import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import { ExchangeRatesData, languages } from '../types';
import { LanguageToggle } from './language-toggle';

type FetchInfoProps = {
    data: ExchangeRatesData | undefined;
    loading: boolean;
    handleLanguageChange: (newLanguage: 'EN' | 'CZ') => void;
    handleRefetch: () => void;
    language: typeof languages[number];
};

export const DataFetchRow = ({
    data,
    handleRefetch,
    handleLanguageChange,
    loading,
    language,
}: FetchInfoProps) => (
    <Grid container>
        <Grid alignContent="center" item xs={6} sm={6}>
            {data && (
                <Typography color="gray" variant="subtitle1" sx={{ mt: 2 }}>
                    Last updated: {format(new Date(data.exchangeRates.timestamp), 'PPpp')}
                </Typography>
            )}
        </Grid>

        <Grid item xs={6} sm={6} sx={{ textAlign: 'right' }}>
            <Grid gap="10px" container direction="column" alignContent="end">
                <StyledButton variant="contained" onClick={handleRefetch} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Refetch'}
                </StyledButton>
                {!import.meta.env.VITE_MULTIPLE_LANGUAGE_SUPPORT && (
                    <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />
                )}
            </Grid>
        </Grid>
    </Grid>
);

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    width: '80px',
}));
