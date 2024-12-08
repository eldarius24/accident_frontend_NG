import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Box,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '../Hook/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import config from '../config.json';
import '../pageFormulaire/formulaire.css';
import fetchLogs from './foncLogs/fetchLogs';
import filterLogs from './foncLogs/filterLogs';
import exportLogs from './foncLogs/exportLogs';
import { useLogger } from '../Hook/useLogger';

const apiUrl = config.apiUrl;

/**
 * Component qui affiche la liste des logs du système.
 * @returns Un élément JSX qui affiche la liste des logs du système.
 */
const LogsViewer = () => {
  const { darkMode } = useTheme();
  const { isAdminOrDev, userInfo } = useUserConnected();
  const { logAction } = useLogger();
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
  const showSnackbar = useCallback((message, severity = 'info') => { setSnackbar({ open: true, message, severity }); }, []);

  /**
   * Gère le changement de page dans la pagination.
   * Met à jour l'état de la page actuelle.
   * @param {object} event L'événement qui a déclenché la modification de page.
   * @param {number} value La nouvelle page.
   */
  const handlePageChange = (event, value) => { setPage(value); };
  const isMounted = useRef(false);
  const fetchLogsWithState = useCallback(() => {
    return fetchLogs({
      selectedDate: dateEnabled ? selectedDate : null,
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
    });
  }, [selectedDate, selectedType, searchTerm, isAdminOrDev, userInfo, page, logsPerPage, dateEnabled]);

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

  useEffect(() => {
    fetchLogsWithState();
  }, [selectedDate, selectedType, page]);

  /**
   * Réinitialise les paramètres de filtrage des logs.
   * Supprime le terme de recherche, reset la date à aujourd'hui et active le champ de date.
   * Reset le type de log à 'all'.
   * Supprime les logs affichés et recharge les logs avec les paramètres par défaut.
   */
  const handleReset = useCallback(() => {
    setSearchTerm(''); // Supprime le terme de recherche
    setSelectedDate(''); // Reset la date à aujourd'hui
    setDateEnabled(true); // Active le champ de date
    setSelectedType('all'); // Reset le type de log à 'all'
    setLogs([]); // Supprime les logs affichés
    fetchLogsWithState(); // Recharge les logs avec les paramètres par défaut
  }, [fetchLogsWithState, today]);

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
      email_sent: { backgroundColor: '#e3f2fd', color: '#1565c0' },
      email_error: { backgroundColor: '#fce4ec', color: '#c2185b' },
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
      <div style={{
        p: 3,
        backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        margin: '0 20px'
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            margin: '1.5rem 0',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '45px',
              background: darkMode
                ? 'rgba(122,142,28,0.1)'
                : 'rgba(238,117,45,0.1)',
              filter: 'blur(10px)',
              borderRadius: '10px',
              zIndex: 0
            }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              fontWeight: 600,
              background: darkMode
                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                : 'linear-gradient(45deg, #ee752d, #f4a261)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              position: 'relative',
              padding: '0.5rem 1.5rem',
              zIndex: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                  : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
              }
            }}
          >
            Logs Système
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.5,
              pointerEvents: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
              }
            }}
          />
        </Box>
        <Grid container item xs={12} spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
          <Grid item xs={12} md={3}>
            <FormControl
              fullWidth
              sx={{
                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : 'inherit'
                },
                '& .MuiSelect-select': {
                  color: darkMode ? '#fff' : 'inherit'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                },
                '& .MuiSvgIcon-root': {
                  color: darkMode ? '#fff' : 'inherit'
                },
                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <InputLabel sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                Type d'action
              </InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Type d'action"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: darkMode ? '#424242' : '#fff',
                      boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3
                    }
                  }
                }}
              >
                {[
                  { value: 'all', label: 'Toutes les actions' },
                  { value: 'email_sent', label: 'Email envoyé' },
                  { value: 'email_error', label: 'Erreur email' },
                  { value: 'export', label: 'Export' },
                  { value: 'error', label: 'Error' },
                  { value: 'import', label: 'Import' },
                  { value: 'déconnexion', label: 'Déconnexion' },
                  { value: 'connexion', label: 'Connexion' },
                  { value: 'creation', label: 'Création' },
                  { value: 'modification', label: 'Modification' },
                  { value: 'suppression', label: 'Suppression' },
                  { value: 'consultation', label: 'Consultation' }
                ].map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    sx={{
                      backgroundColor: darkMode ? '#424242' : '#fff',
                      color: darkMode ? '#fff' : 'inherit',
                      '&:hover': {
                        backgroundColor: darkMode ? '#505050' : '#f5f5f5'
                      },
                      '&.Mui-selected': {
                        backgroundColor: darkMode ? '#505050' : '#f5f5f5'
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: darkMode ? '#606060' : '#eeeeee'
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              fullWidth
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                },
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#fff' : 'inherit',
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? 'rgba(255,255,255,0.7)' : '#1976d2'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : 'inherit'
                },
                '& .MuiSvgIcon-root': {
                  color: darkMode ? '#fff' : 'inherit'
                },
                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}
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
                  backgroundColor: darkMode ? '#424242' : '#ee752d60',
                  color: darkMode ? '#ffffff' : 'black',
                  transition: 'all 0.1s ease-in-out',
                  '&:hover': {
                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                    transform: 'scale(1.08)',
                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                  },
                  boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  '& .MuiSvgIcon-root': {
                    color: darkMode ? '#fff' : 'inherit'
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
                onClick={() => exportLogs({
                  apiUrl,
                  selectedType,
                  selectedDate,
                  searchTerm,
                  isAdminOrDev,
                  userInfo,
                  logAction,
                  showSnackbar
                })}
                startIcon={<FileDownloadIcon />}
                sx={{
                  height: '100%',
                  backgroundColor: darkMode ? '#424242' : '#ee752d60',
                  color: darkMode ? '#ffffff' : 'black',
                  transition: 'all 0.1s ease-in-out',
                  '&:hover': {
                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                    transform: 'scale(1.08)',
                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                  },
                  boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  '& .MuiSvgIcon-root': {
                    color: darkMode ? '#fff' : 'inherit'
                  }
                }}
              >
                Exporter
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <h1 className="text-2xl font-bold text-center mb-4" style={{ color: darkMode ? '#ffffff' : '#6e6e6e' }}>⚠️⚠️Les logs sont supprimers automatiquement apres 30 jours⚠️⚠️</h1>
            <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} count={totalPages} page={page} onChange={handlePageChange} color="primary" />
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
      </div >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%', fontSize: '1rem', padding: '10px', outline: '3px solid green' }}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
      );
};

      export default LogsViewer;