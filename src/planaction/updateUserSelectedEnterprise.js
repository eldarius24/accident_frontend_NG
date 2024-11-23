import { COOKIE_PREFIXES, saveEnterpriseSelection } from '../Home/_actions/cookieUtils';

const createUpdateUserSelectedEnterprise = (showSnackbar) => (userInfo, setSelectedEnterprise) => {
    return (newValue) => {
        try {
            // Accepter toute valeur qui existe dans les actions, même si elle n'est pas dans la table entreprises
            if (newValue !== '') {
                // Valider que l'entreprise est accessible pour l'utilisateur si ce n'est pas un admin
                if (!userInfo?.isAdminOrDev) {
                    const userEnterprises = userInfo?.entreprisesConseillerPrevention || [];
                    if (!userEnterprises.includes(newValue)) {
                        showSnackbar('Entreprise non autorisée', 'error');
                        return;
                    }
                }
            }

            // Sauvegarder la sélection
            saveEnterpriseSelection(COOKIE_PREFIXES.PLAN_ACTION, newValue);
            setSelectedEnterprise(newValue);

        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'entreprise sélectionnée:', error);
            showSnackbar('Erreur lors de la mise à jour de l\'entreprise sélectionnée', 'error');
            setSelectedEnterprise(''); // Réinitialiser à une valeur vide en cas d'erreur
        }
    };
};

export default createUpdateUserSelectedEnterprise;