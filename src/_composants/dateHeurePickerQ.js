import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

export default function DateHeurePickerQ({
    id,
    label,
    defaultValue,
    onChange,
    required = false
}) {
    const handleChange = (event, _) => {
        console.log('DatePicker event "', event, '"');
        if (onChange) {
            const date = dayjs(event).format('YYYY-MM-DD:HH:mm');
            onChange(date);
        }
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DateTimePicker
                    id={id}
                    label={label}
                    sx={{ backgroundColor: '#e62a5663', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    defaultValue={defaultValue ? dayjs(defaultValue) : null}
                    onChange={handleChange}
                    slotProps={{
                        textField: {
                            required: required,
                            error: required && !defaultValue,
                            helperText: required && !defaultValue ? "Ce champ est obligatoire" : "",
                        },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
};