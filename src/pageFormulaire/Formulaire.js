import axios from 'axios';
/* IMPORT REACT */
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
/* IMPORT MUI */
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
/* IMPORT PERSO */
import './formulaire.css';
import FormulaireEntreprise from './formulaireEntreprise';
import FormulaireAssureur from './formulaireAssureur';
import FormulaireAccident from './formulaireAccident';
import FormulaireSalarie from './formulaireSalarie';
import FormulaireDeclarationASSBelfius from './formulaireDeclarationAssBelfius';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';

const forms = [
    { id: 0, component: FormulaireEntreprise },
    { id: 1, component: FormulaireAssureur },
    { id: 2, component: FormulaireSalarie },
    { id: 3, component: FormulaireAccident },
    { id: 4, component: FormulaireDeclarationASSBelfius },
];

export default function Formulaire() {
    const accidentData = useLocation().state;
    const apiUrl = config.apiUrl;
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const {
        setValue,
        control,
        handleSubmit,
        watch
    } = useForm();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    //au chargement de la page on retourn vers le haut de la page
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeStep])



    /**************************************************************************
     * Gestion du téléchargement de fichiers
        **************************************************************************/
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }, []);

    const handleFileUpload = (file) => {
        console.log("Fichier téléchargé :", file.name);
    };
    /**************************************************************************/


    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = (data) => {
        if (accidentData) {

            console.log("Formulaire.js -> onSubmit -> Données à editer accidentData :", accidentData);

            //mode EDITION
            axios.put("http://" + apiUrl + ":3100/api/accidents/" + accidentData._id, data)
                .then(response => {
                    console.log('Réponse du serveur en modification :', response.data);


                })
                .catch(error => {
                    console.error('Erreur de requête:', error.message);
                    showSnackbar('Erreur lors de la création de l\'accident', 'error');

                });
        } else {
            console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);


            //mode CREATION
            axios.put("http://" + apiUrl + ":3100/api/accidents", data)
                .then(response => {
                    console.log('Réponse du serveur en création :', response.data);
                })
                .catch(error => {
                    console.error('Erreur de requête:', error.message);
                    showSnackbar('Erreur lors de la création de l\'accident', 'error');
                });
        }
        showSnackbar('Accident en cours de création', 'success');
        setTimeout(() => showSnackbar('Accident créée avec succès', 'success'), 1000);
        setTimeout(() => navigate('/'), 2000);
        // Naviguer vers la page d'accueil
        //navigate('/');
    };

    //enregistrement des donnée quand suivent ou précédent
    const onSubmit1 = (data) => {

        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);
        console.log("Formulaire.js -> onSubmit -> Données à editer accidentData :", accidentData);

        if (accidentData) {

            //mode EDITION
            axios.put("http://" + apiUrl + ":3100/api/accidents/" + accidentData._id, data)
                .then(response => {
                    console.log('Réponse du serveur en modification :', response.data);
                })
                .catch(error => {
                    console.error('Erreur de requête:', error.message);
                });
        } else {
            //mode CREATION
            axios.put("http://" + apiUrl + ":3100/api/accidents", data)
                .then(response => {
                    console.log('Réponse du serveur en création :', response.data);
                })
                .catch(error => {
                    console.error('Erreur de requête:', error.message);
                });
        }

    };


    /**************************************************************************
     * affichage du formulaire
     * ************************************************************************/
    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>

            {/* Boutons de navigation pour passer à l'étape suivante ou revenir à l'étape précédente */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                {activeStep > 0 && (
                    <Button
                        onClick={() => {
                            //handleSubmit(onSubmit1)();
                            setActiveStep(prevStep => prevStep - 1);
                        }}
                        sx={{
                            backgroundColor: '#ee752d60',
                            '&:hover': { backgroundColor: '#95ad22' },
                            padding: '10px 20px',
                            marginRight: '1rem',
                        }}
                        startIcon={<ArrowBackIcon />}
                    >
                        Précédent
                    </Button>
                )}
                {activeStep < forms.length - 1 && (
                    <Button
                        onClick={() => {
                            //handleSubmit(onSubmit1)();
                            setActiveStep((prevStep) => prevStep + 1)
                        }}
                        sx={{
                            backgroundColor: '#ee752d60',
                            '&:hover': { backgroundColor: '#95ad22' },
                            padding: '10px 20px',
                        }}
                        startIcon={<ArrowForwardIcon />}
                    >
                        Suivant
                    </Button>
                )}
            </div>
            {React.createElement(forms[activeStep].component, { setValue, accidentData, watch })}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                {activeStep > 0 && (
                    <Button
                        onClick={() => {
                            //handleSubmit(onSubmit1)();
                            setActiveStep(prevStep => prevStep - 1);
                        }}
                        sx={{
                            backgroundColor: '#ee752d60',
                            '&:hover': { backgroundColor: '#95ad22' },
                            padding: '10px 20px',
                            marginRight: '1rem',
                        }}
                        startIcon={<ArrowBackIcon />}
                    >
                        Précédent
                    </Button>
                )}
                {activeStep < forms.length - 1 && (
                    <Button
                        onClick={() => {
                            //handleSubmit(onSubmit1)();
                            setActiveStep((prevStep) => prevStep + 1)
                        }}
                        sx={{
                            backgroundColor: '#ee752d60',
                            '&:hover': { backgroundColor: '#95ad22' },
                            padding: '10px 20px',
                        }}
                        startIcon={<ArrowForwardIcon />}
                    >
                        Suivant
                    </Button>
                )}
            </div>

            {/************* Lien vers les sites**************************/}
            <h3>Pour savoir s'il s'agit d'un accident grave, rendez-vous sur le site Fedris via le lien ci-dessous</h3>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button target="_blank" rel="noopener noreferrer" sx={{ color: 'black', backgroundColor: '#ee752d60', '&:hover': { backgroundColor: '#95ad22' }, padding: '10px 20px', width: '50%', marginTop: '1cm', height: '300%', fontSize: '300%' }} href="https://www.socialsecurity.be/app001/drselearning/aoat/aoat000/jsp/index_fatdecision.jsp">Fedris</Button>
            </div>

            <h4>Vous n'êtes pas obligé de remplir toutes les données pour les enregistrer.</h4>

            {/************* Bouton enregistrer **************************/}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    sx={{
                        backgroundColor: '#ee752d60',
                        '&:hover': { backgroundColor: '#95ad22' },
                        padding: '10px 20px',
                        width: '50%',
                        marginTop: '1cm',
                        height: '300%',
                        fontSize: '2rem', // Taille de police de base

                        // Utilisation de Media Queries pour ajuster la taille de police
                        '@media (min-width: 750px)': {
                            fontSize: '3rem', // Taille de police plus grande pour les écrans plus larges
                        },
                        '@media (max-width: 550px)': {
                            fontSize: '1.5rem', // Taille de police plus petite pour les écrans plus étroits
                        },
                    }}
                    variant="contained"
                >
                    Enregistrer les données
                </Button>
            </div>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
            <h3>Une fois les données enregistrées, vous pouvez les retrouver et les re-éditer dans la base de données.</h3>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
        </form>
    );
}
