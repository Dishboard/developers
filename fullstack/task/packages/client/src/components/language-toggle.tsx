import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface LanguageToggleProps {
    language: 'EN' | 'CZ';
    onLanguageChange: (newLanguage: 'EN' | 'CZ') => void;
    disabled?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
    language,
    onLanguageChange,
    disabled,
}) => {
    const handleLanguageChange = (
        event: React.MouseEvent<HTMLElement>,
        newLanguage: 'EN' | 'CZ' | null
    ) => {
        if (newLanguage !== null) {
            onLanguageChange(newLanguage);
        }
    };

    return (
        <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleLanguageChange}
            aria-label="language"
            disabled={disabled}
        >
            <ToggleButton value="EN" aria-label="English">
                EN
            </ToggleButton>
            <ToggleButton value="CZ" aria-label="Czech">
                CZ
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
