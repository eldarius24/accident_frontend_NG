import React, { useCallback, useEffect, useState, useTransition, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, LinearProgress, TextField, Grid, FormControl, InputLabel,
    Select, MenuItem, Checkbox, ListItemText, Tooltip
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
import { handleExportData, handleExportDataAss } from '../Model/excelGenerator.js';
import getAccidents from './_actions/get-accidents.js';
import { useUserConnected } from '../Hook/userConnected.js';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const apiUrl = config.apiUrl;

/**
 * Page principale de l'application, cette page contient une table avec 
 * les accidents du travail, les boutons pour exporter les données, 
 * filtrer les accidents et les boutons pour modifier, générer un pdf, 
 * supprimer les accidents
 * @returns {React.ReactElement} 
 */
function Home() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [yearsFromData, setYearsFromData] = useState([]);
    const [yearsChecked, setYearsChecked] = useState([]);
    const [selectAllYears, setSelectAllYears] = useState(false);
    const [accidents, setAccidents] = useState([]);
    const [accidentsIsPending, startGetAccidents] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

    const formatDate = useCallback((dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }, []);

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

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

    const isConseillerPrevention = useCallback((entrepriseName) => {
        return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
    }, [userInfo]);

    const handleDelete = useCallback((accidentIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/accidents/${accidentIdToDelete}`)
            .then(response => {
                if ([200, 204].includes(response.status)) {
                    setAccidents(prevAccidents => prevAccidents.filter(item => item._id !== accidentIdToDelete));
                    showSnackbar('Accident supprimé avec succès', 'success');
                } else {
                    showSnackbar(`Erreur lors de la suppression de l'accident: ${response.status} ${response.statusText}`, 'error');
                }
            })
            .catch(error => {
                console.error(error);
                showSnackbar('Erreur lors de la suppression de l accident', 'error');
            });
    }, [apiUrl, showSnackbar]);

    const handleGeneratePDF = useCallback(async (accidentIdToGenerate) => {
        const accident = accidents.find(item => item._id === accidentIdToGenerate);
        if (accident) {
            try {
                await editPDF(accident);
                showSnackbar('PDF généré avec succès', 'success');
            } catch (error) {
                console.error(error);
                showSnackbar('Erreur lors de la génération du PDF', 'error');
            }
        } else {
            showSnackbar('Accident non trouvé', 'error');
        }
    }, [accidents, showSnackbar]);

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

    const refreshListAccidents = useCallback(() => {
        startGetAccidents(async () => {
            try {
                const fetchedAccidents = await getAccidents();
                setAccidents(fetchedAccidents);
                setYearsFromData([...new Set(fetchedAccidents.map(accident => new Date(accident.DateHeureAccident).getFullYear()))]);
                showSnackbar('Liste des accidents actualisée', 'success');
            } catch (error) {
                console.error("Erreur lors de la récupération des accidents:", error);
                showSnackbar('Erreur lors de l actualisation de la liste des accidents', 'error');
            }
        });
    }, [showSnackbar]);

    useEffect(() => {
        refreshListAccidents();
        const currentYear = new Date().getFullYear();
        setYearsChecked(prevYears => [...prevYears, currentYear]);
    }, [refreshListAccidents]);

    const filteredData = useMemo(() => {
        if (!accidents || !yearsChecked) return [];

        const years = yearsChecked.map(Number);
        const searchTermLower = searchTerm.toLowerCase();
        return accidents.filter(item => {
            if (!item.DateHeureAccident) return false;
            //le filtre filtre unioquement sur ces données
            const date = new Date(item.DateHeureAccident).getFullYear();
            return years.includes(date) && ['AssureurStatus', 'DateHeureAccident', 'entrepriseName', 'secteur', 'nomTravailleur', 'prenomTravailleur', 'typeAccident'].some(property =>
                item[property]?.toString().toLowerCase().includes(searchTermLower)
            );
        });
    }, [accidents, yearsChecked, searchTerm]);

    /**
     * Met à jour les années sélectionnées en fonction de la nouvelle valeur reçue via l'événement de changement.
     * Si la valeur est une chaîne, la fonction la divise en un tableau de valeurs en utilisant la virgule comme séparateur.
     * Sinon, la fonction utilise la valeur telle quelle.
     * @param {Event} event - L'événement de changement contenant la nouvelle valeur
     */
    const handleChangeYearsFilter = (event) => {
        const value = event.target.value;
        setYearsChecked(typeof value === 'string' ? value.split(',') : value);
    };

    /**
     * Met à jour les années sélectionnées en fonction de la valeur du champ de sélection 'Tout'.
     * Si le champ est coché, la fonction met à jour les années sélectionnées avec la liste de toutes les années trouvées dans la liste des accidents.
     * Sinon, la fonction met à jour les années sélectionnées avec un tableau vide.
     * @param {Event} event - L'événement de changement contenant la nouvelle valeur du champ de sélection 'Tout'
     */
    const handleSelectAllYears = (event) => {
        const checked = event.target.checked;
        setSelectAllYears(checked);
        setYearsChecked(checked ? yearsFromData : []);
    };

    const handleExportDataAccident = useCallback(() => {
        let dataToExport = filteredData;
        if (!isAdmin) {
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }
        try {
            handleExportData(dataToExport);
            showSnackbar('Exportation des données réussie', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            showSnackbar('Erreur lors de l\'exportation des données', 'error');
        }
    }, [filteredData, isAdmin, userInfo, showSnackbar]);

    const handleExportDataAssurance = useCallback(() => {
        let dataToExport = filteredData;
        if (!isAdmin) {
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }
        try {
            handleExportDataAss(dataToExport);
            showSnackbar('Exportation des données d\'assurance réussie', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données d\'assurance:', error);
            showSnackbar('Erreur lors de l\'exportation des données d\'assurance', 'error');
        }
    }, [filteredData, isAdmin, userInfo, showSnackbar]);

    if (accidentsIsPending) {
        return <LinearProgress color="success" />;
    }

    return (
        <div style={{
            backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            margin: '0 20px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={2}>
                        <Tooltip title="Cliquez ici pour actualiser le tableau des accidents du travails" arrow>
                            <Button
                                sx={{ color: 'black', padding: '15px', width: '100%', backgroundColor: '#ee752d60', transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 }, boxShadow: 3, textTransform: 'none' }}
                                variant="contained"
                                color="secondary"
                                onClick={refreshListAccidents}
                                startIcon={<RefreshIcon />}
                            >
                                Actualiser
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Tooltip title="Cliquez ici pour filtrer les accidents par années" arrow placement="top">
                            <FormControl sx={{ boxShadow: 3, width: '100%', backgroundColor: '#ee752d60' }}>
                                <InputLabel id="sort-label">Année</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    id="sort-select"
                                    multiple
                                    value={selectAllYears ? yearsFromData : yearsChecked}
                                    onChange={handleChangeYearsFilter}
                                    renderValue={selected => selected.join(', ')}
                                >
                                    <MenuItem key="All" value="All" style={{ backgroundColor: '#ee742d59' }}>
                                        <Checkbox
                                            checked={selectAllYears}
                                            onChange={handleSelectAllYears}
                                            style={{ color: 'red' }}
                                        />
                                        <ListItemText primary="All" />
                                    </MenuItem>
                                    {yearsFromData.filter(Boolean).map(year => (
                                        <MenuItem key={year} value={year} style={{ backgroundColor: '#ee742d59' }}>
                                            <Checkbox
                                                checked={yearsChecked.includes(year)}
                                                style={{ color: '#257525' }}
                                            />
                                            <ListItemText primary={year} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Tooltip title="Filtrer les accidents par mots clés" arrow>
                            <TextField
                                value={searchTerm}
                                onChange={event => setSearchTerm(event.target.value)}
                                variant="outlined"
                                sx={{ boxShadow: 3, backgroundColor: '#ee752d60', width: '100%' }}
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
                    {isAdminOuConseiller && (
                        <>
                            <Grid item xs={6} md={3}>
                                <Tooltip title="Cliquez ici pour exporter les données Accident en fonction des filtres sélèctionnes en excel" arrow>
                                    <Button
                                        sx={{ color: 'black', padding: '15px', width: '100%', backgroundColor: '#ee752d60', transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 }, boxShadow: 3, textTransform: 'none' }}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleExportDataAccident}
                                        startIcon={<FileUploadIcon />}
                                    >
                                        Accident
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Tooltip title="Cliquez ici pour exporter les données Assurance en fonction des filtres sélèctionnes en excel" arrow>
                                    <Button
                                        sx={{ color: 'black', padding: '15px', width: '100%', backgroundColor: '#ee752d60', transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 }, boxShadow: 3, textTransform: 'none' }}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleExportDataAssurance}
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
                            <TableCell style={{ fontWeight: 'bold' }}>N° Groupe</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Date accident</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Nom du travailleur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Prénom du travailleur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Type accident</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Editer</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Fichier</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>PDF</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Supprimer</TableCell>
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
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour éditer les données de l'accident" arrow>
                                                    <Button sx={{
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }} variant="contained" color="primary" onClick={() => handleEdit(item._id)}>
                                                        <EditIcon />
                                                    </Button >
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour ajouter des fichiers a l'accident" arrow>
                                                    <Button sx={{
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }} variant="contained" color="secondary" onClick={() => navigate("/fichierdll", { state: item._id })}>
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour générer la déclaration d'accident Belfius si vous avez remplis tous les champs du formulaire" arrow>
                                                    <Button sx={{
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }} variant="contained" color="success" onClick={() => handleGeneratePDF(item._id)}>
                                                        <PictureAsPdfIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour supprimer l'accident" arrow>
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
                                                                customUI: ({ onClose }) => (
                                                                    <div className="custom-confirm-dialog">
                                                                        <h1 className="custom-confirm-title">Supprimer</h1>
                                                                        <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                                                                        <div className="custom-confirm-buttons">
                                                                            <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                                                <button className="custom-confirm-button" onClick={() => { handleDelete(item._id); onClose(); }}>
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
                                                        }}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
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
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </div>
    );
}

export default Home;