import { COOKIE_PREFIXES, saveYearSelections } from '../Home/_actions/cookieUtils';

// Ajout du mot-clé export devant la déclaration de la fonction
const createUpdateUserSelectedYears = (apiUrl, showSnackbar) => (userInfo, setSelectedYears) => {
    return async (newSelectedYears) => {
        try {
            // Si newSelectedYears est undefined, null, ou contient une chaîne vide, initialiser comme tableau vide
            if (!newSelectedYears || newSelectedYears.includes('')) {
                const emptySelection = [];
                saveYearSelections(COOKIE_PREFIXES.HOME, emptySelection, true);
                setSelectedYears(emptySelection);
                return;
            }

            // S'assurer que newSelectedYears est un tableau
            const yearsArray = Array.isArray(newSelectedYears) ? newSelectedYears : [newSelectedYears];

            // Vérifier que toutes les valeurs sont des années valides
            const isValidYear = (year) => {
                // Ignorer les valeurs vides ou null
                if (!year) return false;

                // Convertir en nombre si c'est une chaîne
                const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
                
                // Vérifier si c'est un nombre valide
                if (isNaN(yearNum)) {
                    return false;
                }

                // Accepter une plage d'années plus large
                const currentYear = new Date().getFullYear();
                return yearNum >= (currentYear - 50) && yearNum <= (currentYear + 50);
            };

            // Filtrer les années valides
            const validYears = yearsArray.filter(isValidYear);

            if (validYears.length === 0 && yearsArray.length > 0) {
                console.warn('Aucune année valide trouvée dans:', yearsArray);
                throw new Error('Années invalides détectées');
            }

            // Sauvegarder les années sélectionnées
            saveYearSelections(COOKIE_PREFIXES.HOME, validYears, false);

            // Mettre à jour le localStorage
            const token = JSON.parse(localStorage.getItem('token'));
            if (token && token.data) {
                token.data.selectedYears = validYears;
                localStorage.setItem('token', JSON.stringify(token));
            }

            // Mettre à jour l'état
            setSelectedYears(validYears);

        } catch (error) {
            console.error('Erreur lors de la mise à jour des années sélectionnées:', error);
            showSnackbar(
                `Erreur lors de la sauvegarde des années sélectionnées: ${error.message}`,
                'error'
            );
        }
    };
};

export default createUpdateUserSelectedYears;