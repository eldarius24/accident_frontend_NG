import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
    Tooltip
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


const apiUrl = config.apiUrl;

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


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };


    useEffect(() => {
        const fetchData = async () => {
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

                const isConseillerPrevention = (entrepriseName) => {
                    return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
                };

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
        };

        fetchData();
    }, [apiUrl, isAdmin, isConseiller]);

    const filteredUsers = users.filter(addaction => {
        if (!searchTerm) {
            return true; // Retourne true pour inclure toutes les entrées si searchTerm est vide
        }
        return (
            (addaction.AddActionEntreprise && addaction.AddActionEntreprise.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionDate && addaction.AddActionDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionSecteur && addaction.AddActionSecteur.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddAction && addaction.AddAction.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionQui && addaction.AddActionQui.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActoinmoi && addaction.AddActoinmoi.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionDange && addaction.AddActionDange.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionanne && addaction.AddActionanne.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

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

    const rowColors = ['#e62a5625', '#95519b25']; // Tableau de couleurs pour les lignes

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

    const canViewAction = (action) => {
        if (isAdmin) {
            return true; // Admin can view all actions
        } else {
            return userEnterprise.includes(action.AddActionEntreprise); // Regular user can view actions of their enterprise
        }
    };

    const handleExport = () => {
        let dataToExport = users;

        if (!isAdmin) {
            dataToExport = users.filter(action =>
                userInfo.entreprisesConseillerPrevention?.includes(action.AddActionEntreprise)
            );
        }

        console.log("Données à exporter:", dataToExport);
        handleExportDataAction(dataToExport);
    };
    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>

            <h2>Plan d'actions</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Tooltip title="Cliquez ici pour actualiser le tableau des actions" arrow>
                        <Button
                            sx={{ marginLeft: '20px', marginRight: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
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
                            sx={{ marginLeft: '20px', marginRight: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
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
                            {filteredUsers.map((addaction, index) => (
                                canViewAction(addaction) && (

                                    <TableRow className="table-row-separatormenu" key={addaction._id} style={{ backgroundColor: rowColors[index % rowColors.length] }}>

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
