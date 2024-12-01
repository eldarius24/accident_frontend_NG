import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    IconButton,
    LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Hook/ThemeContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import CustomSnackbar from '../../_composants/CustomSnackbar';
import config from '../../config.json';
import axios from 'axios';

export default function VehicleUserManagement() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = config.apiUrl;
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const rowColors = [
        darkMode ? '#7a7a7a' : '#e62a5625',
        darkMode ? '#979797' : '#95519b25'
    ];

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getRole = (user) => {
        if (user.isVehicleAdmin) return 'Administrateur Véhicules';
        if (user.isFleetManager) return 'Gestionnaire de Flotte';
        return 'Utilisateur Véhicule';
    };

    const handleEdit = (user) => {
        try {
            navigate("/addVehicleUser", { state: { user } });
            showSnackbar('Modification de l\'utilisateur initiée', 'info');
        } catch (error) {
            console.error("Erreur lors de la navigation vers editVehicleUser:", error);
            showSnackbar('Erreur lors de l\'initialisation de l\'édition', 'error');
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(`http://${apiUrl}:3100/api/vehicleUsers/${userId}`);
            
            if (response.status === 200 || response.status === 204) {
                setUsers(users.filter(user => user._id !== userId));
                showSnackbar('Utilisateur supprimé avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showSnackbar('Erreur lors de la suppression de l\'utilisateur', 'error');
        }
    };

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/vehicleUsers`);
            setUsers(response.data);
            showSnackbar('Utilisateurs chargés avec succès', 'success');
        } catch (error) {
            console.error('Error fetching users:', error);
            showSnackbar('Erreur lors du chargement des utilisateurs', 'error');
        } finally {
            setLoading(false);
        }
    }, [apiUrl, showSnackbar]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <div style={{ margin: '0 20px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    margin: '1.5rem 0'
                }}
            >
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
                    Gestion des Utilisateurs Véhicules
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
                        <TableRow 
                            className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                            style={{
                                backgroundColor: darkMode ? '#535353' : '#0098f950',
                            }}
                        >
                            <TableCell style={{ fontWeight: 'bold' }}>Login</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Modifier</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow
                                key={user._id}
                                className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                style={{
                                    backgroundColor: rowColors[index % rowColors.length],
                                }}
                            >
                                <TableCell>{user.userLogin}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{getRole(user)}</TableCell>
                                <TableCell>{user.entrepriseName || 'N/A'}</TableCell>
                                <TableCell style={{ padding: 0, width: '70px' }}>
                                    <Tooltip title="Modifier l'utilisateur" arrow>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(user)}
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                                }
                                            }}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ padding: 0, width: '70px' }}>
                                    <Tooltip title="Supprimer l'utilisateur" arrow>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                confirmAlert({
                                                    customUI: ({ onClose }) => {
                                                        return (
                                                            <div className="custom-confirm-dialog">
                                                                <h1>Supprimer</h1>
                                                                <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                                                                <Button
                                                                    onClick={() => {
                                                                        handleDelete(user._id);
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
