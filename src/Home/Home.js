import React, { useCallback, useEffect, useState, useTransition } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    LinearProgress,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import editPDF from '../Model/pdfGenerator.js';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../pageFormulaire/formulaire.css';
import { handleExportData, handleExportDataAss } from '../Model/excelGenerator.js';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import getAccidents from './_actions/get-accidents.js';
import { useUserConnected } from '../Hook/userConnected.js';
import CustomSnackbar from '../_composants/CustomSnackbar';

/**
 * Page d'accueil de l'application. Affiche la liste des accidents
 * 
 * @returns {JSX.Element} La page d'accueil
 */

function Home() {
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const [yearsFromData, setYearsFromData] = useState([]);
    const [yearsChecked, setYearsChecked] = useState([]);
    const [selectAllYears, setSelectAllYears] = useState(false);
    const [accidents, setAccidents] = useState([]);
    const [accidentsIsPending, startGetAccidents] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const [users, setAddactions] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    // Function to show Snackbar
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    // Function to close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };


    /**
     * Check if the user is a conseiller prevention for the given entreprise
     * @param {string} entrepriseName
     * @returns {boolean}
     */
    const isConseillerPrevention = (entrepriseName) => {
        return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
    };

    /**
     * Supprime un accident de la base de données
     * 
     * @param {string} accidentIdToDelete id de l'accident à supprimer
     * 
     * @returns {Promise<void>}
     */
    const handleDelete = (accidentIdToDelete) => {
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
    };

    /**
     * Génère un PDF à partir des données de l'accident passé en paramètre
     * 
     * @param {string} accidentIdToGenerate id de l'accident pour lequel générer le PDF
     * 
     * @returns {Promise<void>}
     */
    const handleGeneratePDF = async (accidentIdToGenerate) => {
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
    };

    /**
     * Modifie l'accident passé en paramètre en le redirigeant vers le formulaire
     * 
     * @param {string} accidentIdToModify id de l'accident à modifier
     * 
     * @returns {Promise<void>}
     */
    const handleEdit = async (accidentIdToModify) => {
        try {
            const { data } = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentIdToModify}`);
            navigate("/formulaire", { state: data });
            showSnackbar('Modification de l accident initiée', 'info');
        } catch (error) {
            console.error(error);
            showSnackbar('Erreur lors de la récupération des données de l accident', 'error');
        }
    };

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
    }, [startGetAccidents]);

    useEffect(() => {
        refreshListAccidents();
        const currentYear = new Date().getFullYear();
        setYearsChecked(prevYears => [...prevYears, currentYear]);
    }, [refreshListAccidents]);

    /**
     * Filtre les accidents en fonction des années vérifiées et du terme de recherche
     * 
     * @returns {Array} Les accidents filtrés
     */
    const filteredData = () => {
        if (!accidents || !yearsChecked) {
            console.error("Accidents ou années vérifiées non définis");
            return [];
        }

        const years = yearsChecked.map(Number);
        return accidents.filter(item => {
            if (!item.DateHeureAccident) {
                console.error("DateHeureAccident non définie");
                return false;
            }

            const date = new Date(item.DateHeureAccident).getFullYear();
            const filterProperties = ['DateHeureAccident', 'entrepriseName', 'secteur', 'nomTravailleur', 'prenomTravailleur', 'typeAccident'];

            return years.includes(date) && filterProperties.some(property =>
                item[property]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    /**
     * Met à jour les années vérifiées en fonction de la nouvelle valeur 
     * reçue via l'événement de changement de l'élément de type checkbox.
     * Si la valeur est de type string, elle est divisée en un tableau d'entiers.
     * @param {Event} event - L'événement de changement de l'élément de type checkbox.
     */
    const handleChangeYearsFilter = (event) => {
        const value = event.target.value;
        setYearsChecked(typeof value === 'string' ? value.split(',') : value);
    };

    /**
     * Met à jour les années vérifiées et le flag selectAllYears en fonction
     * de la nouvelle valeur reçue via l'événement de changement de l'élément
     * de type checkbox.
     * Si la valeur est true, yearsFromData est affecté à yearsChecked.
     * Sinon, un tableau vide est affecté à yearsChecked.
     * @param {Event} event - L'événement de changement de l'élément de type checkbox.
     */
    const handleSelectAllYears = (event) => {
        const checked = event.target.checked;
        setSelectAllYears(checked);
        setYearsChecked(checked ? yearsFromData : []);
    };

    const rowColors = ['#e62a5625', '#95519b25'];

    if (accidentsIsPending) {
        return <LinearProgress color="success" />;
    }

    const data = filteredData();

    /**
     * Fonction pour exporter les données d'accidents filtrées vers Excel
     * @returns {void} null
     */

    const handleExportDataAccident = () => {
        let dataToExport = filteredData(); // Utilise la fonction filteredData() existante
    
        if (!isAdmin) {
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }
    
        console.log("Données d'accidents à exporter:", dataToExport);
        handleExportData(dataToExport);
    };
    
    /**
     * Fonction pour exporter les données d'assurance filtrées vers Excel.
     * Si l'utilisateur est un conseiller de prévention, les données sont filtrées
     * pour ne conserver que celles des entreprises qu'il est autorisé à voir.
     * @returns {void} null
     */
    const handleExportDataAssurance = () => {
        let dataToExport = filteredData(); // Utilise la fonction filteredData() existante
    
        if (!isAdmin) {
            dataToExport = dataToExport.filter(accident =>
                userInfo.entreprisesConseillerPrevention?.includes(accident.entrepriseName)
            );
        }
    
        console.log("Données d'assurance à exporter:", dataToExport);
        handleExportDataAss(dataToExport);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Tooltip title="Cliquez ici pour actualiser le tableau des accidents du travails" arrow>
                        <Button
                            sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
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
                    <Tooltip title="Cliquez ici pour filtrer les accidents par années" arrow placement="top">
                        <FormControl sx={{ boxShadow: 3, minWidth: 120 }}>
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
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Tooltip title="Filtrer les accidents par mots clés" arrow>
                        <TextField
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            variant="outlined"
                            sx={{ boxShadow: 3, backgroundColor: '#ee752d60' }}
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
                        <Grid item xs={6} style={{ marginRight: '20px' }}>
                            <Tooltip title="Cliquez ici pour exporter les données Accident en fonction des filtres sélèctionnes en excel" arrow>
                                <Button
                                    sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleExportDataAccident()}
                                    startIcon={<FileUploadIcon />}
                                >
                                    Accident
                                </Button>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6} style={{ marginRight: '20px' }}>
                            <Tooltip title="Cliquez ici pour exporter les données Assurance en fonction des filtres sélèctionnes en excel" arrow>
                                <Button
                                    sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleExportDataAssurance()}
                                    startIcon={<FileUploadIcon />}
                                >
                                    Assurance
                                </Button>
                            </Tooltip>
                        </Grid>
                    </>
                )}
            </div>

            <TableContainer className="frameStyle-style" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#0098f950' }}>
                            {['N° Groupe', 'N° Entreprise', 'Date accident', 'Entreprise', 'Secteur', 'Nom du travailleur', 'Prénom du travailleur', 'Type accident', 'Editer', 'Fichier', 'PDF', 'Supprimer'].map((header, index) => (
                                <TableCell key={index} style={{ fontWeight: 'bold', padding: 0, width: index < 8 ? 'auto' : '70px' }}>{isAdminOuConseiller || index < 8 ? header : null}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-separatormenu"></TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <React.Fragment key={item._id}>
                                <TableRow style={{ backgroundColor: rowColors[index % rowColors.length] }}>
                                    <TableCell>{item.numeroGroupe}</TableCell>
                                    <TableCell>{item.numeroEntreprise}</TableCell>
                                    <TableCell>{item.DateHeureAccident}</TableCell>
                                    <TableCell>{item.entrepriseName}</TableCell>
                                    <TableCell>{item.secteur}</TableCell>
                                    <TableCell>{item.nomTravailleur}</TableCell>
                                    <TableCell>{item.prenomTravailleur}</TableCell>
                                    <TableCell>{item.typeAccident}</TableCell>

                                    <>
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour éditer les données de l'accident" arrow>
                                                    <Button variant="contained" color="primary" onClick={() => handleEdit(item._id)}>
                                                        <EditIcon /> {/* L'icône est placée à l'intérieur du bouton */}
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>

                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour ajouter des fichiers a l'accident" arrow>
                                                    <Button variant="contained" color="secondary" onClick={() => navigate("/fichierdll", { state: item._id })}>
                                                        <GetAppIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour générer la déclaration d'accident Belfius si vous avez remplis tous les champs du formulaire" arrow>
                                                    <Button variant="contained" color="success" onClick={() => handleGeneratePDF(item._id)}>
                                                        <PictureAsPdfIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell style={{ padding: 0 }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour supprimer l'accident" arrow>
                                                    <Button variant="contained" color="error" onClick={() => {
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
                                                    }}>
                                                        <DeleteForeverIcon />
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                    </>

                                </TableRow>
                                <TableRow className="table-row-separator"></TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                {/* ... (existing JSX) */}

                {/* Add Snackbar component */}
                <CustomSnackbar
                    open={snackbar.open}
                    handleClose={handleCloseSnackbar}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
            </div>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </div>
    );
}

export default Home;