import axios from "axios";
import config from '../../config.json';

const apiUrl = config.apiUrl;
/**
 * Récupère les détails d'un action depuis l'API
 * @param {string} actionId - ID de l'action
 * @returns {Promise<Object>} Les détails de l'action
 */
const getactionDiversDetails = async (actionId) => {
    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/planaction/${actionId}`);
        if (response.data) {
            return {
                nomTravailleur: response.data.AddActionQui,
                entreprise: response.data.AddActionEntreprise,
                dateAction: new Date(response.data.AddActionDate).toLocaleDateString()
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'action:', error);
        return null;
    }
};

/**
 * Supprime un fichier de la base de données et de la liste des fichiers de l'action
 * @param {Object} params - Paramètres de la fonction
 * @param {string} params.fileId - ID du fichier à supprimer
 * @param {string} params.actionId - ID de l'action
 * @param {string} params.fileName - Nom du fichier
 * @param {Function} params.onDeleteSuccess - Callback appelé après la suppression réussie
 */
const deleteFile = async ({ fileId, actionId, fileName, onDeleteSuccess }) => {
    try {
        // Récupérer les détails de l'action avant la suppression
        const actionDetails = await getactionDiversDetails(actionId);

        // Supprimer le fichier
        await axios.delete(`http://${apiUrl}:3100/api/fileAction/${fileId}`);

        // Mettre à jour la liste des fichiers de l'action
        await axios.get(`http://${apiUrl}:3100/api/planaction/${actionId}`)
            .then(async (response) => {
                const action = response.data;
                if (action && action.files) {
                    const updatedFiles = action.files.filter(file => file.fileId !== fileId);
                    await axios.put(`http://${apiUrl}:3100/api/planaction/${actionId}`, { files: updatedFiles });
                }
            });

        // Appeler le callback de succès avec les détails de l'action
        if (onDeleteSuccess && actionDetails) {
            await onDeleteSuccess(actionDetails);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier :', error.message);
        throw new Error(`Erreur lors de la suppression du fichier : ${error.message}`);
    }
};

export { deleteFile as default, getactionDiversDetails };
