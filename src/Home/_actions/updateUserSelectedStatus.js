import { COOKIE_PREFIXES, saveStatusSelection } from './cookieUtils';

const createUpdateUserSelectedStatus = (showSnackbar) => (setSelectedStatus) => {
    return (newValues) => {
        try {
            // Si "Tous les états" est sélectionné (valeur vide dans la sélection)
            if (newValues.includes('')) {
                saveStatusSelection(COOKIE_PREFIXES.HOME, []);
                setSelectedStatus([]);
                return;
            }

            // Sauvegarder la sélection
            saveStatusSelection(COOKIE_PREFIXES.HOME, newValues);
            setSelectedStatus(newValues);

        } catch (error) {
            console.error('Erreur lors de la mise à jour des états sélectionnés:', error);
            showSnackbar('Erreur lors de la mise à jour des états sélectionnés', 'error');
            setSelectedStatus([]); // Réinitialiser à un tableau vide en cas d'erreur
        }
    };
};

export default createUpdateUserSelectedStatus;