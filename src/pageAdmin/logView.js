import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import config from '../config.json';



const apiUrl = config.apiUrl || 'localhost';

const LogsViewer = () => {
  const { darkMode } = useTheme();
  const { isAdmin, userInfo } = useUserConnected();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const rowColors = darkMode
    ? ['#7a7a7a', '#979797']
    : ['#e62a5625', '#95519b25'];

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedDate !== 'all') params.append('date', selectedDate);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchTerm) params.append('search', searchTerm);
      if (!isAdmin && userInfo?._id) params.append('userId', userInfo._id);

      const url = `http://${apiUrl}:3100/api/logs?${params}`;
      console.log('URL de requête:', url);

      const response = await axios.get(url);
      console.log('Réponse reçue:', response.data);

      if (response.data?.data) {
        setLogs(response.data.data);
        setFilteredLogs(response.data.data);
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
  }, [selectedDate, selectedType, searchTerm, isAdmin, userInfo, showSnackbar]);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      console.log('Chargement initial des logs...');
      fetchLogs().catch(error => {
        console.error('Erreur dans useEffect:', error);
        showSnackbar('Erreur lors du chargement initial', 'error');
      });
      isMounted.current = true;
    }
  }, []); // Dépendances vides pour le chargement initial


  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const filterLogs = useCallback(() => {
    console.log('Filtrage des logs...', {
      totalLogs: logs.length,
      searchTerm,
      selectedDate,
      selectedType
    });

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

    if (selectedDate !== 'all') {
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

    console.log('Résultat du filtrage:', {
      filteredCount: filtered.length,
      firstItem: filtered[0]
    });

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedDate, selectedType]);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSelectedDate('all');
    setSelectedType('all');
    fetchLogs();
  }, [fetchLogs]);

  const exportLogs = useCallback(async () => {
    try {
      const response = await axios.get(`http://${apiUrl}:3100/api/logs/export`, {
        responseType: 'blob',
        params: {
          type: selectedType !== 'all' ? selectedType : undefined,
          date: selectedDate !== 'all' ? selectedDate : undefined,
          search: searchTerm || undefined,
          userId: !isAdmin && userInfo?._id ? userInfo._id : undefined
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `logs_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSnackbar('Export réussi', 'success');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      showSnackbar('Erreur lors de l\'export des logs', 'error');
    }
  }, [selectedType, selectedDate, searchTerm, isAdmin, userInfo, showSnackbar]);

  const getActionTypeStyle = useCallback((type) => {
    const styles = {
      Connexion: { backgroundColor: '#a5d6a7', color: '#2e7d32' },
      creation: { backgroundColor: '#a5d6a7', color: '#2e7d32' },
      modification: { backgroundColor: '#90caf9', color: '#1976d2' },
      suppression: { backgroundColor: '#ef9a9a', color: '#d32f2f' },
      consultation: { backgroundColor: '#e0e0e0', color: '#616161' },
      error: { backgroundColor: '#ffcdd2', color: '#c62828' }
    };
    return styles[type] || styles.consultation;
  }, []);

  const formatDateForDisplay = useCallback((dateString) => {
    if (!dateString) return 'Toutes les dates';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }, []);


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#ffebee' }}>
        <Typography color="error">
          Erreur: {error}
        </Typography>
        <Button onClick={handleReset} sx={{ mt: 2 }}>
          Réessayer
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{
        p: 3,
        backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
      }}>


        <h2>Logs Système</h2>

        <Grid container item xs={12} spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ backgroundColor: '#ee752d60' }}>
              <InputLabel>Type d'action</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Type d'action"
              >
                <MenuItem value="all">Toutes les actions</MenuItem>
                <MenuItem value="connexion">Connexion</MenuItem>
                <MenuItem value="creation">Création</MenuItem>
                <MenuItem value="modification">Modification</MenuItem>
                <MenuItem value="suppression">Suppression</MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
                <MenuItem value="error">Erreur</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              fullWidth
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{ backgroundColor: '#ee752d60' }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Tooltip title="Réinitialiser les filtres" arrow>
              <Button
                fullWidth
                variant="contained"
                onClick={handleReset}
                startIcon={<RefreshIcon />}
                sx={{
                  height: '100%',
                  backgroundColor: '#ee752d60',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#95ad22',
                    transform: 'scale(1.08)',
                    boxShadow: 6
                  }
                }}
              >
                Réinitialiser
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={3}>
            <Tooltip title="Exporter les logs" arrow>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={exportLogs}
                startIcon={<FileDownloadIcon />}
                sx={{
                  height: '100%',
                  backgroundColor: '#ee752d60',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#95ad22',
                    transform: 'scale(1.08)',
                    boxShadow: 6
                  }
                }}
              >
                Exporter
              </Button>
            </Tooltip>
          </Grid>


          <Grid item xs={12}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Type d'action</TableCell>
                    <TableCell>Détails</TableCell>
                    <TableCell>Entité</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        {loading ? 'Chargement...' : 'Aucun log trouvé'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <TableRow
                        key={log._id || index}
                        sx={{ backgroundColor: rowColors[index % 2] }}
                      >
                        <TableCell className="font-mono">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell>
                          <Typography
                            component="span"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: '12px',
                              ...getActionTypeStyle(log.actionType)
                            }}
                          >
                            {log.actionType}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>{log.entity}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper >

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LogsViewer;