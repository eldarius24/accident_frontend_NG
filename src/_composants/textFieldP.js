import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const TextFieldP = forwardRef(({ id, label, onChange, value, defaultValue, ...props }, ref) => {
    const { darkMode } = useTheme();

    const handleChange = (event) => {
        if (event && event.target) {
            const { value } = event.target;
            if (onChange) {
                onChange(value);
            }
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
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                ref={ref}
                id={id}
                label={label}
                {...(value !== undefined ? { value } : { defaultValue })}
                onChange={handleChange}
                sx={{
                    ...darkModeStyles,
                    width: '50%',
                    boxShadow: 3,
                }}
                multiline
                {...props}
            />
        </div>
    );
});

export default TextFieldP;