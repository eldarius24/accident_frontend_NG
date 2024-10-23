import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext'; // Assurez-vous que le chemin d'importation est correct

export default function TextFieldQ({
    id,
    label,
    onChange,
    value,
    defaultValue,
    required = false
}) {
    const { darkMode } = useTheme();
    const [inputValue, setInputValue] = useState(value || defaultValue || "");
    const [backgroundColor, setBackgroundColor] = useState(darkMode ? '#333333' : '#e62a5663');

    useEffect(() => {
        setBackgroundColor(inputValue
            ? (darkMode ? '#4a4a4a' : '#95ad2271')
            : (darkMode ? '#333333' : '#e62a5663')
        );
    }, [inputValue, darkMode]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                label={label}
                value={inputValue}
                onChange={handleChange}
                sx={{
                    backgroundColor,
                    width: '50%',
                    boxShadow: 3,
                    transition: 'background-color 0.3s ease',
                    '& .MuiInputLabel-root': {
                        color: darkMode ? '#ffffff' : 'inherit',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: darkMode ? '#ffffff' : 'inherit',
                    },
                    '& .MuiInputLabel-root.Mui-error': {
                        color: darkMode ? '#ff6b6b' : '#d32f2f',
                    },
                    '& .MuiInputBase-input': {
                        color: darkMode ? '#ffffff' : 'inherit',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '& .MuiFormHelperText-root': {
                        color: darkMode ? '#ff6b6b' : 'inherit',
                    },
                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#ff6b6b' : '#d32f2f',
                    },
                }}
                multiline
                required={required}
                error={required && !inputValue}
                helperText={required && !inputValue ? "Ce champ est obligatoire" : ""}
            />
        </div>
    );
}