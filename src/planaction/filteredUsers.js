const createFilteredUsers = () => {
    const memoizedFilter = (users, searchTerm, selectedYears, selectedEnterprise, isAdminOrDev, userInfo) => {
        // Vérifier les années sélectionnées en premier
        if (!selectedYears.length) {
            return [];
        }

        let filtered = users;

        // Filtre par années
        filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));

        // Filtre par entreprise sélectionnée - Modifié pour gérer correctement la valeur vide
        if (selectedEnterprise && selectedEnterprise !== '') {
            filtered = filtered.filter(action => action.AddActionEntreprise === selectedEnterprise);
        }
        // Filtre par entreprises si non admin
        else if (!isAdminOrDev) {
            const userEntreprises = userInfo?.entreprisesConseillerPrevention || [];
            filtered = filtered.filter(action => userEntreprises.includes(action.AddActionEntreprise));
        }

        // Filtre par terme de recherche
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            const searchFields = [
                'AddActionEntreprise',
                'AddActionDate',
                'AddActionSecteur',
                'AddAction',
                'AddActionQui',
                'AddActoinmoi',
                'AddActionDange',
                'AddActionanne',
                'priority'
            ];

            filtered = filtered.filter(addaction => (
                searchFields.some(field => {
                    const value = addaction[field];
                    return value && String(value).toLowerCase().includes(searchTermLower);
                })
            ));
        }

        return filtered;
    };
    return memoizedFilter;
};

export default createFilteredUsers;