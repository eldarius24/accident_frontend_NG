const createFilteredUsers = () => {
    return (users, searchTerm, selectedYears, selectedEnterprises = [], isAdminOrDev, userInfo) => {
        if (!users || !Array.isArray(users)) return [];
        if (!selectedYears || !Array.isArray(selectedYears) || selectedYears.length === 0) return [];

        let filtered = users;

        // Filtre par années
        filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));

        // Filtre par entreprises sélectionnées
        if (selectedEnterprises && selectedEnterprises.length > 0) {
            filtered = filtered.filter(action => 
                selectedEnterprises.includes(action.AddActionEntreprise)
            );
        }
        // Filtre par entreprises si non admin et aucune entreprise spécifique sélectionnée
        else if (!isAdminOrDev && userInfo?.entreprisesConseillerPrevention) {
            filtered = filtered.filter(action => 
                userInfo.entreprisesConseillerPrevention.includes(action.AddActionEntreprise)
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