const createFilteredUsers = () => {
    // Créer une fonction mémoïsée pour le filtrage
    const memoizedFilter = (users, searchTerm, selectedYears, isAdminOrDev, userInfo) => {
        // Vérifier les années sélectionnées en premier pour éviter un traitement inutile
        if (!selectedYears.length) {
            return [];
        }

        // Appliquer les filtres dans l'ordre le plus efficace (du plus restrictif au moins restrictif)
        let filtered = users;

        // Filtre par années d'abord (généralement le plus restrictif)
        filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));

        // Filtre par entreprises si non admin
        if (!isAdminOrDev) {
            const userEntreprises = userInfo?.entreprisesConseillerPrevention || [];
            filtered = filtered.filter(action => userEntreprises.includes(action.AddActionEntreprise));
        }

        // Filtre par terme de recherche en dernier (le plus coûteux)
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            // Définir les champs à rechercher une seule fois
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