import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Checkbox, Grid, LinearProgress, TextField, Tooltip,
    FormControl, InputLabel, Select, MenuItem, ListItemText, OutlinedInput, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../pageFormulaire/formulaire.css';
import config from '../config.json';
import { useUserConnected } from '../Hook/userConnected';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import EnterpriseStats from './entrepriseStats';
import createFilteredUsers from './filteredUsers';
import createFetchData from './fetchData.js';
import createHandleExport from './handleExport';
import { useLogger } from '../Hook/useLogger';
import { blueGrey } from '@mui/material/colors';
import createUpdateUserSelectedYears from './updateUserSelecterYears';
import {
    COOKIE_PREFIXES,
    getSelectedYearsFromCookie
} from '../Home/_actions/cookieUtils';
import listeaddaction from '../liste/listeaddaction.json';
const apiUrl = config.apiUrl;



/**
 * Page qui affiche le plan d'action
 * @param {object} accidentData Données de l'accident
 * @returns {JSX.Element} La page du plan d'action
 */
export default function PlanAction({ accidentData }) {

    // Créer la fonction de mise à jour
    const { logAction } = useLogger();
    const { darkMode } = useTheme();
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleSubmit } = useForm();
    const location = useLocation();
    const isFileUploadIcon = location.pathname === '/actionfichierdll';
    const [searchTerm, setSearchTerm] = useState('');
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);
    const { isAdmin, userInfo, isAdminOrDev } = useUserConnected();
    const currentYear = new Date().getFullYear().toString();
    const [selectedYears, setSelectedYears] = useState(() =>
        getSelectedYearsFromCookie(COOKIE_PREFIXES.PLAN_ACTION)
    );
    const [availableYears, setAvailableYears] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const navigate = useNavigate();
    // Then inside your PlanAction component, add these lines after your state declarations:

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleExport = useCallback(
        createHandleExport(
            users,
            isAdminOrDev,
            userInfo,
            selectedYears,
            searchTerm,
            showSnackbar,
            logAction  // Ajout du paramètre logAction
        ),
        [users, isAdminOrDev, userInfo, selectedYears, searchTerm, showSnackbar, logAction]
    );

    const updateUserSelectedYears = useCallback(
        createUpdateUserSelectedYears(apiUrl, showSnackbar)(userInfo, setSelectedYears),
        [apiUrl, showSnackbar, userInfo]
    );

    const getFilteredUsers = useMemo(
        () => createFilteredUsers(),
        []
    );

    const filteredUsers = useMemo(
        () => getFilteredUsers(users, searchTerm, selectedYears, isAdminOrDev, userInfo),
        [getFilteredUsers, users, searchTerm, selectedYears, isAdminOrDev, userInfo]
    );

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     * 
     * @param {object} event - L'événement qui a déclenché la fermeture de la snackbar.
     * @param {string} reason - La raison pour laquelle la snackbar se ferme. Si elle vaut 'clickaway', cela signifie que l'utilisateur a cliqué en dehors de la snackbar.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const rowColors = useMemo(() => ({
        dark: {
            checked: '#4f7c4f',
            rows: ['#7a7a7a', '#979797']
        },
        light: {
            checked: '#90EE90',
            rows: ['#e62a5625', '#95519b25']
        }
    }), []);

    // Fonction pour obtenir la couleur de la ligne
    const getRowColor = useCallback((isChecked, index) => {
        const theme = darkMode ? 'dark' : 'light';
        if (isChecked) {
            return rowColors[theme].checked;
        }
        return rowColors[theme].rows[index % 2];
    }, [darkMode, rowColors]);

    const handleYearsChange = (event) => {
        const newSelectedYears = event.target.value;
        setSelectedYears(newSelectedYears);
        updateUserSelectedYears(newSelectedYears);
    };

    const checkboxStyle = useMemo(
        () => ({
            '&.Mui-checked': {
                color: darkMode ? '#70f775' : '#2e7d32', // Couleur de la checkbox cochée
            },
        }),
        [darkMode]
    );

    /**
        * Formatte une date en string au format jj-mm-aaaa
        * @param {string} dateString - La date à formatter
        * @returns {string} La date formatée
        */
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleEdit = useCallback(async (actionIdToModify) => {
        try {
            const actionToEdit = users.find(action => action._id === actionIdToModify);
            if (actionToEdit) {
                // Crée un log pour l'édition
                await logAction({
                    actionType: 'modification',
                    details: `Début de modification de l'action - Action: ${actionToEdit.AddAction} - Entreprise: ${actionToEdit.AddActionEntreprise} - Année: ${actionToEdit.AddActionanne}`,
                    entity: 'Plan Action',
                    entityId: actionIdToModify,
                    entreprise: actionToEdit.AddActionEntreprise
                });

                // Redirige vers le formulaire d'édition
                navigate("/formulaireAction", { state: actionToEdit });
                showSnackbar('Modification de l\'action initiée', 'info');
            } else {
                showSnackbar('Erreur : Action non trouvée', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la modification:', error);
            showSnackbar('Erreur lors de l\'initialisation de la modification', 'error');
        }
    }, [navigate, users, showSnackbar, logAction]);

    const fetchData = useCallback(
        createFetchData(apiUrl)(
            setAddactions,
            setEntreprises,
            setAllSectors,
            setAvailableSectors,
            setLoading,
            showSnackbar,
            isAdminOrDev,
            userInfo
        ),
        [apiUrl, setAddactions, setEntreprises, setAllSectors, setAvailableSectors,
            setLoading, showSnackbar, isAdminOrDev, userInfo]
    );

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const years = [...new Set(users.map(action => action.AddActionanne))].filter(Boolean).sort();

        setAvailableYears(years.sort());

    }, [users]);

    // Modifiez d'abord les useEffects pour la gestion des années disponibles et sélectionnées
    useEffect(() => {
        // Obtenir les années disponibles en fonction des droits de l'utilisateur
        const getAvailableYearsForUser = () => {
            let filteredActions = isAdminOrDev
                ? users
                : users.filter(action =>
                    userInfo?.entreprisesConseillerPrevention?.includes(action.AddActionEntreprise)
                );

            return [...new Set(filteredActions.map(action => action.AddActionanne))]
                .filter(Boolean)
                .sort();
        };

        const availableYrs = getAvailableYearsForUser();
        setAvailableYears(availableYrs);

        // Récupérer les années sauvegardées
        const token = JSON.parse(localStorage.getItem('token'));
        const savedYears = token?.data?.selectedYears || [];

        // Filtrer les années sauvegardées pour ne garder que celles qui sont toujours disponibles
        const validYears = savedYears.filter(year => availableYrs.includes(year));

        // Mettre à jour le state uniquement si nécessaire
        if (JSON.stringify(validYears) !== JSON.stringify(selectedYears)) {
            setSelectedYears(validYears);
        }

    }, [users, isAdminOrDev, userInfo?.entreprisesConseillerPrevention]);

    const handleDelete = useCallback(async (userIdToDelete) => {
        try {
            // Récupère les informations de l'action avant la suppression
            const actionToDelete = users.find(action => action._id === userIdToDelete);
            if (!actionToDelete) {
                showSnackbar('Erreur : Action non trouvée', 'error');
                return;
            }

            const response = await axios.delete(`http://${apiUrl}:3100/api/planaction/${userIdToDelete}`);

            if (response.status === 204 || response.status === 200) {
                // Met à jour la liste des actions localement
                setAddactions(prevAddactions => prevAddactions.filter(addaction => addaction._id !== userIdToDelete));

                // Crée un log pour la suppression
                await logAction({
                    actionType: 'suppression',
                    details: `Suppression de l'action - Action: ${actionToDelete.AddAction} - Entreprise: ${actionToDelete.AddActionEntreprise} - Année: ${actionToDelete.AddActionanne}`,
                    entity: 'Plan Action',
                    entityId: userIdToDelete,
                    entreprise: actionToDelete.AddActionEntreprise
                });

                showSnackbar('Action supprimée avec succès', 'success');
            } else {
                showSnackbar(`Erreur lors de la suppression de l'action: ${response.status} ${response.statusText}`, 'error');
            }
        } catch (error) {
            console.error(error);
            showSnackbar('Erreur lors de la suppression de l\'action', 'error');
        }
    }, [apiUrl, users, logAction, showSnackbar]);

    const refreshListAccidents = useCallback(() => {
        setLoading(true);
        axios.get(`http://${apiUrl}:3100/api/planaction`)
            .then(response => {
                setAddactions(response.data);
                showSnackbar('Liste des actions actualisée', 'success');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                showSnackbar('Erreur lors de l\'actualisation de la liste des actions', 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [showSnackbar]);

    const onSubmit = useCallback((data) => {
        axios.put(`http://${apiUrl}:3100/api/planaction`, data)
            .then(response => {
                showSnackbar('Action en cours d\'enregistrement', 'success');
                setTimeout(() => showSnackbar('Action enregistrée avec succès', 'success'), 1000);
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
                showSnackbar('Erreur lors de la création de l\'action', 'error');
            });
    }, [showSnackbar]);

    const userEnterprise = userInfo?.entreprisesConseillerPrevention || [];

    const canViewAction = useCallback((action) => {
        if (isAdminOrDev) {
            return true;
        } else {
            return userEnterprise.includes(action.AddActionEntreprise);
        }
    }, [isAdminOrDev, userEnterprise]);

    const sortByYear = useCallback((a, b) => {
        return parseInt(a.AddActionanne) - parseInt(b.AddActionanne);
    }, []);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    //format d'affichage AddActionDange
    /**
     * Formatte une chaîne de catégories de dangers pour en faire une chaîne lisible.
     * Exemple : "DangerChuteDeHauteur" devient "Danger chute de hauteur"
     * @param {string|undefined} dangers - La chaîne de catégories de dangers à formatter
     * @returns {string} - La chaîne formatée
     */
    const formatDangerCategories = (dangers) => {
        try {
            if (!dangers) return '';
            const dangerString = typeof dangers === 'string' ? dangers : String(dangers);
            return dangerString.split(/(?=[A-Z])/).join(' ');
        } catch (error) {
            console.error('Erreur lors du formatage des dangers:', error);
            return dangers || ''; // Retourne la valeur originale ou une chaîne vide
        }
    };


    return (
        <div style={{ margin: '0 20px' }}>
            <form className="background-image" onSubmit={handleSubmit(onSubmit)}>

                <h2>Plan d'actions</h2>
                <EnterpriseStats actions={filteredUsers.filter(action => canViewAction(action))} />

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                    <Grid item xs={6} style={{ marginRight: '20px' }}>
                        <Tooltip title="Cliquez ici pour actualiser le tableau des actions" arrow>
                            <Button
                                sx={{
                                    marginLeft: '20px',
                                    color: darkMode ? '#ffffff' : 'black',
                                    padding: '15px 60px',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
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

                    <Grid item xs={6} style={{ marginRight: '20px' }}>
                        <Tooltip title="Filtrer par année" arrow>
                            <FormControl sx={{
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                minWidth: 120,
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                '& .MuiInputLabel-root': {
                                    color: darkMode ? '#fff' : 'inherit'
                                },
                                '& .MuiOutlinedInput-root': {
                                    color: darkMode ? '#fff' : 'inherit',
                                    '& fieldset': {
                                        borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                    }
                                }
                            }}>
                                <InputLabel id="years-select-label">Filtrer par année(s)</InputLabel>
                                <Select
                                    labelId="years-select-label"
                                    multiple
                                    value={selectedYears}
                                    onChange={handleYearsChange}
                                    input={<OutlinedInput label="Filtrer par année(s)" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 48 * 4.5 + 8,
                                                width: 250,
                                                backgroundColor: darkMode ? '#424242' : '#fff'
                                            },
                                        },
                                    }}
                                >
                                    {availableYears.map((year) => (
                                        <MenuItem
                                            key={year}
                                            value={year}
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                                color: darkMode ? '#fff' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedYears.indexOf(year) > -1}
                                                sx={{
                                                    marginRight: 8,
                                                    color: darkMode ? '#4CAF50' : '#257525',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#81C784' : '#257525'
                                                    }
                                                }}
                                            />
                                            <ListItemText primary={year} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={6} style={{ marginRight: '20px' }}>
                        <Tooltip title="Filtrer les actions par mots clés" arrow>
                            <TextField
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    '& .MuiOutlinedInput-root': {
                                        color: darkMode ? '#fff' : 'inherit',
                                        '& fieldset': {
                                            borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                        }
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item xs={6} style={{ marginRight: '20px' }}>
                        <Tooltip title="Cliquez ici pour exporter les données du plan d'action, en excel, en fonction des filtres sélèctionnés " arrow>
                            <Button
                                sx={{
                                    marginRight: '20px',
                                    color: darkMode ? '#ffffff' : 'black',
                                    padding: '15px 60px',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                                variant="contained"
                                color="primary"
                                onClick={() => handleExport()}
                                startIcon={<FileUploadIcon />}
                            >
                                Action
                            </Button>
                        </Tooltip>
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
                            <React.Fragment>
                                <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                    style={{
                                        backgroundColor: darkMode ? '#535353' : '#0098f950',
                                    }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Priorité</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Année</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Mois</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Catégorie du risque</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Crée quand</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Par qui</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Download</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                                </TableRow>
                            </React.Fragment>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .sort(sortByYear)
                                .map((addaction, index) => (
                                    canViewAction(addaction) && (
                                        <TableRow
                                            key={addaction._id || `action-${index}`}
                                            className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                            style={{
                                                backgroundColor: getRowColor(addaction.AddboolStatus, index)
                                            }}
                                        >
                                            <TableCell>
                                                <Typography style={{
                                                    color: listeaddaction.priority[addaction.priority]
                                                }}>
                                                    {addaction.priority}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Sélectionnez quand l'action est réalisée" arrow>
                                                    <Checkbox
                                                        sx={{
                                                            ...checkboxStyle,
                                                            '& .MuiSvgIcon-root': { fontSize: 25 }
                                                        }}
                                                        color="success"
                                                        checked={addaction.AddboolStatus}
                                                        onChange={async () => {
                                                            const newStatus = !addaction.AddboolStatus;
                                                            try {
                                                                await axios.put(`http://${apiUrl}:3100/api/planaction/${addaction._id}`, {
                                                                    AddboolStatus: newStatus
                                                                });
                                                                setAddactions(prev =>
                                                                    prev.map(action =>
                                                                        action._id === addaction._id
                                                                            ? { ...action, AddboolStatus: newStatus }
                                                                            : action
                                                                    )
                                                                );
                                                                showSnackbar('Status mise à jour avec succès', 'success');
                                                            } catch (error) {
                                                                console.error('Erreur lors de la mise à jour du statut:', error.message);
                                                                showSnackbar('Erreur lors de la mise à jour du statut', 'error');
                                                            }
                                                        }}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{addaction.AddActionanne}</TableCell>
                                            <TableCell>{addaction.AddActoinmoi}</TableCell>
                                            <TableCell>{addaction.AddActionEntreprise}</TableCell>
                                            <TableCell>{addaction.AddActionSecteur}</TableCell>
                                            <TableCell>{addaction.AddAction}</TableCell>
                                            <TableCell>{formatDangerCategories(addaction.AddActionDange)}</TableCell>
                                            <TableCell>{formatDate(addaction.AddActionDate)}</TableCell>
                                            <TableCell>{addaction.AddActionQui}</TableCell>
                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour éditer les données de l'action" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                                        transition: 'all 0.3s ease-in-out',
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
                                                        onClick={() => handleEdit(addaction._id)}
                                                    >
                                                        <EditIcon />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour ajouter des fichiers a l'action" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? '#7b1fa2' : '#9c27b0',
                                                        transition: 'all 0.3s ease-in-out',
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
                                                        onClick={() => {
                                                            if (!isFileUploadIcon) {
                                                                navigate('/actionfichierdll', { state: addaction._id });
                                                            } else {
                                                                navigate('/');
                                                            }
                                                        }}
                                                    >
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour supprimer l'action" arrow>
                                                    <Button sx={{
                                                        backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                        transition: 'all 0.3s ease-in-out',
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
                                                                        <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet action?</p>
                                                                        <div className="custom-confirm-buttons">
                                                                            <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                                                <button
                                                                                    className="custom-confirm-button"
                                                                                    onClick={() => {
                                                                                        handleDelete(addaction._id);
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
                                                        }}>
                                                        <DeleteForeverIcon />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
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
                <div className="image-cortigroupe"></div>
                <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
                    <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe.</h5>
                </Tooltip>
            </form >
        </div>
    );
}
