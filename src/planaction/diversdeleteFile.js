import axios from "axios";

/**
 * Récupère les détails d'un action depuis l'API
 * @param {string} actionId - ID de l'action
 * @returns {Promise<Object>} Les détails de l'action
 */
const getactionDiversDetails = async (actionId) => {
    try {
        const response = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
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
 * Supprime la référence du fichier dans la liste des fichiers de l'action
 * @param {Object} params - Paramètres de la fonction
 * @param {string} params.fileId - ID du fichier à supprimer
 * @param {string} params.actionId - ID de l'action
 */
const deleteReferenceFile = async ({ fileId, actionId }) => {
    try {
        // Récupération de l'action et de sa liste de fichiers
        const { data: action } = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
        
        if (!action.files) {
            action.files = [];
        }
        
        // Filtrage pour obtenir la liste sans le fichier à supprimer
        const updatedFiles = action.files.filter(file => file.fileId !== fileId);
        
        // Mise à jour de la liste des fichiers de l'action
        await axios.put(`http://localhost:3100/api/planaction/${actionId}`, { files: updatedFiles });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la liste des fichiers :', error.message);
        throw new Error(`Erreur lors de la mise à jour de la liste des fichiers : ${error.message}`);
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
        await axios.delete(`http://localhost:3100/api/fileAction/${fileId}`);
        
        // Mettre à jour la liste des fichiers de l'action
        await axios.get(`http://localhost:3100/api/planaction/${actionId}`)
            .then(async (response) => {
                const action = response.data;
                if (action && action.files) {
                    const updatedFiles = action.files.filter(file => file.fileId !== fileId);
                    await axios.put(`http://localhost:3100/api/planaction/${actionId}`, { files: updatedFiles });
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
