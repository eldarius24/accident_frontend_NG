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
import * as ExcelJS from 'exceljs';

function Home() {
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const [data, setData] = useState([]); // Stocker les données de l'API
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [firstLoad, setFirstLoad] = useState(true);

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

    /*const handleEdit = (accidentIdToModify) => {

        axios.get("http://"+apiUrl+":3100/api/accidents/"+accidentIdToModify)
            .then(response => {
                const accidents = response.data;
                console.log(accidents);
                redirect("/formulaire")
            })
            .catch(error => {
                console.log(error);
            });
    };*/
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
        axios.get("http://" + apiUrl + ":3100/api/accidents")
            .then(response => {
                // Traiter la réponse de l'API
                const accidents = response.data;
                console.log(accidents);
                setData(accidents);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (firstLoad) {
            refreshListAccidents();
            setFirstLoad(false)
        }
    });

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter((item) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            Object.values(item).some((value) =>
                typeof value === "string" && value.toLowerCase().includes(searchTermLower)
            )
        );
    });

    if (loading) {
        return <LinearProgress color="success" />;
    }

    //=======================================================================================================
    //===========================================Comportement======================================
    //=======================================================================================================

    /**
     * Fonction pour exporter les données vers Excel
     * @returns {void}
     * @param {void}
     */
    const handleExportData = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Accidents');

        worksheet.addRow([

            'Nom de l entreprise',
            'Nom du secteur',
            'Type de travailleur',
            'Status assureur',
            'Date d envoie de la déclaration a l assurance',
            'Getionnaire du sinistre',
            'Numéro de la police d assurance',
            'Cloturer ou pas',
            'Commentaire et suivit',
            'référence du sinistre',

        ]);

        filteredData.forEach(item => {
            worksheet.addRow([

                item.entrepriseName,
                item.secteur,
                item.typetravailleur,
                item.AssureurStatus,
                item.DateEnvoieDeclarationAccident,
                item.Getionnaiesinistre,
                item.NumeroPoliceAssurance,
                item.boolAsCloture,
                item.commentaireetSuivit,
                item.referenceduSinistre,
            ]);
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const fileName = 'accidents.xlsx';

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // Pour Internet Explorer
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                // Pour les autres navigateurs
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url); // Libérer l'URL
            }
        });
    };


    /**
     * Fonction pour exporter les données filtrées
     * @returns {void}
     * @param {void}
     */
    const handleExportDataAss = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Accidents');

        // Ajouter l'en-tête
        worksheet.addRow([

            'Nom de l entreprise',
            'Nom du secteur',
            'Type de travailleur',
            'Status assureur',
            'Date d envoie de la déclaration a l assurance',
            'Getionnaire du sinistre',
            'Numéro de la police d assurance',
            'Cloturer ou pas',
            'Commentaire et suivit',
            'référence du sinistre',

        ]);

        // Ajouter les données filtrées
        filteredData.forEach(item => {
            worksheet.addRow([
                
                item.entrepriseName,
                item.secteur,
                item.typetravailleur,
                item.AssureurStatus,
                item.DateEnvoieDeclarationAccident,
                item.Getionnaiesinistre,
                item.NumeroPoliceAssurance,
                item.boolAsCloture,
                item.commentaireetSuivit,
                item.referenceduSinistre,

            ]);
        });



        // Générer le fichier Excel et le télécharger
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const fileName = 'accidents.xlsx';

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // Pour Internet Explorer
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                // Pour les autres navigateurs
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url); // Libérer l'URL
            }
        });
    };


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
                        onChange={handleSearch}
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
                        onClick={handleExportData}
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
                        onClick={handleExportDataAss}
                        startIcon={<GetAppIcon />}
                    >
                        Assurance
                    </Button>
                </Grid>
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow key={"CellTowerSharp"}>
                            <TableCell>N° Groupe</TableCell>
                            <TableCell>N° Entreprise</TableCell>
                            <TableCell>Date accident</TableCell>
                            <TableCell>Entreprise</TableCell>
                            <TableCell>Secteur</TableCell>
                            <TableCell>Nom du travailleur</TableCell>
                            <TableCell>Prénom du travailleur</TableCell>
                            <TableCell>Type accident</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.recordNumberGroupoe}</TableCell>
                                <TableCell>{item.recordNumberEntreprise}</TableCell>
                                <TableCell>{item.DateHeureAccident}</TableCell>
                                <TableCell>{item.entrepriseName}</TableCell>
                                <TableCell>{item.secteur}</TableCell>
                                <TableCell>{item.nomTravailleur}</TableCell>
                                <TableCell>{item.prenomTravailleur}</TableCell>
                                <TableCell>{item.typeAccident}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(item._id)}>
                                        <EditIcon />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(item._id)}
                                        startIcon={<DeleteForeverIcon />}
                                    >
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Home;
