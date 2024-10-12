import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export default function textFieldQ({ 
    id, 
    label, 
    onChange, 
    value, 
    defaultValue,
    required = false
}) {
    const [inputValue, setInputValue] = useState(value || defaultValue || "");
    const [backgroundColor, setBackgroundColor] = useState('#e62a5663');

    useEffect(() => {
        setBackgroundColor(inputValue ? '#95ad2271' : '#e62a5663');
    }, [inputValue]);

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
                    transition: 'background-color 0.3s ease' 
                }}
                multiline
                required={required}
                error={required && !inputValue}
                helperText={required && !inputValue ? "Ce champ est obligatoire" : ""}
            />
        </div>
    );
}
