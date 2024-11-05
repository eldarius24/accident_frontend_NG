import React, { useCallback, useEffect, useState, useTransition, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, LinearProgress, TextField, Grid, FormControl, InputLabel,
    Select, MenuItem, Checkbox, ListItemText, Tooltip, Chip
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
import getAccidents from './_actions/get-accidents.js';
import { useUserConnected } from '../Hook/userConnected.js';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { handleExportDataAccident } from './_actions/exportAcci';
import { handleExportDataAssurance } from './_actions/exportAss';
import { useLogger } from '../Hook/useLogger';
import useHandleDelete from './_actions/handleDelete.js';
import { blueGrey } from '@mui/material/colors';
import { 
    COOKIE_PREFIXES,
    getSelectedYearsFromCookie,
    getSelectAllFromCookie,
    saveYearSelections
} from './_actions/cookieUtils';

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

    const [yearsFromData, setYearsFromData] = useState([]);
    const [yearsChecked, setYearsChecked] = useState(() => 
        getSelectedYearsFromCookie(COOKIE_PREFIXES.HOME)
    );
    
    const [selectAllYears, setSelectAllYears] = useState(() =>
        getSelectAllFromCookie(COOKIE_PREFIXES.HOME)
    );
    const [accidents, setAccidents] = useState([]);
    const [accidentsIsPending, startGetAccidents] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const { logAction } = useLogger();  // Ajout du hook useLogger
    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);
    const handleDelete = useHandleDelete({
        setAccidents,
        accidents,
        logAction,
        showSnackbar
    });



    /**
        * Rafraichit la liste des accidents en appelant la fonction getAccidents.
        * Met à jour l'état de la liste des accidents et des années.
        * Affiche un message de réussite ou d'erreur en fonction du résultat.
        */
    const refreshListAccidents = useCallback(() => {
        startGetAccidents(async () => {
            try {
                const fetchedAccidents = await getAccidents();
                setAccidents(fetchedAccidents);
                const years = [...new Set(fetchedAccidents.map(accident =>
                    new Date(accident.DateHeureAccident).getFullYear()
                ))].sort((a, b) => b - a);
                setYearsFromData(years);
                showSnackbar('Liste des accidents actualisée', 'success');
            } catch (error) {
                console.error("Erreur lors de la récupération des accidents:", error);
                showSnackbar('Erreur lors de l actualisation de la liste des accidents', 'error');
            }
        });
    }, [showSnackbar]);

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
                    entity: 'Export',
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
        if (!accidents || !Array.isArray(yearsChecked)) return [];

        const years = yearsChecked.map(Number);
        const searchTermLower = searchTerm.toLowerCase();

        return accidents.filter(item => {
            if (!item.DateHeureAccident) return false;

            const date = new Date(item.DateHeureAccident).getFullYear();
            return years.includes(date) &&
                ['AssureurStatus', 'DateHeureAccident', 'entrepriseName', 'secteur',
                    'nomTravailleur', 'prenomTravailleur', 'typeAccident'].some(property =>
                        item[property]?.toString().toLowerCase().includes(searchTermLower)
                    );
        });
    }, [accidents, yearsChecked, searchTerm]);

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
        handleExportDataAccident({
            filteredData,
            isAdmin,
            userInfo,
            logAction, // Ajout de la fonction logAction
            onSuccess: (message) => showSnackbar(message, 'success'),
            onError: (message) => showSnackbar(message, 'error')
        });
    }, [filteredData, isAdmin, userInfo, logAction, showSnackbar]);

    /**
     * Exporte les données d'assurance vers un fichier Excel.
     * 
     * @param {object} params - Les paramètres d'exportation
     * @param {object[]} params.filteredData - Les données filtrées à exporter
     * @param {boolean} params.isAdmin - Si l'utilisateur est administrateur
     * @param {object} params.userInfo - Les informations de l'utilisateur
     * @param {function} params.logAction - La fonction pour créer des logs
     * @param {function} [params.onSuccess] - La fonction à appeler en cas de succès
     * @param {function} [params.onError] - La fonction à appeler en cas d'erreur
     */
    const handleExportAssuranceClick = useCallback(() => {
        handleExportDataAssurance({
            filteredData,
            isAdmin,
            userInfo,
            logAction, // Ajout de la fonction logAction
            onSuccess: (message) => showSnackbar(message, 'success'),
            onError: (message) => showSnackbar(message, 'error')
        });
    }, [filteredData, isAdmin, userInfo, logAction, showSnackbar]);


    const handleChangeYearsFilter = (event) => {
        const value = event.target.value;
        if (value === 'All') {
            const allYears = [...yearsFromData];
            setSelectAllYears(true);
            setYearsChecked(allYears);
            saveYearSelections(COOKIE_PREFIXES.HOME, allYears, true);
        } else {
            const newYears = ensureArray(value);
            setSelectAllYears(false);
            setYearsChecked(newYears);
            saveYearSelections(COOKIE_PREFIXES.HOME, newYears, false);
        }
    };

    const handleSelectAllYears = (event) => {
        const checked = event.target.checked;
        const years = checked ? [...yearsFromData] : [];
        setSelectAllYears(checked);
        setYearsChecked(years);
        saveYearSelections(COOKIE_PREFIXES.HOME, years, checked);
    };

    useEffect(() => {
        refreshListAccidents();
    }, [refreshListAccidents]);

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
                                    value={yearsChecked || []}
                                    onChange={handleChangeYearsFilter}
                                    renderValue={(selected) => {
                                        return Array.isArray(selected) ? selected.join(', ') : '';
                                    }}
                                >
                                    <MenuItem key="All" value="All" style={{ backgroundColor: '#ee742d59' }}>
                                        <Checkbox
                                            checked={selectAllYears}
                                            onChange={handleSelectAllYears}
                                            style={{ color: 'red' }}
                                        />
                                        <ListItemText primary="Toutes les années" />
                                    </MenuItem>
                                    {yearsFromData.map(year => (
                                        <MenuItem key={year} value={year} style={{ backgroundColor: '#ee742d59' }}>
                                            <Checkbox
                                                checked={Array.isArray(yearsChecked) && yearsChecked.includes(year)}
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
                                        onClick={handleExportAccidentClick}
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
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour éditer les données de l'accident" arrow>
                                                    <Button sx={{
                                                        backgroundColor: blueGrey[500],
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: blueGrey[700],
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }} variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEdit(item._id)}>
                                                        <EditIcon />
                                                    </Button >
                                                </Tooltip>
                                            ) : null}
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
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
                                        <TableCell style={{ padding: 0, width: '70px' }}>
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
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            {(isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName))) ? (
                                                <Tooltip title="Cliquez ici pour supprimer l'accident" arrow>
                                                    <Button
                                                        sx={{
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
