import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Paper } from '@mui/material';

/**
 * A Material-UI Autocomplete component that handles the background color
 * depending on the value and provides a Paper component with a light blue
 * background color.
 *
 * @param {string} id - The id of the component.
 * @param {array} option - The options of the Autocomplete component.
 * @param {string} label - The label of the Autocomplete component.
 * @param {function} onChange - The function called when the value changes.
 * @param {any} defaultValue - The default value of the Autocomplete component.
 * @param {boolean} required - If the field is required.
 * @param {object} sx - The style object for the Autocomplete component.
 * @returns {JSX.Element}
 */
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

    /**
     * Handles the change of the Autocomplete component.
     * @param {object} _ - The event object (not used).
     * @param {any} newValue - The new value of the Autocomplete component.
     * @returns {undefined}
     */
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