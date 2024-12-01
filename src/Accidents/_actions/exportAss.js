import { handleExportDataAss } from '../../Model/excelGenerator.js';

export const handleExportDataAssurance = async ({
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
            details: `Export Excel des données d'assurance - ${dataToExport.length} déclarations exportées - Période: ${new Date().toLocaleDateString()}`,
            entity: 'Accident',
            entityId: null,
            entreprise: userInfo.entreprisesConseillerPrevention?.[0] || 'Toutes'
        });

        // Passer les données filtrées à handleExportDataAss
        await handleExportDataAss(userInfo, isAdminOrDev, dataToExport);
       
        if (onSuccess) onSuccess('Exportation des données d\'assurance réussie');
    } catch (error) {
        console.error('Erreur lors de l\'exportation des données d\'assurance:', error);
        if (onError) onError('Erreur lors de l\'exportation des données d\'assurance');
    }
};