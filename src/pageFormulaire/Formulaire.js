import axios from 'axios';
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './formulaire.css';
import FormulaireEntreprise from './formulaireEntreprise';
import FormulaireAssureur from './formulaireAssureur';
import FormulaireAccident from './formulaireAccident';
import FormulaireSalarie from './formulaireSalarie';
import FormulaireDeclarationASSBelfius from './formulaireDeclarationAssBelfius';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { Tooltip, Button, Paper, Box, Typography } from '@mui/material';
import { useLogger } from '../Hook/useLogger';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const forms = [
    { id: 0, component: FormulaireEntreprise },
    { id: 1, component: FormulaireAssureur },
    { id: 2, component: FormulaireSalarie },
    { id: 3, component: FormulaireAccident },
    { id: 4, component: FormulaireDeclarationASSBelfius },
];

const mandatoryFields = [
    'entrepriseName', 'secteur', 'typeTravailleur', 'nomTravailleur', 'prenomTravailleur',
    'dateNaissance', 'sexe', 'typeAccident', 'DateHeureAccident', 'blessures'
];

export default function Formulaire() {
    const { darkMode } = useTheme();
    const { logAction } = useLogger();
    const { state: accidentData } = useLocation();
    const apiUrl = config.apiUrl;
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const { setValue, control, handleSubmit, watch } = useForm();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeStep]);

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason !== 'clickaway') {
            setSnackbar(prev => ({ ...prev, open: false }));
        }
    }, []);

    const onSubmit = useCallback((data) => {
        // Convertir explicitement boolAsCloture en booléen
        const formattedData = {
            ...data,
            boolAsCloture: Boolean(data.boolAsCloture)
        };

        const missingFields = mandatoryFields.filter(field => !formattedData[field]);

        if (missingFields.length > 0) {
            const missingFieldNames = missingFields.map(field => field.replace('_', ' ')).join(', ');
            showSnackbar(`Veuillez remplir les champs obligatoires suivants : ${missingFieldNames}`, 'error');
            return;
        }

        const url = accidentData
            ? `http://${apiUrl}:3100/api/accidents/${accidentData._id}`
            : `http://${apiUrl}:3100/api/accidents`;

        const method = accidentData ? 'put' : 'post';

        axios[method](url, formattedData)
            .then(async response => {

                // Création du log
                try {
                    await logAction({
                        actionType: accidentData ? 'modification' : 'creation',
                        details: `${accidentData ? 'Modification' : 'Création'} d'un accident du travail - Entreprise: ${data.entrepriseName} - Secteur: ${data.secteur} - Travailleur: ${data.nomTravailleur} ${data.prenomTravailleur} - Date: ${new Date(data.DateHeureAccident).toLocaleDateString()}`,
                        entity: 'Accident',
                        entityId: accidentData?._id || response.data._id,
                        entreprise: data.entrepriseName
                    });
                } catch (logError) {
                    console.error('Erreur lors de la création du log:', logError);
                }

                showSnackbar(`Accident ${accidentData ? 'édité' : 'créé'} avec succès`, 'success');
                setTimeout(() => navigate('/'), 500);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
                showSnackbar(`Erreur lors de la ${accidentData ? 'modification' : 'création'} de l'accident`, 'error');
            });
    }, [accidentData, apiUrl, navigate, showSnackbar, logAction]);

    const handleStepChange = useCallback((direction) => {
        setActiveStep(prevStep => prevStep + direction);
    }, []);

    const renderNavigationButtons = useCallback((position) => {
        const { darkMode } = useTheme();

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1.5rem',

            }}>
                {activeStep > 0 && (
                    <Tooltip title="Cliquez ici pour revenir au formulaire précédent" arrow>
                        <Button
                            onClick={() => handleStepChange(-1)}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.1s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                padding: '10px 20px',
                                marginRight: '1rem',
                                '& .MuiSvgIcon-root': {
                                    color: darkMode ? '#fff' : 'inherit'
                                }
                            }}
                            startIcon={<ArrowBackIcon />}
                        >
                            Précédent
                        </Button>
                    </Tooltip>
                )}
                {activeStep < forms.length - 1 && (
                    <Tooltip title="Cliquez ici pour passer au formulaire suivant" arrow>
                        <Button
                            onClick={() => handleStepChange(1)}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.1s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                padding: '10px 20px',
                                marginRight: '1rem',
                                '& .MuiSvgIcon-root': {
                                    color: darkMode ? '#fff' : 'inherit'
                                }
                            }}
                            startIcon={<ArrowForwardIcon />}
                        >
                            Suivant
                        </Button>
                    </Tooltip>
                )}
            </div>
        );
    }, [activeStep, handleStepChange]);

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)} style={{ margin: '0 20px' }}>
            {renderNavigationButtons('top')}
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
                {React.createElement(forms[activeStep].component, { setValue, accidentData, watch })}
            </Paper>
            {renderNavigationButtons('bottom')}

            <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Pour savoir s'il s'agit d'un accident grave, rendez-vous sur le site Fedris via le lien ci-dessous</h3>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Cliquez ici pour accéder au site FEDRIS afin de voir si votre accident est grave" arrow>
                    <Button
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: darkMode ? '#ffffff' : 'black',
                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                            transition: 'all 0.1s ease-in-out',
                            '&:hover': {
                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                transform: 'scale(1.08)',
                                boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                            },
                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            fontSize: '300%',
                            '& .MuiSvgIcon-root': {
                                color: darkMode ? '#fff' : 'inherit'
                            }
                        }}
                        href="https://www.socialsecurity.be/app001/drselearning/aoat/aoat000/jsp/index_fatdecision.jsp"
                    >
                        Fedris
                    </Button>
                </Tooltip>
            </div>

            <h4>Vous devez OBLIGATOIREMENT remplir les champs de cette couleur pour pouvoir enregistrer.</h4>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Cliquez ici pour enregistrer les données (certains champs doivent être obligatoirement remplis)" arrow>
                    <Button
                        type="submit"
                        sx={{
                            color: darkMode ? '#ffffff' : 'black',
                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                            transition: 'all 0.1s ease-in-out',
                            '&:hover': {
                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                transform: 'scale(1.08)',
                                boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                            },
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            fontSize: '2rem',

                            '@media (min-width: 750px)': {
                                fontSize: '3rem',
                            },
                            '@media (max-width: 550px)': {
                                fontSize: '1.5rem',
                            },
                        }}
                        variant="contained"
                    >
                        Enregistrer les données
                    </Button>
                </Tooltip>
            </div>

            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />

            <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Une fois les données enregistrées, vous pouvez les retrouver et les ré-éditer dans la base de données.</h3>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyez un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquez le problème rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '300%',
                            height: '100%',
                            background: darkMode
                                ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                                : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                            animation: 'shine 3s infinite linear',
                            '@keyframes shine': {
                                to: {
                                    transform: 'translateX(50%)'
                                }
                            }
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '50px',
                            background: darkMode
                                ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                                : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                            backdropFilter: 'blur(5px)',
                            border: darkMode
                                ? '1px solid rgba(122,142,28,0.2)'
                                : '1px solid rgba(238,117,45,0.2)',
                            color: darkMode ? '#ffffff' : '#2D3748',
                            boxShadow: darkMode
                                ? '0 4px 6px rgba(0,0,0,0.1)'
                                : '0 4px 6px rgba(238,117,45,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            position: 'relative',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: darkMode
                                    ? '0 6px 12px rgba(0,0,0,0.2)'
                                    : '0 6px 12px rgba(238,117,45,0.2)',
                                '& .highlight': {
                                    color: darkMode ? '#7a8e1c' : '#ee752d'
                                }
                            }
                        }}
                    >
                        <span>Développé par </span>
                        <span className="highlight" style={{
                            transition: 'color 0.3s ease',
                            fontWeight: 700
                        }}>
                            Remy
                        </span>
                        <span> & </span>
                        <span className="highlight" style={{
                            transition: 'color 0.3s ease',
                            fontWeight: 700
                        }}>
                            Benoit
                        </span>
                        <span> pour </span>
                        <span style={{
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 700
                        }}>
                            Le Cortigroupe
                        </span>
                        <span style={{
                            fontSize: '1.2em',
                            marginLeft: '4px',
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            ®
                        </span>
                    </Typography>
                </Box></h5>
            </Tooltip>
        </form>
    );
}