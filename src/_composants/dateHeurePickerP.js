import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

/**
 * Date Picker composant qui affiche un calendrier pour choisir une date
 * @param {*} label texte à afficher 
 * @param {*} defaultValue Valeur par défaut format dayjs '2021-10-10'
 * @param {*} onChange 
 * @returns 
 */
export default function DateHeurePickerP({id, label, defaultValue, onChange}) {

    /**
     * Fonction qui se déclenche à chaque changement de date.
     * Envoie la date au format 'YYYY-MM-DD:HH:mm' via la fonction onChange si elle est définie.
     * @param {Event} event - L'événement de changement de date.
     * @param {*} _ - Non utilisé.
     */
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
                    sx={{ backgroundColor: '#00479871', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    defaultValue={defaultValue ? dayjs(defaultValue) : null}
                    onChange={handleChange}
                />
            </div>
        </LocalizationProvider>
    );
};