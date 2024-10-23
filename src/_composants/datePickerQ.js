import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useTheme } from '../pageAdmin/user/ThemeContext'; // Assurez-vous que le chemin d'importation est correct

dayjs.locale('fr');

export default function DatePickerQ({ id, label, defaultValue, onChange, required = false }) {
    const { darkMode } = useTheme();
    const [value, setValue] = useState(defaultValue ? dayjs(defaultValue) : null);
    const [backgroundColor, setBackgroundColor] = useState(darkMode ? '#333333' : '#e62a5663');

    useEffect(() => {
        setBackgroundColor(value
            ? (darkMode ? '#4a4a4a' : '#95ad2271')
            : (darkMode ? '#333333' : '#e62a5663')
        );
    }, [value, darkMode]);

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
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#ffffff' : 'inherit',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#ffffff' : 'inherit',
                        },
                        '& .MuiInputLabel-root.Mui-error': {
                            color: darkMode ? '#ff6b6b' : '#d32f2f',
                        },
                        '& .MuiInputBase-input': {
                            color: darkMode ? '#ffffff' : 'inherit',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
                        },
                        '& .MuiFormHelperText-root': {
                            color: darkMode ? '#ff6b6b' : 'inherit',
                        },
                        '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                            borderColor: darkMode ? '#ff6b6b' : '#d32f2f',
                        },
                    }}
                    slotProps={{
                        textField: {
                            required: required,
                            error: required && !value,
                            helperText: required && !value ? "Ce champ est obligatoire" : "",
                        },
                        popper: {
                            sx: {
                                '& .MuiPaper-root': {
                                    backgroundColor: darkMode ? '#333333' : '#ffffff',
                                    color: darkMode ? '#ffffff' : 'inherit',
                                },
                                '& .MuiPickersDay-root': {
                                    color: darkMode ? '#ffffff' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#4a4a4a' : '#e6e6e6',
                                    },
                                },
                                '& .Mui-selected': {
                                    backgroundColor: darkMode ? '#95ad22' : '#1976d2',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7c9118' : '#1565c0',
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
}