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
import { useTheme } from '../Hook/ThemeContext.js';
import EnterpriseStats from './entrepriseStats';
import createFilteredUsers from './filteredUsers';
import createFetchData from './fetchData.js';
import createHandleExport from './handleExport';
import { useLogger } from '../Hook/useLogger';
import { blueGrey } from '@mui/material/colors';
import BoutonArchiver from '../Archives/BoutonArchiver';
import Footer from '../_composants/Footer';
import {
    COOKIE_PREFIXES,
    getSelectedEnterpriseFromCookie,
    saveEnterpriseSelection
} from '../Accidents/_actions/cookieUtils';
import listeaddaction from '../liste/listeaddaction.json';
import useYearFilter from '../Hook/useYearFilter';

const apiUrl = config.apiUrl;



/**
 * Page qui affiche le plan d'action
 * @param {object} accidentData Données de l'accident
 * @returns {JSX.Element} La page du plan d'action
 */
export default function PlanAction({ accidentData }) {
    const [availableYears, setAvailableYears] = useState([]);
    const { selectedYears, setSelectedYears, handleYearChange } = useYearFilter(
        COOKIE_PREFIXES.PLAN_ACTION,
        availableYears
    );
    const [enterprises, setEnterprises] = useState([]);
    const { logAction } = useLogger();
    const { darkMode } = useTheme();
    const [users, setAddactions] = useState([]);
    const { handleSubmit } = useForm();
    const location = useLocation();
    const isFileUploadIcon = location.pathname === '/actionfichierdll';
    const [searchTerm, setSearchTerm] = useState('');
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);
    const { userInfo, isAdminOrDev } = useUserConnected();
    const currentYear = new Date().getFullYear().toString();
    const [isLoading, setLoading] = useState(true);
    const [selectedEnterprises, setSelectedEnterprises] = useState(() => {
        const savedEnterprises = getSelectedEnterpriseFromCookie(COOKIE_PREFIXES.PLAN_ACTION);
        return Array.isArray(savedEnterprises) ? savedEnterprises : [];
    });
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

    const FORM_CONTROL_STYLES = {
        DARK: {
            bg: '#424242',
            border: 'rgba(255,255,255,0.3)',
            hoverBorder: 'rgba(255,255,255,0.5)',
            text: '#fff',
            shadow: '0 3px 6px rgba(255,255,255,0.1)',
            hoverShadow: '0 6px 12px rgba(255,255,255,0.2)'
        },
        LIGHT: {
            bg: '#ee742d59',
            border: 'rgba(0,0,0,0.23)',
            hoverBorder: 'rgba(0,0,0,0.5)',
            text: 'inherit',
            shadow: 3,
            hoverShadow: 6
        }
    };

    // Memoized style generator
    const getFormControlStyles = useMemo(() => (isDark) => ({
        width: '100%',
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isDark ? FORM_CONTROL_STYLES.DARK.bg : FORM_CONTROL_STYLES.LIGHT.bg,
        boxShadow: isDark ? FORM_CONTROL_STYLES.DARK.shadow : FORM_CONTROL_STYLES.LIGHT.shadow,
        '&:hover': {
            boxShadow: isDark ? FORM_CONTROL_STYLES.DARK.hoverShadow : FORM_CONTROL_STYLES.LIGHT.hoverShadow,
            transform: 'translateY(-2px)'
        },
        '& .MuiOutlinedInput-root': {
            color: isDark ? FORM_CONTROL_STYLES.DARK.text : FORM_CONTROL_STYLES.LIGHT.text,
            '& fieldset': {
                borderColor: isDark ? FORM_CONTROL_STYLES.DARK.border : FORM_CONTROL_STYLES.LIGHT.border,
                transition: 'border-color 0.2s ease-in-out'
            },
            '&:hover fieldset': {
                borderColor: isDark ? FORM_CONTROL_STYLES.DARK.hoverBorder : FORM_CONTROL_STYLES.LIGHT.hoverBorder
            }
        },
        '& .MuiInputLabel-root, & .MuiSvgIcon-root': {
            color: isDark ? FORM_CONTROL_STYLES.DARK.text : FORM_CONTROL_STYLES.LIGHT.text
        }
    }), []);

    const ITEM_MARGIN = '20px';
    const BUTTON_STYLES = {
        DARK: {
            color: '#ffffff',
            backgroundColor: '#424242',
            hoverBg: '#7a8e1c',
            boxShadow: '0 3px 6px rgba(255,255,255,0.1)',
            hoverShadow: '0 6px 12px rgba(255,255,255,0.2)'
        },
        LIGHT: {
            color: 'black',
            backgroundColor: '#ee742d59',
            hoverBg: '#95ad22',
            boxShadow: 3,
            hoverShadow: 6
        }
    };

    const getButtonStyles = useMemo(() => (isDark) => ({
        color: isDark ? BUTTON_STYLES.DARK.color : BUTTON_STYLES.LIGHT.color,
        padding: '15px 60px',
        backgroundColor: isDark ? BUTTON_STYLES.DARK.backgroundColor : BUTTON_STYLES.LIGHT.backgroundColor,
        transition: 'all 0.1s ease-in-out',
        boxShadow: isDark ? BUTTON_STYLES.DARK.boxShadow : BUTTON_STYLES.LIGHT.boxShadow,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: isDark ? BUTTON_STYLES.DARK.hoverBg : BUTTON_STYLES.LIGHT.hoverBg,
            transform: 'scale(1.08)',
            boxShadow: isDark ? BUTTON_STYLES.DARK.hoverShadow : BUTTON_STYLES.LIGHT.hoverShadow
        },
        '& .MuiSvgIcon-root': {
            color: isDark ? '#fff' : 'inherit'
        }
    }), []);

    const COLORS = {
        DARK: {
            BG: '#424242',
            BG_HOVER: '#505050',
            TEXT: '#fff',
            CHECKBOX: '#4CAF50',
            CHECKBOX_CHECKED: '#81C784'
        },
        LIGHT: {
            BG: '#ee742d59',
            BG_HOVER: '#ee742d80',
            TEXT: 'inherit',
            CHECKBOX: '#257525',
            CHECKBOX_CHECKED: '#257525'
        }
    };

    const getMenuItemStyles = useMemo(() => (isDark) => ({
        backgroundColor: isDark ? COLORS.DARK.BG : COLORS.LIGHT.BG,
        color: isDark ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
        '&:hover': {
            backgroundColor: isDark ? COLORS.DARK.BG_HOVER : COLORS.LIGHT.BG_HOVER
        },
        '&.Mui-selected': {
            backgroundColor: `${isDark ? COLORS.DARK.BG : COLORS.LIGHT.BG} !important`
        },
        '&.Mui-selected:hover': {
            backgroundColor: `${isDark ? COLORS.DARK.BG_HOVER : COLORS.LIGHT.BG_HOVER} !important`
        }
    }), []);

    const getCheckboxStyles = useMemo(() => (isDark) => ({
        color: isDark ? COLORS.DARK.CHECKBOX : COLORS.LIGHT.CHECKBOX,
        '&.Mui-checked': {
            color: isDark ? COLORS.DARK.CHECKBOX_CHECKED : COLORS.LIGHT.CHECKBOX_CHECKED
        }
    }), []);

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

    const getRowColor = useCallback((isChecked, index) => {
        const theme = darkMode ? 'dark' : 'light';
        if (isChecked) {
            return rowColors[theme].checked;
        }
        return rowColors[theme].rows[index % 2];
    }, [darkMode, rowColors]);

    const checkboxStyle = useMemo(
        () => ({
            '&.Mui-checked': {
                color: darkMode ? '#70f775' : '#2e7d32',
            },
        }),
        [darkMode]
    );

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
        const token = JSON.parse(localStorage.getItem('token'));
        const savedYears = token?.data?.selectedYears || [];
        const validYears = savedYears.filter(year => availableYrs.includes(year));
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
                fetchData();
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

    const refreshListActions = useCallback(() => {
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
                        <Grid item xs={6} sx={{ pr: ITEM_MARGIN }}>
                            <Tooltip title="Filtrer par entreprise" arrow>
                                <FormControl
                                    sx={getFormControlStyles(darkMode)}>
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
                                            sx={getMenuItemStyles(darkMode)}
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
                                                sx={getCheckboxStyles(darkMode)}
                                            />
                                            <ListItemText
                                                primary="Toutes les entreprises"
                                                sx={{ color: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT }}
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
                                                    sx={getMenuItemStyles(darkMode)}
                                                >
                                                    <Checkbox
                                                        checked={selectedEnterprises?.includes(enterprise.label)}
                                                        sx={getCheckboxStyles(darkMode)}
                                                    />
                                                    <ListItemText
                                                        primary={enterprise.label}
                                                        sx={{ color: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT }}
                                                    />
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Tooltip>
                        </Grid>
                    ) : null}
                    <Grid item xs={6} sx={{ pr: ITEM_MARGIN }}>
                        <Tooltip title="Cliquez ici pour actualiser le tableau des actions" arrow>
                            <Button
                                sx={getButtonStyles(darkMode)}
                                variant="contained"
                                color="secondary"
                                onClick={refreshListActions}
                                startIcon={<RefreshIcon />}
                            >
                                Actualiser
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} sx={{ pr: ITEM_MARGIN }}>
                        <Tooltip title="Filtrer par année" arrow>
                            <FormControl
                                sx={getFormControlStyles(darkMode)}>
                                <InputLabel id="years-select-label" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                                    Année
                                </InputLabel>
                                <Select
                                    labelId="years-select-label"
                                    id="years-select"
                                    multiple
                                    value={selectedYears}
                                    onChange={handleYearChange}
                                    renderValue={(selected) => `${selected.length} année(s)`}
                                >
                                    <MenuItem
                                        value="all"
                                        sx={getMenuItemStyles(darkMode)}
                                    >
                                        <Checkbox
                                            checked={selectedYears.length === availableYears.length}
                                            indeterminate={selectedYears.length > 0 && selectedYears.length < availableYears.length}
                                            sx={getCheckboxStyles(darkMode)}
                                        />
                                        <ListItemText
                                            primary="Tout sélectionner"
                                            sx={{ color: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT }}
                                        />
                                    </MenuItem>
                                    {availableYears.map((year) => (
                                        <MenuItem
                                            key={year}
                                            value={year}
                                            sx={getMenuItemStyles(darkMode)}
                                        >
                                            <Checkbox
                                                checked={selectedYears.includes(year)}
                                                sx={getCheckboxStyles(darkMode)}
                                            />
                                            <ListItemText
                                                primary={year}
                                                sx={{ color: darkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} sx={{ pr: ITEM_MARGIN }}>
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
                    <Grid item xs={6} sx={{ pr: ITEM_MARGIN }}>
                        <Tooltip title="Cliquez ici pour exporter les données du plan d'action, en excel, en fonction des filtres sélèctionnés " arrow>
                            <Button
                                sx={getButtonStyles(darkMode)}
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
                        maxHeight: '900px',
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
                                                                navigate('/Accident');
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
                                                            refreshListActions();
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
            </form >
        </div>
    );
}