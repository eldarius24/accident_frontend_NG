import { TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';
import React from 'react';

/**
 * objet qui affiche un TextField
 * @param {*} id identifiant unique
 * @param {*} label nom du TextField
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @param {*} defaultValue valeur par défaut
 * @param {*} mask masque de saisie (ex: mask="AA00-0000-0000-0000-0000") où A = lettre et 0 = chiffre et # = lettre ou chiffre
 * @param {*} defaultValueMask valeur par défaut du masque (ex: defaultValueMask="BE00-0000-0000-0000-0000")
 * @returns
 */
export default function TextFieldMaskP({ id, option, label, onChange, defaultValue, mask, defaultValueMask }) {

    const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask={mask ? mask : ""}
                value={defaultValueMask ? defaultValueMask : ""}
                definitions={{
                    '0': /[0-9]/,
                    'A': /[a-zA-Z]/,
                    '#': /[a-zA-Z0-9]/
                }}
                inputRef={ref}
                overwrite
            />
        );
    });


    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                options={option}
                onChange={handleChange}
                label={label}
                InputProps={{
                    inputComponent: TextMaskCustom
                }}
                defaultValue={defaultValue ? defaultValue : ""}
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
            />
        </div >
    );
};