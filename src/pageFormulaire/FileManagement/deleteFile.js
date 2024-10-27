import axios from "axios";

/**
 * Récupère les détails d'un accident depuis l'API
 * @param {string} accidentId - ID de l'accident
 * @returns {Promise<Object>} Les détails de l'accident
 */
const getAccidentDetails = async (accidentId) => {
    try {
        const response = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
        if (response.data) {
            return {
                nomTravailleur: response.data.nomTravailleur,
                prenomTravailleur: response.data.prenomTravailleur,
                entreprise: response.data.entrepriseName,
                dateAccident: new Date(response.data.DateHeureAccident).toLocaleDateString()
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'accident:', error);
        return null;
    }
};

/**
 * Supprime la référence du fichier dans la liste des fichiers de l'accident
 * @param {Object} params - Paramètres de la fonction
 * @param {string} params.fileId - ID du fichier à supprimer
 * @param {string} params.accidentId - ID de l'accident
 */
const deleteReferenceFile = async ({ fileId, accidentId }) => {
    try {
        // Récupération de l'accident et de sa liste de fichiers
        const { data: accident } = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
        
        // Filtrage pour obtenir la liste sans le fichier à supprimer
        const updatedFiles = accident.files.filter(file => file.fileId !== fileId);
        
        // Mise à jour de la liste des fichiers de l'accident sans le fichier supprimé
        await axios.put(`http://localhost:3100/api/accidents/${accidentId}`, { files: updatedFiles });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la liste des fichiers :', error.message);
        throw new Error(`Erreur lors de la mise à jour de la liste des fichiers : ${error.message}`);
    }
};

/**
 * Supprime un fichier de la base de données et de la liste des fichiers de l'accident
 * @param {Object} params - Paramètres de la fonction
 * @param {string} params.fileId - ID du fichier à supprimer
 * @param {string} params.accidentId - ID de l'accident
 * @param {string} params.fileName - Nom du fichier
 * @param {Function} params.onDeleteSuccess - Callback appelé après la suppression réussie
 */
const deleteFile = async ({ fileId, accidentId, fileName, onDeleteSuccess }) => {
    try {
        // Récupérer les détails de l'accident avant la suppression
        const accidentDetails = await getAccidentDetails(accidentId);
        
        // Supprimer le fichier
        await axios.delete(`http://localhost:3100/api/file/${fileId}`);
        
        // Mettre à jour la liste des fichiers de l'accident
        await deleteReferenceFile({ fileId, accidentId });

        // Appeler le callback de succès avec les détails de l'accident
        if (onDeleteSuccess && accidentDetails) {
            await onDeleteSuccess(accidentDetails);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier :', error.message);
        throw new Error(`Erreur lors de la suppression du fichier : ${error.message}`);
    }
};

export { deleteFile as default, getAccidentDetails };