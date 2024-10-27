// exportLogs.js
import axios from 'axios';

/**
 * Exporte les logs filtrés vers un fichier CSV.
 * @param {Object} params Les paramètres pour l'export
 * @param {string} params.apiUrl L'URL de l'API
 * @param {string} params.selectedType Le type de log sélectionné
 * @param {string} params.selectedDate La date sélectionnée
 * @param {string} params.searchTerm Le terme de recherche
 * @param {boolean} params.isAdmin Si l'utilisateur est admin
 * @param {Object} params.userInfo Les informations de l'utilisateur
 * @param {Function} params.showSnackbar Fonction pour afficher les notifications
 * @returns {Promise<void>}
 */
const exportLogs = async ({
  apiUrl,
  selectedType,
  selectedDate,
  searchTerm,
  isAdmin,
  userInfo,
  showSnackbar
}) => {
  try {
    // Effectuer une requête GET pour obtenir les logs exportés sous forme de blob
    const response = await axios.get(`http://${apiUrl}:3100/api/logs/export`, {
      responseType: 'blob',
      params: {
        type: selectedType !== 'all' ? selectedType : undefined,
        date: selectedDate !== 'all' ? selectedDate : undefined,
        search: searchTerm || undefined,
        userId: !isAdmin && userInfo?._id ? userInfo._id : undefined
      }
    });

    // Créer un lien de téléchargement pour le fichier CSV
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove(); // Supprimer le lien après le téléchargement

    // Afficher un message de succès
    showSnackbar('Export réussi', 'success');
  } catch (error) {
    // Gérer les erreurs et afficher un message d'erreur
    console.error('Erreur lors de l\'export:', error);
    showSnackbar('Erreur lors de l\'export des logs', 'error');
  }
};

export default exportLogs;