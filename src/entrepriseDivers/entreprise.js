import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Card, CardContent, Typography, Grid, LinearProgress,
    Box, Divider, Button, Select, MenuItem, Modal,
    FormControl, Tooltip, InputLabel
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import config from '../config.json';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import { useNavigate } from 'react-router-dom';
import '../pageFormulaire/formulaire.css';
import { useLogger } from '../Hook/useLogger';
import FileViewer from '../pageFormulaire/FileManagement/fileViewer';
import CustomSnackbar from '../_composants/CustomSnackbar';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import GetAppIcon from '@mui/icons-material/GetApp';
import handleFileDownload from './fileUtils';
import showDeleteConfirm from '../pageFormulaire/FileManagement/showDeleteConfirm';
import EditIcon from '@mui/icons-material/Edit';
import { blueGrey } from '@mui/material/colors';



const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
};

const Enterprise = () => {
    const { logAction } = useLogger();
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [enterprises, setEnterprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, isConseiller, userInfo } = useUserConnected();
    const apiUrl = config.apiUrl;
    const [questionnaires, setQuestionnaires] = useState({});
    const [filteredEnterprises, setFilteredEnterprises] = useState([]);
    const [selectedEnterprises, setSelectedEnterprises] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const showMessage = (message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };


    const handleEdit = useCallback(async (questionnaireId, enterpriseId) => {
        try {
            // Récupérer le questionnaire complet via l'API
            const response = await axios.get(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`);
            const questionnaire = response.data;
            const entrepriseName = enterprises.find(e => e._id === enterpriseId)?.AddEntreName;

            if (questionnaire) {
                // Log de l'action d'édition
                await logAction({
                    actionType: 'modification',
                    details: `Début de modification du questionnaire - Type: ${questionnaire.typeFichier} - Entreprise: ${entrepriseName} - Années: ${questionnaire.annees.join(', ')}`,
                    entity: 'Divers Entreprise',
                    entityId: questionnaireId,
                    entreprise: entrepriseName
                });

                // Navigation vers le formulaire avec les données existantes
                navigate("/quesEntrep", {
                    state: {
                        enterprise: enterprises.find(e => e._id === enterpriseId),
                        editMode: true,
                        questionnaire: questionnaire
                    }
                });
                showMessage('Modification du questionnaire initiée', 'info');
            } else {
                showMessage('Erreur : Questionnaire non trouvé', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la modification:', error);
            showMessage('Erreur lors de l\'initialisation de la modification', 'error');
        }
    }, [apiUrl, navigate, enterprises, logAction, showMessage]);

    const buttonStyle = {
        backgroundColor: '#01aeac',
        '&:hover': { backgroundColor: '#95519b' },
        mr: 1,
        whiteSpace: 'nowrap',
    };

    // Fonction utilitaire pour gérer les messages


    const handleCloseSnackbar = (event, reason) => {
        // If the reason is 'clickaway', do not close the snackbar
        if (reason === 'clickaway') return;
        // Close the snackbar by setting its 'open' state to false
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const isConseillerPrevention = useCallback((entrepriseName) => {
        return Array.isArray(userInfo?.entreprisesConseillerPrevention)
            && userInfo?.entreprisesConseillerPrevention.includes(entrepriseName);
    }, [userInfo]);

    const handleOpenPreview = async (fileId, fileName) => {
        if (!fileId || !fileName) return;

        // Créer l'objet file avec la structure attendue par FileViewer
        setSelectedFile({
            fileId,
            fileName,
            file: { fileId, fileName }  // Ajout de cette structure
        });
        setModalOpen(true);

        try {
            const entreprise = enterprises.find(e =>
                questionnaires[e._id]?.some(q =>
                    q.files?.some(f => f.fileId === fileId)
                )
            );

            if (entreprise) {
                await logAction({
                    actionType: 'consultation',
                    details: `Prévisualisation du fichier - Nom: ${fileName} - Entreprise: ${entreprise.AddEntreName}`,
                    entity: 'Entreprise',
                    entityId: fileId,
                    entreprise: entreprise.AddEntreName
                });
            }
        } catch (error) {
            console.error('Erreur lors du log de la prévisualisation:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedFile(null);
        setModalOpen(false);
    };

    const fetchEnterprises = useCallback(async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
            const enterpriseData = response.data;

            // Vérification des données reçues
            console.log("Données reçues pour les entreprises:", enterpriseData);

            if (!Array.isArray(enterpriseData)) {
                console.error("Données non conformes : tableau attendu, mais reçu :", enterpriseData);
                setEnterprises([]);  // Définit `enterprises` à un tableau vide en cas d'erreur
                return;
            }

            // Vérifiez les valeurs de `isAdmin` et `isConseiller`
            console.log("Valeur de isAdmin:", isAdmin);
            console.log("Valeur de isConseiller:", isConseiller);

            const filteredData = isAdmin
                ? enterpriseData
                : enterpriseData.filter(enterprise =>
                    isConseiller && isConseillerPrevention(enterprise.AddEntreName)
                );

            setEnterprises(filteredData);
        } catch (error) {
            console.error("Erreur lors de la récupération des entreprises:", error);
            setEnterprises([]);  // Par défaut à un tableau vide en cas d'erreur
        } finally {
            setLoading(false);
        }
    }, [apiUrl, isAdmin, isConseiller, isConseillerPrevention]);

    const fetchQuestionnaires = useCallback(async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/questionnaires`);
            const questionnairesByEnterprise = response.data.reduce((acc, q) => {
                if (!acc[q.entrepriseId]) {
                    acc[q.entrepriseId] = [];
                }
                acc[q.entrepriseId].push(q);
                return acc;
            }, {});
            setQuestionnaires(questionnairesByEnterprise);
        } catch (error) {
            console.error('Error fetching questionnaires:', error);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchEnterprises();
        fetchQuestionnaires();
    }, []);

    useEffect(() => {
        const initializeEnterprises = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
                const data = response.data;
                let enterprisesData;

                if (isAdmin) {
                    enterprisesData = data;
                } else {
                    enterprisesData = data.filter(enterprise =>
                        isConseiller && isConseillerPrevention(enterprise.AddEntreName)
                    );
                }
                setEnterprises(enterprisesData);
                setFilteredEnterprises(
                    Array.isArray(enterprises) && Array.isArray(selectedEnterprises) && selectedEnterprises.length > 0
                        ? enterprises.filter(e => selectedEnterprises.includes(e.AddEntreName))
                        : enterprises || [] // Fallback to empty array if enterprises is undefined
                );
            } catch (error) {
                console.error('Error fetching enterprises:', error);
            } finally {
                setLoading(false);
            }
        };
        initializeEnterprises();
    }, [apiUrl, isAdmin, isConseiller, isConseillerPrevention, selectedEnterprises]);

    const handleDeleteFile = async (questionnaireId, fileId, enterpriseId) => {
        try {
            // Defensive checks
            if (!questionnaires || !questionnaires[enterpriseId]) {
                console.error('No questionnaires found for this enterprise');
                return;
            }
            const entrepriseName = enterprises.find(e => e._id === enterpriseId)?.AddEntreName;
            const currentQuestionnaire = questionnaires[enterpriseId]?.find(q => q._id === questionnaireId);
            if (!currentQuestionnaire) {
                console.error('Questionnaire not found');
                return;
            }
            // Safe filtering with default empty array
            const updatedFiles = currentQuestionnaire.files?.filter(f => f.fileId !== fileId) || [];
            await axios.put(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`, {
                ...currentQuestionnaire,
                files: updatedFiles

            });
            await logAction({
                actionType: 'suppression',
                details: `Suppression d'un document - Entreprise: ${entrepriseName}`,
                entity: 'Divers Entreprise',
                entityId: questionnaireId,
                entreprise: entrepriseName
            });
            // Defensive state update
            setQuestionnaires(prev => {
                // Ensure the enterprise exists in state
                if (!prev[enterpriseId]) {
                    return prev;
                }
                return {
                    ...prev,
                    [enterpriseId]: prev[enterpriseId].map(q =>
                        q._id === questionnaireId
                            ? { ...q, files: updatedFiles }
                            : q
                    )
                };
            });
            // Rest of the code remains the same
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // Fonction pour gérer la suppression d'un questionnaire
    const handleDeleteQuestionnaire = async (questionnaireId, enterpriseId) => {
        try {
            const entrepriseName = enterprises.find(e => e._id === enterpriseId)?.AddEntreName;
            const questionnaire = questionnaires[enterpriseId]?.find(q => q._id === questionnaireId);
            // Si le questionnaire a des fichiers, les supprimer d'abord
            if (questionnaire?.files?.length > 0) {
                for (const file of questionnaire.files) {
                    await axios.delete(`http://${apiUrl}:3100/api/file/${file.fileId}`);
                }
            }
            // Supprimer le questionnaire
            await axios.delete(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`);
            await logAction({
                actionType: 'suppression',
                details: `Suppression d'un questionnaire - Entreprise: ${entrepriseName}`,
                entity: 'Divers Entreprise',
                entityId: questionnaireId,
                entreprise: entrepriseName
            });
            // Mettre à jour l'état local
            setQuestionnaires(prev => ({
                ...prev,
                [enterpriseId]: prev[enterpriseId].filter(q => q._id !== questionnaireId)
            }));

        } catch (error) {
            console.error('Erreur lors de la suppression du questionnaire:', error);
        }
    };

    const handleStartQuestionnaire = (enterprise) => {
        navigate('/quesEntrep', {
            state: { enterprise }
        });
    };

    const handleFilterChange = (event) => {
        const selectedValues = event.target.value;
        setSelectedEnterprises(selectedValues);
    };

    const getCardStyle = useCallback(() => ({
        height: '100%',
        backgroundColor: darkMode ? '#2a2a2a' : '#fff',
        color: darkMode ? '#fff' : 'inherit',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }
    }), [darkMode]);

    const IconWrapper = ({ icon: Icon, text }) => (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Icon fontSize="small" sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#fff' : 'text.secondary' }}>
                {text}
            </Typography>
        </Box>
    );

    if (loading) {
        return <LinearProgress color="success" />;
    }

    const clearFilter = () => {
        setSelectedEnterprises([]);
    };

    const handleDelete = (questionnaireId, fileId, enterpriseId, type) => {
        showDeleteConfirm({
            message: `Êtes-vous sûr de vouloir supprimer ${type === 'file' ? 'ce fichier' : 'ce questionnaire'} ?`,
            onConfirm: () => {
                if (type === 'file') {
                    handleDeleteFile(questionnaireId, fileId, enterpriseId);
                } else if (type === 'questionnaire') {
                    handleDeleteQuestionnaire(questionnaireId, enterpriseId);
                }
            }
        });
    };


    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                sx={{ color: darkMode ? '#fff' : 'inherit' }}
            >
                Liste des Entreprises
            </Typography>
            {isAdmin && (
                <Box sx={{ mb: 3, width: '100%', maxWidth: 500, mx: 'auto' }}>
                    <FormControl fullWidth>
                        <InputLabel>Filtrer les entreprises</InputLabel>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <Select
                                fullWidth
                                multiple
                                value={selectedEnterprises}
                                onChange={handleFilterChange}
                                renderValue={(selected) => selected.join(', ')}
                                style={{ minHeight: '48px' }}
                            >
                                {enterprises.sort((a, b) =>
                                    a.AddEntreName.localeCompare(b.AddEntreName)
                                ).map((enterprise) => (
                                    <MenuItem key={enterprise._id} value={enterprise.AddEntreName}>
                                        {enterprise.AddEntreName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {selectedEnterprises.length > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={clearFilter}
                                    sx={{
                                        minWidth: '120px',
                                        height: '48px',
                                        backgroundColor: darkMode ? '#2a2a2a' : '#fff',
                                        color: darkMode ? '#fff' : '#000',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#3a3a3a' : '#f5f5f5',
                                        }
                                    }}
                                >
                                    Effacer le filtre
                                </Button>
                            )}
                        </Box>
                    </FormControl>
                </Box>
            )}
            <Grid container spacing={3}>
                {filteredEnterprises.map((enterprise, index) => (
                    <Grid item xs={12} md={6} lg={4} key={enterprise._id || index}>
                        <Card sx={getCardStyle()}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                    >
                                        <strong>Entreprise: </strong>{enterprise.AddEntreName}
                                    </Typography>
                                </Box>
                                <IconWrapper
                                    icon={LocationOnIcon}
                                    text={<><strong>Adresse:</strong> {`${enterprise.AddEntrRue}, ${enterprise.AddEntrCodpost} ${enterprise.AddEntrLocalite}`}</>}
                                />
                                <IconWrapper
                                    icon={PhoneIcon}
                                    text={<><strong>Téléphone:</strong> {enterprise.AddEntrTel}</>}
                                />
                                <IconWrapper
                                    icon={EmailIcon}
                                    text={<><strong>Email:</strong> {enterprise.AddEntrEmail}</>}
                                />
                                <IconWrapper
                                    icon={BusinessIcon}
                                    text={<><strong>N° Entreprise:</strong> {enterprise.AddEntrNumentr}</>}
                                />
                                <IconWrapper
                                    icon={AccountBalanceIcon}
                                    text={<><strong>IBAN:</strong> {enterprise.AddEntrIban}</>}
                                />
                                <IconWrapper
                                    icon={WorkIcon}
                                    text={<><strong>Activité:</strong> {enterprise.AddEntreActiventre}</>}
                                />
                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#ffffff' : '#000000' }} />
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <GroupIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                        component="h2"
                                    >
                                        <strong>Secrétariat Social</strong>
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 3, mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: darkMode ? '#fff' : 'text.secondary' }}
                                    >
                                        {enterprise.AddEntrSecsoci}
                                        <br />
                                        <strong>N° Affiliation:</strong> {enterprise.AddEntrNumaffi}
                                        <br />
                                        {enterprise.AddEntrScadresse}, {enterprise.AddEntrSccpost} {enterprise.AddEntrSclocalite}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#ffffff' : '#000000' }} />
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssignmentIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                        component="h2"
                                    >
                                        <strong>Pièces jointes</strong>
                                    </Typography>
                                </Box>
                                {questionnaires[enterprise._id]?.map((q, index, array) => (
                                    <Box key={q._id} display="flex" flexDirection="column" gap={1} mb={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box flex="1">
                                                <Typography variant="body2" sx={{ color: darkMode ? '#fff' : 'text.secondary' }}>
                                                    <strong>Type:</strong> {q.typeFichier} | <strong>Années:</strong> {q.annees.join(', ')} | <strong>Commentaires:</strong> {q.commentaire} | <strong>Entreprise:</strong> {q.entrepriseName} | <strong>files:</strong> {q.files.length}
                                                </Typography>
                                            </Box>
                                            <Tooltip title="Modifier le questionnaire" arrow>
                                                <Button
                                                    sx={{
                                                        backgroundColor: blueGrey[500],
                                                        minWidth: '36px',
                                                        width: '36px',
                                                        height: '36px',
                                                        padding: 0,
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: blueGrey[700],
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }}
                                                    onClick={() => handleEdit(q._id, enterprise._id)}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    <EditIcon sx={{ fontSize: 20 }} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Supprimer le questionnaire" arrow>
                                                <Button
                                                    sx={{
                                                        minWidth: '36px',
                                                        width: '36px',
                                                        height: '36px',
                                                        padding: 0,
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.08)',
                                                            boxShadow: 6
                                                        }
                                                    }}
                                                    onClick={() => handleDelete(q._id, null, enterprise._id, 'questionnaire')}
                                                    variant="contained"
                                                    color="error"
                                                >
                                                    <DeleteForeverIcon sx={{ fontSize: 20 }} />
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                        {q.files && q.files.map(file => (
                                            <Box key={file.fileId} display="flex" alignItems="center" gap={2} ml={2}>
                                                <Typography variant="body2" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: darkMode ? '#bbb' : '#666', flex: 1 }}>
                                                    {file.fileName}
                                                </Typography>
                                                <Box display="flex" gap={1}>
                                                    <Tooltip title="Telecharger le fichier" arrow>
                                                        <Button
                                                            sx={{
                                                                minWidth: '36px',
                                                                width: '36px',
                                                                height: '36px',
                                                                padding: 0,
                                                                transition: 'all 0.3s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'scale(1.08)',
                                                                    boxShadow: 6
                                                                }
                                                            }}
                                                            onClick={() => handleFileDownload({
                                                                fileId: file.fileId,
                                                                fileName: file.fileName,
                                                                entrepriseName: enterprise.AddEntreName,
                                                                logAction,
                                                                showMessage
                                                            })}
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            <GetAppIcon sx={{ fontSize: 20 }} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Visualiser le fichier" arrow>
                                                        <Button
                                                            sx={{
                                                                minWidth: '36px',
                                                                width: '36px',
                                                                height: '36px',
                                                                padding: 0,
                                                                transition: 'all 0.3s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'scale(1.08)',
                                                                    boxShadow: 6
                                                                }
                                                            }}
                                                            onClick={() => handleOpenPreview(file.fileId, file.fileName)}
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            <VisibilityIcon sx={{ fontSize: 20 }} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer le fichier" arrow>
                                                        <Button
                                                            sx={{
                                                                minWidth: '36px',
                                                                width: '36px',
                                                                height: '36px',
                                                                padding: 0,
                                                                transition: 'all 0.3s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'scale(1.08)',
                                                                    boxShadow: 6
                                                                }
                                                            }}
                                                            onClick={() => handleDelete(q._id, file.fileId, enterprise._id, 'file')}
                                                            variant="contained"
                                                            color="error"
                                                        >
                                                            <DeleteForeverIcon sx={{ fontSize: 20 }} />
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        ))}
                                        {index < array.length - 1 && (
                                            <Divider
                                                sx={{
                                                    my: 1,
                                                    backgroundColor: darkMode ? '#0b5a59' : '#01aeac',
                                                    opacity: 0.7,
                                                    height: '3px'
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#ffffff' : '#000000' }} />
                                <Tooltip title="Ajouter un nouveau document lié a l'entreprise" arrow>
                                    <Button
                                        variant="contained"
                                        startIcon={<GetAppIcon />}
                                        onClick={() => handleStartQuestionnaire(enterprise)}
                                        sx={{
                                            ...buttonStyle,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#95ad22',
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        Ajouter un pièce
                                    </Button>
                                </Tooltip>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}>
                    Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be
                </h5>
            </Tooltip>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="file-viewer-modal"
            >
                <Box sx={modalStyles}>
                    <Tooltip title="Fermer la fenêtre" arrow>
                        <Button
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                zIndex: 1,
                                color: 'white',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                        >
                            <CloseIcon />
                        </Button>
                    </Tooltip>
                    {selectedFile && (
                        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                        <pre>{JSON.stringify(selectedFile.fileName, null, 5)}</pre>
                        <FileViewer
                            file={selectedFile.file}
                            accidentId={null}
                        />
                    </Box>
                    )}
                </Box>
            </Modal>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box>
    );
};

export default Enterprise;