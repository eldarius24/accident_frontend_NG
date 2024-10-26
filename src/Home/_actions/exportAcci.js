import { handleExportData } from '../../Model/excelGenerator.js';


/**
 * Exporte les données d'accidents vers un fichier Excel.
 * 
 * @param {object} params - Les paramètres d'exportation
 * @param {object[]} params.filteredData - Les données filtrées à exporter
 * @param {boolean} params.isAdmin - Si l'utilisateur est administrateur
 * @param {object} params.userInfo - Les informations de l'utilisateur
 * @param {function} [params.onSuccess] - La fonction à appeler en cas de succès
 * @param {function} [params.onError] - La fonction à appeler en cas d'erreur
 * 
 * Si l'utilisateur n'est pas administrateur, les données sont filtrées pour ne garder que les accidents
 * liés à une entreprise que l'utilisateur est habilité à consulter.
 */
export const handleExportDataAccident = ({ filteredData, isAdmin, userInfo, onSuccess, onError }) => {
    let dataToExport = filteredData;
    if (!isAdmin) {
        // Si l'utilisateur n'est pas administrateur, on filtre les données pour ne garder que les accidents
        // liés à une entreprise que l'utilisateur est habilité à consulter.
        dataToExport = dataToExport.filter(accident =>
            userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
        );
    }
    try {
        // On exporte les données filtrées.
        handleExportData(dataToExport);
        if (onSuccess) onSuccess('Exportation des données réussie');
    } catch (error) {
        console.error('Erreur lors de l\'exportation des données:', error);
        if (onError) onError('Erreur lors de l\'exportation des données');
    }
};
