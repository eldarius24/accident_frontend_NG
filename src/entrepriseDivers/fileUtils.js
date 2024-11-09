import axios from 'axios';
import { saveAs } from 'file-saver';

/**
 * Fonction utilitaire pour télécharger un fichier
 * @param {Object} params Les paramètres de la fonction
 * @param {string} params.fileId - L'ID du fichier à télécharger
 * @param {string} params.fileName - Le nom du fichier
 * @param {string} params.entrepriseName - Le nom de l'entreprise
 * @param {Function} params.logAction - Fonction pour logger l'action
 * @param {Function} params.showMessage - Fonction pour afficher les messages
 */
const handleFileDownload = async ({ fileId, fileName, entrepriseName, logAction, showMessage }) => {
    try {
        // Vérification des paramètres requis
        if (!fileId || !fileName) {
            throw new Error('ID du fichier ou nom du fichier manquant');
        }

        // Téléchargement du fichier
        const response = await axios.get(`http://localhost:3100/api/getFile/${fileId}`, {
            responseType: 'blob'
        });

        // Vérification de la réponse
        if (!response.data) {
            throw new Error('Pas de données reçues du serveur');
        }

        // Sauvegarde du fichier
        saveAs(response.data, fileName);

        // Log de l'action
        if (logAction) {
            await logAction({
                actionType: 'export',
                details: `Téléchargement du fichier - Nom: ${fileName} - Entreprise: ${entrepriseName}`,
                entity: 'Entreprise',
                entityId: fileId,
                entreprise: entrepriseName
            });
        }

        // Affichage du message de succès
        if (showMessage) {
            showMessage('Téléchargement réussi', 'success');
        }
    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        if (showMessage) {
            showMessage('Erreur lors du téléchargement du fichier', 'error');
        }
    }
};

export default handleFileDownload;