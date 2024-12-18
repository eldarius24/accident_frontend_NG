import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    LinearProgress,
    Tooltip,
    Box,
    Typography,
    TextField,
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import axios from 'axios';
import { blueGrey } from '@mui/material/colors';
import GetAppIcon from '@mui/icons-material/GetApp';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function GetionVehicleList() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchPlaque, setSearchPlaque] = useState('');
    const apiUrl = config.apiUrl;
    const { userInfo, isAdminOrDev } = useUserConnected();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const ITEM_MARGIN = '20px';
    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']
            : ['#e62a5625', '#95519b25'],
        [darkMode]
    );

    const filteredVehicles = useMemo(() => {
        const searchTerm = searchPlaque.toLowerCase();
        return vehicles.filter(vehicle =>
            vehicle.numPlaque.toLowerCase().includes(searchTerm) ||
            vehicle.marque.toLowerCase().includes(searchTerm) ||
            vehicle.modele.toLowerCase().includes(searchTerm) ||
            vehicle.entrepriseName.toLowerCase().includes(searchTerm) ||
            vehicle.secteur.toLowerCase().includes(searchTerm)
        );
    }, [vehicles, searchPlaque]);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleEdit = (vehicle) => {
        try {
            const vehicleToEdit = {
                ...vehicle,
                kilometrage: vehicle.kilometrage || 0
            };
            navigate("/modifVehicule", { state: { vehicle: vehicleToEdit } });
            showSnackbar('Modification du véhicule initiée', 'info');
        } catch (error) {
            console.error("Erreur lors de la navigation:", error);
            showSnackbar('Erreur lors de l\'initialisation de l\'édition', 'error');
        }
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicles`);
                let filteredVehicles = response.data;

                if (!isAdminOrDev && userInfo?.userGetionaireVehicule) {
                    filteredVehicles = response.data.filter(vehicle =>
                        userInfo.userGetionaireVehicule.includes(vehicle.entrepriseName)
                    );
                }

                setVehicles(filteredVehicles);
                showSnackbar('Véhicules chargés avec succès', 'success');
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                showSnackbar('Erreur lors du chargement des véhicules', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <div style={{ margin: '0 20px' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                margin: '1.5rem 0'
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                        fontWeight: 600,
                        background: darkMode
                            ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                            : 'linear-gradient(45deg, #ee752d, #f4a261)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}
                >
                    Liste des Véhicules
                </Typography>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
            <Grid item xs={3} sx={{ pr: ITEM_MARGIN }}>
                <TextField
                    fullWidth
                    label="Rechercher par mot-clé"
                    variant="outlined"
                    value={searchPlaque}
                    onChange={(e) => setSearchPlaque(e.target.value)}
                    sx={{
                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                        backgroundColor: darkMode ? '#424242' : '#ee752d60',
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            color: darkMode ? '#fff' : 'inherit',
                            '& fieldset': {
                                borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                            },
                            '&:hover fieldset': {
                                borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: darkMode ? 'rgba(255,255,255,0.7)' : '#1976d2'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : 'inherit'
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: darkMode ? '#fff' : 'inherit' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            '&::placeholder': {
                                color: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit'
                            }
                        }
                    }}
                />
            </Grid>
            </Box>

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
                        <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                            style={{
                                backgroundColor: darkMode ? '#535353' : '#0098f950',
                            }}>
                            <TableCell style={{ fontWeight: 'bold' }}>N° Plaque</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Marque/Modèle</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Carburant</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Num. Chassis</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Kilométrage</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Dernier entretien</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Prochain entretien</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Dernier CT</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Prochain CT</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Fichier</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Modifier</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVehicles.map((vehicle, index) => (
                            <TableRow
                                key={vehicle._id}
                                className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                style={{
                                    backgroundColor: rowColors[index % rowColors.length],
                                }}
                            >
                                <TableCell>{vehicle.numPlaque}</TableCell>
                                <TableCell>{`${vehicle.marque} ${vehicle.modele}`}</TableCell>
                                <TableCell>{vehicle.typeCarburant}</TableCell>
                                <TableCell>{vehicle.entrepriseName}</TableCell>
                                <TableCell>{vehicle.secteur}</TableCell>
                                <TableCell>{vehicle.numChassis}</TableCell>
                                <TableCell>{vehicle.kilometrage} km</TableCell>
                                <TableCell>{formatDate(vehicle.dateDerniereRevision)}</TableCell>
                                <TableCell>{formatDate(vehicle.dateProchaineRevision)}</TableCell>
                                <TableCell>{formatDate(vehicle.dateDernierCT)}</TableCell>
                                <TableCell>{formatDate(vehicle.dateProchainCT)}</TableCell>
                                <TableCell style={{ padding: 0, width: '70px' }}>
                                    <Tooltip title="ajouter et consulter les documents ou infos du véhicule" arrow>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/vehiculeDetails', { state: { vehicleId: vehicle._id } })}
                                            sx={{
                                                backgroundColor: darkMode ? '#7b1fa2' : '#9c27b0',
                                                transition: 'all 0.1s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#4a0072' : '#7b1fa2',
                                                    transform: 'scale(1.08)',
                                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }}
                                        >
                                            <GetAppIcon />
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ padding: 0, width: '70px' }}>
                                    <Tooltip title="Modifier les date de passage au contrôle technique et dates des entretiens et ajouter des contacts pour l'envoie des notifications" arrow>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleEdit(vehicle)}
                                            sx={{
                                                backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                                transition: 'all 0.1s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? blueGrey[900] : blueGrey[700],
                                                    transform: 'scale(1.08)',
                                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
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
        </div>
    );
}