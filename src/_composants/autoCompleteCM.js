import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Paper, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MultipleAutoComplete({
    id,
    option = [],
    label,
    onChange,
    defaultValue,
    required = false,
    sx = { width: '50%', boxShadow: 3, margin: '0 auto 1rem' }
}) {
    const { darkMode } = useTheme();
    
    // S'assurer que defaultValue est toujours un tableau
    const initialValue = Array.isArray(defaultValue) ? defaultValue : 
                        defaultValue ? [defaultValue] : 
                        [];
    
    const [value, setValue] = useState(initialValue);
    const [backgroundColor, setBackgroundColor] = useState(darkMode ? '#333333' : '#e62a5663');
    const [touched, setTouched] = useState(false);

    // S'assurer que les options sont toujours un tableau
    const safeOptions = Array.isArray(option) ? option : [];

    useEffect(() => {
        setBackgroundColor(value.length > 0
            ? (darkMode ? '#4a4a4a' : '#95ad2271')
            : (darkMode ? '#333333' : '#e62a5663')
        );
    }, [value, darkMode]);

    useEffect(() => {
        // Mise à jour sécurisée de la valeur quand defaultValue change
        const newValue = Array.isArray(defaultValue) ? defaultValue :
                        defaultValue ? [defaultValue] :
                        [];
        setValue(newValue);
    }, [defaultValue]);

    const handleChange = (_, newValue) => {
        // S'assurer que newValue est toujours un tableau
        const safeNewValue = Array.isArray(newValue) ? newValue : [];
        setValue(safeNewValue);
        setTouched(true);
        if (onChange) {
            onChange(safeNewValue);
        }
    };

    // Déterminer si le champ est invalide
    const isInvalid = required && touched && value.length === 0;

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            id={id}
            options={safeOptions}
            value={value}
            getOptionLabel={(option) => {
                if (option === null || option === undefined) return '';
                return option.toString();
            }}
            isOptionEqualToValue={(option, value) => {
                if (option === null || value === null) return false;
                return option === value;
            }}
            sx={{
                ...sx,
                backgroundColor,
                transition: 'background-color 0.3s ease',
                '& .MuiInputLabel-root': {
                    color: darkMode ? '#ffffff' : 'inherit',
                },
                '& .MuiInputBase-input': {
                    color: darkMode ? '#ffffff' : 'inherit',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
                },
            }}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            renderOption={(props, option, { selected }) => {
                const { key, ...otherProps } = props;
                return (
                    <li key={option?.toString()} {...otherProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    error={isInvalid}
                    helperText={isInvalid ? "Ce champ est obligatoire" : ""}
                    inputProps={{
                        ...params.inputProps,
                        required: false, // Désactive la validation HTML5 native
                    }}
                />
            )}
            PaperComponent={(props) => (
                <Paper {...props} sx={{
                    backgroundColor: darkMode ? '#4a4a4a' : '#bed7f6',
                    color: darkMode ? '#ffffff' : 'inherit',
                }} />
            )}
        />
    );
}