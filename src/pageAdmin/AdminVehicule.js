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
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import axios from 'axios';
import { useLogger } from '../Hook/useLogger';
import { blueGrey } from '@mui/material/colors';
export default function VehicleList() {
    const { logAction } = useLogger();
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = config.apiUrl;
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']
            : ['#e62a5625', '#95519b25'],
        [darkMode]
    );

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

    const handleEdit = async (vehicle) => {
        try {
            // S'assurer que tous les champs sont disponibles avant la navigation
            const vehicleToEdit = {
                ...vehicle,
                kilometrage: vehicle.kilometrage || 0  // Assurez-vous que le kilométrage existe

            };

            await logAction({
                actionType: 'modification',
                details: `Modification du véhicule ${vehicle.numPlaque}`,
                entity: 'Vehicle',
                entityId: vehicle._id
            });


            navigate("/AdminAddVehicule", { state: { vehicle: vehicleToEdit } });
            showSnackbar('Modification du véhicule initiée', 'info');
        } catch (error) {
            console.error("Erreur lors de la navigation:", error);
            showSnackbar('Erreur lors de l\'initialisation de l\'édition', 'error');
        }
    };

    const handleDelete = async (vehicleId) => {
        try {
            await axios.delete(`http://${apiUrl}:3100/api/vehicles/${vehicleId}`);

            await logAction({
                actionType: 'suppression',
                details: `Suppression du véhicule`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

            setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleId));
            showSnackbar('Véhicule supprimé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showSnackbar('Erreur lors de la suppression du véhicule', 'error');
        }
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicles`);
                setVehicles(response.data);

                await logAction({
                    actionType: 'consultation',
                    details: 'Consultation de la liste des véhicules',
                    entity: 'Vehicle'
                });

                showSnackbar('Véhicules chargés avec succès', 'success');
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                showSnackbar('Erreur lors du chargement des véhicules', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [apiUrl]);

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
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Modifier</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.map((vehicle, index) => (
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
                                    <Tooltip title="Modifier le véhicule" arrow>
                                        <Button
                                            variant="contained"
                                            color="primary"
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
                                <TableCell style={{ padding: 0, width: '70px' }}>
                                    <Tooltip title="Supprimer le véhicule" arrow>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                confirmAlert({
                                                    customUI: ({ onClose }) => {
                                                        return (
                                                            <div className="custom-confirm-dialog">
                                                                <h1>Supprimer</h1>
                                                                <p>Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
                                                                <Button
                                                                    onClick={() => {
                                                                        handleDelete(vehicle._id);
                                                                        onClose();
                                                                    }}
                                                                >
                                                                    Oui
                                                                </Button>
                                                                <Button onClick={onClose}>
                                                                    Non
                                                                </Button>
                                                            </div>
                                                        );
                                                    }
                                                });
                                            }}
                                            sx={{
                                                backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#d32f2f' : '#b71c1c',
                                                }
                                            }}
                                        >
                                            <DeleteForeverIcon />
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