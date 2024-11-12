/**
 * Utility function to filter logs based on search criteria
 * @param {Object} params - Parameters for filtering
 * @param {Array} params.logs - Array of logs to filter
 * @param {string} params.searchTerm - Search term to filter by
 * @param {string} params.selectedDate - Selected date to filter by
 * @param {string} params.selectedType - Selected type to filter by
 * @param {Function} params.setFilteredLogs - Function to set filtered logs
 * @returns {void}
 */
const filterLogs = ({
    logs,
    searchTerm,
    selectedDate,
    selectedType,
    setFilteredLogs
  }) => {
  
    if (!Array.isArray(logs)) {
      console.error('logs n\'est pas un tableau:', logs);
      setFilteredLogs([]);
      return;
    }
  
    let filtered = [...logs];
  
    if (searchTerm) {
      filtered = filtered.filter(log =>
        (log.details?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.actionType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
  
    if (selectedDate) {
      const logDate = new Date(selectedDate);
      filtered = filtered.filter(log => {
        if (!log.timestamp) return false;
        const date = new Date(log.timestamp);
        return date.toDateString() === logDate.toDateString();
      });
    }
  
    if (selectedType !== 'all') {
      filtered = filtered.filter(log => log.actionType === selectedType);
    }
    
    setFilteredLogs(filtered);
  };
  
  export default filterLogs;