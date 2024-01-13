import { FormControlLabel, Checkbox } from '@mui/material';

/**
 * objet qui affiche un checkbox
 * @param {*} id identifiant unique
 * @param {*} label nom du checkbox
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @param {*} defaultValue valeur par défaut
 * @returns
 */
export default function controlLabelAdminP({ id, label, onChange, defaultValue }) {

    const handleChange = (_, value) => {
        console.log('checkBox change to "', value, '"');
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <FormControlLabel
            id={id}
            control={<Checkbox
                checked={defaultValue}
                onChange={handleChange}
            />}
            sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '10px' }}
            label={label}
        />
    )
};