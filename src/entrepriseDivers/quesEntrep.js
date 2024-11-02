import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Tooltip, Typography, Box } from '@mui/material';
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

    const [questionnaireData, setQuestionnaireData] = useState({
        quesEntreAnnee: editMode ? questionnaire.annees : [],
        quesEntreType: editMode ? questionnaire.typeFichier : '',
        quesEntreCommentaire: editMode ? questionnaire.commentaire : ''
    });

    const [uploadedFiles, setUploadedFiles] = useState(
        editMode ? questionnaire.files : []
    );

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

    const promptForFileName = (file) => {
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
    };

    const handleFileUpload = async (file, name) => {
        const formData = new FormData();
        formData.append('file', file, name);

        try {
            const uploadResponse = await axios.post(
                `http://${apiUrl}:3100/api/stockFile`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setUploadedFiles(prev => [...prev, {
                fileId: uploadResponse.data.fileId,
                fileName: name
            }]);

            showSnackbar('Fichier téléchargé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            showSnackbar('Erreur lors du téléchargement du fichier', 'error');
        }
    };


    const handleFileDelete = async (fileId, fileName) => {
        try {
            // Suppression du fichier
            await axios.delete(`http://${apiUrl}:3100/api/file/${fileId}`);
            
            // Mise à jour de la liste des fichiers locale
            setUploadedFiles(prevFiles => prevFiles.filter(file => file.fileId !== fileId));
    
            // Logger l'action
            await logAction({
                actionType: 'suppression',
                details: `Suppression du fichier - Nom: ${fileName} - Entreprise: ${enterprise?.AddEntreName}`,
                entity: 'Divers Entreprise',
                entityId: fileId,
                entreprise: enterprise?.AddEntreName
            });
    
            // Mise à jour du questionnaire dans la base de données
            if (editMode && questionnaire?._id) {
                await axios.put(`http://${apiUrl}:3100/api/questionnaires/${questionnaire._id}`, {
                    ...questionnaire,
                    files: uploadedFiles.filter(file => file.fileId !== fileId)
                });
            }
    
            showSnackbar('Fichier supprimé avec succès', 'success');
            
            // Rediriger vers la page entreprise après un court délai
            setTimeout(() => {
                navigate('/entreprise');
            }, 1500);
            
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            showSnackbar('Erreur lors de la suppression du fichier', 'error');
        }
    };
    

    const handleDrop = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) promptForFileName(file);
    }, []);

    const handleFileInputChange = e => {
        const file = e.target.files[0];
        if (file) promptForFileName(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const dataToSubmit = {
                entrepriseId: enterprise?._id,
                entrepriseName: enterprise?.AddEntreName,
                annees: questionnaireData.quesEntreAnnee,
                typeFichier: questionnaireData.quesEntreType,
                commentaire: questionnaireData.quesEntreCommentaire,
                files: uploadedFiles
            };

            let response;

            if (editMode && questionnaire?._id) {
                // Modification
                response = await axios.put(
                    `http://${apiUrl}:3100/api/questionnaires/${questionnaire._id}`,
                    dataToSubmit
                );

                console.log('Mise à jour questionnaire:', response.data);
                await logAction({
                    actionType: 'modification',
                    details: `Modification du questionnaire - Entreprise: ${enterprise?.AddEntreName} - Type: ${dataToSubmit.typeFichier} - Années: ${dataToSubmit.annees.join(', ')}`,
                    entity: 'Divers Entreprise',
                    entityId: questionnaire._id,
                    entreprise: enterprise?.AddEntreName
                });

                showSnackbar('Questionnaire modifié avec succès', 'success');
            } else {
                // Création
                response = await axios.post(
                    `http://${apiUrl}:3100/api/questionnaires`,
                    dataToSubmit
                );

                await logAction({
                    actionType: 'creation',
                    details: `Création d'un questionnaire - Entreprise: ${enterprise?.AddEntreName} - Type: ${dataToSubmit.typeFichier} - Années: ${dataToSubmit.annees.join(', ')}`,
                    entity: 'Divers Entreprise',
                    entityId: response.data._id,
                    entreprise: enterprise?.AddEntreName
                });

                showSnackbar('Questionnaire créé avec succès', 'success');
            }

            // Attendre un peu avant de rediriger
            setTimeout(() => {
                navigate('/entreprise');
            }, 2000);

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

                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
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
                        {uploadedFiles.map((file) => (
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