import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';

/**
 * Objet qui affiche un TextField.
 * @param {string} id - Identifiant unique.
 * @param {string} label - Nom du TextField.
 * @param {function} onChange - Fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value)).
 * @param {string} value - Valeur contrôlée du TextField.
 * @param {string} defaultValue - Valeur par défaut non contrôlée du TextField.
 * @returns {JSX.Element}
 */
const TextFieldP = forwardRef(({ id, label, onChange, value, defaultValue, ...props }, ref) => {
    /**
     * Handles the change event of the TextField.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object.
     * Logs the new value and triggers the onChange callback if provided.
     */
    const handleChange = (event) => {
        if (event && event.target) {
            const { value } = event.target;
            if (onChange) {
                onChange(value);
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                ref={ref}
                id={id}
                label={label}
                // Si value est fourni, TextField est contrôlé. Sinon, il utilise defaultValue (non contrôlé)
                {...(value !== undefined ? { value } : { defaultValue })}
                onChange={handleChange}
                sx={{ backgroundColor: '#00479871', width: '50%', boxShadow: 3 }}
                multiline
                {...props}
            />
        </div>
    );
});

export default TextFieldP;
