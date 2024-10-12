import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

/**
 * Date Picker composant qui affiche un calendrier pour choisir une date
 * @param {string} id - identifiant du composant
 * @param {string} label - texte à afficher
 * @param {string} defaultValue - Valeur par défaut format dayjs '2021-10-10'
 * @param {function} onChange - Fonction appelée lors du changement de date
 * @param {boolean} required - Indique si le champ est obligatoire
 * @returns {JSX.Element}
 */
export default function datePickerP({ id, label, defaultValue, onChange, required = false }) {
    const handleChange = (event) => {
        if (onChange && event) {
            const date = dayjs(event).format('YYYY-MM-DD');
            onChange(date);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DatePicker
                    id={id}
                    label={label}
                    sx={{ 
                        backgroundColor: '#e62a5663', 
                        width: '50%', 
                        boxShadow: 3, 
                        margin: '0 auto 1rem'
                    }}
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
}