const createHandleExport = (users, isAdminOrDev, userInfo, selectedYears, selectedEnterprise, searchTerm, showSnackbar, logAction) => {
    return async () => {
        try {
            let dataToExport = users;

            // Filtre par entreprise sélectionnée
            if (selectedEnterprise) {
                dataToExport = dataToExport.filter(action => action.AddActionEntreprise === selectedEnterprise);
            }
            // Filtre par entreprise si l'utilisateur n'est pas admin
            else if (!isAdminOrDev) {
                dataToExport = dataToExport.filter(action =>
                    userInfo.entreprisesConseillerPrevention?.includes(action.AddActionEntreprise)
                );
            }

            // Filtre par années sélectionnées
            if (selectedYears && selectedYears.length > 0) {
                dataToExport = dataToExport.filter(action =>
                    selectedYears.includes(action.AddActionanne)
                );
            }

            // Filtre par terme de recherche
            if (searchTerm) {
                const searchTermLower = searchTerm.toLowerCase();
                dataToExport = dataToExport.filter(addaction =>
                    ['AddActionEntreprise', 'AddActionDate', 'AddActionSecteur', 'AddAction',
                        'AddActionQui', 'AddActoinmoi', 'AddActionDange', 'AddActionanne']
                        .some(field => {
                            const value = addaction[field];
                            return value != null && String(value).toLowerCase().includes(searchTermLower);
                        })
                );
            }

            await handleExportDataAction(dataToExport);

            await logAction({
                actionType: 'export',
                details: `Export Excel des actions - ${dataToExport.length} actions exportées - Années: ${selectedYears.join(', ') || 'Toutes'} - Entreprise: ${selectedEnterprise || 'Toutes'} - Filtre: ${searchTerm || 'Aucun'}`,
                entity: 'Plan Action',
                entityId: null,
                entreprise: selectedEnterprise || (isAdminOrDev ? 'Toutes' : userInfo.entreprisesConseillerPrevention?.[0])
            });

            showSnackbar('Exportation des données réussie', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            showSnackbar('Erreur lors de l\'exportation des données', 'error');
        }
    };
};

export default createHandleExport;