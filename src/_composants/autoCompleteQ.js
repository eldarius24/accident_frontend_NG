import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Paper } from '@mui/material';

export default function AutoCompleteQ({
    id,
    option,
    label,
    onChange,
    defaultValue,
    required = false,
    sx = { width: '50%', boxShadow: 3, margin: '0 auto 1rem' }
}) {
    const [value, setValue] = useState(defaultValue || null);
    const [backgroundColor, setBackgroundColor] = useState('#e62a5663');

    useEffect(() => {
        setBackgroundColor(value ? '#95ad2271' : '#e62a5663');
    }, [value]);

/*************  ✨ Codeium Command 🌟  *************/
    /**
     * Handles the change of the Autocomplete.
     * Updates the state with the new value, and if the onChange function is provided,
     * calls onChange with the new value.
     * @param {object} _ - The event object (not used).
     * @param {string} newValue - The new value of the Autocomplete.
     */
    const handleChange = (_, newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };
/******  ef5d534b-3bfe-445f-a725-b814e235ed90  *******/

    return (
        <div className={id}>
            <Autocomplete
                disablePortal
                id={id}
                options={option}
                value={value}
                isOptionEqualToValue={(option, value) => option === value} // comparaison directe pour les chaînes
                sx={{
                    ...sx,
                    backgroundColor,
                    transition: 'background-color 0.3s ease',
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
                    />
                )}
                fullWidth={true}
                PaperComponent={(props) => (
                    <Paper {...props} sx={{ backgroundColor: '#bed7f6' }} />
                )}
            />

        </div>
    );
}