import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Paper, Tooltip, Typography, Button } from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import config from '../config.json';
import axios from 'axios';

export default function AddVehicleCompany() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const companyToEdit = location.state?.company;
    const apiUrl = config.apiUrl;
    
    const { register, setValue, handleSubmit } = useForm();
    
    const [company, setCompany] = useState({
        companyName: '',
        address: '',
        postalCode: '',
        city: '',
        phone: '',
        email: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        if (companyToEdit) {
            setCompany(companyToEdit);
            Object.keys(companyToEdit).forEach(key => {
                setValue(key, companyToEdit[key]);
            });
        }
    }, [companyToEdit, setValue]);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (key, value) => {
        setCompany(prev => ({ ...prev, [key]: value }));
    };

    const onSubmit = async () => {
        try {
            const method = companyToEdit ? 'put' : 'post';
            const endpoint = companyToEdit 
                ? `http://${apiUrl}:3100/api/vehicleCompanies/${companyToEdit._id}`
                : `http://${apiUrl}:3100/api/vehicleCompanies`;

            const response = await axios[method](endpoint, company);
            
            showSnackbar(
                companyToEdit ? 'Entreprise modifiée avec succès' : 'Entreprise créée avec succès',
                'success'
            );
            
            setTimeout(() => {
                navigate('/adminVehiculeCompany');
            }, 2000);
        } catch (error) {
            console.error('Erreur:', error);
            showSnackbar('Erreur lors de l\'opération', 'error');
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
                        {companyToEdit ? 'Modifier une entreprise' : 'Créer une entreprise'}
                    </Typography>
                </Box>

                <TextFieldP
                    id='companyName'
                    label="Nom de l'entreprise"
                    onChange={(value) => handleChange('companyName', value)}
                    defaultValue={company.companyName}
                    required
                />

                <TextFieldP
                    id='address'
                    label="Adresse"
                    onChange={(value) => handleChange('address', value)}
                    defaultValue={company.address}
                />

                <TextFieldP
                    id='postalCode'
                    label="Code postal"
                    onChange={(value) => handleChange('postalCode', value)}
                    defaultValue={company.postalCode}
                />

                <TextFieldP
                    id='city'
                    label="Ville"
                    onChange={(value) => handleChange('city', value)}
                    defaultValue={company.city}
                />

                <TextFieldP
                    id='phone'
                    label="Téléphone"
                    onChange={(value) => handleChange('phone', value)}
                    defaultValue={company.phone}
                />

                <TextFieldP
                    id='email'
                    label="Email"
                    onChange={(value) => handleChange('email', value)}
                    defaultValue={company.email}
                />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title={companyToEdit ? "Modifier l'entreprise" : "Créer l'entreprise"} arrow>
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
                                marginTop: '1cm',
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
                            {companyToEdit ? 'Modifier l\'entreprise' : 'Créer l\'entreprise'}
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