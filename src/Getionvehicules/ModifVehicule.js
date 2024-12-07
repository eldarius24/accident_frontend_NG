import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box, Paper, Tooltip, Typography, Button, Grid,
} from '@mui/material';
import DatePickerP from '../_composants/datePickerP';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import { useLogger } from '../Hook/useLogger';
import config from '../config.json';
import axios from 'axios';
import dayjs from 'dayjs';
import EmailNotificationManager from '../Dialog/EmailNotificationManager';

export default function ModifVehicle() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { darkMode } = useTheme();
    const { logAction } = useLogger();
    const navigate = useNavigate();
    const location = useLocation();
    const vehicleToEdit = location.state?.vehicle;
    const apiUrl = config.apiUrl;
    const { register, setValue, handleSubmit } = useForm();

    const [dateDerniereRevision, setDateDerniereRevision] = useState(vehicleToEdit?.dateDerniereRevision || null);
    const [dateProchaineRevision, setdateProchaineRevision] = useState(vehicleToEdit?.dateProchaineRevision || "");
    const [dateDernierCT, setDateDernierCT] = useState(vehicleToEdit?.dateDernierCT || null);
    const [dateProchainCT, setDateProchainCT] = useState(vehicleToEdit?.dateProchainCT || null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        setValue('dateDerniereRevision', dateDerniereRevision);
        setValue('dateProchaineRevision', dateProchaineRevision);
        setValue('dateDernierCT', dateDernierCT);
        setValue('dateProchainCT', dateProchainCT);
    }, [dateProchaineRevision, dateDerniereRevision, dateDernierCT, dateProchainCT, setValue]);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const validateDates = () => {
        if (dateDernierCT && dateProchainCT) {
            const dernierCT = new Date(dateDernierCT);
            const prochainCT = new Date(dateProchainCT);
            if (prochainCT <= dernierCT) {
                showSnackbar('La date du prochain CT doit être postérieure à celle du dernier CT', 'error');
                return false;
            }
        }
        return true;
    };

    const onSubmit = async () => {
              // Éviter la double soumission
              if (isSubmitting) return;

              // Marquer comme en cours de soumission
              setIsSubmitting(true);
      
              try {
                  if (!validateDates()) {
                      setIsSubmitting(false);
                      return;
                  }

            const vehicleData = {
                ...vehicleToEdit,
                dateDerniereRevision: dateDerniereRevision ? dayjs(dateDerniereRevision).format('YYYY-MM-DD') : null,
                dateProchaineRevision: dateProchaineRevision ? dayjs(dateProchaineRevision).format('YYYY-MM-DD') : null,
                dateDernierCT: dateDernierCT ? dayjs(dateDernierCT).format('YYYY-MM-DD') : null,
                dateProchainCT: dateProchainCT ? dayjs(dateProchainCT).format('YYYY-MM-DD') : null
            };

            const response = await axios.put(
                `http://${apiUrl}:3100/api/vehicles/${vehicleToEdit._id}`,
                vehicleData
            );

            await logAction({
                actionType: 'modification',
                details: `Mise à jour des dates du véhicule ${vehicleToEdit.numPlaque}`,
                entity: 'Vehicle',
                entityId: vehicleToEdit._id
            });

            showSnackbar('Véhicule modifié avec succès', 'success');
            setTimeout(() => navigate('/gestionVehicules'), 2000);
        } catch (error) {
            console.error('Erreur:', error);
            showSnackbar(error.response?.data?.message || 'Erreur lors de la modification', 'error');
        }
    };

    return (
        <form className="background-image" style={{ margin: '0 20px' }} onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={3} sx={{
                border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                '&:hover': {
                    boxShadow: darkMode ? '0 8px 16px rgba(255, 255, 255, 0.1)' : '0 8px 16px rgba(238, 116, 45, 0.2)'
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    margin: '1.5rem 0'
                }}>
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                        fontWeight: 600,
                        background: darkMode ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)' : 'linear-gradient(45deg, #ee752d, #f4a261)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        {vehicleToEdit ? 'Modifier un véhicule' : 'Ajouter un véhicule'}
                    </Typography>
                </Box>

                <Grid container spacing={2}>


                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateDerniereRevision'
                            label="Date dernière révision"
                            onChange={(value) => {
                                setDateDerniereRevision(value);
                                setValue('dateDerniereRevision', value);
                            }}
                            defaultValue={dateDerniereRevision}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateProchaineRevision'
                            label="Date prochaine révision"
                            onChange={(value) => {
                                setdateProchaineRevision(value);
                                setValue('dateProchaineRevision', value);
                            }}
                            defaultValue={dateProchaineRevision}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateDernierCT'
                            label="Date dernier CT"
                            onChange={(value) => {
                                setDateDernierCT(value);
                                setValue('dateDernierCT', value);
                            }}
                            defaultValue={dateDernierCT}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateProchainCT'
                            label="Date prochain CT"
                            onChange={(value) => {
                                setDateProchainCT(value);
                                setValue('dateProchainCT', value);
                            }}
                            defaultValue={dateProchainCT}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <EmailNotificationManager vehicleId={vehicleToEdit._id} />
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Tooltip title={vehicleToEdit ? "Modifier le véhicule" : "Ajouter le véhicule"} arrow>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
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
                            {isSubmitting 
                                ? 'Modification en cours...' 
                                : (vehicleToEdit ? 'Modifier le véhicule' : 'Ajouter le véhicule')
                            }
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