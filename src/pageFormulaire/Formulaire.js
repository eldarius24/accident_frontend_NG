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
import { Tooltip, Button } from '@mui/material';
import { useLogger } from '../Hook/useLogger';

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
    
        axios[method](url, formattedData)  // Utiliser formattedData au lieu de data
            .then(async response => {
                console.log(`Réponse du serveur en ${accidentData ? 'modification' : 'création'} :`, response.data);

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

                showSnackbar(`Accident en cours de ${accidentData ? 'édition' : 'création'}`, 'success');
                setTimeout(() => showSnackbar(`Accident ${accidentData ? 'édité' : 'créé'} avec succès`, 'success'), 1000);
                setTimeout(() => navigate('/'), 2000);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
                showSnackbar(`Erreur lors de la ${accidentData ? 'modification' : 'création'} de l'accident`, 'error');
            });
    }, [accidentData, apiUrl, navigate, showSnackbar, logAction]);

    const handleStepChange = useCallback((direction) => {
        setActiveStep(prevStep => prevStep + direction);
    }, []);

    const renderNavigationButtons = useCallback((position) => (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            {activeStep > 0 && (
                <Tooltip title="Cliquez ici pour revenir au formulaire précédent" arrow>
                    <Button
                        onClick={() => handleStepChange(-1)}
                        sx={{
                            backgroundColor: '#ee752d60',
                            transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 },
                            padding: '10px 20px',
                            marginRight: '1rem',
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
                            backgroundColor: '#ee752d60',
                            transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 },
                            padding: '10px 20px',
                        }}
                        startIcon={<ArrowForwardIcon />}
                    >
                        Suivant
                    </Button>
                </Tooltip>
            )}
        </div>
    ), [activeStep, handleStepChange]);

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)} style={{ margin: '0 20px' }}>
            {renderNavigationButtons('top')}
            {React.createElement(forms[activeStep].component, { setValue, accidentData, watch })}
            {renderNavigationButtons('bottom')}

            <h3>Pour savoir s'il s'agit d'un accident grave, rendez-vous sur le site Fedris via le lien ci-dessous</h3>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Cliquez ici pour accéder au site FEDRIS afin de voir si votre accident est grave" arrow>
                    <Button
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'black',
                            backgroundColor: '#ee752d60',
                            transition: 'all 0.3s ease-in-out', '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 },
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            fontSize: '300%'
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
                            backgroundColor: '#ee752d60',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 },
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
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

            <h3>Une fois les données enregistrées, vous pouvez les retrouver et les ré-éditer dans la base de données.</h3>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyez un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquez le problème rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </form>
    );
}