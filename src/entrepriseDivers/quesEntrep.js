// QuesEntrep.js
import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Tooltip, Typography } from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import AutoCompleteP from '../_composants/autoCompleteP';
import MultipleAutoCompleteCMQ from '../_composants/autoCompleteCMQ';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useLogger } from '../Hook/useLogger';
import '../pageFormulaire/formulaire.css';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import listeQuesEntr from '../liste/listeQuesEntre.json';

const QuesEntrep = () => {
    const { logAction } = useLogger();
    const location = useLocation();
    const navigate = useNavigate();
    const { enterprise } = location.state || {};
    const apiUrl = config.apiUrl;
    const { darkMode } = useTheme();
    const currentYear = new Date().getFullYear();
    const yearsRange = Array.from(
        { length: 21 },
        (_, i) => (currentYear - 10 + i).toString()
    );

    const [questionnaireData, setQuestionnaireData] = useState({
        quesEntreAnnee: [],
        quesEntreType: '',
        quesEntreCommentaire: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleFieldChange = (field) => (value) => {
        setQuestionnaireData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (questionnaireData.quesEntreAnnee.length === 0) {
            showSnackbar('Veuillez sélectionner au moins une année', 'error');
            return;
        }
    
        if (!questionnaireData.quesEntreType) {
            showSnackbar('Veuillez sélectionner un type de fichier', 'error');
            return;
        }
    
        try {
            const dataToSubmit = {
                entrepriseId: enterprise?._id,
                entrepriseName: enterprise?.AddEntreName,
                annees: questionnaireData.quesEntreAnnee,
                typeFichier: questionnaireData.quesEntreType,
                commentaire: questionnaireData.quesEntreCommentaire
            };
    
            const response = await axios.post(`http://${apiUrl}:3100/api/questionnaires`, dataToSubmit);
    
            
                await logAction({
                    actionType: 'creation',
                    details: `Création d'un questionnaire - Entreprise: ${enterprise?.AddEntreName} - Années: ${questionnaireData.quesEntreAnnee.join(', ')} - Type: ${questionnaireData.quesEntreType}`,
                    entity: 'Divers Entreprise',
                    entityId: response.data._id,
                    entreprise: enterprise?.AddEntreName
                });
    
                showSnackbar('Questionnaire créé avec succès', 'success');
                setTimeout(() => navigate('/entreprise'), 2000);
            
        } catch (error) {
            console.error('Erreur lors de la création du questionnaire:', error);
            showSnackbar(error.response?.data?.message || 'Erreur lors de la création du questionnaire', 'error');
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="background-image">
            <div className="frameStyle-style" style={{
                backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Questionnaire {enterprise?.AddEntreName}
                </Typography>
                <AutoCompleteP
                    id="quesEntreType"
                    label="Type de fichier"
                    option={listeQuesEntr.typeFicher}
                    onChange={handleFieldChange('quesEntreType')}
                    defaultValue={questionnaireData.quesEntreType}
                />
                <MultipleAutoCompleteCMQ
                    id="quesEntreAnnee"
                    label="Réaliser en Années"
                    option={yearsRange}
                    onChange={handleFieldChange('quesEntreAnnee')}
                    defaultValue={questionnaireData.quesEntreAnnee}
                />
                <TextFieldP
                    id="quesEntreCommentaire"
                    label="Commentaires additionnels"
                    onChange={handleFieldChange('quesEntreCommentaire')}
                    value={questionnaireData.quesEntreCommentaire}
                    multiline
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Tooltip title="Cliquer pour enregistrer le questionnaire" arrow>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#ee742d59',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: 6
                                },
                                padding: '10px 20px',
                                width: '50%',
                                fontSize: {
                                    xs: '1.5rem',
                                    md: '2rem',
                                    lg: '3rem'
                                }
                            }}
                        >
                            Enregistrer le questionnaire
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> 
                    Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be
                </h5>
            </Tooltip>
        </form>
    );
};

export default QuesEntrep;