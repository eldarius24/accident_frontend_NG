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
  Pagination
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import config from '../config.json';
import '../pageFormulaire/formulaire.css';

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
   * Fonction qui permet de charger les logs du système.
   * La fonction utilise `axios` pour envoyer une requête GET vers l'API de logs.
   * La fonction accepte un objet `params` qui contient les paramètres de la requête.
   * Les paramètres suivants sont supportés :
   *   - `date` : la date pour laquelle on souhaite charger les logs.
   *   - `type` : le type de logs que l'on souhaite charger.
   *   - `search` : le terme de recherche pour filtrer les logs.
   *   - `userId` : l'identifiant de l'utilisateur dont on souhaite charger les logs.
   * La fonction renvoie une promesse qui se résout avec un objet qui contient les logs chargés.
   * Si une erreur se produit, la fonction renvoie une promesse qui se rejette avec l'erreur.
   * @param {Object} [params] - Les paramètres de la requête.
   * @returns {Promise<Object>} - Une promesse qui se résout avec un objet qui contient les logs chargés.
   */
  const fetchLogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const urlParams = new URLSearchParams();
      if (selectedDate !== 'all') urlParams.append('date', selectedDate);
      if (selectedType !== 'all') urlParams.append('type', selectedType);
      if (searchTerm) urlParams.append('search', searchTerm);
      if (!isAdmin && userInfo?._id) urlParams.append('userId', userInfo._id);
      urlParams.append('page', page); // Pagination
      urlParams.append('limit', logsPerPage); // Nombre de logs par page
      const url = `http://${apiUrl}:3100/api/logs?${urlParams}`;
      console.log('URL de requête:', url);

      const response = await axios.get(url);
      console.log('Réponse reçue:', response.data);

      if (response.data?.data) {
        setLogs(response.data.data);
        setFilteredLogs(response.data.data);


        // Calculer le nombre total de pages
        const totalLogs = response.data.total || 0; // `total` doit être renvoyé par l'API
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
  }, [selectedDate, selectedType, searchTerm, isAdmin, userInfo, showSnackbar, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
    fetchLogs();
  }, [page]); // Dépendances vides pour le chargement initial


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

  /**
   * Fonction qui permet de filtrer les logs en fonction des paramètres définis.
   * La fonction est appelée lorsque l'utilisateur modifie les paramètres de filtrage.
   * La fonction utilise les paramètres suivants :
   *   - `searchTerm` : le terme de recherche pour filtrer les logs.
   *   - `selectedDate` : la date pour laquelle on souhaite filtrer les logs.
   *   - `selectedType` : le type de logs que l'on souhaite filtrer.
   * La fonction renvoie un tableau filtré qui contient les logs qui correspondent aux paramètres définis.
   * @returns {Array<Object>} - Un tableau filtré qui contient les logs qui correspondent aux paramètres définis.
   */
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

    /**
     * Filtrer les logs en fonction de la date sélectionnée.
     * La date est convertie en un objet Date et on utilise la méthode toDateString()
     * pour extraire la date au format 'dd/mm/yyyy'. On filtre ensuite les logs
     * en fonction de la date correspondante.
     */
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
    setLogs([]); // Vide les logs avant de recharger
    fetchLogs();
  }, [fetchLogs]);

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