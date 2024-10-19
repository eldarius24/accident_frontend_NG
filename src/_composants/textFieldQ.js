import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

/**
 * Affiche un champ de texte avec un label, un ID et une valeur.
 * Si onchange est défini, alors il s'agit d'un champ de texte qui appelle
 * la fonction onchange à chaque changement de valeur.
 * Si defaultValue est défini, alors c'est la valeur par défaut.
 * Si required est true, alors le champ est obligatoire.
 * @param {string} id - Identifiant unique.
 * @param {string} label - Nom du champ.
 * @param {function} onChange - Fonction qui se déclenche à chaque changement de valeur.
 * @param {string} value - Valeur du champ.
 * @param {string} defaultValue - Valeur par défaut.
 * @param {boolean} required - Si true, alors le champ est obligatoire.
 * @returns {JSX.Element}
 */
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

    /**
     * Handles the change event of the TextField component.
     * Updates the state with the new value, and if the onChange function is provided,
     * calls onChange with the new value.
     * @param {object} event - The event object.
     * @returns {undefined}
     */
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
