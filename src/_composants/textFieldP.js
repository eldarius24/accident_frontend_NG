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
    const handleChange = (event) => {
        // Vérifiez que l'événement et son cible sont définis
        if (event && event.target) {
            const { value } = event.target; // Obtenez la valeur de l'élément cible
            console.log('Event target value:', value); // Log pour débogage
            if (onChange) {
                onChange(value); // Appeler onChange avec la valeur
            } else {
                console.error('onChange is not a function or is undefined');
            }
        } else {
            console.error('Event or event.target is undefined');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                ref={ref} // Utilisez ref pour passer la référence à l'élément
                id={id}
                label={label}
                value={value !== undefined ? value : ''}  // Utiliser "value" si contrôlé
                defaultValue={defaultValue}  // Utiliser "defaultValue" si non contrôlé
                onChange={handleChange}  // Appeler la fonction handleChange sur les changements
                sx={{ backgroundColor: '#00479871', width: '50%', boxShadow: 3 }}
                multiline
                {...props}
            />
        </div>
    );
});

export default TextFieldP;
