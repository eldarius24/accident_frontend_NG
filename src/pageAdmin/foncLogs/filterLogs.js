/**
 * Utility function to filter logs based on search criteria
 * @param {Object} params - Parameters for filtering
 * @param {Array} params.logs - Array of logs to filter
 * @param {string} params.searchTerm - Search term to filter by
 * @param {Function} params.setFilteredLogs - Function to set filtered logs
 * @returns {void}
 */
const filterLogs = ({
  logs,
  searchTerm,
  setFilteredLogs
}) => {
  if (!Array.isArray(logs)) {
    console.error('logs n\'est pas un tableau:', logs);
    setFilteredLogs([]);
    return;
  }

  // Si pas de terme de recherche, on retourne tous les logs
  if (!searchTerm) {
    setFilteredLogs(logs);
    return;
  }

  // Filtre uniquement sur le terme de recherche pour le filtrage en temps réel
  const filtered = logs.filter(log =>
    (log.details?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (log.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (log.actionType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  setFilteredLogs(filtered);
};

export default filterLogs;