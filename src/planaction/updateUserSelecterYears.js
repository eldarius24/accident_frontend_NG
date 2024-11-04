import Cookies from 'js-cookie';

const SELECTED_YEARS_COOKIE = 'selectedYears';
const COOKIE_EXPIRY_DAYS = 365;

const createUpdateUserSelectedYears = (apiUrl, showSnackbar) => (userInfo, setSelectedYears) => {
    return async (newSelectedYears) => {
        try {
            // Valider les données
            if (!Array.isArray(newSelectedYears)) {
                throw new Error('Les années sélectionnées doivent être un tableau');
            }

            // Vérifier que toutes les valeurs sont des années valides
            const currentYear = new Date().getFullYear();
            const isValidYear = (year) => {
                const yearNum = parseInt(year);
                return !isNaN(yearNum) && yearNum >= currentYear - 10 && yearNum <= currentYear + 10;
            };

            if (!newSelectedYears.every(isValidYear)) {
                throw new Error('Années invalides détectées');
            }

            // Stocker dans un cookie
            Cookies.set(SELECTED_YEARS_COOKIE, JSON.stringify(newSelectedYears), {
                expires: COOKIE_EXPIRY_DAYS,
                secure: true,
                sameSite: 'strict'
            });

            // Mettre à jour le localStorage
            const token = JSON.parse(localStorage.getItem('token'));
            if (token && token.data) {
                token.data.selectedYears = newSelectedYears;
                localStorage.setItem('token', JSON.stringify(token));
            }

            // Mettre à jour l'état
            setSelectedYears(newSelectedYears);
            showSnackbar('Années sélectionnées mises à jour avec succès', 'success');

        } catch (error) {
            console.error('Erreur lors de la mise à jour des années sélectionnées:', error);
            showSnackbar(
                `Erreur lors de la sauvegarde des années sélectionnées: ${error.message}`,
                'error'
            );
        }
    };
};

// Fonction utilitaire pour récupérer les années sélectionnées depuis les cookies
export const getSelectedYearsFromCookie = () => {
    try {
        const cookieValue = Cookies.get(SELECTED_YEARS_COOKIE);
        if (!cookieValue) return [];

        try {
            const parsedValue = JSON.parse(cookieValue);
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch (parseError) {
            console.error('Erreur lors du parsing du cookie:', parseError);
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la lecture du cookie:', error);
        return [];
    }
};

export default createUpdateUserSelectedYears;