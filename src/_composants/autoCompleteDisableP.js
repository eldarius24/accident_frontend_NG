import { Autocomplete, TextField } from '@mui/material';

export default function AutoCompleteDisableP({ id, label}) {
  const inputStyle = {
    backgroundColor: '#00479871',
    width: '50%',
    boxShadow: 3,
    margin: '0 auto 1rem',
  };

    return (
        <div className={id}>
            <Autocomplete
              disabled
              sx={inputStyle}
              options={[]}
              renderInput={(params) => <TextField {...params} label={label} />}
            />
          </div>
    );
};