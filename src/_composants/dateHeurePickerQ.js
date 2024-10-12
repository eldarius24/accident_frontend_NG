import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

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