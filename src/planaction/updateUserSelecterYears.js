import { COOKIE_PREFIXES, saveYearSelections } from '../Home/_actions/cookieUtils';

// Ajout du mot-clé export devant la déclaration de la fonction
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

            // Sauvegarder les années sélectionnées avec le préfixe PLAN_ACTION
            saveYearSelections(COOKIE_PREFIXES.PLAN_ACTION, newSelectedYears, false);

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

// Exportation par défaut de la fonction
export default createUpdateUserSelectedYears;