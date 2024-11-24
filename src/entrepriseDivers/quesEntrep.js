import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Tooltip, Typography, Box, Paper } from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import AutoCompleteP from '../_composants/autoCompleteP';
import MultipleAutoCompleteCMQ from '../_composants/autoCompleteCMQ';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useLogger } from '../Hook/useLogger';
import '../pageFormulaire/formulaire.css';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import listeQuesEntr from '../liste/listeQuesEntre.json';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const dropZoneStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    border: '2px dashed #00b1b2',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '20px 1rem',
    backgroundColor: '#00b2b246',
};

const labelStyle = {
    textAlign: 'center',
    width: '45%',
    backgroundColor: '#00b1b2',
    color: 'black',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

const QuesEntrep = () => {
    const { logAction } = useLogger();
    const location = useLocation();
    const navigate = useNavigate();
    const { enterprise, editMode, questionnaire } = location.state || {};
    const apiUrl = config.apiUrl;
    const { darkMode } = useTheme();
    const currentYear = new Date().getFullYear();
    const yearsRange = Array.from(
        { length: 21 },
        (_, i) => (currentYear - 10 + i).toString()
    );
    const TfFormula = () => {
        const { darkMode } = useTheme(); // Accéder au thème dans le composant

        return (
            <Box
                style={{ color: darkMode ? '#ffffff' : 'inherit' }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                    '& .formula': {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mx: 2,
                        fontSize: '1.2rem',
                    },
                    '& .divider': {
                        width: '100%',
                        borderTop: '2px solid',
                        my: '4px'
                    }
                }}
            >
                <Typography component="div" sx={{ fontSize: '1.2rem', mr: 2, color: darkMode ? '#ffffff' : 'inherit' }}>
                    Tf =
                </Typography>
                <div className="formula">
                    <div>B × 1.000.000</div>
                    <div className="divider" />
                    <div>A</div>
                </div>
            </Box>
        );
    };

    // État unifié pour le formulaire
    const [formState, setFormState] = useState({
        questionnaireData: {
            quesEntreAnnee: editMode ? questionnaire?.annees || [] : [],
            quesEntreType: editMode ? questionnaire?.typeFichier || '' : '',
            quesEntreCommentaire: editMode ? questionnaire?.commentaire || '' : '',
            valueATf: editMode ? questionnaire?.valueATf || '' : '',
            valueBTf: editMode ? questionnaire?.valueBTf || '' : '',
            resultTf: editMode ? questionnaire?.resultTf || '' : ''
        },
        uploadedFiles: editMode ? questionnaire?.files || [] : [],
        tfCalculation: {
            valueATf: editMode ? questionnaire?.valueATf || '' : '',
            valueBTf: editMode ? questionnaire?.valueBTf || '' : '',
            resultTf: editMode ? questionnaire?.resultTf || '' : ''
        },
        snackbar: {
            open: false,
            message: '',
            severity: 'info'
        }
    });

    // Determine whether the Tf calculator should be shown based on the questionnaire type
    const showTfCalculator = formState.questionnaireData.quesEntreType === "Rapport Annuelle SIPPT";

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setFormState(prev => ({
            ...prev,
            snackbar: { ...prev.snackbar, open: false }
        }));
    };

    const showSnackbar = useCallback((message, severity = 'info') => {
        setFormState(prev => ({
            ...prev,
            snackbar: { open: true, message, severity }
        }));
    }, []);

    const calculateTf = useCallback((a, b) => {
        if (!a || !b || isNaN(a) || isNaN(b) || Number(a) === 0) {
            return '';
        }
        return ((Number(b) * 1000000) / Number(a)).toFixed(2);
    }, []);

    const handleTfValueChange = useCallback((field) => (value) => {
        const numValue = Number(value);

        setFormState(prev => {
            const newTfCalculation = {
                ...prev.tfCalculation,
                [field]: value
            };

            if (field === 'valueATf' || field === 'valueBTf') {
                const otherField = field === 'valueATf' ? 'valueBTf' : 'valueATf';
                const resultTf = calculateTf(
                    field === 'valueATf' ? numValue : Number(prev.tfCalculation[otherField]),
                    field === 'valueBTf' ? numValue : Number(prev.tfCalculation[otherField])
                );
                newTfCalculation.resultTf = resultTf;
            }

            return {
                ...prev,
                tfCalculation: newTfCalculation,
                questionnaireData: {
                    ...prev.questionnaireData,
                    [field]: value,
                    resultTf: newTfCalculation.resultTf
                }
            };
        });
    }, [calculateTf]);

    const handleFieldChange = useCallback((field) => (value) => {
        setFormState(prev => ({
            ...prev,
            questionnaireData: {
                ...prev.questionnaireData,
                [field]: value
            }
        }));
    }, []);

    const handleFileUpload = useCallback(async (file, name) => {
        if (!file || !name) {
            showSnackbar('Fichier ou nom manquant', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file, name);

        try {
            const response = await axios.post(
                `http://${apiUrl}:3100/api/stockFile`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (!response.data?.fileId) {
                throw new Error('ID du fichier manquant dans la réponse');
            }

            setFormState(prev => ({
                ...prev,
                uploadedFiles: [
                    ...prev.uploadedFiles,
                    {
                        fileId: response.data.fileId,
                        fileName: name
                    }
                ]
            }));

            showSnackbar('Fichier téléchargé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            showSnackbar('Erreur lors du téléchargement du fichier', 'error');
        }
    }, [apiUrl, showSnackbar]);

    const handleFileDelete = async (fileId, fileName) => {
        try {
            await axios.delete(`http://${apiUrl}:3100/api/file/${fileId}`);

            setFormState(prev => ({
                ...prev,
                uploadedFiles: prev.uploadedFiles.filter(file => file.fileId !== fileId)
            }));

            await logAction({
                actionType: 'suppression',
                details: `Suppression du fichier - Nom: ${fileName} - Entreprise: ${enterprise?.AddEntreName}`,
                entity: 'Divers Entreprise',
                entityId: fileId,
                entreprise: enterprise?.AddEntreName
            });

            if (editMode && questionnaire?._id) {
                await axios.put(`http://${apiUrl}:3100/api/questionnaires/${questionnaire._id}`, {
                    ...questionnaire,
                    files: formState.uploadedFiles.filter(file => file.fileId !== fileId)
                });
            }

            showSnackbar('Fichier supprimé avec succès', 'success');

            setTimeout(() => {
                navigate('/entreprise');
            }, 1500);

        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            showSnackbar('Erreur lors de la suppression du fichier', 'error');
        }
    };

    const promptForFileName = useCallback((file) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                let fileName = file.name;

                return (
                    <div className="custom-confirm-dialog" style={{ textAlign: 'center' }}>
                        <h1 className="custom-confirm-title">Renommer le fichier</h1>
                        <p className="custom-confirm-message">Si vous le désirez, entrez un nouveau nom pour le fichier:</p>
                        <input
                            type="text"
                            defaultValue={fileName}
                            onChange={(e) => { fileName = e.target.value; }}
                            className="custom-confirm-input"
                            style={{
                                border: '2px solid #0098f9',
                                padding: '10px',
                                borderRadius: '5px',
                                fontSize: '16px',
                                width: '60%',
                                backgroundColor: '#f0f8ff',
                                color: 'black',
                            }}
                        />
                        <div className="custom-confirm-buttons">
                            <Tooltip title="Cliquez sur ENVOYER après avoir changé le nom si besoin" arrow>
                                <button
                                    className="custom-confirm-button"
                                    onClick={async () => {
                                        await handleFileUpload(file, fileName);
                                        onClose();
                                    }}
                                >
                                    Envoyer
                                </button>
                            </Tooltip>
                            <Tooltip title="Cliquez sur ANNULER pour annuler l'envoi du fichier" arrow>
                                <button
                                    className="custom-confirm-button custom-confirm-no"
                                    onClick={onClose}
                                >
                                    Annuler
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                );
            }
        });
    }, [handleFileUpload]);

    const handleDrop = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) promptForFileName(file);
    }, [promptForFileName]);

    const handleFileInputChange = useCallback(e => {
        const file = e.target.files[0];
        if (file) promptForFileName(file);
    }, [promptForFileName]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { questionnaireData, uploadedFiles } = formState;

        // Validation
        if (!questionnaireData.quesEntreType || !questionnaireData.quesEntreAnnee.length) {
            showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        try {
            const dataToSubmit = {
                entrepriseId: enterprise?._id,
                entrepriseName: enterprise?.AddEntreName,
                annees: questionnaireData.quesEntreAnnee,
                typeFichier: questionnaireData.quesEntreType,
                commentaire: questionnaireData.quesEntreCommentaire,
                valueATf: questionnaireData.valueATf,
                valueBTf: questionnaireData.valueBTf,
                resultTf: questionnaireData.resultTf,
                files: uploadedFiles
            };

            const response = editMode && questionnaire?._id
                ? await axios.put(`http://${apiUrl}:3100/api/questionnaires/${questionnaire._id}`, dataToSubmit)
                : await axios.post(`http://${apiUrl}:3100/api/questionnaires`, dataToSubmit);

            await logAction({
                actionType: editMode ? 'modification' : 'creation',
                details: `${editMode ? 'Modification' : 'Création'} du questionnaire - Entreprise: ${enterprise?.AddEntreName}`,
                entity: 'Divers Entreprise',
                entityId: editMode ? questionnaire._id : response.data._id,
                entreprise: enterprise?.AddEntreName
            });

            showSnackbar(`Questionnaire ${editMode ? 'modifié' : 'créé'} avec succès`, 'success');

            setTimeout(() => navigate('/entreprise'), 500);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            showSnackbar(
                error.response?.data?.message ||
                `Erreur lors de la ${editMode ? 'modification' : 'création'} du questionnaire`,
                'error'
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '0 20px' }} className="background-image">
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
                <Typography variant="h4" component="h1" align="center" gutterBottom style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                    Questionnaire {enterprise?.AddEntreName}
                </Typography>
                <AutoCompleteP
                    id="quesEntreType"
                    label="Type de fichier"
                    option={listeQuesEntr.typeFicher}
                    onChange={handleFieldChange('quesEntreType')}
                    defaultValue={formState.questionnaireData.quesEntreType}
                />
                <MultipleAutoCompleteCMQ
                    id="quesEntreAnnee"
                    label="Réaliser en Années"
                    option={yearsRange}
                    onChange={handleFieldChange('quesEntreAnnee')}
                    defaultValue={formState.questionnaireData.quesEntreAnnee}
                />
                <TextFieldP
                    id="quesEntreCommentaire"
                    label="Commentaires additionnels"
                    onChange={handleFieldChange('quesEntreCommentaire')}
                    value={formState.questionnaireData.quesEntreCommentaire}
                    multiline
                />
                {showTfCalculator && (
                    <Paper elevation={3} sx={{ backgroundColor: darkMode ? '#6e6e6e' : '#ffffff', p: 3, mt: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom align="center" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                            Calcul du Tf (Taux de fréquence)
                        </Typography>

                        <TfFormula />

                        <Box sx={{ mt: 3 }}>
                            <TextFieldP
                                id="valueATf"
                                label="Valeur A (Nombre d'heures prestées)"
                                type="number"
                                value={formState.tfCalculation.valueATf}
                                onChange={handleTfValueChange('valueATf')}
                                inputProps={{ min: 0 }}
                                helperText="Entrez le nombre total d'heures prestées"
                            />
                            <TextFieldP
                                id="valueBTf"
                                label="Valeur B (Nombre d'accidents)"
                                type="number"
                                value={formState.tfCalculation.valueBTf}
                                onChange={handleTfValueChange('valueBTf')}
                                inputProps={{ min: 0 }}
                                helperText="Entrez le nombre d'accidents"
                            />
                            <TextFieldP
                                id="resultTf"
                                label="Résultat Tf"
                                value={formState.tfCalculation.resultTf}
                                disabled
                                InputProps={{
                                    readOnly: true,
                                    style: {
                                        fontWeight: 'bold',
                                        color: darkMode ? '#ffffff' : 'inherit', 
                                       
                                    }
                                }}                                                                
                            />
                        </Box>
                    </Paper>
                )}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                        Fichiers joints
                    </Typography>

                    <Tooltip title="Faites glisser un fichier ici pour l'ajouter au questionnaire" arrow>
                        <div
                            style={dropZoneStyle}
                            onDrop={handleDrop}
                            onDragOver={e => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <span style={{ textAlign: 'center', width: '45%', color: 'black' }}>
                                Pour ajouter un fichier, Glisser-déposer le ici
                            </span>
                        </div>
                    </Tooltip>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Cliquez ici pour importer des fichiers" arrow>
                            <label
                                htmlFor="file-upload"
                                style={labelStyle}
                                onMouseEnter={e => (e.target.style.backgroundColor = '#95ad22')}
                                onMouseLeave={e => (e.target.style.backgroundColor = '#00b1b2')}
                            >
                                Ajouter un fichier au questionnaire
                            </label>
                        </Tooltip>
                    </div>

                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                    />

                    <Box sx={{ mt: 2 }}>
                        {formState.uploadedFiles.map((file) => (
                            <Box
                                key={file.fileId}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    mb: 1,
                                    p: 1,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.08)'
                                    }
                                }}
                            >
                                <Typography variant="body2">
                                    {file.fileName}
                                </Typography>
                                <Tooltip title="Supprimer le fichier" arrow>
                                    <Button
                                        onClick={() => {
                                            confirmAlert({
                                                customUI: ({ onClose }) => (
                                                    <div className="custom-confirm-dialog">
                                                        <h1 className="custom-confirm-title">Supprimer le fichier</h1>
                                                        <p className="custom-confirm-message">
                                                            Êtes-vous sûr de vouloir supprimer ce fichier ?
                                                        </p>
                                                        <div className="custom-confirm-buttons">
                                                            <Tooltip title="Confirmer la suppression" arrow>
                                                                <button
                                                                    className="custom-confirm-button"
                                                                    onClick={() => {
                                                                        handleFileDelete(file.fileId, file.fileName);
                                                                        onClose();
                                                                    }}
                                                                >
                                                                    Oui
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip title="Annuler la suppression" arrow>
                                                                <button
                                                                    className="custom-confirm-button custom-confirm-no"
                                                                    onClick={onClose}
                                                                >
                                                                    Non
                                                                </button>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                )
                                            });
                                        }}
                                        sx={{
                                            minWidth: '40px',
                                            ml: 2,
                                            color: 'error.main',
                                            '&:hover': {
                                                bgcolor: 'error.light',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        <DeleteForeverIcon />
                                    </Button>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Tooltip title="Cliquer pour enregistrer le questionnaire" arrow>
                        <Button
                            type="submit"
                            variant="contained"
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
                                fontSize: {
                                    xs: '1.5rem',
                                    md: '2rem',
                                    lg: '3rem'
                                },
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                '& .MuiSvgIcon-root': {
                                    color: darkMode ? '#fff' : 'inherit'
                                },
                            }}
                        >
                            Enregistrer le questionnaire
                        </Button>
                    </Tooltip>
                </div>
            </Paper>
            <CustomSnackbar
                open={formState.snackbar.open}
                handleClose={handleCloseSnackbar}
                message={formState.snackbar.message}
                severity={formState.snackbar.severity}
            />
            <div className="image-cortigroupe"></div>
            <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
                <h5 style={{ marginBottom: '40px' }}>
                    Développé par Remy et Benoit pour Le Cortigroupe.
                </h5>
            </Tooltip>
        </form>
    );
};

export default QuesEntrep;