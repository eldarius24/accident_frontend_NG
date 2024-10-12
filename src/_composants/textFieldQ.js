import { TextField } from '@mui/material';

/**
 * objet qui affiche un TextField
 * @param {*} id identifiant unique
 * @param {*} label nom du TextField
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @param {*} value valeur contrôlée du TextField
 * @param {*} defaultValue valeur par défaut non contrôlée du TextField
 * @returns
 */
export default function textFieldP({ id, label, onChange, value, defaultValue
 }) {

    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value); // Transmettre la valeur de l'événement
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                label={label}
                value={value !== undefined ? value : undefined}  // Utiliser "value" si contrôlé
                defaultValue={defaultValue}  // Utiliser "defaultValue" si non contrôlé
                onChange={handleChange}  // Appeler la fonction handleChange sur les changements
                sx={{ backgroundColor: '#e62a5663', width: '50%', boxShadow: 3 }}
                multiline
            />
        </div>
    );
}
