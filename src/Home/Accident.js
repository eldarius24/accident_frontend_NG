import React, { useCallback, useEffect, useState, useTransition, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, TextField, Grid, FormControl, InputLabel,
    Select, MenuItem, Checkbox, ListItemText, Tooltip, Chip, Box, Typography
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../pageFormulaire/formulaire.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InputAdornment from '@mui/material/InputAdornment';
import config from '../config.json';
import editPDF from '../Model/pdfGenerator.js';
import { useUserConnected } from '../Hook/userConnected.js';
import CustomSnackbar from '../_composants/CustomSnackbar.js';
import { useTheme } from '../pageAdmin/user/ThemeContext.js';
import { handleExportDataAccident } from './_actions/exportAcci.js';
import { handleExportDataAssurance } from './_actions/exportAss.js';
import { useLogger } from '../Hook/useLogger.js';
import useHandleDelete from './_actions/handleDelete.js';
import { blueGrey } from '@mui/material/colors';
import BoutonArchiver from '../Archives/BoutonArchiver.js';
import createUpdateUserSelectedStatus from './_actions/updateUserSelectedStatus.js';
import {
    COOKIE_PREFIXES,
    getSelectedYearsFromCookie,
    getSelectedStatusFromCookie
} from './_actions/cookieUtils.js';
import createFetchData from './_actions/fetch-accidents-data';
import useYearFilter from '../Hook/useYearFilter';
import Footer from '../_composants/Footer';

const apiUrl = config.apiUrl;

/**
 * Page principale de l'application, cette page contient une table avec 
 * les accidents du travail, les boutons pour exporter les données, 
 * filtrer les accidents et les boutons pour modifier, générer un pdf, 
 * supprimer les accidents
 * @returns {React.ReactElement} 
 */
function Accident() {
    const [yearsFromData, setYearsFromData] = useState([]);

    // Utiliser useYearFilter avec les années récupérées
    const { selectedYears, handleYearChange } = useYearFilter(
        COOKIE_PREFIXES.HOME,
        yearsFromData
    );

    const [yearsChecked, setYearsChecked] = useState(() =>
        getSelectedYearsFromCookie(COOKIE_PREFIXES.HOME)
    );

    useEffect(() => {
        setYearsChecked(getSelectedYearsFromCookie(COOKIE_PREFIXES.HOME));
    }, []);

    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const ensureArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        try {
            // Si c'est une chaîne JSON, essayer de la parser
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };
    const [statusFilters, setStatusFilters] = useState(() => {
        return getSelectedStatusFromCookie(COOKIE_PREFIXES.HOME);
    });


    const [accidents, setAccidents] = useState([]);;
    const [searchTerm, setSearchTerm] = useState('');
    const { userInfo, isConseiller, isAdminOrDev, isAdminOrDevOrConseiller } = useUserConnected();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const { logAction } = useLogger();
    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);
    const handleDelete = useHandleDelete({
        setAccidents,
        accidents,
        logAction,
        showSnackbar
    });

    const updateUserSelectedStatus = useCallback(
        createUpdateUserSelectedStatus(showSnackbar)(setStatusFilters),
        [showSnackbar]
    );

    const handleStatusFilterChange = (event) => {
        const newValues = event.target.value;
        try {
            if (Array.isArray(newValues) && newValues.includes('')) {
                // Cas "Tous les états"
                updateUserSelectedStatus([]);
            } else {
                // Sélection normale
                const validValues = Array.isArray(newValues) ? newValues : [];
                updateUserSelectedStatus(validValues);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des états:', error);
            showSnackbar('Erreur lors de la sauvegarde des états', 'error');
        }
    };

    /**
        * Rafraichit la liste des accidents en appelant la fonction getAccidents.
        * Met à jour l'état de la liste des accidents et des années.
        * Affiche un message de réussite ou d'erreur en fonction du résultat.
        */
    const fetchData = useCallback(
        createFetchData(apiUrl)(
            setAccidents,
            setYearsFromData,
            setLoading,
            showSnackbar,
            isAdminOrDev,
            userInfo
        ),
        [apiUrl, isAdminOrDev, userInfo]
    );


    /**
     * Renvoie un tableau de deux couleurs pour le background des lignes de la table.
     * Si le thème est sombre, les couleurs sont #7a7a7a et #979797.
     * Si le thème est clair, les couleurs sont #e62a5625 et #95519b25.
     * @returns {Array<string>} Un tableau de deux couleurs.
     */
    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

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
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }, []);

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     * 
     * @param {object} event - L'événement qui a déclenché la fermeture de la snackbar.
     * @param {string} reason - La raison pour laquelle la snackbar se ferme. Si elle vaut 'clickaway', cela signifie que l'utilisateur a cliqué en dehors de la snackbar.
     */
    const handleCloseSnackbar = (event, reason) => {
        // If the reason is 'clickaway', do not close the snackbar
        if (reason === 'clickaway') return;
        // Close the snackbar by setting its 'open' state to false
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    /**
     * Vérifie si l'utilisateur est un conseiller de prévention pour une entreprise.
     * La fonction prend en paramètre le nom de l'entreprise.
     * La fonction renvoie true si l'utilisateur est un conseiller de prévention pour l'entreprise, false sinon.
     * La fonction utilise l'information stockée dans userInfo pour faire la vérification.
     * @param {string} entrepriseName - Le nom de l'entreprise.
     * @returns {boolean} - True si l'utilisateur est un conseiller de prévention pour l'entreprise, false sinon.
     */
    const isConseillerPrevention = useCallback((entrepriseName) => {
        return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
    }, [userInfo]);

    /**
     * Génère un PDF pour l'accident passé en paramètre
     * L'accident est recherché dans la liste des accidents enregistrés
     * Si l'accident est trouvé, la fonction editPDF est appelée pour générer le PDF
     * Si l'accident n'est pas trouvé, une erreur est affichée
     * 
     * @param {string} accidentIdToGenerate L'ID de l'accident pour lequel le PDF doit être généré
     */
    const handleGeneratePDF = useCallback(async (accidentIdToGenerate) => {
        const accident = accidents.find(item => item._id === accidentIdToGenerate);
        if (accident) {
            try {
                // Génère le PDF avec les données de l'accident
                await editPDF(accident);

                // Crée un log pour le téléchargement en utilisant les données de l'accident trouvé
                await logAction({
                    actionType: 'export',
                    details: `Téléchargement de la déclaration PDF - Travailleur: ${accident.nomTravailleur} ${accident.prenomTravailleur} - Date: ${new Date(accident.DateHeureAccident).toLocaleDateString()}`,
                    entity: 'Accident',
                    entityId: accidentIdToGenerate,
                    entreprise: accident.entrepriseName
                });

                // Affiche une snackbar pour indiquer que l'opération a réussi
                showSnackbar('PDF généré avec succès', 'success');
            } catch (error) {
                console.error(error);
                // Affiche une erreur si la génération du PDF a échoué
                showSnackbar('Erreur lors de la génération du PDF', 'error');
            }
        } else {
            // Affiche une erreur si l'accident n'a pas été trouvé
            showSnackbar('Accident non trouvé', 'error');
        }
    }, [accidents, showSnackbar, logAction]); // Ajout de logAction dans les dépendances

    /**
     * Redirige l'utilisateur vers la page de modification d'un accident de travail
     * en passant en paramètre l'ID de l'accident.
     * 
     * @param {string} accidentIdToModify L'ID de l'accident à modifier.
     */

    const handleEdit = useCallback(async (accidentIdToModify) => {
        try {
            const { data } = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentIdToModify}`);
            navigate("/formulaire", { state: data });
            showSnackbar('Modification de l accident initiée', 'info');
        } catch (error) {
            console.error(error);
            showSnackbar('Erreur lors de la récupération des données de l accident', 'error');
        }
    }, [apiUrl, navigate, showSnackbar]);

    /**
     * Filtre les données des accidents en fonction des années sélectionnées et du terme de recherche.
     * Utilise useMemo pour optimiser le recalcul des données filtrées.
     * 
     * @returns {Array} - Un tableau des accidents filtrés.
     */
    const filteredData = useMemo(() => {
        if (!accidents || !Array.isArray(selectedYears)) return []; // Changé yearsChecked à selectedYears

        const years = selectedYears.map(Number); // Changé yearsChecked à selectedYears
        const searchTermLower = searchTerm.toLowerCase();

        return accidents.filter(item => {
            if (!item.DateHeureAccident) return false;

            const date = new Date(item.DateHeureAccident).getFullYear();

            // Si aucun filtre d'état n'est sélectionné, on ne retourne aucun élément
            if (statusFilters.length === 0) return false;

            // Vérifie si l'élément correspond aux filtres d'état sélectionnés
            const matchesStatus = statusFilters.includes('closed') && item.boolAsCloture ||
                statusFilters.includes('pending') && !item.boolAsCloture;

            return years.includes(date) &&
                matchesStatus &&
                ['AssureurStatus', 'DateHeureAccident', 'entrepriseName', 'secteur',
                    'nomTravailleur', 'prenomTravailleur', 'typeAccident'].some(property =>
                        item[property]?.toString().toLowerCase().includes(searchTermLower)
                    );
        });
    }, [accidents, selectedYears, searchTerm, statusFilters]);

    /**
     * Exporte les données d'accidents vers un fichier Excel.
     * 
     * @param {object} params - Les paramètres d'exportation
     * @param {object[]} params.filteredData - Les données filtrées à exporter
     * @param {boolean} params.isAdmin - Si l'utilisateur est administrateur
     * @param {object} params.userInfo - Les informations de l'utilisateur
     * @param {function} params.logAction - La fonction pour créer des logs
     * @param {function} [params.onSuccess] - La fonction à appeler en cas de succès
     * @param {function} [params.onError] - La fonction à appeler en cas d'erreur
     */
    const handleExportAccidentClick = useCallback(() => {
        const cleanSearchTerm = searchTerm || ''; // S'assure que searchTerm n'est jamais undefined

        handleExportDataAccident({
            filteredData,
            isAdminOrDev,
            userInfo,
            logAction,
            searchTerm: cleanSearchTerm, // Passe la version nettoyée
            onSuccess: (message) => showSnackbar(message, 'success'),
            onError: (message) => showSnackbar(message, 'error')
        });
    }, [filteredData, isAdminOrDev, userInfo, logAction, searchTerm, showSnackbar]);

    /**
     * Exporte les données d'assurance vers un fichier Excel.
     * 
     * @param {object} params - Les paramètres d'exportation
     * @param {object[]} params.filteredData - Les données filtrées à exporter
     * @param {boolean} params.isAdminOrDev - Si l'utilisateur est administrateur
     * @param {object} params.userInfo - Les informations de l'utilisateur
     * @param {function} params.logAction - La fonction pour créer des logs
     * @param {function} [params.onSuccess] - La fonction à appeler en cas de succès
     * @param {function} [params.onError] - La fonction à appeler en cas d'erreur
     */
    const handleExportAssuranceClick = useCallback(() => {
        handleExportDataAssurance({
            filteredData,
            isAdminOrDev,
            userInfo,
            logAction,
            onSuccess: (message) => showSnackbar(message, 'success'),
            onError: (message) => showSnackbar(message, 'error')
        });
    }, [filteredData, isAdminOrDev, userInfo, logAction, showSnackbar]);

    useEffect(() => {
        fetchData();
    }, []);

    const refreshListAccidents = useCallback(() => {
        setLoading(true);
        fetchData();
    }, []);

    return (
        <div style={{
            backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            margin: '0 20px'
        }}>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2rem 0',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '4px',
                    background: darkMode
                        ? 'linear-gradient(90deg, rgba(122,142,28,0.2) 0%, rgba(122,142,28,1) 50%, rgba(122,142,28,0.2) 100%)'
                        : 'linear-gradient(90deg, rgba(238,117,45,0.2) 0%, rgba(238,117,45,1) 50%, rgba(238,117,45,0.2) 100%)',
                    borderRadius: '2px'
                }
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#2D3748',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textAlign: 'center',
                        textShadow: darkMode
                            ? '2px 2px 4px rgba(0,0,0,0.3)'
                            : '2px 2px 4px rgba(0,0,0,0.1)',
                        '&::first-letter': {
                            color: darkMode ? '#7a8e1c' : '#ee752d',
                            fontSize: '120%'
                        },
                        position: 'relative',
                        padding: '0 20px'
                    }}
                >
                    Gesion des Accidents
                </Typography>
            </Box>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Tooltip title="Filtrer par état" arrow>
                            <FormControl sx={{
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                width: '100%',
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
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
                                }
                            }}>
                                <InputLabel id="etat-label" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                                    État
                                </InputLabel>
                                <Select
                                    labelId="etat-label"
                                    id="etat-select"
                                    multiple
                                    value={statusFilters}
                                    onChange={handleStatusFilterChange}
                                    renderValue={(selected) => {
                                        if (!selected || !Array.isArray(selected) || selected.length === 0) {
                                            return "Tous les états";
                                        }
                                        return selected.map(s => s === 'closed' ? 'Clôturé' : 'En attente').join(', ');
                                    }}
                                    sx={{
                                        '& .MuiSelect-icon': {
                                            color: darkMode ? '#fff' : 'inherit'
                                        }
                                    }}
                                >
                                    <MenuItem
                                        value=""
                                        sx={{
                                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                            }
                                        }}
                                    >
                                        <Checkbox
                                            checked={statusFilters?.length === 2}
                                            onChange={(event) => {
                                                // Si la case est cochée, on sélectionne tout, sinon on déselectionne tout
                                                const newValue = event.target.checked ? ['closed', 'pending'] : [];
                                                handleStatusFilterChange({ target: { value: newValue } });
                                            }}
                                            sx={{
                                                color: darkMode ? '#ff6b6b' : 'red',
                                                '&.Mui-checked': {
                                                    color: darkMode ? '#ff8080' : 'red'
                                                }
                                            }}
                                        />
                                        <ListItemText
                                            primary="Tous les états"
                                            sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                        />
                                    </MenuItem>
                                    {['closed', 'pending'].map(status => (
                                        <MenuItem
                                            key={status}
                                            value={status}
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                                color: darkMode ? '#fff' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                                },
                                                '&.Mui-selected:hover': {
                                                    backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                checked={statusFilters?.includes(status)}
                                                sx={{
                                                    color: darkMode ? '#4CAF50' : '#257525',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#81C784' : '#257525'
                                                    }
                                                }}
                                            />
                                            <ListItemText
                                                primary={status === 'closed' ? 'Clôturé' : 'En attente'}
                                                sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Tooltip title="Cliquez ici pour actualiser le tableau des accidents du travails" arrow>
                            <Button
                                sx={{
                                    color: darkMode ? '#ffffff' : 'black',
                                    padding: '15px',
                                    width: '100%',
                                    backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                                color="secondary"
                                onClick={refreshListAccidents}
                                startIcon={<RefreshIcon />}
                            >
                                Actualiser
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Tooltip title="Cliquez ici pour filtrer les accidents par années" arrow placement="top">
                            <FormControl sx={{
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                width: '100%',
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
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
                                }
                            }}>
                                <InputLabel id="sort-label" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                                    Année
                                </InputLabel>
                                <Select
                                    labelId="years-label"
                                    id="years-select"
                                    multiple
                                    value={selectedYears}
                                    onChange={handleYearChange}
                                    renderValue={(selected) => `${selected.length} année(s)`}
                                >
                                    <MenuItem
                                        value="all"
                                        sx={{
                                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                            }
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedYears.length === yearsFromData.length}
                                            indeterminate={selectedYears.length > 0 && selectedYears.length < yearsFromData.length}
                                            sx={{
                                                color: darkMode ? '#ff6b6b' : 'red',
                                                '&.Mui-checked': {
                                                    color: darkMode ? '#ff8080' : 'red'
                                                }
                                            }}
                                        />
                                        <ListItemText primary="Tout sélectionner" />
                                    </MenuItem>
                                    {yearsFromData.map((year) => (
                                        <MenuItem
                                            key={year}
                                            value={year}
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                                color: darkMode ? '#fff' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                                },
                                                '&.Mui-selected:hover': {
                                                    backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedYears.includes(year)}
                                                sx={{
                                                    color: darkMode ? '#4CAF50' : '#257525',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#81C784' : '#257525'
                                                    }
                                                }}
                                            />
                                            <ListItemText
                                                primary={year}
                                                sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Tooltip title="Filtrer les accidents par mots clés" arrow>
                            <TextField
                                value={searchTerm}
                                onChange={event => setSearchTerm(event.target.value)}
                                variant="outlined"
                                sx={{
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                    width: '100%',
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
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: darkMode ? '#fff' : 'inherit' }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        '&::placeholder': {
                                            color: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit'
                                        }
                                    }
                                }}
                            />
                        </Tooltip>
                    </Grid>
                    {isAdminOrDevOrConseiller && (
                        <>
                            <Grid item xs={12} sm={6} md={1.5}>
                                <Tooltip title="Cliquez ici pour exporter les données Accident en fonction des filtres sélèctionnes en excel" arrow>
                                    <Button
                                        sx={{
                                            color: darkMode ? '#ffffff' : 'black',
                                            padding: '15px',
                                            width: '100%',
                                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                            transition: 'all 0.1s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                                transform: 'scale(1.08)',
                                                boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                            },
                                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                            textTransform: 'none',
                                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                            '& .MuiSvgIcon-root': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            }
                                        }}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleExportAccidentClick}
                                        startIcon={<FileUploadIcon />}
                                    >
                                        Accident
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={6} md={1.5}>
                                <Tooltip title="Cliquez ici pour exporter les données Assurance en fonction des filtres sélèctionnes en excel" arrow>
                                    <Button
                                        sx={{
                                            color: darkMode ? '#ffffff' : 'black',
                                            padding: '15px',
                                            width: '100%',
                                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                            transition: 'all 0.1s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                                transform: 'scale(1.08)',
                                                boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                            },
                                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                            textTransform: 'none',
                                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                            '& .MuiSvgIcon-root': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            }
                                        }}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleExportAssuranceClick}
                                        startIcon={<FileUploadIcon />}
                                    >
                                        Assurance
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </>
                    )}
                </Grid>
            </div>
            <TableContainer
                className="frameStyle-style"
                style={{
                    maxHeight: '600px',
                    overflowY: 'auto',
                    backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow
                            className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                            style={{
                                backgroundColor: darkMode ? '#535353' : '#0098f950'
                            }}
                        >
                            <TableCell style={{ fontWeight: 'bold' }}>Etat</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>N° Groupe</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>N° Entreprise</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Date accident</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Nom du travailleur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Prénom du travailleur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Type accident</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Editer</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Fichier</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>PDF</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                            {(isAdminOrDev) ? (
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Archivage</TableCell>
                            ) : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item, index) => (
                            <React.Fragment key={item._id}>
                                <TableRow
                                    className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                    style={{
                                        backgroundColor: rowColors[index % rowColors.length]
                                    }}
                                >
                                    <TableCell>
                                        <Chip
                                            label={item.boolAsCloture ? "Clôturé" : "En attente"}
                                            color={item.boolAsCloture ? "error" : "success"}
                                            size="small"
                                            sx={{
                                                opacity: 0.6,  // Ajuste la transparence (0 = invisible, 1 = opaque)
                                                '& .MuiChip-label': {
                                                    opacity: 1  // Garde le texte complètement visible
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{item.numeroGroupe}</TableCell>
                                    <TableCell>{item.numeroEntreprise}</TableCell>
                                    <TableCell>{item.AssureurStatus}</TableCell>
                                    <TableCell>{formatDate(item.DateHeureAccident)}</TableCell>
                                    <TableCell>{item.entrepriseName}</TableCell>
                                    <TableCell>{item.secteur}</TableCell>
                                    <TableCell>{item.nomTravailleur}</TableCell>
                                    <TableCell>{item.prenomTravailleur}</TableCell>
                                    <TableCell>{item.typeAccident}</TableCell>
                                    <>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            {(isAdminOrDev || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour éditer les données de l'accident" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                                        transition: 'all 0.1s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? blueGrey[900] : blueGrey[700],
                                                            transform: 'scale(1.08)',
                                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEdit(item._id)}>
                                                        <EditIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>

                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            {(isAdminOrDev || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour ajouter des fichiers a l'accident" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? '#7b1fa2' : '#9c27b0',
                                                        transition: 'all 0.1s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? '#4a0072' : '#7b1fa2',
                                                            transform: 'scale(1.08)',
                                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => navigate("/fichierdll", { state: item._id })}>
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>

                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            {(isAdminOrDev || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour générer la déclaration d'accident Belfius si vous avez remplis tous les champs du formulaire" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? '#1b5e20' : '#2e7d32',
                                                        transition: 'all 0.1s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? '#2e7d32' : '#1b5e20',
                                                            transform: 'scale(1.08)',
                                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }}
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => handleGeneratePDF(item._id)}>
                                                        <PictureAsPdfIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>

                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            {(isAdminOrDev || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour supprimer l'accident" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                        transition: 'all 0.1s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? '#d32f2f' : '#b71c1c',
                                                            transform: 'scale(1.08)',
                                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }}
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            confirmAlert({
                                                                customUI: ({ onClose }) => (
                                                                    <div className="custom-confirm-dialog">
                                                                        <h1 className="custom-confirm-title">Supprimer</h1>
                                                                        <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet accident?</p>
                                                                        <div className="custom-confirm-buttons">
                                                                            <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                                                <button
                                                                                    className="custom-confirm-button"
                                                                                    onClick={() => {
                                                                                        handleDelete(item._id);
                                                                                        onClose();
                                                                                    }}
                                                                                >
                                                                                    Oui
                                                                                </button>
                                                                            </Tooltip>
                                                                            <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                                                                <button
                                                                                    className="custom-confirm-button custom-confirm-no"
                                                                                    onClick={onClose}
                                                                                >
                                                                                    Non
                                                                                </button>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            });
                                                        }}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        {/* Autres cellules */}
                                        {(isAdminOrDev) ? (
                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <BoutonArchiver
                                                    donnee={item}
                                                    type="accident"
                                                    onSuccess={() => {
                                                        refreshListAccidents();
                                                        showSnackbar('Action archivée avec succès', 'success');
                                                    }}
                                                />
                                            </TableCell>
                                        ) : null}
                                    </>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
             <Footer />
        </div>
    );
}

export default Accident;
