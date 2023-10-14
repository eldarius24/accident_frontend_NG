import { Autocomplete, TextField } from '@mui/material';

/**
 * objet autocomplete désactivé
 * @param {*} id identifiant unique
 * @param {*} label nom de l'autocomplete
 * @returns 
 */
export default function AutoCompleteP({ id, label}) {
    return (
        <div className={id}>
            <Autocomplete
              disabled
              sx={inputStyle}
              renderInput={(params) => <TextField {...params} label={label} />}
            />
          </div>
    );
};