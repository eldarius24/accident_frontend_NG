import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useTheme } from '../Hook/ThemeContext';

dayjs.locale('fr');

export default function DateHeurePickerP({id, label, defaultValue, onChange}) {
    const { darkMode } = useTheme();

    const handleChange = (event, _) => {
        if (onChange) {
            const date = dayjs(event).format('YYYY-MM-DD:HH:mm');
            onChange(date);
        }
    }

    const darkModeStyles = {
        backgroundColor: darkMode ? '#333333' : '#00479871',
        '& .MuiInputLabel-root': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
        '& .MuiInputBase-input': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
        },
        '& .MuiSvgIcon-root': {
            color: darkMode ? '#ffffff' : 'inherit',
        },
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DateTimePicker
                    id={id}
                    label={label}
                    sx={{ 
                        ...darkModeStyles, 
                        width: '50%', 
                        boxShadow: 3, 
                        margin: '0 auto 1rem' 
                    }}
                    defaultValue={defaultValue ? dayjs(defaultValue) : null}
                    onChange={handleChange}
                    slotProps={{
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
                                '& .MuiClock-pin': {
                                    backgroundColor: darkMode ? '#95ad22' : '#1976d2',
                                },
                                '& .MuiClockPointer-root': {
                                    backgroundColor: darkMode ? '#95ad22' : '#1976d2',
                                },
                                '& .MuiClockPointer-thumb': {
                                    border: `16px solid ${darkMode ? '#95ad22' : '#1976d2'}`,
                                },
                            },
                        },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
};