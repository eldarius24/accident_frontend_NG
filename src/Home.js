// Home.js
import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import config from './config.json';
import { useNavigate } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import editPDF from './Model/pdfGenerator.js';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
/* IMPORT PERSO */
import './pageFormulaire/formulaire.css';
import { handleExportData, handleExportDataAss } from './Model/excelGenerator.js';
import dateConverter from './Model/dateConverter.js';
import CountNumberAccident from './Model/CountNumberAccident.js';

function Home() {
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const [data, setData] = useState([]); // Stocker les données de l'API
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    //au chargerment de la page, on met à jour les données de la liste des accidents
    useEffect(() => {
        refreshListAccidents();
    }, []);



    const handleDelete = (accidentIdToDelete) => {
        axios.delete("http://" + apiUrl + ":3100/api/accidents/" + accidentIdToDelete)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Accident supprimé avec succès');
                    // Mettre à jour les données après suppression
                    refreshListAccidents();
                    const updatedData = data.filter(item => item._id !== accidentIdToDelete);
                    setData(updatedData);
                }
                else {
                    console.log('Erreur lors de la suppression de l\'accident, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleGeneratePDF = async (accidentIdToGenerate) => {
        try {
            const accidents = data.find(item => item._id == accidentIdToGenerate);
            editPDF(accidents);
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



    function refreshListAccidents() {
        axios.get(`http://${apiUrl}:3100/api/accidents`)
            .then(response => {
                let accidents = response.data;

                accidents = CountNumberAccident(accidents);

                console.log("Home.js => refresh list accident =>", accidents);

                if (Array.isArray(accidents)) {
                    accidents.forEach(item => {
                        const dateProperties = [
                            'DateHeureAccident',
                            'DateEnvoieDeclarationAccident',
                            'DateJourIncapDebut',
                            'DateJourIncapFin',
                            'dateNaissance',
                            'dateDebutArret',
                            'dateFinArret',
                            'dateEntrEntreprise',
                            'dateSortie',
                            'dateNotifEmployeur',
                            'dateProcesVerbalOuiRedigeQuand',
                            'dateSoinsMedicauxDate',
                            'dateSoinsMedicauxMedecin',
                            'dateSoinsMedicauxHopital',
                            'dateRepriseEffective',
                            'dateChangementFonction',
                            'dateDecede',
                            'dateIncapaciteTemporaire',
                            'dateTravailAddapte'
                        ];

                        dateProperties.forEach(property => {
                            item[property] = dateConverter(item[property], dateProperties.includes('DateHeureAccident'));
                        });
                    });

                    setData(accidents);
                } else {
                    console.error("La réponse de l'API n'est pas un tableau.");
                }
            })
            .catch(error => {
                console.log("Home.js => refresh list accident error =>", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /**
     * Fonction qui permet de filtrer les données de la table en fonction du contenu de la barre de recherche
     */
    const filteredData = data.filter((item) => {
        const filterProperties = [
            'recordNumberGroupoe',
            'recordNumberEntreprise',
            'DateHeureAccident',
            'entrepriseName',
            'secteur',
            'nomTravailleur',
            'prenomTravailleur',
            'typeAccident'
        ];
        return filterProperties.some((property) => {
            const value = item[property];
            return (
                value &&
                typeof value === 'string' &&
                value.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    });

    if (loading) {
        return <LinearProgress color="success" />;
    }

    const rowColors = ['#bed1be', '#d2e2d2']; // Tableau de couleurs pour les lignes

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="secondary"
                        onClick={refreshListAccidents}
                        startIcon={<RefreshIcon />}
                    >
                        Actualiser
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <TextField
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        variant="outlined"
                        sx={{ boxShadow: 3, backgroundColor: '#84a784' }}
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
                        sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleExportData(filteredData)}
                        startIcon={<GetAppIcon />}
                    >
                        Accident
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleExportDataAss(filteredData)}
                        startIcon={<GetAppIcon />}
                    >
                        Assurance
                    </Button>
                </Grid>
            </div>

            <TableContainer>
                <div className="frameStyle-style">
                    <Table>
                        <TableHead>
                            <React.Fragment>
                                <TableRow style={{ backgroundColor: '#84a784' }} key={"CellTowerSharp"}>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° Groupe</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° Entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Date accident</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Nom du travailleur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Prénom du travailleur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Type accident</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>&nbsp;&nbsp;&nbsp;Editer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PDF&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Supprimer</TableCell>
                                </TableRow>
                                <TableRow className="table-row-separatormenu"></TableRow>
                            </React.Fragment>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <React.Fragment key={item._id}>
                                    <TableRow key={item._id} style={{ backgroundColor: rowColors[index % rowColors.length] }} // Utilisez le style alternatif pour chaque deuxième ligne
                                    >
                                        <TableCell>{item.numeroGroupe}</TableCell>
                                        <TableCell>{item.numeroEntreprise}</TableCell>
                                        <TableCell>{item.DateHeureAccident}</TableCell>
                                        <TableCell>{item.entrepriseName}</TableCell>
                                        <TableCell>{item.secteur}</TableCell>
                                        <TableCell>{item.nomTravailleur}</TableCell>
                                        <TableCell>{item.prenomTravailleur}</TableCell>
                                        <TableCell>{item.typeAccident}</TableCell>
                                        <TableCell>
                                            <Button style={{ margin: '2px' }} variant="contained" color="primary" onClick={() => handleEdit(item._id)}> <EditIcon /></Button>
                                            <Button style={{ margin: '2px' }} variant="contained" color="success" onClick={() => handleGeneratePDF(item._id)}> <PictureAsPdfIcon /></Button>
                                            <Button
                                                style={{ margin: '2px' }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    confirmAlert({
                                                        customUI: ({ onClose }) => {
                                                            return (
                                                                <div className="custom-confirm-dialog">
                                                                    <h1 className="custom-confirm-title">Supprimer</h1>
                                                                    <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                                                                    <div className="custom-confirm-buttons">
                                                                        <button
                                                                            className="custom-confirm-button"
                                                                            onClick={() => {
                                                                                handleDelete(item._id);
                                                                                onClose();
                                                                            }}
                                                                        >
                                                                            Oui
                                                                        </button>
                                                                        <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                                                            Non
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    });
                                                }}
                                            >
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {/* Ligne de séparation */}
                                    <TableRow className="table-row-separator">
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </TableContainer>
        </div>

    );
}

export default Home;
