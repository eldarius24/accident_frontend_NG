// src/planaction/utils/handleExport.js
import { handleExportDataAction } from '../Model/excelGenerator.js';

const createHandleExport = (users, isAdmin, userInfo, selectedYears, searchTerm, showSnackbar) => {
    return async () => {
        try {
            let dataToExport = users;
            
            // Filtre par entreprise si l'utilisateur n'est pas admin
            if (!isAdmin) {
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
            showSnackbar('Exportation des données réussie', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            showSnackbar('Erreur lors de l\'exportation des données', 'error');
        }
    };
};

export default createHandleExport;