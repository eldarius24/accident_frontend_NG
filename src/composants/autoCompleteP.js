import { Autocomplete, TextField } from '@mui/material';

/**
 * objet qui affiche un autocomplete (champ de texte avec suggestions)
 * si onchange est défini, alors il s'agit d'un autocomplete ou vous devez entre le code dans onchange
 * sinon, il s'agit d'un autocomplete ou vous devez juste entrer un id
 * @param {*} id identifiant unique
 * @param {*} option liste des suggestions
 * @param {*} label nom de l'autocomplete
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur
 * @returns 
 */
export default function AutoCompleteP({ id, option, label, onChange }) {

    const handleChange = (_, value) => {
        console.log('change');
        console.log(value);
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <div className={id}>
            <Autocomplete
                disablePortal
                id={id}
                options={option}
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                onChange={handleChange}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                renderInput={(params) => <TextField {...params} label={label} />}
            />
        </div>
    );
};