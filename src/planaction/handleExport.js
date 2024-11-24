
import { handleExportDataAction } from '../Model/excelGenerator.js';
const createHandleExport = (users, isAdminOrDev, userInfo, selectedYears, selectedEnterprises, searchTerm, showSnackbar, logAction) => {
    return async () => {
        try {
            let dataToExport = [...users]; // Create a copy of the original data

            // Filtre par entreprises sélectionnées
            if (selectedEnterprises && selectedEnterprises.length > 0) {
                dataToExport = dataToExport.filter(action => 
                    selectedEnterprises.includes(action.AddActionEntreprise)
                );
            }
            // Filtre par entreprise si l'utilisateur n'est pas admin
            else if (!isAdminOrDev && userInfo?.entreprisesConseillerPrevention) {
                dataToExport = dataToExport.filter(action =>
                    userInfo.entreprisesConseillerPrevention.includes(action.AddActionEntreprise)
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
                dataToExport = dataToExport.filter(action =>
                    Object.entries(action).some(([key, value]) => {
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(searchTermLower);
                    })
                );
            }

            if (dataToExport.length === 0) {
                showSnackbar('Aucune donnée à exporter avec les filtres sélectionnés', 'warning');
                return;
            }

            await handleExportDataAction(dataToExport);

            await logAction({
                actionType: 'export',
                details: `Export Excel des actions - ${dataToExport.length} actions exportées - Années: ${selectedYears.join(', ') || 'Toutes'} - Entreprises: ${selectedEnterprises.join(', ') || 'Toutes'} - Filtre: ${searchTerm || 'Aucun'}`,
                entity: 'Plan Action',
                entityId: null,
                entreprise: selectedEnterprises?.[0] || (isAdminOrDev ? 'Toutes' : userInfo?.entreprisesConseillerPrevention?.[0])
            });

            showSnackbar('Exportation des données réussie', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            showSnackbar('Erreur lors de l\'exportation des données', 'error');
        }
    };
};

export default createHandleExport;