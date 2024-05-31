// src/components/ExchangeRateTable.tsx
import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { calculateMinutesDiff } from '../../../utils/date';

interface ExchangeRateHeaderProps {
    lastUpdated: Date;
    refetch: () => void;
}

const ExchangeRateHeader: FC<ExchangeRateHeaderProps> = ({ lastUpdated, refetch }) => {
    const [minutesAgo, setMinutesAgo] = useState<number>(0);

    useEffect(() => {
        const updateMinutesAgo = () => {
            const minutes = calculateMinutesDiff(lastUpdated);
            setMinutesAgo(minutes);
        };

        updateMinutesAgo();
        const intervalId = setInterval(updateMinutesAgo, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, [lastUpdated]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>
                Last updated: {minutesAgo} minute{minutesAgo !== 1 ? 's' : ''} ago
            </p>
            <Button variant="outlined" onClick={() => refetch()}>Refresh Rates</Button>
        </Box>
    );
};

export default ExchangeRateHeader;
