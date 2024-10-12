import { Autocomplete, TextField, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export default function AutoCompleteQ({
    id,
    option,
    label,
    onChange,
    defaultValue,
    required = false,
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
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label={label} 
                        required={required}
                        error={required && !defaultValue}
                        helperText={required && !defaultValue ? "Ce champ est obligatoire" : ""}
                    />
                )}
                fullWidth={true}
                PaperComponent={(props) => (
                    <Paper {...props} sx={{ backgroundColor: '#bed7f6' }} />
                )}
            />
        </div>
    );
}