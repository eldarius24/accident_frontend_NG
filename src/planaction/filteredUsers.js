const createFilteredUsers = () => {
    return (users, searchTerm, selectedYears, selectedEnterprises = [], isAdminOrDev, userInfo) => {
        // Vérifications de base
        if (!users || !Array.isArray(users)) return [];
        if (!selectedYears || !Array.isArray(selectedYears) || selectedYears.length === 0) return [];

        let filtered = users;

        // Filtre par années (avec conversion en nombre pour la comparaison)
        filtered = filtered.filter(action => 
            selectedYears.map(Number).includes(Number(action.AddActionanne))
        );

        // Vérification des entreprises sélectionnées
        if (!selectedEnterprises || selectedEnterprises.length === 0) {
            // Si aucune entreprise n'est sélectionnée
            if (!isAdminOrDev && userInfo?.entreprisesConseillerPrevention) {
                // Pour les non-admins, filtrer par leurs entreprises autorisées
                filtered = filtered.filter(action =>
                    userInfo.entreprisesConseillerPrevention.includes(action.AddActionEntreprise)
                );
            } else {
                // Si pas d'entreprises sélectionnées et pas de filtre par défaut
                return [];
            }
        } else {
            // Filtre par entreprises sélectionnées
            filtered = filtered.filter(action =>
                selectedEnterprises.includes(action.AddActionEntreprise)
            );
        }

        // Filtre par terme de recherche
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(addaction => (
                Object.entries(addaction).some(([key, value]) =>
                    value && String(value).toLowerCase().includes(searchTermLower)
                )
            ));
        }

        return filtered;
    };
};

export default createFilteredUsers;