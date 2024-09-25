import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { PropsWithChildren } from 'react';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export const Error: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{children || 'Unknown error occured'}</AlertDescription>
        </Alert>
    );
};
