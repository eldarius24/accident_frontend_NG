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

export default function VehicleCompanyList() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
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

    const handleEdit = (company) => {
        try {
            navigate("/addVehicleCompany", { state: { company } });
            showSnackbar('Modification de l\'entreprise initiée', 'info');
        } catch (error) {
            console.error("Erreur lors de la navigation:", error);
            showSnackbar('Erreur lors de l\'initialisation de l\'édition', 'error');
        }
    };

    const handleDelete = async (companyId) => {
        try {
            await axios.delete(`http://${apiUrl}:3100/api/vehicleCompanies/${companyId}`);
            setCompanies(companies.filter(company => company._id !== companyId));
            showSnackbar('Entreprise supprimée avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showSnackbar('Erreur lors de la suppression de l\'entreprise', 'error');
        }
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicleCompanies`);
                setCompanies(response.data);
                showSnackbar('Entreprises chargées avec succès', 'success');
            } catch (error) {
                console.error('Error fetching companies:', error);
                showSnackbar('Erreur lors du chargement des entreprises', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
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
                    Gestion des Entreprises Véhicules
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
                            <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Adresse</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Code Postal</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Ville</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Téléphone</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Modifier</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company, index) => (
                            <TableRow
                                key={company._id}
                                className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                style={{
                                    backgroundColor: rowColors[index % rowColors.length],
                                }}
                            >
                                <TableCell>{company.companyName}</TableCell>
                                <TableCell>{company.address}</TableCell>
                                <TableCell>{company.postalCode}</TableCell>
                                <TableCell>{company.city}</TableCell>
                                <TableCell>{company.phone}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell style={{ padding: 0, width: '70px' }}>
                                    <Tooltip title="Modifier l'entreprise" arrow>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleEdit(company)}
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
                                    <Tooltip title="Supprimer l'entreprise" arrow>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                confirmAlert({
                                                    customUI: ({ onClose }) => {
                                                        return (
                                                            <div className="custom-confirm-dialog">
                                                                <h1>Supprimer</h1>
                                                                <p>Êtes-vous sûr de vouloir supprimer cette entreprise ?</p>
                                                                <Button
                                                                    onClick={() => {
                                                                        handleDelete(company._id);
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