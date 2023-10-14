import './formulaire.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormulaireEntreprise from './formulaireEntreprise';
import { useNavigate } from 'react-router-dom';
const forms = [
    { id: 0, component: FormulaireEntreprise }
];

export default function Formulaire(data) {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const {
        register,
        setValue,
        control,
        handleSubmit,
        watch
    } = useForm();

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
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeStep])

    const onSubmit = (data) => {

        console.log("Données à enregistrer :");
        console.log(data);

        // Enregistrer les données dans la base de données
        axios.put('http://localhost:3100/api/accidents', data)
            .then(response => {
                console.log('Réponse du serveur:', response.data);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
            });

        // Naviguer vers la page d'accueil
        navigate('/');
    };

    /**************************************************************************
     * affichage du formulaire
     * ************************************************************************/
    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            {React.createElement(forms[activeStep].component, {setValue})}
            {/* Boutons de navigation pour passer à l'étape suivante ou revenir à l'étape précédente */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {activeStep > 0 && (
                    <Button
                        onClick={setActiveStep((prevStep) => prevStep - 1)}
                        sx={{
                            backgroundColor: '#84a784',
                            '&:hover': { backgroundColor: 'green' },
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
                        onClick={setActiveStep((prevStep) => prevStep + 1)}
                        sx={{
                            backgroundColor: '#84a784',
                            '&:hover': { backgroundColor: 'green' },
                            padding: '10px 20px',
                        }}
                        startIcon={<ArrowForwardIcon />}
                    >
                        Suivant
                    </Button>
                )}

            </div>
            
            {/************* Telechargement de fichier **************************/}
            <h3>Vous pouvez ajouter des pièces à joindre au dossier (courriers, e-mails, etc..).</h3>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    border: '2px dashed #84a784',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    margin: '20px 1rem',
                    backgroundColor: '#d2e2d2',

                }}
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >

                <span style={{ textAlign: 'center', width: '45%', color: 'black' }}>
                    Glisser-déposer un fichier ici ou
                </span>
                <input
                    type="file"
                    id="fileInput"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    style={{ display: 'none' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label
                    htmlFor="fileInput"
                    style={{
                        textAlign: 'center',
                        width: '45%',
                        backgroundColor: '#84a784',
                        color: 'black',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#84a784')}
                >
                    Télécharger un document
                </label>
            </div>

            {/************* Lien vers les sites**************************/}
            <h3>Pour savoir s'il s'agit d'un accident grave, rendez-vous sur le site Fedris via le lien ci-dessous</h3>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button target="_blank" rel="noopener noreferrer" type="submit" sx={{ color: 'black', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, padding: '10px 20px', width: '50%', marginTop: '1cm', height: '300%', fontSize: '300%' }} href="https://www.socialsecurity.be/app001/drselearning/aoat/aoat000/jsp/index_fatdecision.jsp">Fedris</Button>
            </div>

            <h4>Vous n'êtes pas obligé de remplir toutes les données pour les enregistrer.</h4>

            {/************* Bouton enregistrer **************************/}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    sx={{
                        backgroundColor: '#84a784',
                        '&:hover': { backgroundColor: 'green' },
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
            <h3>Une fois les données enregistrées, vous pouvez les retrouver et les re-éditer dans la base de données.</h3>
        </form>
    );
}
