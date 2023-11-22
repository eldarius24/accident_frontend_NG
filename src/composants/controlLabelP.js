import { FormControlLabel, Checkbox } from '@mui/material';

/**
 * objet qui affiche un checkbox
 * @param {*} id identifiant unique
 * @param {*} label nom du checkbox
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @returns
 */
export default function controlLabelP({ id, label, onChange }) {

    const handleChange = (_, value) => {
        console.log('Autocomplet change to "', value, '"');
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <FormControlLabel
            id={id}
            control={<Checkbox />}
            sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
            label={label}
            onChange={handleChange}

        />
    )
};