

// src/planaction/utils/filteredUsers.js
const createFilteredUsers = () => (users, searchTerm, selectedYears, isAdmin, userInfo) => {
    // If no years selected, return empty array
    if (selectedYears.length === 0) {
        return [];
    }
    
    let filtered = users;
    
    // Filter by user enterprises if not admin
    if (!isAdmin) {
        const userEntreprises = userInfo?.entreprisesConseillerPrevention || [];
        filtered = filtered.filter(action =>
            userEntreprises.includes(action.AddActionEntreprise)
        );
    }
    
    // Filter by selected years
    filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));
    
    // Apply search filter if needed
    if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        filtered = filtered.filter(addaction =>
            ['AddActionEntreprise', 'AddActionDate', 'AddActionSecteur', 'AddAction', 
             'AddActionQui', 'AddActoinmoi', 'AddActionDange', 'AddActionanne']
                .some(field => {
                    const value = addaction[field];
                    return value && String(value).toLowerCase().includes(searchTermLower);
                })
        );
    }
    
    return filtered;
};

export default createFilteredUsers;