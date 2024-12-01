import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Paper,
    Tooltip,
    Typography,
    Button,
    Grid,
    MenuItem,
    TextField as MuiTextField
} from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import config from '../config.json';
import axios from 'axios';

const CARBURANT_TYPES = [
    { value: 'DIESEL', label: 'Diesel' },
    { value: 'ESSENCE', label: 'Essence' },
    { value: 'HYBRID', label: 'Hybride' },
    { value: 'ELECTRIC', label: 'Électrique' }
];

export default function AddVehicle() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const vehicleToEdit = location.state?.vehicle;
    const apiUrl = config.apiUrl;
    
    const { register, setValue, handleSubmit } = useForm();
    
    const [vehicle, setVehicle] = useState({
        numPlaque: '',
        marque: '',
        modele: '',
        typeCarburant: '',
        nombrePlaces: '',
        anneeConstruction: '',
        entrepriseName: '',
        kilometrage: '',
        dateAchat: '',
        dateDerniereRevision: '',
        dateDernierCT: '',
        dateProchainCT: ''
    });

    const [companies, setCompanies] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicleCompanies`);
                setCompanies(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des entreprises:', error);
                showSnackbar('Erreur lors du chargement des entreprises', 'error');
            }
        };

        fetchCompanies();

        if (vehicleToEdit) {
            const formattedVehicle = {
                ...vehicleToEdit,
                dateAchat: vehicleToEdit.dateAchat ? new Date(vehicleToEdit.dateAchat).toISOString().split('T')[0] : '',
                dateDerniereRevision: vehicleToEdit.dateDerniereRevision ? new Date(vehicleToEdit.dateDerniereRevision).toISOString().split('T')[0] : '',
                dateDernierCT: vehicleToEdit.dateDernierCT ? new Date(vehicleToEdit.dateDernierCT).toISOString().split('T')[0] : '',
                dateProchainCT: vehicleToEdit.dateProchainCT ? new Date(vehicleToEdit.dateProchainCT).toISOString().split('T')[0] : '',
            };
            setVehicle(formattedVehicle);
            Object.keys(formattedVehicle).forEach(key => {
                setValue(key, formattedVehicle[key]);
            });
        }
    }, [vehicleToEdit, setValue, apiUrl]);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (key, value) => {
        setVehicle(prev => ({ ...prev, [key]: value }));
        setValue(key, value);
    };

    const onSubmit = async () => {
        try {
            const method = vehicleToEdit ? 'put' : 'post';
            const endpoint = vehicleToEdit 
                ? `http://${apiUrl}:3100/api/vehicles/${vehicleToEdit._id}`
                : `http://${apiUrl}:3100/api/vehicles`;

            const response = await axios[method](endpoint, vehicle);
            
            showSnackbar(
                vehicleToEdit ? 'Véhicule modifié avec succès' : 'Véhicule créé avec succès',
                'success'
            );
            
            setTimeout(() => {
                navigate('/AdminVehicule');
            }, 2000);
        } catch (error) {
            console.error('Erreur:', error);
            showSnackbar(error.response?.data?.message || 'Erreur lors de l\'opération', 'error');
        }
    };

    return (
        <form className="background-image" style={{ margin: '0 20px' }} onSubmit={handleSubmit(onSubmit)}>
            <Paper
                elevation={3}
                sx={{
                    border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                    borderRadius: '8px',
                    padding: '20px',
                    margin: '20px 0',
                    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                    '&:hover': {
                        boxShadow: darkMode
                            ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                            : '0 8px 16px rgba(238, 116, 45, 0.2)'
                    }
                }}
            >
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
                        {vehicleToEdit ? 'Modifier un véhicule' : 'Ajouter un véhicule'}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Informations de base */}
                    <Grid item xs={12} md={6}>
                        <TextFieldP
                            id='numPlaque'
                            label="Numéro de plaque"
                            onChange={(value) => handleChange('numPlaque', value)}
                            defaultValue={vehicle.numPlaque}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextFieldP
                            id='marque'
                            label="Marque"
                            onChange={(value) => handleChange('marque', value)}
                            defaultValue={vehicle.marque}
                            required
                        />
                    </Grid>

                    {/* Reste des champs */}
                    {/* ... Autres champs comme avant ... */}

                    {/* Dates avec input type="date" */}
                    <Grid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            type="date"
                            label="Date d'achat"
                            value={vehicle.dateAchat}
                            onChange={(e) => handleChange('dateAchat', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ffffff',
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#ffffff' : 'inherit'
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            type="date"
                            label="Date dernière révision"
                            value={vehicle.dateDerniereRevision}
                            onChange={(e) => handleChange('dateDerniereRevision', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ffffff',
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#ffffff' : 'inherit'
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            type="date"
                            label="Date dernier CT"
                            value={vehicle.dateDernierCT}
                            onChange={(e) => handleChange('dateDernierCT', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ffffff',
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#ffffff' : 'inherit'
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MuiTextField
                            fullWidth
                            type="date"
                            label="Date prochain CT"
                            value={vehicle.dateProchainCT}
                            onChange={(e) => handleChange('dateProchainCT', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ffffff',
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#ffffff' : 'inherit'
                                }
                            }}
                        />
                    </Grid>
                </Grid>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Tooltip title={vehicleToEdit ? "Modifier le véhicule" : "Ajouter le véhicule"} arrow>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.1s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                padding: '10px 20px',
                                width: '50%',
                                height: '300%',
                                fontSize: '2rem',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                '@media (min-width: 750px)': {
                                    fontSize: '3rem',
                                },
                                '@media (max-width: 550px)': {
                                    fontSize: '1.5rem',
                                },
                            }}
                            variant="contained"
                        >
                            {vehicleToEdit ? 'Modifier le véhicule' : 'Ajouter le véhicule'}
                        </Button>
                    </Tooltip>
                </div>
            </Paper>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </form>
    );
}