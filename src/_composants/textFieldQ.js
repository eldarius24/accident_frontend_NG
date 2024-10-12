import { TextField } from '@mui/material';

export default function textFieldQ({ 
    id, 
    label, 
    onChange, 
    value, 
    defaultValue,
    required = false
}) {
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <TextField
                id={id}
                label={label}
                value={value !== undefined ? value : undefined}
                defaultValue={defaultValue}
                onChange={handleChange}
                sx={{ backgroundColor: '#e62a5663', width: '50%', boxShadow: 3 }}
                multiline
                required={required}
                error={required && !value && !defaultValue}
                helperText={required && !value && !defaultValue ? "Ce champ est obligatoire" : ""}
            />
        </div>
    );
}