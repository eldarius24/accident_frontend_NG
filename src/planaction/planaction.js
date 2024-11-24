import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Checkbox, Grid, TextField, Tooltip,
    FormControl, InputLabel, Select, MenuItem, ListItemText, OutlinedInput, Typography, Chip,
    Box
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
import createUpdateUserSelectedEnterprise from './updateUserSelectedEnterprise';
import BoutonArchiver from '../Archives/BoutonArchiver';
import {
    COOKIE_PREFIXES,
    getSelectedYearsFromCookie,
    getSelectedEnterpriseFromCookie,
    saveEnterpriseSelection
} from '../Home/_actions/cookieUtils';
import listeaddaction from '../liste/listeaddaction.json';
const apiUrl = config.apiUrl;

/**
 * Page qui affiche le plan d'action
 * @param {object} accidentData Données de l'accident
 * @returns {JSX.Element} La page du plan d'action
 */
export default function PlanAction({ accidentData }) {
    const [enterprises, setEnterprises] = useState([]);
    const [archiveOuverte, setArchiveOuverte] = useState(false);
    const { logAction } = useLogger();
    const { darkMode } = useTheme();
    const [users, setAddactions] = useState([]);
    const { handleSubmit } = useForm();
    const location = useLocation();
    const isFileUploadIcon = location.pathname === '/actionfichierdll';
    const [searchTerm, setSearchTerm] = useState('');
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);
    const { isAdmin, userInfo, isAdminOrDev } = useUserConnected();
    const currentYear = new Date().getFullYear().toString();
    const [isLoading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [selectedEnterprises, setSelectedEnterprises] = useState(() => {
        const savedEnterprises = getSelectedEnterpriseFromCookie(COOKIE_PREFIXES.PLAN_ACTION);
        return Array.isArray(savedEnterprises) ? savedEnterprises : [];
    });
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
            selectedEnterprises,
            searchTerm,
            showSnackbar,
            logAction
        ),
        [users, isAdminOrDev, userInfo, selectedYears, selectedEnterprises, searchTerm, showSnackbar, logAction]
    );


    const updateUserSelectedEnterprise = useCallback(
        (newValue) => {
            createUpdateUserSelectedEnterprise(showSnackbar)(
                { isAdminOrDev, entreprisesConseillerPrevention: userInfo?.entreprisesConseillerPrevention },
                setSelectedEnterprises  // Changé de setSelectedEnterprise à setSelectedEnterprises
            )(newValue);
        },
        [showSnackbar, userInfo, isAdminOrDev]
    );

    const updateUserSelectedYears = useCallback(
        createUpdateUserSelectedYears(apiUrl, showSnackbar)(userInfo, setSelectedYears),
        [apiUrl, showSnackbar, userInfo]
    );

    const getFilteredUsers = useMemo(() => createFilteredUsers(), []);

    const filteredUsers = useMemo(
        () => getFilteredUsers(
            users,
            searchTerm,
            selectedYears,
            selectedEnterprises,
            isAdminOrDev,
            userInfo
        ),
        [getFilteredUsers, users, searchTerm, selectedYears, selectedEnterprises, isAdminOrDev, userInfo]
    );

    const handleEnterpriseChange = (event) => {
        const newValues = event.target.value;
        try {
            // Cas où on sélectionne ou désélectionne depuis "Toutes les entreprises"
            if (Array.isArray(newValues) && newValues.includes('')) {
                // Si on sélectionne "Toutes les entreprises", on vide la sélection
                setSelectedEnterprises([]);
                saveEnterpriseSelection(COOKIE_PREFIXES.PLAN_ACTION, []);
            } else {
                // Sélection normale
                const validValues = Array.isArray(newValues) ? newValues : [];
                setSelectedEnterprises(validValues);
                saveEnterpriseSelection(COOKIE_PREFIXES.PLAN_ACTION, validValues);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des entreprises:', error);
            showSnackbar('Erreur lors de la sauvegarde des entreprises', 'error');
        }
    };

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     * 
     * @param {object} event - L'événement qui a déclenché la fermeture de la snackbar.
     * @param {string} reason - La raison pour laquelle la snackbar se ferme. Si elle vaut 'clickaway', cela signifie que l'utilisateur a cliqué en dehors de la snackbar.
     */
    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

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



    const handleYearsChange = useCallback((event) => {
        const newSelectedYears = event.target.value;
        setSelectedYears(newSelectedYears);
        updateUserSelectedYears(newSelectedYears);
    }, [updateUserSelectedYears]);

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
            if (!actionToEdit) {
                showSnackbar('Erreur : Action non trouvée', 'error');
                return;
            }

            await logAction({
                actionType: 'consultation',
                details: `Consultation de l'action - Action: ${actionToEdit.AddAction} Risque: ${actionToEdit.AddActionDange.join(', ')} - Entreprise: ${actionToEdit.AddActionEntreprise} - Année: ${actionToEdit.AddActionanne}`,
                entity: 'Plan Action',
                entityId: actionIdToModify,
                entreprise: actionToEdit.AddActionEntreprise
            });

            navigate("/formulaireAction", { state: actionToEdit });
            showSnackbar('Modification de l\'action initiée', 'info');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la modification:', error);
            showSnackbar('Erreur lors de l\'initialisation de la modification', 'error');
        }
    }, [users, showSnackbar, logAction, navigate]);

    const fetchData = useCallback(
        createFetchData(apiUrl)(
            setAddactions,
            setEnterprises,
            setAllSectors,
            setAvailableSectors,
            setLoading,
            showSnackbar,
            isAdminOrDev,
            userInfo
        ),
        [apiUrl, isAdminOrDev, userInfo]
    );

    useEffect(() => {
        fetchData();

    }, []);

    useEffect(() => {
        const savedEnterprises = getSelectedEnterpriseFromCookie(COOKIE_PREFIXES.PLAN_ACTION);
        if (Array.isArray(savedEnterprises) && savedEnterprises.length > 0) {
            setSelectedEnterprises(savedEnterprises);
        }
    }, []);

    useEffect(() => {
        if (users?.length) {
            const years = [...new Set(users.map(action => action.AddActionanne))]
                .filter(Boolean)
                .sort();
            setAvailableYears(years);
        }
    }, [users]);
    // Modifiez d'abord les useEffects pour la gestion des années disponibles et sélectionnées
    useEffect(() => {
        if (!users?.length) return;

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

        // Filtrer les années valides
        const validYears = savedYears.filter(year => availableYrs.includes(year));

        // Mettre à jour les années sélectionnées si elles diffèrent
        setSelectedYears(prevSelected =>
            JSON.stringify(prevSelected) !== JSON.stringify(validYears) ? validYears : prevSelected
        );
    }, []);

    const handleDelete = useCallback(async (userIdToDelete) => {
        try {
            const actionToDelete = users.find(action => action._id === userIdToDelete);
            if (!actionToDelete) {
                showSnackbar('Erreur : Action non trouvée', 'error');
                return;
            }

            const response = await axios.delete(`http://${apiUrl}:3100/api/planaction/${userIdToDelete}`);

            if (response.status === 204 || response.status === 200) {
                fetchData(); // Utiliser fetchData au lieu de setAddactions

                await logAction({
                    actionType: 'suppression',
                    details: `Suppression de l'action - Action: ${actionToDelete.AddAction} - Entreprise: ${actionToDelete.AddActionEntreprise} - Année: ${actionToDelete.AddActionanne}`,
                    entity: 'Plan Action',
                    entityId: userIdToDelete,
                    entreprise: actionToDelete.AddActionEntreprise
                });
                showSnackbar('Action supprimée avec succès', 'success');
            }
        } catch (error) {
            console.error(error);
            showSnackbar('Erreur lors de la suppression de l\'action', 'error');
        }
    }, [users, apiUrl, logAction, showSnackbar]);

    const refreshListAccidents = useCallback(() => {
        setLoading(true);
        fetchData();
    }, []);

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
    }, [apiUrl, showSnackbar]);

    const userEnterprise = userInfo?.entreprisesConseillerPrevention || [];

    const canViewAction = useCallback((action) => {
        if (isAdminOrDev) return true;
        return userEnterprise.includes(action.AddActionEntreprise);
    }, [isAdminOrDev, userEnterprise]);

    const sortByYear = useCallback((a, b) => {
        return parseInt(a.AddActionanne) - parseInt(b.AddActionanne);
    }, []);

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
            return dangers || '';
        }
    };
    return (
        <div style={{ margin: '0 20px' }}>
            <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
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
                        Plan d'Actions
                    </Typography>
                </Box>
                <EnterpriseStats actions={filteredUsers.filter(action => canViewAction(action))} />
                <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                    {(isAdminOrDev) ? (
                        <Grid item xs={6}>
                            <Tooltip title="Filtrer par entreprise" arrow>
                                <FormControl sx={{
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    width: '250px',
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
                                    <InputLabel id="enterprise-select-label">Filtrer par entreprise(s)</InputLabel>
                                    <Select
                                        labelId="enterprise-select-label"
                                        multiple
                                        value={selectedEnterprises || []}
                                        onChange={(event) => {
                                            const { value } = event.target;
                                            const availableEnterprises = enterprises
                                                .filter(enterprise =>
                                                    isAdminOrDev ||
                                                    userInfo?.entreprisesConseillerPrevention?.includes(enterprise.label)
                                                )
                                                .map(enterprise => enterprise.label);

                                            // Si on clique sur une entreprise individuelle
                                            if (Array.isArray(value)) {
                                                handleEnterpriseChange(event);
                                            }
                                        }}
                                        input={<OutlinedInput label="Filtrer par entreprise(s)" />}
                                        renderValue={(selected) => {
                                            if (!selected || !Array.isArray(selected) || selected.length === 0) {
                                                return "Toutes les entreprises";
                                            }
                                            if (selected.length === enterprises.length) {
                                                return "Toutes les entreprises";
                                            }
                                            return Array.isArray(selected) ? selected.join(', ') : '';
                                        }}
                                        sx={{
                                            '& .MuiSelect-icon': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            }
                                        }}
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
                                        <MenuItem
                                            value=""
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                                color: darkMode ? '#fff' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedEnterprises?.length === enterprises.filter(enterprise =>
                                                    isAdminOrDev ||
                                                    userInfo?.entreprisesConseillerPrevention?.includes(enterprise.label)
                                                ).length && selectedEnterprises.length > 0}
                                                indeterminate={selectedEnterprises?.length > 0 &&
                                                    selectedEnterprises?.length < enterprises.filter(enterprise =>
                                                        isAdminOrDev ||
                                                        userInfo?.entreprisesConseillerPrevention?.includes(enterprise.label)
                                                    ).length}
                                                onChange={(event) => {
                                                    const availableEnterprises = enterprises
                                                        .filter(enterprise =>
                                                            isAdminOrDev ||
                                                            userInfo?.entreprisesConseillerPrevention?.includes(enterprise.label)
                                                        )
                                                        .map(enterprise => enterprise.label);

                                                    handleEnterpriseChange({
                                                        target: {
                                                            value: event.target.checked ? availableEnterprises : []
                                                        }
                                                    });
                                                }}
                                                sx={{
                                                    color: darkMode ? '#ff6b6b' : 'red',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#ff8080' : 'red'
                                                    }
                                                }}
                                            />
                                            <ListItemText
                                                primary="Toutes les entreprises"
                                                sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                            />
                                        </MenuItem>
                                        {enterprises
                                            .filter(enterprise =>
                                                isAdminOrDev ||
                                                userInfo?.entreprisesConseillerPrevention?.includes(enterprise.label)
                                            )
                                            .map((enterprise) => (
                                                <MenuItem
                                                    key={enterprise.label}
                                                    value={enterprise.label}
                                                    sx={{
                                                        backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                                        color: darkMode ? '#fff' : 'inherit',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                                        }
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={selectedEnterprises?.includes(enterprise.label)}
                                                        sx={{
                                                            color: darkMode ? '#4CAF50' : '#257525',
                                                            '&.Mui-checked': {
                                                                color: darkMode ? '#81C784' : '#257525'
                                                            }
                                                        }}
                                                    />
                                                    <ListItemText
                                                        primary={enterprise.label}
                                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                                    />
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Tooltip>
                        </Grid>
                    ) : null}
                    <Grid item xs={6} style={{ marginRight: '20px' }}>
                        <Tooltip title="Cliquez ici pour actualiser le tableau des actions" arrow>
                            <Button
                                sx={{
                                    marginLeft: '20px',
                                    color: darkMode ? '#ffffff' : 'black',
                                    padding: '15px 60px',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
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
                                width: '200px',
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
                                <InputLabel id="years-select-label" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                                    Année
                                </InputLabel>
                                <Select
                                    labelId="years-select-label"
                                    id="years-select"
                                    multiple
                                    value={selectedYears}
                                    onChange={handleYearsChange}
                                    renderValue={(selected) => {
                                        if (!selected || !Array.isArray(selected) || selected.length === 0) {
                                            return "Toutes les années";
                                        }
                                        return selected.join(', ');
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
                                            checked={selectedYears?.length === availableYears.length}
                                            onChange={(event) => {
                                                const newValue = event.target.checked ? availableYears : [];
                                                handleYearsChange({ target: { value: newValue } });
                                            }}
                                            sx={{
                                                color: darkMode ? '#ff6b6b' : 'red',
                                                '&.Mui-checked': {
                                                    color: darkMode ? '#ff8080' : 'red'
                                                }
                                            }}
                                        />
                                        <ListItemText
                                            primary="Toutes les années"
                                            sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                        />
                                    </MenuItem>
                                    {availableYears.map((year) => (
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
                                    transition: 'all 0.1s ease-in-out',
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
                </Box>
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
                                    {(isAdminOrDev) ? (
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Archiver</TableCell>
                                    ) : null}
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
                                                <Chip
                                                    label={addaction.priority}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${listeaddaction.priority[addaction.priority]}99`, // 60% opacity for background
                                                        border: '1px solid',
                                                        borderColor: listeaddaction.priority[addaction.priority],
                                                        color: 'white',
                                                        '& .MuiChip-label': {
                                                            fontWeight: 500,
                                                            color: 'white'
                                                        }
                                                    }}
                                                />
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
                                            {(isAdminOrDev) ? (
                                                <TableCell style={{ padding: 0, width: '70px' }}>

                                                    <BoutonArchiver
                                                        donnee={addaction}
                                                        type="planaction"
                                                        onSuccess={() => {
                                                            refreshListAccidents();
                                                            showSnackbar('Action archivée avec succès', 'success');
                                                        }}
                                                    />

                                                </TableCell>
                                            ) : null}
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