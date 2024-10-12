import { Autocomplete, TextField, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * objet qui affiche un autocomplete (champ de texte avec suggestions)
 * si onchange est défini, alors il s'agit d'un autocomplete ou vous devez entre le code dans onchange
 * sinon, il s'agit d'un autocomplete ou vous devez juste entrer un id
 * @param {*} id identifiant unique
 * @param {*} option liste des suggestions
 * @param {*} label nom de l'autocomplete
 * @param {} onChange fonction qui se déclenche à chaque changement de valeur (setValue({ id }, value))
 * @param {string} defaultValue /!\ obligatoire /!\ valeur par défaut à afficher dans l'autocomplete
 * @returns
 */
export default function AutoCompleteP({
    id,
    option,
    label,
    onChange,
    defaultValue,
    sx = { backgroundColor: '#e62a5663', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }
}) {
    const handleChange = (_, value) => {
        console.log('Autocomplet change to "', value, '"');
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className={id}>
            <Autocomplete
                disablePortal
                id={id}
                options={option}
                value={defaultValue}
                sx={sx}
                onChange={handleChange}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                renderInput={(params) => <TextField {...params} label={label} />}
                fullWidth={true}
                PaperComponent={(props) => (
                    <Paper {...props} sx={{ backgroundColor: '#bed7f6' }} />
                )}
            />
        </div>
    );
}
