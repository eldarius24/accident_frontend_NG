import { COOKIE_PREFIXES, saveEnterpriseSelection } from '../Accidents/_actions/cookieUtils';

const createUpdateUserSelectedEnterprise = (showSnackbar) => (userInfo, setSelectedEnterprise) => {
    return (newValues) => {
        try {
            // Si "Toutes les entreprises" est sélectionné (valeur vide dans la sélection)
            if (newValues.includes('')) {
                saveEnterpriseSelection(COOKIE_PREFIXES.PLAN_ACTION, []);
                setSelectedEnterprise([]);
                return;
            }

            // Valider que les entreprises sont accessibles pour l'utilisateur si ce n'est pas un admin
            if (!userInfo?.isAdminOrDev) {
                const userEnterprises = userInfo?.entreprisesConseillerPrevention || [];
                const invalidEnterprises = newValues.filter(enterprise => 
                    !userEnterprises.includes(enterprise)
                );
                
                if (invalidEnterprises.length > 0) {
                    showSnackbar('Certaines entreprises sélectionnées ne sont pas autorisées', 'error');
                    return;
                }
            }

            // Sauvegarder la sélection
            saveEnterpriseSelection(COOKIE_PREFIXES.PLAN_ACTION, newValues);
            setSelectedEnterprise(newValues);

        } catch (error) {
            console.error('Erreur lors de la mise à jour des entreprises sélectionnées:', error);
            showSnackbar('Erreur lors de la mise à jour des entreprises sélectionnées', 'error');
            setSelectedEnterprise([]); // Réinitialiser à un tableau vide en cas d'erreur
        }
    };
};

export default createUpdateUserSelectedEnterprise;