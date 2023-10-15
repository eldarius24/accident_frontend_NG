import { Autocomplete, TextField, DateTimePicker, FormControlLabel } from '@mui/material';

/**
 * objet qui affiche un textfield (champ de texte)
 * @param {*} id identifiant unique du champ de texte
 * @param {*} label  nom du champ de texte
 * @param {*} onChange fonction qui se déclenche à chaque changement de valeur
 * @returns 
 */
export function textFieldP(id, label, onChange) {

    const handleChange = () => {
        if (onChange) {
            onChange();
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
        </div>
    );
};




/**
 * objet qui affiche un DateTimePicker (champ de texte avec calendrier)
 * @param {*} id identifiant unique
 * @param {*} label texte à afficher au dessus du datetimepicker
 * @returns 
 
function DateTimePickerP(id, label) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Controller
          name={id}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DateTimePicker
              label={label}
              sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
              onChange={(e) => {
                console.log(e);
                setValue({ id }, e.$d);
                field.onChange();
              }}
              inputFormat="dd-MM-yyyy"
            />
          )}
        />
      </div>
    </LocalizationProvider>
  );
};*/

/**
 * objet qui affiche un FormControlLabel (checkbox)
 * @param {*} id identifiant unique
 * @param {*} label nom de la checkbox
 * @returns 
 */
export function FormControlLabelP(id, label) {
    return (
        <FormControlLabel
            id={id}
            control={<Checkbox />}
            sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
            label={label}
            onChange={(e) => setValue({ id }, e.target.value)}
        />
    )
}