import axios from "axios";

/**Supprime un fichier de la base de données et de la liste des fichiers de l'accident
 * 
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
        throw new Error('Erreur lors de la suppression du fichier dans la liste des fichiers de l\'accident : ', error);
    }
}

/** Supprime le fichier de la liste des fichiers de l'accident
 * 
 * @param {*} fileId id du fichier à supprimer
 * @param {*} accidentId id de l'accident
 */
const deleteReferenceFile = async ({ fileId, accidentId }) => {
    try {
        // Récupération de l'accident et de sa liste de fichiers
        const { data: accident } = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
        const updatedFiles = accident.files.filter(file => file.fileId !== fileId);

        // Mise à jour de la liste des fichiers de l'accident sans le fichier supprimé
        await axios.put(`http://localhost:3100/api/accidents/${accidentId}`, { files: updatedFiles });
    } catch (error) {
        throw new Error('Erreur lors de la suppression du fichier dans la liste des fichiers de l\'accident : ', error);
    }
}

export default deleteFile;