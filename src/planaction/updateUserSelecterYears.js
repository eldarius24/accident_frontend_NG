import Cookies from 'js-cookie';

const SELECTED_YEARS_COOKIE = 'selectedYears';
const COOKIE_EXPIRY_DAYS = 365; // Expire après 1 an

const createUpdateUserSelectedYears = (apiUrl, showSnackbar) => (userInfo, setSelectedYears) => {
    return async (newSelectedYears) => {
        try {
            // Valider les données avant de les stocker
            if (!Array.isArray(newSelectedYears)) {
                throw new Error('Les années sélectionnées doivent être un tableau');
            }

            // Vérifier que toutes les valeurs sont des chaînes d'années valides
            const currentYear = new Date().getFullYear();
            const isValidYear = (year) => {
                const yearNum = parseInt(year);
                return !isNaN(yearNum) && yearNum >= currentYear - 10 && yearNum <= currentYear + 10;
            };

            if (!newSelectedYears.every(isValidYear)) {
                throw new Error('Années invalides détectées');
            }

            // Stocker dans un cookie avec encryption basique
            const encodedYears = btoa(JSON.stringify(newSelectedYears));
            Cookies.set(SELECTED_YEARS_COOKIE, encodedYears, {
                expires: COOKIE_EXPIRY_DAYS,
                secure: true, // Cookie uniquement sur HTTPS
                sameSite: 'strict'
            });

            // Mettre à jour le localStorage pour la compatibilité
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
        const encodedYears = Cookies.get(SELECTED_YEARS_COOKIE);
        if (!encodedYears) return [];

        const decodedYears = JSON.parse(atob(encodedYears));
        return Array.isArray(decodedYears) ? decodedYears : [];
    } catch (error) {
        console.error('Erreur lors de la lecture des années depuis le cookie:', error);
        return [];
    }
};

export default createUpdateUserSelectedYears;