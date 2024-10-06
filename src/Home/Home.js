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
import '../pageFormulaire/formulaire.css';
import { handleExportData, handleExportDataAss} from '../Model/excelGenerator.js';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import getAccidents from './_actions/get-accidents.js';
import { useUserConnected } from '../Hook/userConnected.js';

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

    const isConseillerPrevention = (entrepriseName) => {
        return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
    };

    const handleDelete = (accidentIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/accidents/${accidentIdToDelete}`)
            .then(response => {
                if ([200, 204].includes(response.status)) {
                    console.log('Accident supprimé avec succès');
                    setAccidents(prevAccidents => prevAccidents.filter(item => item._id !== accidentIdToDelete));
                } else {
                    console.log(`Erreur lors de la suppression de l'accident, code d'erreur : ${response.status} ${response.statusText}`);
                }
            })
            .catch(console.error);
    };

    const handleGeneratePDF = async (accidentIdToGenerate) => {
        const accident = accidents.find(item => item._id === accidentIdToGenerate);
        if (accident) {
            try {
                await editPDF(accident);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Accident non trouvé");
        }
    };

    const handleEdit = async (accidentIdToModify) => {
        try {
            const { data } = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentIdToModify}`);
            navigate("/formulaire", { state: data });
        } catch (error) {
            console.log(error);
        }
    };

    const refreshListAccidents = useCallback(() => {
        startGetAccidents(async () => {
            try {
                const fetchedAccidents = await getAccidents();
                setAccidents(fetchedAccidents);
                setYearsFromData([...new Set(fetchedAccidents.map(accident => new Date(accident.DateHeureAccident).getFullYear()))]);
            } catch (error) {
                console.error("Erreur lors de la récupération des accidents:", error);
            }
        });
    }, [startGetAccidents]);

    useEffect(() => {
        refreshListAccidents();
        const currentYear = new Date().getFullYear();
        setYearsChecked(prevYears => [...prevYears, currentYear]);
    }, [refreshListAccidents]);

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

    const handleChangeYearsFilter = (event) => {
        const value = event.target.value;
        setYearsChecked(typeof value === 'string' ? value.split(',') : value);
    };

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
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
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
                </Grid>
                {isAdminOuConseiller && (
                    <>
                        <Grid item xs={6} style={{ marginRight: '20px' }}>
                            <Button
                                sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                                variant="contained"
                                color="primary"
                                onClick={() => handleExportData(filteredData())}
                            >
                                Accident
                            </Button>
                        </Grid>
                        <Grid item xs={6} style={{ marginRight: '20px' }}>
                            <Button
                                sx={{ color: 'black', padding: '15px 60px', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                                variant="contained"
                                color="primary"
                                onClick={() => handleExportDataAss(filteredData())}
                                startIcon={<FileUploadIcon />}
                            >
                                Assurance
                            </Button>
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
                                    {isAdmin || (isConseiller && isConseillerPrevention(item.entrepriseName)) ? (
                                        <>
                                            <TableCell style={{ padding: 0 }}>
                                                <Button variant="contained" color="primary" onClick={() => handleEdit(item._id)}>
                                                    <EditIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell style={{ padding: 0 }}>
                                                <Button variant="contained" color="secondary" onClick={() => navigate("/fichierdll", { state: item._id })}>
                                                    <GetAppIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell style={{ padding: 0 }}>
                                                <Button variant="contained" color="success" onClick={() => handleGeneratePDF(item._id)}>
                                                    <PictureAsPdfIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell style={{ padding: 0 }}>
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
                                        </>
                                    ) : null}
                                </TableRow>
                                <TableRow className="table-row-separator"></TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
        </div>
    );
}

export default Home;