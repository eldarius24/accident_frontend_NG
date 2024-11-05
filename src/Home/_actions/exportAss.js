import { handleExportDataAss } from '../../Model/excelGenerator.js';

/**
 * Exporte les données d'assurance vers un fichier Excel.
 *
 * @param {object} params - Les paramètres d'exportation
 * @param {object[]} params.filteredData - Les données filtrées à exporter
 * @param {boolean} params.isAdmin - Si l'utilisateur est administrateur
 * @param {object} params.userInfo - Les informations de l'utilisateur
 * @param {function} params.logAction - La fonction pour créer des logs
 * @param {function} [params.onSuccess] - La fonction à appeler en cas de succès
 * @param {function} [params.onError] - La fonction à appeler en cas d'erreur
 */
export const handleExportDataAssurance = async ({ 
    filteredData, 
    isAdmin, 
    userInfo, 
    logAction,
    onSuccess, 
    onError 
}) => {
    try {
        // Si l'utilisateur n'est pas administrateur, ne garder que les accidents liés à une entreprise que l'utilisateur est habilité à consulter
        let dataToExport = filteredData;
        if (!isAdmin) {
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }

        // Création du log pour l'export
        await logAction({
            actionType: 'export',
            details: `Export Excel des données d'assurance - ${dataToExport.length} déclarations exportées - Période: ${new Date().toLocaleDateString()}`,
            entity: 'Accident',
            entityId: null,
            entreprise: userInfo.entreprisesConseillerPrevention?.[0] || 'Toutes'
        });

        // Exporter les données
        handleExportDataAss(dataToExport);
        
        if (onSuccess) onSuccess('Exportation des données d\'assurance réussie');
    } catch (error) {
        // Gestion des erreurs
        console.error('Erreur lors de l\'exportation des données d\'assurance:', error);
        if (onError) onError('Erreur lors de l\'exportation des données d\'assurance');
    }
};