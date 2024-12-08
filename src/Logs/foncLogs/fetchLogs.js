import axios from 'axios';
import config from '../../config.json';

const apiUrl = config.apiUrl;

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
    if (selectedDate) urlParams.append('startDate', selectedDate);
    if (selectedType && selectedType !== 'all') urlParams.append('actionType', selectedType); // Changé 'type' en 'actionType'
    if (searchTerm) urlParams.append('search', searchTerm);
    if (!isAdminOrDev && userInfo?._id) urlParams.append('userId', userInfo._id);
    urlParams.append('page', page);
    urlParams.append('limit', logsPerPage);

    const url = `http://${apiUrl}:3100/api/logs?${urlParams}`;
    
    const response = await axios.get(url);

    if (response.data?.data) {
      setLogs(response.data.data);
      setFilteredLogs(response.data.data);
      const totalLogs = response.data.total || 0;
      setTotalPages(Math.ceil(totalLogs / logsPerPage));
      showSnackbar(`${response.data.data.length} logs chargés`, 'success');
    } else {
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