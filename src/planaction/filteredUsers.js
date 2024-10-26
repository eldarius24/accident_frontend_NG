import { useMemo } from 'react';

const filteredUsers = useMemo(() => {
    // Si aucune année n'est sélectionnée, retourner un tableau vide
    if (selectedYears.length === 0) {
        return [];
    }

    let filtered = users;

    // Filtrer d'abord par les entreprises de l'utilisateur si ce n'est pas un admin
    if (!isAdmin) {
        const userEntreprises = userInfo?.entreprisesConseillerPrevention || [];
        filtered = filtered.filter(action =>
            userEntreprises.includes(action.AddActionEntreprise)
        );
    }

    // Filtrer par années sélectionnées
    filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));

    // Appliquer le filtre de recherche si nécessaire
    if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        filtered = filtered.filter(addaction =>
            ['AddActionEntreprise', 'AddActionDate', 'AddActionSecteur', 'AddAction', 'AddActionQui', 'AddActoinmoi', 'AddActionDange', 'AddActionanne']
                .some(field => {
                    const value = addaction[field];
                    return value && String(value).toLowerCase().includes(searchTermLower);
                })
        );
    }

    return filtered;
}, [users, searchTerm, selectedYears, isAdmin, userInfo]);

export default filteredUsers;