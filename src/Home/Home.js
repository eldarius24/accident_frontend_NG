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
/* IMPORT PERSO */
import '../pageFormulaire/formulaire.css';
import { handleExportData, handleExportDataAss } from '../Model/excelGenerator.js';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import getAccidents from './_actions/get-accidents.js';

/**
 * Premiere page de l'application, contient la liste des accidents
 * 
 * @returns Home component
 */
function Home() {

    const navigate = useNavigate();
    const apiUrl = config.apiUrl;

    const [yearsFromData, setYearsFromData] = useState([]); // Années récupérées de l'API pour le filtre
    const [yearsChecked, setYearsChecked] = useState([]); // State pour les années sélectionnées, utilisé pour le filtre
    const [selectAllYears, setSelectAllYears] = useState(false); // State pour la case à cocher "Sélectionner toutes les années"
    const [accidents, setAccidents] = useState([]); // Stocker les données de l'API
    const [accidentsIsPending, startGetAccidents] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (accidentIdToDelete) => {
        axios.delete("http://" + apiUrl + ":3100/api/accidents/" + accidentIdToDelete)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Accident supprimé avec succès');
                    // Mettre à jour les données après suppression
                    //refreshListAccidents();
                    const updatedData = accidents.filter(item => item._id !== accidentIdToDelete);
                    setAccidents(updatedData);
                }
                else {
                    console.log('Erreur lors de la suppression de l\'accident, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    //erreur
    /* const handleGeneratePDF = async (accidentIdToGenerate) => {
         try {
             const accidents = accidents.find(item => item._id == accidentIdToGenerate);
             editPDF(accidents);
         } catch (error) {
             console.log(error);
         }
     };
 */
    //correction
    const handleGeneratePDF = async (accidentIdToGenerate) => {
        try {
            const accident = accidents.find(item => item._id === accidentIdToGenerate);
            if (accident) {
                await editPDF(accident);
            } else {
                console.log("Accident non trouvé");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (accidentIdToModify) => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentIdToModify}`);
            const accidents = response.data;
            navigate("/formulaire", { state: accidents });
        } catch (error) {
            console.log(error);
        }
    };

    const refreshListAccidents = useCallback(() => {
        try {
            startGetAccidents(async () => {
                const accidents = await getAccidents()

                setAccidents(accidents);

                //mettre à jour les années pour le filtre
                setYearsFromData([...new Set(accidents.map(accident => new Date(accident.DateHeureAccident).getFullYear()))]);
            });
        } catch (error) {
            console.error("Home.js => refresh list accident error =>", error);
        }
    }, [accidents, yearsFromData]);

    //au chargerment de la page, on met à jour les données de la liste des accidents
    useEffect(() => {
        refreshListAccidents();
        // Cocher l'année en cours par défaut
        const currentYear = new Date().getFullYear();
        setYearsChecked([...yearsChecked, currentYear]);
    }, []);

    /**
     * Fonction qui permet de filtrer les données de la table en fonction du contenu de la barre de recherche
     */
    let filteredData = accidents.filter((item) => {
        const years = yearsChecked.map(Number);
        const date = new Date(item.DateHeureAccident).getFullYear();
        const filterProperties = [
            'DateHeureAccident',
            'entrepriseName',
            'secteur',
            'nomTravailleur',
            'prenomTravailleur',
            'typeAccident'
        ];
        return filterProperties.some((property) => {
            //console.log("Home.js => filteredData => property =>", property);
            const value = item[property];
            //console.log("Home.js => filteredData => value =>", value);
            const result = (value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) && years.includes(date);
            //console.log("Home.js => filteredData => result =>", result);
            return result
        });
    });

    // Function that filters the data based on the selected year
    const handleChangeYearsFilter = (event) => {
        const {
            target: { value },
        } = event;
        setYearsChecked(typeof value === 'string' ? value.split(',') : value);
    }

    // Function to handle the select all years checkbox
    const handleSelectAllYears = (event) => {
        const { checked } = event.target;
        setSelectAllYears(checked);
        if (checked) {
            setYearsChecked(yearsFromData);
        } else {
            setYearsChecked([]);
        }
    }

    const rowColors = ['#e62a5625', '#95519b25']; // Tableau de couleurs pour les lignes

    if (accidentsIsPending) {
        return <LinearProgress color="success" />;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="secondary"
                        onClick={refreshListAccidents}
                        startIcon={<RefreshIcon />}
                    >
                        Actualiser
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px', backgroundColor: '#ee752d60' }}>
                    <FormControl sx={{ boxShadow: 3, minWidth: 120 }}>
                        <InputLabel id="sort-label">Année</InputLabel>

                        <Select
                            labelId="sort-label"
                            id="sort-select"
                            multiple
                            value={selectAllYears ? yearsFromData : yearsChecked}
                            onChange={handleChangeYearsFilter}
                            renderValue={(selected) => selected.join(', ')} // Affichage des valeurs sélectionnées
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        //backgroundColor: '#fff3ec', // Couleur de fond du menu
                                    },
                                },
                            }}
                        >
                            <MenuItem key="All" value="All" style={{ backgroundColor: '#ee742d59' }}>
                                <Checkbox
                                    checked={selectAllYears}
                                    onChange={handleSelectAllYears}
                                    style={{ color: 'red' }}
                                />
                                <ListItemText primary="All" />
                            </MenuItem>
                            {yearsFromData.filter(Boolean).map((year) => (
                                <MenuItem key={year} value={year} style={{ backgroundColor: '#ee742d59' }}>
                                    <Checkbox
                                        checked={yearsChecked.indexOf(year) > -1}
                                        style={{ color: '#257525' }} />
                                    <ListItemText primary={year} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <TextField
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
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
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleExportData(filteredData)}
                        startIcon={<FileUploadIcon />}
                    >
                        Accident
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleExportDataAss(filteredData)}
                        startIcon={<FileUploadIcon />}
                    >
                        Assurance
                    </Button>
                </Grid>
            </div>


            <TableContainer style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <div className="frameStyle-style">
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#0098f950' }} key={"CellTowerSharp"}>
                                <TableCell style={{ fontWeight: 'bold' }}>N° Groupe</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>N° Entreprise</TableCell>
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
                            <TableRow className="table-row-separatormenu"></TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <React.Fragment key={item._id}>
                                    <TableRow key={item._id} style={{ backgroundColor: rowColors[index % rowColors.length] }}>
                                        <TableCell>{item.numeroGroupe}</TableCell>
                                        <TableCell>{item.numeroEntreprise}</TableCell>
                                        <TableCell>{item.DateHeureAccident}</TableCell>
                                        <TableCell>{item.entrepriseName}</TableCell>
                                        <TableCell>{item.secteur}</TableCell>
                                        <TableCell>{item.nomTravailleur}</TableCell>
                                        <TableCell>{item.prenomTravailleur}</TableCell>
                                        <TableCell>{item.typeAccident}</TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="primary" onClick={() => handleEdit(item._id)}>
                                                <EditIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="secondary" onClick={() => navigate("/fichierdll", { state: item._id })}>
                                                <GetAppIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="success" onClick={() => handleGeneratePDF(item._id)}>
                                                <PictureAsPdfIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="error" onClick={() => {
                                                confirmAlert({
                                                    customUI: ({ onClose }) => (
                                                        <div className="custom-confirm-dialog">
                                                            <h1 className="custom-confirm-title">Supprimer</h1>
                                                            <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                                                            <div className="custom-confirm-buttons">
                                                                <button className="custom-confirm-button" onClick={() => { handleDelete(item._id); onClose(); }}>Oui</button>
                                                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>Non</button>
                                                            </div>
                                                        </div>
                                                    )
                                                });
                                            }}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {/* Ligne de séparation */}
                                    <TableRow className="table-row-separator"></TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </TableContainer>
            <div>
            </div>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
        </div>


    );
}

export default Home;
