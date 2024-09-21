import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';


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

/**
 * objet qui affiche un TextField
 * @param {string} id identifiant unique
 * @param {string} label nom du TextField
 * @param {fonction} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @param {string} defaultValue valeur par défaut
 * @param {string} mask masque de saisie (ex: mask="AA00-0000-0000-0000-0000") où A = lettre et 0 = chiffre et # = lettre ou chiffre
 */
export default function TextFieldMaskP({ id, label, onChange, defaultValue, mask }) {

    function handleChange(event) {
        if (onChange) {
            onChange(event.target.value);
        }
    }

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
                sx={{ backgroundColor: '#00479871', width: '50%', boxShadow: 3 }}
            />
        </div>
    );
};