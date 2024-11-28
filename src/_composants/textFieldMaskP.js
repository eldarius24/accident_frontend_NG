import React from 'react';
import { TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';
import { useTheme } from '../Hook/ThemeContext';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, value, mask, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask={mask ? mask : ""}
            value={value}
            onChange={onChange}
            definitions={{
                '0': /[0-9]/,
                'A': /[a-zA-Z]/,
                '#': /[a-zA-Z0-9]/
            }}
            inputRef={ref}
        />
    );
});

export default function TextFieldMaskP({ id, label, onChange, defaultValue, mask }) {
    const { darkMode } = useTheme();

    function handleChange(event) {
        if (onChange) {
            onChange(event.target.value);
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
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                label={label}
                InputProps={{
                    inputComponent: TextMaskCustom,
                    inputProps: {
                        onChange: handleChange,
                        value: defaultValue,
                        mask: mask
                    }
                }}
                sx={{
                    ...darkModeStyles,
                    width: '50%',
                    boxShadow: 3,
                }}
            />
        </div>
    );
};