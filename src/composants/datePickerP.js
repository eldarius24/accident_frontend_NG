import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export default function date2Perso(id, label) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DatePicker
                    label={label}
                    sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    onChange={(e) => {
                        console.log(e)
                    }}
                    format="dd-MM-yyyy"
                />
            </div>
        </LocalizationProvider>
    );
};
