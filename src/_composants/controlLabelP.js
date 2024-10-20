import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext'; // Assurez-vous que le chemin d'importation est correct

export default function ControlLabelP({ 
    id, 
    label, 
    onChange, 
    defaultValue, 
    sx = { width: '50%', boxShadow: 3, margin: '0 auto 1rem' } 
}) {
    const { darkMode } = useTheme();

    const handleChange = (_, value) => {
        console.log('checkBox change to "', value, '"');
        if (onChange) {
            onChange(value);
        }
    }

    const darkModeStyles = {
        backgroundColor: darkMode ? '#333333' : '#00479871',
        color: darkMode ? '#ffffff' : 'inherit',
        '& .MuiCheckbox-root': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
        '& .MuiCheckbox-root.Mui-checked': {
            color: darkMode ? '#95ad22' : '#1976d2',
        },
    };

    return (
        <FormControlLabel
            id={id}
            control={
                <Checkbox
                    checked={defaultValue}
                    onChange={handleChange}
                />
            }
            sx={{
                ...sx,
                ...darkModeStyles,
            }}
            label={label}
        />
    )
};