import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import config from '../config.json';
import '../pageFormulaire/formulaire.css';
import fetchLogs from './foncLogs/fetchLogs';
import filterLogs from './foncLogs/filterLogs';

const apiUrl = config.apiUrl || 'localhost';

/**
 * Component qui affiche la liste des logs du système.
 * @returns Un élément JSX qui affiche la liste des logs du système.
 */
const LogsViewer = () => {
  const { darkMode } = useTheme();
  const { isAdmin, userInfo } = useUserConnected();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateEnabled, setDateEnabled] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 200;

  const rowColors = useMemo(() =>
    darkMode
      ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
      : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
    [darkMode]
  );

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /**
   * Gère le changement de page dans la pagination.
   * Met à jour l'état de la page actuelle.
   * @param {object} event L'événement qui a déclenché la modification de page.
   * @param {number} value La nouvelle page.
   */
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const isMounted = useRef(false);

  const fetchLogsWithState = useCallback(() => {
    return fetchLogs({
      selectedDate: dateEnabled ? selectedDate : null,
      selectedType,
      searchTerm,
      isAdmin,
      userInfo,
      page,
      logsPerPage,
      setLoading,
      setError,
      setLogs,
      setFilteredLogs,
      setTotalPages,
      showSnackbar
    });
  }, [selectedDate, selectedType, searchTerm, isAdmin, userInfo, page, logsPerPage, dateEnabled]);


  const filterLogsWithState = useCallback(() => {
    filterLogs({
      logs,
      searchTerm,
      selectedDate: dateEnabled ? selectedDate : null,
      selectedType,
      setFilteredLogs
    });
  }, [logs, searchTerm, selectedDate, selectedType, dateEnabled]);

  useEffect(() => {
    if (!isMounted.current) {
      console.log('Chargement initial des logs...');
      fetchLogsWithState().catch(error => {
        console.error('Erreur dans useEffect:', error);
        showSnackbar('Erreur lors du chargement initial', 'error');
      });
      isMounted.current = true;
    }
    fetchLogsWithState();
  }, [page]);

  /**
   * Formatte une date en string au format "DD/MM/YYYY HH:mm:ss".
   * La date est attendue au format "YYYY-MM-DDTHH:mm:ss.sssZ".
   * Si la date est nulle ou vide, la fonction renvoie une chaîne vide.
   * 
   * @param {string} dateString - La date à formater.
   * @returns {string} La date formatée.
   */
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);



// useEffect hook to apply filters whenever filterLogsWithState function changes
useEffect(() => {
  /**
   * Applies the current filters to the logs.
   * The filterLogsWithState function is used to filter logs based on
   * the current state of search term, selected date, and log type.
   */
  filterLogsWithState();
}, [filterLogsWithState]);

  /**
   * Réinitialise les paramètres de filtrage des logs.
   * Supprime le terme de recherche, reset la date à aujourd'hui et active le champ de date.
   * Reset le type de log à 'all'.
   * Supprime les logs affichés et recharge les logs avec les paramètres par défaut.
   */
  const handleReset = useCallback(() => {
    setSearchTerm(''); // Supprime le terme de recherche
    setSelectedDate(today); // Reset la date à aujourd'hui
    setDateEnabled(true); // Active le champ de date
    setSelectedType('all'); // Reset le type de log à 'all'
    setLogs([]); // Supprime les logs affichés
    fetchLogsWithState(); // Recharge les logs avec les paramètres par défaut
  }, [fetchLogsWithState, today]);

  /**
   * Exporte les logs filtrés vers un fichier CSV.
   * La fonction utilise les paramètres de filtrage actuels pour déterminer quels logs exporter.
   * Un fichier CSV est créé et téléchargé automatiquement sur l'appareil de l'utilisateur.
   */
  const exportLogs = useCallback(async () => {
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
  }, [selectedType, selectedDate, searchTerm, isAdmin, userInfo, showSnackbar]);

  /**
   * Renvoie un objet contenant les styles CSS pour un type d'action donné.
   * Les styles sont définis en fonction du type d'action :
   *   - export : vert clair (#c8e6c9) avec du texte vert (#388e3c)
   *   - import : vert clair (#c8e6c9) avec du texte vert (#388e3c)
   *   - connexion : vert pâle (#a5d6a7) avec du texte vert (#366637)
   *   - déconnexion : gris (#e0e0e0) avec du texte gris (#616161)
   *   - création : vert pâle (#a5d6a7) avec du texte vert (#2e7d32)
   *   - modification : bleu pâle (#90caf9) avec du texte bleu (#1976d2)
   *   - suppression : rouge pâle (#ef9a9a) avec du texte rouge (#d32f2f)
   *   - consultation : gris (#e0e0e0) avec du texte gris (#616161)
   *   - error : jaune pâle (#ffcdd2) avec du texte rouge (#c62828)
   * Si le type d'action n'est pas reconnu, les styles par défaut sont gris (#e0e0e0) avec du texte gris (#616161)
   */
  const getActionTypeStyle = useCallback((type) => {
    const styles = {
      export: { backgroundColor: '#c8e6c9', color: '#388e3c' },
      import: { backgroundColor: '#c8e6c9', color: '#388e3c' },
      connexion: { backgroundColor: '#a5d6a7', color: '#366637' },
      déconnexion: { backgroundColor: '#e0e0e0', color: '#616161' },
      creation: { backgroundColor: '#a5d6a7', color: '#2e7d32' },
      modification: { backgroundColor: '#90caf9', color: '#1976d2' },
      suppression: { backgroundColor: '#ef9a9a', color: '#d32f2f' },
      consultation: { backgroundColor: '#e0e0e0', color: '#616161' },
      error: { backgroundColor: '#ffcdd2', color: '#c62828' }
    };
    return styles[type] || styles.consultation;
  }, []);

  /**
   * Formatte une date en string pour l'affichage.
   * La date est attendue au format "YYYY-MM-DDTHH:mm:ss.sssZ".
   * Si la date est nulle ou vide, la fonction renvoie "Toutes les dates".
   * 
   * @param {string} dateString - La date à formater.
   * @returns {string} La date formatée.
   */
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
      <Paper style={{
        p: 3,
        backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        margin: '0 20px'
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
                <MenuItem value="export">Export</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="import">Import</MenuItem>
                <MenuItem value="déconnexion">Déconnexion</MenuItem>
                <MenuItem value="connexion">Connexion</MenuItem>
                <MenuItem value="creation">Création</MenuItem>
                <MenuItem value="modification">Modification</MenuItem>
                <MenuItem value="suppression">Suppression</MenuItem>
                <MenuItem value="consultation">Consultation</MenuItem>
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
            <TableContainer className="frameStyle-style"
              style={{
                maxHeight: '600px',
                overflowY: 'auto',
                backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
              }}>
              <Table>
                <TableHead>
                  <TableRow
                    className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                    style={{
                      backgroundColor: darkMode ? '#535353' : '#0098f950'
                    }}
                  >
                    <TableCell>Date</TableCell>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Type d'action</TableCell>
                    <TableCell>Détails</TableCell>
                    <TableCell>Entité</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow >
                      <TableCell colSpan={5} align="center">
                        {loading ? 'Chargement...' : 'Aucun log trouvé'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <TableRow key={log._id || index} className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                        style={{
                          backgroundColor: rowColors[index % rowColors.length]
                        }}>
                        <TableCell>{formatDate(log.timestamp)}</TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell>
                          <Typography component="span" sx={{ px: 1, py: 0.5, borderRadius: '12px', ...getActionTypeStyle(log.actionType) }}>
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
            <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} count={totalPages} page={page} onChange={handlePageChange} color="primary" />
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
      <div className="image-cortigroupe"></div>
      <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
        <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
      </Tooltip>
    </>

  );

};

export default LogsViewer;