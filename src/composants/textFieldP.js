import { TextField } from '@mui/material';

/**
 * objet qui affiche un TextField
 * @param {*} id identifiant unique
 * @param {*} label nom du TextField
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @returns
 */
export default function textFieldP({ id, label, onChange, defaultValue }) {

    const handleChange = (event) => {
        console.log('textfield change to "', event.target.value, '"');
        if (onChange) {
            onChange(event.target.value);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                onChange={handleChange}
                label={label}
                defaultValue={defaultValue ? defaultValue : ""}
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                multiline
            />
        </div >
    );
};