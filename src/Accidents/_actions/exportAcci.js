import { handleExportData } from '../../Model/excelGenerator.js';

// Dans exportAcci.js
export const handleExportDataAccident = async ({
    filteredData,
    isAdminOrDev,
    userInfo,
    logAction,
    onSuccess,
    onError
}) => {
    try {
        let dataToExport = filteredData;  // Utilisons directement les données filtrées
        if (!isAdminOrDev) {
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }

        await logAction({
            actionType: 'export',
            details: `Export Excel des accidents - ${dataToExport.length} accidents exportés - Période: ${new Date().toLocaleDateString()}`,
            entity: 'Accident',
            entityId: null,
            entreprise: userInfo.entreprisesConseillerPrevention?.[0] || 'Toutes'
        });

        // Passer les données filtrées à handleExportData
        await handleExportData(userInfo, isAdminOrDev, dataToExport);
       
        if (onSuccess) onSuccess('Exportation des données réussie');
    } catch (error) {
        console.error('Erreur lors de l\'exportation des données:', error);
        if (onError) onError('Erreur lors de l\'exportation des données');
    }
};