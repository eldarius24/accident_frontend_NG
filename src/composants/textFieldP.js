import { TextField } from '@mui/material';

/**
 * objet qui affiche un TextField
 * @param {*} id identifiant unique
 * @param {*} label nom du TextField
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @returns
 */
export default function textFieldP({ id, label, onChange }) {

    const handleChange = (_, value) => {
        console.log('Autocomplet change to "', value, '"');
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                onChange={handleChange}
                label={label}
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                multiline
            />
        </div >
    );
};