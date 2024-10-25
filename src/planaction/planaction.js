import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Checkbox, Grid, LinearProgress, TextField, Tooltip,
    Card, CardContent, Typography, FormControl, InputLabel, Select,
    MenuItem, ListItemText, OutlinedInput, createTheme
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
import { handleExportDataAction } from '../Model/excelGenerator.js';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../pageAdmin/user/ThemeContext';
const apiUrl = config.apiUrl;

// Extraction du composant de statistiques dans un composant mémorisé
const EnterpriseStats = React.memo(({ actions }) => {
    const { darkMode } = useTheme();
    const [, forceUpdate] = useState();

    useEffect(() => {
        forceUpdate({});
    }, [darkMode]);

    const getCardStyle = useCallback((completed, total) => {
        const completionRate = (completed / total) * 100;
        /**
         * Renvoie une couleur en fonction de la progression d'une t che (0-100%).
         * En mode sombre, les couleurs sont plus sombres.
         * @param {number} rate - Pourcentage de progression (0-100)
         * @returns {string} La couleur correspondante
         */
        const getColorByCompletion = (rate) => {
            if (darkMode) {
                // Couleurs plus sombres pour le mode sombre
                if (rate === 100) return '#50A150'; // Vert assombri
                if (rate >= 75) return '#7A9E7A'; // Vert clair assombri
                if (rate >= 50) return '#BFA980'; // Beige assombri
                if (rate >= 25) return '#B67F7F'; // Rose assombri
                return '#B68080'; // Rouge clair assombri
            } else {
                // Couleurs originales pour le mode clair
                if (rate === 100) return '#90EE90';
                if (rate >= 75) return '#B7E4B7';
                if (rate >= 50) return '#FFE4B5';
                if (rate >= 25) return '#FFB6B6';
                return '#FFCCCB';
            }
        };

        return {
            backgroundColor: getColorByCompletion(completionRate),
            color: darkMode ? '#ffffff' : 'inherit',
            boxShadow: darkMode ? '0 4px 8px 0 rgba(0,0,0,0.2)' : 3,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: darkMode ? '0 8px 16px 0 rgba(0,0,0,0.3)' : 6,
            }
        };
    }, [darkMode]);

    const getProgressBarColor = useCallback((completed, total) => {
        const completionRate = (completed / total) * 100;
        if (completionRate === 100) return '#006400';
        if (completionRate > 75) return '#4CAF50';
        if (completionRate > 50) return '#8BC34A';
        if (completionRate > 25) return '#FFA726';
        return '#FF5722';
    }, []);

    const getEnterpriseStats = useMemo(() => {
        const stats = {};
        actions.forEach(action => {
            const enterprise = action.AddActionEntreprise;
            if (!stats[enterprise]) {
                stats[enterprise] = {
                    total: 0,
                    completed: 0
                };
            }
            stats[enterprise].total += 1;
            if (action.AddboolStatus) {
                stats[enterprise].completed += 1;
            }
        });
        return stats;
    }, [actions]);

    return (
        <div>
            <Grid container spacing={2}>
                {Object.entries(getEnterpriseStats).map(([enterprise, { total, completed }]) => {
                    const completionRate = (completed / total) * 100;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={enterprise}>
                            <Card
                                sx={{
                                    ...getCardStyle(completed, total),
                                    '&:hover': {
                                        boxShadow: 6, // augmente l'ombre au survol
                                        transform: 'scale(1.02)', // agrandit légèrement la carte
                                        transition: 'all 0.3s ease-in-out'
                                    }
                                }}
                            >

                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: completionRate === 100 ? 'bold' : 'normal',
                                            color: completionRate === 100 ? '#006400' : 'inherit'
                                        }}
                                    >
                                        {enterprise}
                                        {completionRate === 100 &&
                                            <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>✓</span>
                                        }
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Actions totales: {total}
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            color: completionRate === 100 ? '#006400' : 'inherit'
                                        }}
                                    >
                                        Actions terminées: {completed}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Actions restantes: {total - completed}
                                    </Typography>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '4px',
                                            backgroundColor: '#e0e0e0',
                                            marginTop: '8px',
                                            borderRadius: '2px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${(completed / total) * 100}%`,
                                                height: '100%',
                                                backgroundColor: getProgressBarColor(completed, total),
                                                transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
                                                borderRadius: '2px'
                                            }}
                                        />
                                    </div>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            textAlign: 'right',
                                            fontWeight: completionRate === 100 ? 'bold' : 'normal',
                                            color: completionRate === 100 ? '#006400' : 'inherit'
                                        }}
                                    >
                                        {Math.round(completionRate)}% complété
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
});


/**
 * Page qui affiche le plan d'action
 * @param {object} accidentData Données de l'accident
 * @returns {JSX.Element} La page du plan d'action
 */
export default function PlanAction({ accidentData }) {
    const { darkMode } = useTheme();
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleSubmit } = useForm();
    const location = useLocation();
    const isFileUploadIcon = location.pathname === '/fichierdllaction';
    const [searchTerm, setSearchTerm] = useState('');
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);
    const { isAdmin, userInfo } = useUserConnected();
    const currentYear = new Date().getFullYear().toString();
    const [selectedYears, setSelectedYears] = useState(() => {
        // Récupérer les années depuis le localStorage
        const token = JSON.parse(localStorage.getItem('token'));
        return token?.data?.selectedYears || [];
    });
    const [availableYears, setAvailableYears] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const navigate = useNavigate();

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
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

    const updateUserSelectedYears = useCallback(async (newSelectedYears) => {
        try {
            if (!userInfo?._id) return;

            const response = await axios.put(
                `http://${apiUrl}:3100/api/users/${userInfo._id}/updateSelectedYears`,
                {
                    selectedYears: newSelectedYears
                }
            );

            if (response.data.success) {
                // Mettre à jour le localStorage
                const token = JSON.parse(localStorage.getItem('token'));
                token.data.selectedYears = newSelectedYears;
                localStorage.setItem('token', JSON.stringify(token));

                // Mettre à jour le state
                setSelectedYears(newSelectedYears);

                showSnackbar('Années sélectionnées mises à jour avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des années sélectionnées:', error);
            showSnackbar(
                `Erreur lors de la sauvegarde des années sélectionnées: ${error.response?.data?.message || error.message
                }`,
                'error'
            );
        }
    }, [userInfo?._id, apiUrl, showSnackbar]);


    const handleYearsChange = useCallback((event) => {
        const newSelectedYears = event.target.value;
        // Mettre à jour immédiatement l'état local
        setSelectedYears(newSelectedYears);
        // Puis mettre à jour le backend et le localStorage
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



    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);


    const handleEdit = useCallback((actionIdToModify) => {
        const actionToEdit = users.find(action => action._id === actionIdToModify);
        if (actionToEdit) {
            navigate("/formulaireAction", { state: actionToEdit });
            showSnackbar('Modification de l\'action initiée', 'info');
        } else {
            showSnackbar('Erreur : Action non trouvée', 'error');
        }
    }, [navigate, users, showSnackbar]);



    const fetchData = useCallback(async () => {
        try {
            const [actionsResponse, enterprisesResponse, sectorsResponse] = await Promise.all([
                axios.get(`http://${apiUrl}:3100/api/planaction`),
                axios.get(`http://${apiUrl}:3100/api/entreprises`),
                axios.get(`http://${apiUrl}:3100/api/secteurs`)
            ]);

            setAddactions(actionsResponse.data);
            let entreprisesData = enterprisesResponse.data.map(e => ({
                label: e.AddEntreName,
                id: e._id
            }));

            if (!isAdmin) {
                entreprisesData = entreprisesData.filter(e =>
                    userInfo.entreprisesConseillerPrevention?.includes(e.label)
                );
            }
            setEntreprises(entreprisesData);
            const secteursData = sectorsResponse.data;
            setAllSectors(secteursData);
            setAvailableSectors(secteursData.map(s => s.secteurName));
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Erreur lors de la récupération des données', 'error');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, userInfo, showSnackbar]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const years = [...new Set(users.map(action => action.AddActionanne))].filter(Boolean).sort();

        setAvailableYears(years.sort());

    }, [users]);



    // Modifiez d'abord les useEffects pour la gestion des années disponibles et sélectionnées
    useEffect(() => {
        // Obtenir les années disponibles en fonction des droits de l'utilisateur
        const getAvailableYearsForUser = () => {
            let filteredActions = isAdmin
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

    }, [users, isAdmin, userInfo?.entreprisesConseillerPrevention]);



    const filteredUsers = useMemo(() => {
        // Si aucune année n'est sélectionnée, retourner un tableau vide
        if (selectedYears.length === 0) {
            return [];
        }

        let filtered = users;

        // Filtrer d'abord par les entreprises de l'utilisateur si ce n'est pas un admin
        if (!isAdmin) {
            const userEntreprises = userInfo?.entreprisesConseillerPrevention || [];
            filtered = filtered.filter(action =>
                userEntreprises.includes(action.AddActionEntreprise)
            );
        }

        // Filtrer par années sélectionnées
        filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));

        // Appliquer le filtre de recherche si nécessaire
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(addaction =>
                ['AddActionEntreprise', 'AddActionDate', 'AddActionSecteur', 'AddAction', 'AddActionQui', 'AddActoinmoi', 'AddActionDange', 'AddActionanne']
                    .some(field => {
                        const value = addaction[field];
                        return value && String(value).toLowerCase().includes(searchTermLower);
                    })
            );
        }

        return filtered;
    }, [users, searchTerm, selectedYears, isAdmin, userInfo]);

    const handleDelete = useCallback((userIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/planaction/${userIdToDelete}`)
            .then(response => {
                if (response.status === 204 || response.status === 200) {
                    setAddactions(prevAddactions => prevAddactions.filter(addaction => addaction._id !== userIdToDelete));
                    showSnackbar('Action supprimée avec succès', 'success');
                } else {
                    showSnackbar(`Erreur lors de la suppression de l'action: ${response.status} ${response.statusText}`, 'error');
                }
            })
            .catch(error => {
                console.error(error);
                showSnackbar('Erreur lors de la suppression de l\'action', 'error');
            });
    }, [showSnackbar]);


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

    const getLinkedSecteurs = useCallback((entrepriseId) => {
        if (!entrepriseId) return [];
        return allSectors
            .filter(s => s.entrepriseId === entrepriseId)
            .map(s => s.secteurName);
    }, [allSectors]);


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
        if (isAdmin) {
            return true;
        } else {
            return userEnterprise.includes(action.AddActionEntreprise);
        }
    }, [isAdmin, userEnterprise]);

    const handleExport = useCallback(async () => {
        try {
            let dataToExport = users;

            // Filtre par entreprise si l'utilisateur n'est pas admin
            if (!isAdmin) {
                dataToExport = dataToExport.filter(action =>
                    userInfo.entreprisesConseillerPrevention?.includes(action.AddActionEntreprise)
                );
            }

            // Filtre par années sélectionnées
            if (selectedYears && selectedYears.length > 0) {
                dataToExport = dataToExport.filter(action =>
                    selectedYears.includes(action.AddActionanne)
                );
            }

            // Filtre par terme de recherche
            if (searchTerm) {
                const searchTermLower = searchTerm.toLowerCase();
                dataToExport = dataToExport.filter(addaction =>
                    ['AddActionEntreprise', 'AddActionDate', 'AddActionSecteur', 'AddAction',
                        'AddActionQui', 'AddActoinmoi', 'AddActionDange', 'AddActionanne']
                        .some(field => {
                            const value = addaction[field];
                            // Vérification et conversion sécurisée en chaîne
                            return value != null && String(value).toLowerCase().includes(searchTermLower);
                        })
                );
            }

            await handleExportDataAction(dataToExport);
            showSnackbar('Exportation des données réussie', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            showSnackbar('Erreur lors de l\'exportation des données', 'error');
        }
    }, [users, isAdmin, userInfo, selectedYears, searchTerm, showSnackbar]);
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
                                sx={{ marginLeft: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 }, boxShadow: 3, textTransform: 'none' }}
                                variant="contained"
                                color="secondary"
                                onClick={refreshListAccidents}
                                startIcon={<RefreshIcon />}
                            >
                                Actualiser
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} style={{ marginRight: '20px', backgroundColor: '#ee752d60' }}>
                        <Tooltip title="Filtrer par année" arrow>
                            <FormControl
                                sx={{ boxShadow: 3, minWidth: 120 }}>
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
                                            },
                                        },
                                    }}
                                >
                                    {availableYears.map((year) => (
                                        <MenuItem key={year} value={year} style={{ backgroundColor: '#ee742d59' }}>
                                            <Checkbox
                                                checked={selectedYears.indexOf(year) > -1}
                                                style={{ marginRight: 8, color: '#257525' }}
                                            />
                                            <ListItemText primary={year} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} style={{ marginRight: '20px' }}>
                        <Tooltip title="Filtrer les actions par mots clés" arrow>
                            <TextField
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ boxShadow: 3, backgroundColor: '#ee742d59' }}
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
                                sx={{ marginRight: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 }, boxShadow: 3, textTransform: 'none' }}
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
                                                <Tooltip title="Sélectionnez quand l'action est réalisée" arrow>
                                                    <Checkbox
                                                        sx={{
                                                            ...checkboxStyle,
                                                            '& .MuiSvgIcon-root': { fontSize: 25 }
                                                        }}
                                                        color="success"
                                                        checked={addaction.AddboolStatus}
                                                        onChange={() => {
                                                            const newStatus = !addaction.AddboolStatus;
                                                            axios.put(`http://${apiUrl}:3100/api/planaction/${addaction._id}`, {
                                                                AddboolStatus: newStatus
                                                            })
                                                                .then(response => {
                                                                    console.log('Statut mis à jour avec succès:', response.data);
                                                                    refreshListAccidents();
                                                                })
                                                                .catch(error => {
                                                                    console.error('Erreur lors de la mise à jour du statut:', error.message);
                                                                    showSnackbar('Erreur lors de la mise à jour du statut', 'error');
                                                                });
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
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
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
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }}
                                                        component={Link} to={isFileUploadIcon ? '/' : '/fichierdllaction'}
                                                        variant="contained"
                                                        color="secondary">
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour supprimer l'action" arrow>
                                                    <Button sx={{
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }}
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            confirmAlert({
                                                                /**
                                                                 * Boîte de dialogue personnalisée pour demander confirmation de suppression de l'action
                                                                 * @param {{ onClose: () => void }} props - Fonction pour fermer la boîte de dialogue
                                                                 * @returns {JSX.Element} Le JSX Element qui contient la boîte de dialogue personnalisée
                                                                 * La boîte de dialogue contient un titre, un message de confirmation et deux boutons : "Oui" et "Non".
                                                                 * Lorsque le bouton "Oui" est cliqué, la fonction handleDelete est appelée
                                                                 * avec l'id de l'action à supprimer, et la fonction onClose est appelée pour fermer la boîte de dialogue.
                                                                 * Lorsque le bouton "Non" est cliqué, la fonction onClose est appelée pour fermer la boîte de dialogue.
                                                                 */
                                                                customUI: ({ onClose }) => (
                                                                    <div className="custom-confirm-dialog">
                                                                        <h1 className="custom-confirm-title">Supprimer</h1>
                                                                        <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet action?</p>
                                                                        <div className="custom-confirm-buttons">
                                                                            <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                                                <button className="custom-confirm-button" onClick={() => { handleDelete(addaction._id); onClose(); }}>
                                                                                    Oui
                                                                                </button>
                                                                            </Tooltip>
                                                                            <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                                                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
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
                <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                    <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
                </Tooltip>
            </form >
        </div>


    );
}
