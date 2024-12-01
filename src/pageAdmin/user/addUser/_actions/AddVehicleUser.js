import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../../../../_composants/textFieldP';
import ControlLabelAdminP from '../../../../_composants/controlLabelAdminP';
import { Box, Paper, Tooltip, Typography, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../../../../_composants/CustomSnackbar';
import { useTheme } from '../../../../Hook/ThemeContext';
import config from '../../../../config.json';

export default function AddVehicleUser() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const userToEdit = location.state?.user;
    const apiUrl = config.apiUrl;
    
    const { register, setValue, handleSubmit } = useForm();
    
    const [user, setUser] = useState({
        userLogin: "",
        userPassword: "",
        userName: "",
        isVehicleAdmin: false,
        isFleetManager: false,
        entrepriseName: ""

    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        if (userToEdit) {
            setUser(userToEdit);
            Object.keys(userToEdit).forEach(key => {
                setValue(key, userToEdit[key]);
            });
        }
    }, [userToEdit, setValue]);

    const handleChange = (key, value) => {
        setUser(prevData => ({ ...prevData, [key]: value }));
    };

    const onSubmit = async () => {
        try {
            const method = userToEdit ? 'put' : 'post';
            const endpoint = userToEdit 
                ? `http://${apiUrl}:3100/api/vehicleUsers/${userToEdit._id}`
                : `http://${apiUrl}:3100/api/vehicleUsers`;

            const response = await axios[method](endpoint, user);
            
            showSnackbar(userToEdit ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès', 'success');
            
            setTimeout(() => {
                navigate('/vehicleUsers');
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
                        {userToEdit ? 'Modifier un utilisateur véhicule' : 'Créer un utilisateur véhicule'}
                    </Typography>
                </Box>

                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Informations utilisateur</h3>

                <TextFieldP
                    id='userLogin'
                    label="Adresse email"
                    onChange={(value) => handleChange('userLogin', value)}
                    defaultValue={user.userLogin}
                />

                <TextFieldP
                    id='userPassword'
                    label="Mot de passe"
                    onChange={(value) => handleChange('userPassword', value)}
                    defaultValue={user.userPassword}
                />

                <TextFieldP
                    id='userName'
                    label="Nom et Prénom"
                    onChange={(value) => handleChange('userName', value)}
                    defaultValue={user.userName}
                />

                <TextFieldP
                    id='entrepriseName'
                    label="Nom de l'entreprise"
                    onChange={(value) => handleChange('entrepriseName', value)}
                    defaultValue={user.entrepriseName}
                />

                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Droits d'accès</h3>

                <Tooltip title="Cocher cette case si l'utilisateur est administrateur véhicules" arrow>
                    <Grid container direction="row" alignItems="center">
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ControlLabelAdminP
                                id="isVehicleAdmin"
                                label="Administrateur véhicules"
                                onChange={(value) => {
                                    handleChange('isVehicleAdmin', value);
                                    setValue('isVehicleAdmin', value);
                                }}
                                checked={Boolean(user.isVehicleAdmin)}
                                defaultChecked={Boolean(user.isVehicleAdmin)}
                            />
                        </Grid>
                    </Grid>
                </Tooltip>

                <Tooltip title="Cocher cette case si l'utilisateur est gestionnaire de flotte" arrow>
                    <Grid container direction="row" alignItems="center">
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ControlLabelAdminP
                                id="isFleetManager"
                                label="Gestionnaire de flotte"
                                onChange={(value) => {
                                    handleChange('isFleetManager', value);
                                    setValue('isFleetManager', value);
                                }}
                                checked={Boolean(user.isFleetManager)}
                                defaultChecked={Boolean(user.isFleetManager)}
                            />
                        </Grid>
                    </Grid>
                </Tooltip>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title={userToEdit ? "Modifier l'utilisateur" : "Créer l'utilisateur"} arrow>
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
                            {userToEdit ? 'Modifier l\'utilisateur' : 'Créer l\'utilisateur'}
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