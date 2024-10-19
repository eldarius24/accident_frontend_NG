import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

/**
 * DateHeurePicker composant qui affiche un calendrier pour choisir une date et une heure
 * @param {string} id - Identifiant unique.
 * @param {string} label - Nom du champ.
 * @param {string} defaultValue - Valeur par défaut format dayjs 'YYYY-MM-DD:HH:mm'.
 * @param {function} onChange - Fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value)).
 * @param {boolean} required - Indique si le champ est obligatoire.
 * @returns {JSX.Element}
 */
export default function DateHeurePickerQ({
    id,
    label,
    defaultValue,
    onChange,
    required = false
}) {
    const [value, setValue] = useState(defaultValue ? dayjs(defaultValue) : null);
    const [backgroundColor, setBackgroundColor] = useState('#e62a5663');

    useEffect(() => {
        setBackgroundColor(value ? '#95ad2271' : '#e62a5663');
    }, [value]);

    /**
     * Fonction qui se déclenche à chaque changement de date et d'heure.
     * Appelle la fonction onChange avec la date et l'heure formatées en 'YYYY-MM-DD:HH:mm'.
     * @param {Dayjs} newValue - La nouvelle date et heure.
     */
    const handleChange = (newValue) => {
        setValue(newValue);
        if (onChange && newValue) {
            const date = newValue.format('YYYY-MM-DD:HH:mm');
            onChange(date);
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DateTimePicker
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