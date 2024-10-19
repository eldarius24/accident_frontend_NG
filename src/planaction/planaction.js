import axios from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../pageFormulaire/formulaire.css';
import config from '../config.json';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Checkbox,
    Grid,
    LinearProgress,
    TextField,
    Tooltip,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
    OutlinedInput
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useUserConnected } from '../Hook/userConnected';
import CustomSnackbar from '../_composants/CustomSnackbar';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { handleExportDataAction } from '../Model/excelGenerator.js';
import AddIcon from '@mui/icons-material/Add';
import TextFieldP from '../_composants/textFieldP';
const apiUrl = config.apiUrl;

// Extraction du composant de statistiques dans un composant mémorisé
const EnterpriseStats = React.memo(({ actions }) => {
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

    const getCardStyle = useCallback((completed, total) => {
        const completionRate = (completed / total) * 100;
        const getColorByCompletion = (rate) => {
            if (rate === 100) return '#90EE90';
            if (rate >= 75) return '#B7E4B7';
            if (rate >= 50) return '#FFE4B5';
            if (rate >= 25) return '#FFB6B6';
            return '#FFCCCB';
        };

        return {
            backgroundColor: getColorByCompletion(completionRate),
            boxShadow: 3,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease-in-out'
            }
        };
    }, []);

    const getProgressBarColor = useCallback((completed, total) => {
        const completionRate = (completed / total) * 100;
        if (completionRate === 100) return '#006400';
        if (completionRate > 75) return '#4CAF50';
        if (completionRate > 50) return '#8BC34A';
        if (completionRate > 25) return '#FFA726';
        return '#FF5722';
    }, []);

    return (
        <div style={{ margin: '20px 0' }}>
            <Grid container spacing={2}>
                {Object.entries(getEnterpriseStats).map(([enterprise, { total, completed }]) => {
                    const completionRate = (completed / total) * 100;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={enterprise}>
                            <Card sx={getCardStyle(completed, total)}>

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
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const location = useLocation();
    const isFileUploadIcon = location.pathname === '/fichierdllaction';
    const [searchTerm, setSearchTerm] = useState('');
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear().toString(); // Obtenir l'année courante
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedYears, setSelectedYears] = useState([currentYear]); // Renommer et initialiser avec un tableau
    const [availableYears, setAvailableYears] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    // Extraire les années uniques des actions et définir l'année courante par défaut
    useEffect(() => {
        const years = [...new Set(users.map(action => action.AddActionanne))].filter(Boolean).sort();

        // Si l'année courante n'est pas dans la liste des années disponibles, l'ajouter
        if (!years.includes(currentYear)) {
            years.push(currentYear);
        }

        setAvailableYears(years.sort());

        // Définir l'année courante comme valeur par défaut si aucune année n'est sélectionnée
        if (selectedYears.length === 0) {
            setSelectedYears([currentYear]);
        }
    }, [users, currentYear]);





    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

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

    const filteredUsers = useMemo(() => {
        let filtered = users;

        // Filtre par années si des années sont sélectionnées
        if (selectedYears.length > 0) {
            filtered = filtered.filter(action => selectedYears.includes(action.AddActionanne));
        }

        // Filtre existant par terme de recherche
        if (searchTerm) {
            filtered = filtered.filter(addaction => {
                const searchTermLower = searchTerm.toLowerCase();
                return (
                    (addaction.AddActionEntreprise?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionDate?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionSecteur?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddAction?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionQui?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActoinmoi?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionDange?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionanne?.toLowerCase().includes(searchTermLower))
                );
            });
        }

        return filtered;
    }, [users, searchTerm, selectedYears]);


    /**
     * Supprime une action
     * 
     * @param {string} userIdToDelete id de l'action à supprimer
     * 
     * @returns {Promise} La promesse de suppression
     */
    const handleDelete = (userIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/planaction/${userIdToDelete}`)
            .then(response => {
                if (response.status === 204 || response.status === 200) {
                    console.log('Utilisateur supprimé avec succès');
                    setAddactions(prevAddactions => prevAddactions.filter(addaction => addaction._id !== userIdToDelete));
                    showSnackbar('Action supprimée avec succès', 'success');
                } else {
                    console.log('Erreur lors de la suppression de l\'utilisateur, code d erreur : ' + response.status + ' ' + response.statusText);
                    showSnackbar(`Erreur lors de la suppression de l'action: ${response.status} ${response.statusText}`, 'error');
                }
            })
            .catch(error => {
                console.log(error);
                showSnackbar('Erreur lors de la suppression de l\'action', 'error');
            });
    };


    /**
     * Rafraichi la liste des actions
     * @function
     */
    const refreshListAccidents = () => {
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
    };


    const getLinkedSecteurs = (entrepriseId) => {
        if (!entrepriseId) return []; // Retourne un tableau vide si aucune entreprise n'est sélectionnée
        return allSectors
            .filter(s => s.entrepriseId === entrepriseId)  // Filtrer par l'ID de l'entreprise
            .map(s => s.secteurName);  // Retourner uniquement les noms des secteurs
    };

    // Filtrer les secteurs en fonction de l'entreprise sélectionnée


    if (loading) {
        return <LinearProgress color="success" />;
    }

    //vouleur des ligne du tableau, change en vert quand checkbox = true
    const getRowColor = (isChecked, index) => {
        if (isChecked) {
            return '#90EE90'; // Vert clair quand la checkbox est cochée
        }
        const baseColors = ['#e62a5625', '#95519b25'];
        return baseColors[index % baseColors.length];
    };

    /**
     * Envoie les données du formulaire pour enregistrer une action
     * @param {Object} data Données du formulaire
     * @returns {Promise} La promesse de création
     */
    const onSubmit = (data) => {
        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);

        axios.put(`http://${apiUrl}:3100/api/planaction`, data)
            .then(response => {
                console.log('Réponse du serveur en création :', response.data);
                showSnackbar('Action en cours d\'enregistrement', 'success');
                setTimeout(() => showSnackbar('Action enregistrée avec succès', 'success'), 1000);
                setTimeout(() => window.location.reload(), 2000); // Actualise la page au lieu de navigate
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
                showSnackbar('Erreur lors de la création de l\'action', 'error');
            });
    };

    const userEnterprise = userInfo?.entreprisesConseillerPrevention || [];

    /**
     * Determine if the user can view the given action
     * @param {Object} action The action to check
     * @returns {Boolean} True if the user can view the action, false otherwise
     * @description
     * The user can view the action if they are an admin or if the action's AddActionEntreprise is in the user's entreprisesConseillerPrevention.
     */
    const canViewAction = (action) => {
        if (isAdmin) {
            return true; // Admin can view all actions
        } else {
            return userEnterprise.includes(action.AddActionEntreprise); // Regular user can view actions of their enterprise
        }
    };

    /**
     * Handle the export functionality by filtering the data based on user permissions, selected years, and search term.
     * @returns {void}
     */
    const handleExport = () => {
        // Commencer avec tous les utilisateurs
        let dataToExport = users;

        // Filtre pour les non-admins (entreprises spécifiques)
        if (!isAdmin) {
            dataToExport = dataToExport.filter(action =>
                userInfo.entreprisesConseillerPrevention?.includes(action.AddActionEntreprise)
            );
        }

        // Filtre par années si des années sont sélectionnées
        if (selectedYears && selectedYears.length > 0) {
            dataToExport = dataToExport.filter(action =>
                selectedYears.includes(action.AddActionanne)
            );
        }

        // Filtre par terme de recherche s'il est défini
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            dataToExport = dataToExport.filter(addaction => {
                return (
                    (addaction.AddActionEntreprise?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionDate?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionSecteur?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddAction?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionQui?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActoinmoi?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionDange?.toLowerCase().includes(searchTermLower)) ||
                    (addaction.AddActionanne?.toLowerCase().includes(searchTermLower))
                );
            });
        }

        console.log("Données à exporter:", dataToExport);
        handleExportDataAction(dataToExport);
    };
    //compte le nombre d'action par entreprise 

    // Ajoutez cette fonction de tri juste avant le return de PlanAction
    const sortByYear = (a, b) => {
        return parseInt(a.AddActionanne) - parseInt(b.AddActionanne);
    };


    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>

            <h2>Plan d'actions</h2>
            <EnterpriseStats actions={filteredUsers.filter(action => canViewAction(action))} />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Tooltip title="Cliquez ici pour actualiser le tableau des actions" arrow>
                        <Button
                            sx={{ marginLeft: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
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
                                onChange={(event) => setSelectedYears(event.target.value)}
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
                            sx={{ marginRight: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
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
            <TableContainer>
                <div className="frameStyle-style">
                    <Table>
                        <TableHead>
                            <React.Fragment>
                                <TableRow style={{ backgroundColor: '#0098f950' }} key={"CellTowerSharp"}>
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
                                <TableRow className="table-row-separatormenu"></TableRow>
                            </React.Fragment>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .sort(sortByYear)
                                .map((addaction, index) => (
                                    canViewAction(addaction) && (

                                        <TableRow
                                            className="table-row-separatormenu"
                                            key={addaction._id}
                                            style={{ backgroundColor: getRowColor(addaction.AddboolStatus, index) }}
                                        >

                                            <TableCell>
                                                <Tooltip title="Sélectionnez quand l'action est réalisée" arrow>
                                                    <Checkbox
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }}
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
                                            <TableCell>{addaction.AddActionDange}</TableCell>
                                            <TableCell>{addaction.AddActionDate}</TableCell>
                                            <TableCell>{addaction.AddActionQui}</TableCell>
                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour éditer les données de l'action" arrow>
                                                    <Button variant="contained" color="primary">
                                                        <EditIcon />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour ajouter des fichiers a l'action" arrow>
                                                    <Button component={Link} to={isFileUploadIcon ? '/' : '/fichierdllaction'} variant="contained" color="secondary">
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell style={{ padding: 0, width: '70px' }}>
                                                <Tooltip title="Cliquez ici pour supprimer l'action" arrow>
                                                    <Button variant="contained" color="error" onClick={() => {
                                                        confirmAlert({
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
                </div>
            </TableContainer>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </form >


    );
}
