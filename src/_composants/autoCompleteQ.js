import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Paper } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext'; // Assurez-vous que le chemin d'importation est correct

export default function AutoCompleteQ({
    id,
    option,
    label,
    onChange,
    defaultValue,
    required = false,
    sx = { width: '50%', boxShadow: 3, margin: '0 auto 1rem' }
}) {
    const { darkMode } = useTheme();
    const [value, setValue] = useState(defaultValue || null);
    const [backgroundColor, setBackgroundColor] = useState(darkMode ? '#333333' : '#e62a5663');

    useEffect(() => {
        setBackgroundColor(value
            ? (darkMode ? '#4a4a4a' : '#95ad2271')
            : (darkMode ? '#333333' : '#e62a5663')
        );
    }, [value, darkMode]);

    const handleChange = (_, newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className={id}>
            <Autocomplete
                disablePortal
                id={id}
                options={option}
                value={value}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{
                    ...sx,
                    backgroundColor,
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
                onChange={handleChange}
                renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return <li key={key} {...otherProps}>{option}</li>;
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        required={required}
                        error={required && !value}
                        helperText={required && !value ? "Ce champ est obligatoire" : ""}
                        inputProps={{
                            ...params.inputProps,
                            required: false,
                        }}
                    />
                )}
                fullWidth={true}
                PaperComponent={(props) => (
                    <Paper {...props} sx={{
                        backgroundColor: darkMode ? '#4a4a4a' : '#bed7f6',
                        color: darkMode ? '#ffffff' : 'inherit',
                    }} />
                )}
            />
        </div>
    );
}