import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

/**
 * Date Picker composant qui affiche un calendrier pour choisir une date
 * @param {string} id - identifiant du composant
 * @param {string} label - texte à afficher
 * @param {string} defaultValue - Valeur par défaut format dayjs '2021-10-10'
 * @param {function} onChange - Fonction appelée lors du changement de date
 * @param {boolean} required - Indique si le champ est obligatoire
 * @returns {JSX.Element}
 */
export default function datePickerQ({ id, label, defaultValue, onChange, required = false }) {
    const [value, setValue] = useState(defaultValue ? dayjs(defaultValue) : null);
    const [backgroundColor, setBackgroundColor] = useState('#e62a5663');

    useEffect(() => {
        setBackgroundColor(value ? '#95ad2271' : '#e62a5663');
    }, [value]);

/**
 * Handles the change of the date value.
 * Updates the state with the new date value, and if the onChange function is provided,
 * formats the new date to 'YYYY-MM-DD' and calls onChange with the formatted date.
 *
 * @param {Dayjs} newValue - The new date value.
 */
    const handleChange = (newValue) => {
        setValue(newValue);
        if (onChange && newValue) {
            const date = newValue.format('YYYY-MM-DD');
            onChange(date);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DatePicker
                    id={id}
                    label={label}
                    value={value}
                    onChange={handleChange}
                    sx={{ 
                        backgroundColor: backgroundColor, 
                        width: '50%', 
                        boxShadow: 3, 
                        margin: '0 auto 1rem',
                        transition: 'background-color 0.3s ease',
                    }}
                    slotProps={{
                        textField: {
                            required: required,
                            error: required && !value,
                            helperText: required && !value ? "Ce champ est obligatoire" : "",
                        },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
}