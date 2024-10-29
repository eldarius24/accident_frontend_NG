import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Tooltip, Typography } from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useLogger } from '../Hook/useLogger';
import '../pageFormulaire/formulaire.css';
import { useTheme } from '../pageAdmin/user/ThemeContext';
const QuesEntrep = () => {
    const { logAction } = useLogger();
    const location = useLocation();
    const navigate = useNavigate();
    const { enterprise } = location.state || {};
    const apiUrl = config.apiUrl;
    const { darkMode } = useTheme();
    // États pour tous les champs du questionnaire
    const [questionnaireData, setQuestionnaireData] = useState({
        quesEntreAnnee: '',
        quesEntreEffectif: '',
        quesEntreCa: '',
        quesEntreSecurite: '',
        quesEntreFormation: '',
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

    // Fonction générique pour mettre à jour les champs
    const handleFieldChange = (field) => (value) => {
        setQuestionnaireData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation de l'année
        const yearNumber = parseInt(questionnaireData.quesEntreAnnee);
        if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 2100) {
            showSnackbar('Veuillez entrer une année valide entre 1900 et 2100', 'error');
            return;
        }

        try {
            const dataToSubmit = {
                entrepriseId: enterprise?._id,
                entrepriseName: enterprise?.AddEntreName,
                annee: questionnaireData.quesEntreAnnee,
                reponses: {
                    effectif: questionnaireData.quesEntreEffectif,
                    chiffreAffaires: questionnaireData.quesEntreCa,
                    securite: questionnaireData.quesEntreSecurite,
                    formation: questionnaireData.quesEntreFormation,
                    commentaire: questionnaireData.quesEntreCommentaire
                }
            };

            const response = await axios.post(`http://${apiUrl}:3100/api/questionnaires`, dataToSubmit);

            if (response.status === 201 || response.status === 200) {
                await logAction({
                    actionType: 'création',
                    details: `Création d'un questionnaire - Entreprise: ${enterprise?.AddEntreName} - Année: ${questionnaireData.quesEntreAnnee}`,
                    entity: 'Questionnaire',
                    entityId: response.data._id,
                    entreprise: enterprise?.AddEntreName
                });

                showSnackbar('Questionnaire créé avec succès', 'success');
                setTimeout(() => {
                    navigate('/questionnaires');
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur lors de la création du questionnaire:', error);
            showSnackbar(
                error.response?.data?.message || 'Erreur lors de la création du questionnaire',
                'error'
            );
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

                <TextFieldP
                    id="quesEntreAnnee"
                    label="Année du questionnaire"
                    onChange={handleFieldChange('quesEntreAnnee')}
                    value={questionnaireData.quesEntreAnnee}
                    inputProps={{ maxLength: 4 }}
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
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </form>

    );
};

export default QuesEntrep;