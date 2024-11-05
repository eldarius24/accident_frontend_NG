import { handleExportData } from '../../Model/excelGenerator.js';

/**
 * Exporte les données d'accidents vers un fichier Excel.
 *
 * @param {object} params - Les paramètres d'exportation
 * @param {object[]} params.filteredData - Les données filtrées à exporter
 * @param {boolean} params.isAdmin - Si l'utilisateur est administrateur
 * @param {object} params.userInfo - Les informations de l'utilisateur
 * @param {function} params.logAction - La fonction pour créer des logs
 * @param {function} [params.onSuccess] - La fonction à appeler en cas de succès
 * @param {function} [params.onError] - La fonction à appeler en cas d'erreur
 */
export const handleExportDataAccident = async ({ 
    filteredData, 
    isAdmin, 
    userInfo, 
    logAction,
    onSuccess, 
    onError 
}) => {
    try {
        let dataToExport = filteredData;
        if (!isAdmin) {
            // Si l'utilisateur n'est pas administrateur, on filtre les données pour ne garder que les accidents
            // liés à une entreprise que l'utilisateur est habilité à consulter.
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }

        // Création du log pour l'export
        await logAction({
            actionType: 'export',
            details: `Export Excel des accidents - ${dataToExport.length} accidents exportés - Période: ${new Date().toLocaleDateString()}`,
            entity: 'Accident',
            entityId: null,
            entreprise: userInfo.entreprisesConseillerPrevention?.[0] || 'Toutes'
        });

        // On exporte les données filtrées.
        handleExportData(dataToExport);
        
        if (onSuccess) onSuccess('Exportation des données réussie');
    } catch (error) {
        console.error('Erreur lors de l\'exportation des données:', error);
        if (onError) onError('Erreur lors de l\'exportation des données');
    }
};