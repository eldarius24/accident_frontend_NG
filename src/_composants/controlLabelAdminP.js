import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext'; // Assurez-vous que le chemin d'importation est correct

export default function ControlLabelAdminP({ id, label, onChange, defaultValue }) {
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
                ...darkModeStyles,
                width: '50%',
                boxShadow: 3,
                margin: '10px',
            }}
            label={label}
        />
    )
};