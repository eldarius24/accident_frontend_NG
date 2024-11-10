// fetchLogs.js
import axios from 'axios';
import config from '../../config.json';

const apiUrl = config.apiUrl || 'localhost';

/**
 * Fetches logs from the API based on provided filtering parameters.
 * 
 * - Constructs the query parameters for the API request from the given parameters.
 * - Updates loading state, error state, logs, filtered logs, and total pages based on the API response.
 * - Displays appropriate messages in a snackbar according to the success or failure of the fetch operation.
 * 
 * @param {Object} params - Parameters for fetching logs.
 * @param {string} params.selectedDate - The selected date for filtering logs.
 * @param {string} params.selectedType - The selected type for filtering logs.
 * @param {string} params.searchTerm - The search term for filtering logs.
 * @param {boolean} params.isAdmin - Whether the user is an admin.
 * @param {Object} params.userInfo - Information about the user.
 * @param {number} params.page - The current page number for pagination.
 * @param {number} params.logsPerPage - The number of logs per page for pagination.
 * @param {Function} params.setLoading - Function to set the loading state.
 * @param {Function} params.setError - Function to set the error state.
 * @param {Function} params.setLogs - Function to set the logs data.
 * @param {Function} params.setFilteredLogs - Function to set the filtered logs data.
 * @param {Function} params.setTotalPages - Function to set the total number of pages.
 * @param {Function} params.showSnackbar - Function to display messages via a snackbar.
 * @throws Will throw an error if the parameters object is not provided.
 */
const fetchLogs = async (params) => {
  const {
    selectedDate,
    selectedType,
    searchTerm,
    isAdminOrDev,
    userInfo,
    page,
    logsPerPage,
    setLoading,
    setError,
    setLogs,
    setFilteredLogs,
    setTotalPages,
    showSnackbar
  } = params || {};

  if (!params) {
    throw new Error('Parameters object is required for fetchLogs');
  }

  setLoading(true);
  setError(null);

  try {
    const urlParams = new URLSearchParams();
    if (selectedDate !== 'all') urlParams.append('date', selectedDate);
    if (selectedType !== 'all') urlParams.append('type', selectedType);
    if (searchTerm) urlParams.append('search', searchTerm);
    if (!isAdminOrDev && userInfo?._id) urlParams.append('userId', userInfo._id);
    urlParams.append('page', page);
    urlParams.append('limit', logsPerPage);

    const url = `http://${apiUrl}:3100/api/logs?${urlParams}`;
    console.log('URL de requête:', url);

    const response = await axios.get(url);
    console.log('Réponse reçue:', response.data);

    if (response.data?.data) {
      setLogs(response.data.data);
      setFilteredLogs(response.data.data);
      
      const totalLogs = response.data.total || 0;
      setTotalPages(Math.ceil(totalLogs / logsPerPage));
      showSnackbar(`${response.data.data.length} logs chargés`, 'success');
    } else {
      console.log('Format de réponse inattendu:', response.data);
      showSnackbar('Format de données incorrect', 'warning');
      setLogs([]);
      setFilteredLogs([]);
    }
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    setError(error.message);
    showSnackbar(`Erreur: ${error.message}`, 'error');
    setLogs([]);
    setFilteredLogs([]);
  } finally {
    setLoading(false);
  }
};

export default fetchLogs;