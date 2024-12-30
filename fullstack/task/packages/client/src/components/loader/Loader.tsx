// eslint-disable-next-line import/no-extraneous-dependencies
import { CircularProgress } from '@mui/material';

export const Loader = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress />
        </div>
    );
};
