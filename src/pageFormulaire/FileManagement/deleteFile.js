import axios from "axios";

/** Supprime un fichier de la base de données et de la liste des fichiers de l'accident
 * @param {string} fileId 
 * @param {string} accidentId
 */
const deleteFile = async ({ fileId, accidentId }) => {
    try {
        // Suppression du fichier dans la base de données
        await axios.delete(`http://localhost:3100/api/file/${fileId}`);
        
        // Suppression de la référence du fichier dans la liste des fichiers de l'accident
        await deleteReferenceFile({ fileId, accidentId });
        
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier :', error.message);
        throw new Error(`Erreur lors de la suppression du fichier : ${error.message}`);
    }
}

/** Supprime le fichier de la liste des fichiers de l'accident
 * @param {string} fileId id du fichier à supprimer
 * @param {string} accidentId id de l'accident
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
}

export default deleteFile;
