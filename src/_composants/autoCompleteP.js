import React from 'react';
import { Autocomplete, TextField, Paper, Typography } from '@mui/material';
import { useTheme } from '../Hook/ThemeContext';
import listeaddaction from '../liste/listeaddaction.json';

export default function AutoCompleteP({
    id,
    option,
    label,
    onChange,
    defaultValue,
    sx = { width: '50%', boxShadow: 3, margin: '0 auto 1rem' }
}) {
    const { darkMode } = useTheme();
    
    const handleChange = (_, value) => {
        if (onChange) {
            onChange(value);
        }
    };

    const darkModeStyles = {
        backgroundColor: darkMode ? '#333333' : '#00479871',
        '& .MuiInputLabel-root': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
        '& .MuiInputBase-input': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
        },
        '& .MuiSvgIcon-root': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
    };

    return (
        <div className={id}>
            <Autocomplete
                disablePortal
                id={id}
                options={option}
                value={defaultValue}
                sx={{ ...sx, ...darkModeStyles }}
                onChange={handleChange}
                renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                    <li key={key} {...otherProps}>
                        <Typography style={{ 
                            color: id === 'priority' ? listeaddaction.priority[option] : 'inherit'
                        }}>
                            {option}
                        </Typography>
                    </li>
                    );
                }}
                renderInput={(params) => <TextField {...params} label={label} />}
                fullWidth={true}
                PaperComponent={(props) => (
                    <Paper
                        {...props}
                        sx={{
                            backgroundColor: darkMode ? '#4a4a4a' : '#bed7f6',
                            color: darkMode ? '#ffffff' : 'inherit',
                        }}
                    />
                )}
            />
        </div>
    );
}