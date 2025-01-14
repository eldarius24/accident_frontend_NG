import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Card, CardContent, Typography, LinearProgress,
    Box, Divider, Button, Select, MenuItem, Modal,
    FormControl, Tooltip, InputLabel, Accordion, AccordionSummary, AccordionDetails,
    Grid
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import config from '../config.json';
import { useTheme } from '../Hook/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import { useNavigate } from 'react-router-dom';
import '../pageFormulaire/formulaire.css';
import { useLogger } from '../Hook/useLogger';
import FileViewer from '../Accidents/FileManagement/fileViewer';
import CustomSnackbar from '../_composants/CustomSnackbar';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import handleFileDownload from './fileUtils';
import showDeleteConfirm from '../Accidents/FileManagement/showDeleteConfirm';
import EditIcon from '@mui/icons-material/Edit';
import { blueGrey } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Cookies from 'js-cookie';
import NumbersIcon from '@mui/icons-material/Numbers';
import handleRenameFile from './fileRenameEntre';
import FileUploadIcon from '@mui/icons-material/FileUpload';

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

const COOKIE_NAME = 'enterpriseAccordionState';
const COOKIE_EXPIRY = 365; // Durée de validité du cookie en jours

const EnterpriseDivers = () => {
    const [expandedFiles, setExpandedFiles] = useState({});
    const { logAction } = useLogger();
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [enterprises, setEnterprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isConseiller, userInfo, isAdminOrDev, isAdminOrDevOrConseiller, isUserPrevention } = useUserConnected();
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

    const handleRename = useCallback((questionnaireId, fileId, newFileName) => {
        const enterprise = filteredEnterprises.find(e =>
            questionnaires[e._id]?.some(q => q._id === questionnaireId)
        );

        if (!enterprise) return;

        setQuestionnaires(prev => ({
            ...prev,
            [enterprise._id]: prev[enterprise._id].map(q =>
                q._id === questionnaireId
                    ? {
                        ...q,
                        files: q.files.map(f =>
                            f.fileId === fileId
                                ? { ...f, fileName: newFileName }
                                : f
                        )
                    }
                    : q
            )
        }));
    }, [filteredEnterprises, questionnaires]);

    const handleFilesAccordionChange = useCallback((questionnaireId) => (event, isExpanded) => {
        setExpandedFiles(prev => ({
            ...prev,
            [questionnaireId]: isExpanded
        }));
    }, []);
    // Initialiser l'état des accordéons depuis les cookies
    const [expandedYears, setExpandedYears] = useState(() => {
        try {
            const savedState = Cookies.get(COOKIE_NAME);
            return savedState ? JSON.parse(savedState) : {};
        } catch (error) {
            console.error('Erreur lors de la lecture des cookies:', error);
            return {};
        }
    });

    useEffect(() => {
        try {
            Cookies.set(COOKIE_NAME, JSON.stringify(expandedYears), {
                expires: COOKIE_EXPIRY,
                sameSite: 'strict',
                secure: true
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des cookies:', error);
        }
    }, [expandedYears]);

    const handleAccordionChange = useCallback((enterpriseId, year) => (event, isExpanded) => {
        setExpandedYears(prev => {
            const newState = {
                ...prev,
                [enterpriseId]: {
                    ...(prev[enterpriseId] || {}),
                    [year]: isExpanded
                }
            };

            try {
                Cookies.set(COOKIE_NAME, JSON.stringify(newState), {
                    expires: COOKIE_EXPIRY,
                    sameSite: 'strict',
                    secure: true
                });
            } catch (error) {
                console.error('Erreur lors de la mise à jour des cookies:', error);
            }

            return newState;
        });
    }, []);

    const handleToggleForEnterprise = useCallback((enterprise) => {
        const questionnairesForEnterprise = questionnaires[enterprise._id] || [];
        const enterpriseYears = new Set();

        questionnairesForEnterprise.forEach(q => {
            q.annees.forEach(year => enterpriseYears.add(year));
        });

        setExpandedYears(prev => {
            const currentYears = Array.from(enterpriseYears);
            const currentEnterpriseState = prev[enterprise._id] || {};
            const areAllExpanded = currentYears.every(year => currentEnterpriseState[year]);

            const newState = {
                ...prev,
                [enterprise._id]: currentYears.reduce((acc, year) => ({
                    ...acc,
                    [year]: !areAllExpanded
                }), {})
            };

            try {
                Cookies.set(COOKIE_NAME, JSON.stringify(newState), {
                    expires: COOKIE_EXPIRY,
                    sameSite: 'strict',
                    secure: true
                });
            } catch (error) {
                console.error('Erreur lors de la mise à jour des cookies:', error);
            }

            return newState;
        });
    }, [questionnaires]);

    const AccordionControls = useCallback(({ enterprise }) => {
        const questionnairesForEnterprise = questionnaires[enterprise._id] || [];
        const enterpriseYears = new Set();

        questionnairesForEnterprise.forEach(q => {
            q.annees.forEach(year => enterpriseYears.add(year));
        });

        const enterpriseState = expandedYears[enterprise._id] || {};
        const areAllExpanded = Array.from(enterpriseYears).every(year => enterpriseState[year]);

        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: 2,
                gap: 2
            }}>
                <Button
                    variant="outlined"
                    onClick={() => handleToggleForEnterprise(enterprise)}
                    sx={{
                        color: darkMode ? '#90caf9' : '#1976d2',
                        borderColor: darkMode ? '#90caf9' : '#1976d2',
                        '&:hover': {
                            backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.08)',
                            borderColor: darkMode ? '#90caf9' : '#1976d2'
                        }
                    }}
                >
                    Tout {areAllExpanded ? 'fermer' : 'ouvrir'}
                </Button>
            </Box>
        );
    }, [darkMode, expandedYears, handleToggleForEnterprise, questionnaires]);

    const getAccordionStyle = useCallback((darkMode) => ({
        backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
        color: darkMode ? '#fff' : 'inherit',
        marginBottom: '8px',
        boxShadow: 'none',
        border: `1px solid ${darkMode ? '#333' : '#ddd'}`,
        '&:before': {
            display: 'none',
        },
        '&.Mui-expanded': {
            margin: '8px 0',
        }
    }), []);

    const getAccordionSummaryStyle = useCallback((darkMode) => ({
        backgroundColor: darkMode ? '#2a2a2a' : '#ebebeb',
        '&:hover': {
            backgroundColor: darkMode ? '#333' : '#e0e0e0',
        },
        '& .MuiAccordionSummary-content': {
            alignItems: 'center'
        }
    }), []);

    const renderConditionalValue = (label, value) => {
        if (!value || value === 'Non renseigné') return null;
        return (
            <span>
                <strong>{label}:</strong> {value} |{' '}
            </span>
        );
    };

    const showMessage = (message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Fonction pour trier et grouper les questionnaires par année
    const organizeQuestionnaires = useCallback((questionnairesArray) => {
        if (!questionnairesArray) return [];

        // Créer un map des questionnaires par année
        const questionnairesByYear = {};

        questionnairesArray.forEach(questionnaire => {
            questionnaire.annees.forEach(annee => {
                if (!questionnairesByYear[annee]) {
                    questionnairesByYear[annee] = [];
                }
                questionnairesByYear[annee].push(questionnaire);
            });
        });

        // Convertir le map en tableau trié par année décroissante
        return Object.entries(questionnairesByYear)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
            .map(([year, questionnaires]) => ({
                year,
                questionnaires
            }));
    }, []);

    const handleEdit = useCallback(async (questionnaireId, enterpriseId) => {
        try {
            // Récupérer le questionnaire complet via l'API
            const response = await axios.get(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`);
            const questionnaire = response.data;
            const entrepriseName = enterprises.find(e => e._id === enterpriseId)?.AddEntreName;

            if (questionnaire) {
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

    const isUserPrev = useCallback((entrepriseName) => {
        return Array.isArray(userInfo?.entreprisesUserPrevention)
            && userInfo?.entreprisesUserPrevention.includes(entrepriseName);
    }, [userInfo]);

    const handleOpenPreview = async (fileId, fileName) => {
        if (!fileId || !fileName) return;

        // Créer l'objet file avec la structure attendue par FileViewer
        setSelectedFile({
            fileId,
            fileName,
            file: { fileId, fileName }
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
    
    const fetchData = useCallback(async () => {
        if (!apiUrl) return;
        
        setLoading(true);
        const controller = new AbortController();

        try {
            const enterpriseResponse = await axios.get(
                `http://${apiUrl}:3100/api/entreprises`, 
                { 
                    signal: controller.signal,
                    params: {
                        fields: 'AddEntreName _id'
                    }
                }
            );

            if (Array.isArray(enterpriseResponse.data)) {
                const filteredData = isAdminOrDev
                    ? enterpriseResponse.data
                    : enterpriseResponse.data.filter(enterprise =>
                        isConseiller && isConseillerPrevention(enterprise.AddEntreName)
                        || isUserPrevention && isUserPrev(enterprise.AddEntreName)
                    );

                setEnterprises(filteredData);
                setFilteredEnterprises(
                    Array.isArray(selectedEnterprises) && selectedEnterprises.length > 0
                        ? filteredData.filter(e => selectedEnterprises.includes(e.AddEntreName))
                        : filteredData
                );
            }

            const questionnaireResponse = await axios.get(
                `http://${apiUrl}:3100/api/questionnaires`,
                { 
                    signal: controller.signal,
                }
            );

            const questionnairesByEnterprise = questionnaireResponse.data.reduce((acc, q) => {
                if (!acc[q.entrepriseId]) {
                    acc[q.entrepriseId] = [];
                }
                acc[q.entrepriseId].push(q);
                return acc;
            }, {});

            setQuestionnaires(questionnairesByEnterprise);

        } catch (error) {
            if (error.name === 'AbortError') {

                return;
            }
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }

        return () => {
            controller.abort();
        };
    }, [apiUrl, isAdminOrDev, isConseiller, isUserPrevention, isConseillerPrevention, isUserPrev, selectedEnterprises]);


    // useEffect reste le même
    useEffect(() => {
        const fetchDataAndCleanup = async () => {
            const cleanup = await fetchData();
            return cleanup;
        };

        fetchDataAndCleanup();
    }, []);

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

            // Supprimer le fichier
            await axios.delete(`http://${apiUrl}:3100/api/file/${fileId}`);

            // Mettre à jour le questionnaire avec la nouvelle liste de fichiers
            const updatedFiles = currentQuestionnaire.files?.filter(f => f.fileId !== fileId) || [];
            await axios.put(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`, {
                ...currentQuestionnaire,
                files: updatedFiles
            });

            // Log de l'action
            await logAction({
                actionType: 'suppression',
                details: `Suppression d'un document - Entreprise: ${entrepriseName}`,
                entity: 'Divers Entreprise',
                entityId: questionnaireId,
                entreprise: entrepriseName
            });

            // Rafraîchir les questionnaires
            fetchQuestionnaires();
            showMessage('Fichier supprimé avec succès', 'success');

        } catch (error) {
            console.error('Error deleting file:', error);
            showMessage('Erreur lors de la suppression du fichier', 'error');
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
        setFilteredEnterprises(
            selectedValues.length > 0
                ? enterprises.filter(e => selectedValues.includes(e.AddEntreName))
                : enterprises
        );
    };

    const getCardStyle = useCallback(() => ({
        height: '100%',
        backgroundColor: darkMode ? '#2a2a2a' : '#ebebeb',
        color: darkMode ? '#fff' : 'inherit',
        transition: 'all 0.1s ease-in-out',
        border: `2px solid ${darkMode ? '#4a4a4a' : '#01aeac'}`,
        borderRadius: '12px',
        '&:hover': {
            borderColor: darkMode ? '#fff' : '#95ad22',
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
        handleFilterChange({ target: { value: [] } });
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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2rem 0',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '4px',
                    background: darkMode
                        ? 'linear-gradient(90deg, rgba(122,142,28,0.2) 0%, rgba(122,142,28,1) 50%, rgba(122,142,28,0.2) 100%)'
                        : 'linear-gradient(90deg, rgba(238,117,45,0.2) 0%, rgba(238,117,45,1) 50%, rgba(238,117,45,0.2) 100%)',
                    borderRadius: '2px'
                }
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#2D3748',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textAlign: 'center',
                        textShadow: darkMode
                            ? '2px 2px 4px rgba(0,0,0,0.3)'
                            : '2px 2px 4px rgba(0,0,0,0.1)',
                        '&::first-letter': {
                            color: darkMode ? '#7a8e1c' : '#ee752d',
                            fontSize: '120%'
                        },
                        position: 'relative',
                        padding: '0 20px'
                    }}
                >
                    Documents Divers
                </Typography>
            </Box>
            {isAdminOrDev && (
                <Grid
                    container
                    spacing={2}
                    sx={{
                        mb: 3,
                        width: '100%',
                        maxWidth: 800,
                        mx: 'auto'
                    }}
                >
                    <Grid item xs={5}>
                        <FormControl fullWidth
                            sx={{
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                width: '100%',
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                '& .MuiInputLabel-root': {
                                    color: darkMode ? '#fff' : 'inherit'
                                },
                                '& .MuiSelect-select': {
                                    color: darkMode ? '#fff' : 'inherit'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                }
                            }}>
                            <InputLabel>Filtrer les entreprises</InputLabel>
                            <Select
                                fullWidth
                                multiple
                                value={selectedEnterprises}
                                onChange={handleFilterChange}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{
                                    '& .MuiSelect-icon': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                            >
                                {enterprises.sort((a, b) =>
                                    a.AddEntreName.localeCompare(b.AddEntreName)
                                ).map((enterprise) => (
                                    <MenuItem
                                        key={enterprise._id}
                                        value={enterprise.AddEntreName}
                                        sx={{
                                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                            }
                                        }}
                                    >
                                        {enterprise.AddEntreName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="outlined"
                            onClick={clearFilter}
                            sx={{
                                color: darkMode ? '#ffffff' : 'black',
                                padding: '15px',
                                width: '100%',
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                transition: 'all 0.1s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                textTransform: 'none',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                            }}
                        >
                            Effacer le filtre
                        </Button>
                    </Grid>
                </Grid>
            )}
            {
                filteredEnterprises.map((enterprise) => (

                    <Card
                        key={enterprise._id}
                        sx={{
                            ...getCardStyle(),
                            mb: '10px',
                            backgroundColor: darkMode ? '#2a2a2a' : '#ebebeb',
                        }}>
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
                            <IconWrapper
                                icon={GroupIcon}
                                text={<><strong>Secrétariat Social:</strong> {enterprise.AddEntrSecsoci}</>}
                            />
                            <IconWrapper
                                icon={NumbersIcon}
                                text={<><strong>N° Affiliation:</strong> {enterprise.AddEntrNumaffi}</>}
                            />

                            <Divider sx={{ my: 2, backgroundColor: darkMode ? '#ffffff' : '#000000' }} />
                            {isAdminOrDevOrConseiller && (
                                <Tooltip title="Ajouter un nouveau document lié a l'entreprise" arrow>
                                    <Button
                                        variant="contained"
                                        startIcon={<GetAppIcon />}
                                        onClick={() => handleStartQuestionnaire(enterprise)}
                                        sx={{
                                            ...buttonStyle,
                                            transition: 'all 0.1s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#95ad22',
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        Ajouter une pièce
                                    </Button>
                                </Tooltip>
                            )}
                            <AccordionControls enterprise={enterprise} />
                            {organizeQuestionnaires(questionnaires[enterprise._id])?.map(({ year, questionnaires }) => (
                                <Accordion
                                    key={year}
                                    expanded={!!(expandedYears[enterprise._id]?.[year])}
                                    onChange={handleAccordionChange(enterprise._id, year)}
                                    sx={getAccordionStyle(darkMode)}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />}
                                        sx={getAccordionSummaryStyle(darkMode)}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            width: '100%'
                                        }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: darkMode ? '#90caf9' : '#1976d2',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Année {year}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: darkMode ? '#bbb' : '#666',
                                                }}
                                            >
                                                ({questionnaires.length} document{questionnaires.length > 1 ? 's' : ''})
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{
                                        backgroundColor: darkMode ? '#2a2a2a' : '#fff',
                                        padding: 2
                                    }}>
                                        {questionnaires.map((q, qIndex) => (
                                            <Box key={q._id} sx={{ mb: 2 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Box flex="1">
                                                        <Typography variant="body2" sx={{ color: darkMode ? '#fff' : 'text.secondary' }}>
                                                            {renderConditionalValue('Type', q.typeFichier)}
                                                            {renderConditionalValue('Années', q.annees.join(', '))}
                                                            {renderConditionalValue('Commentaires', q.commentaire)}
                                                            {renderConditionalValue('Entreprise', q.entrepriseName)}
                                                            {renderConditionalValue('Files', q.files.length)}
                                                            {renderConditionalValue('Valeur A (Heures prestées)', q.valueATf)}
                                                            {renderConditionalValue('Valeur B (Accidents)', q.valueBTf)}
                                                            {renderConditionalValue('Tf', q.resultTf)}
                                                        </Typography>
                                                    </Box>
                                                    {isAdminOrDevOrConseiller && (
                                                        <Box display="flex" gap={1}>
                                                            <Tooltip title="Modifier le questionnaire" arrow>
                                                                <Button
                                                                    sx={{
                                                                        backgroundColor: blueGrey[500],
                                                                        minWidth: '36px',
                                                                        width: '36px',
                                                                        height: '36px',
                                                                        padding: 0,
                                                                        '&:hover': {
                                                                            backgroundColor: blueGrey[700],
                                                                            transform: 'scale(1.08)'
                                                                        }
                                                                    }}
                                                                    onClick={() => handleEdit(q._id, enterprise._id)}
                                                                    variant="contained"
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
                                                                        '&:hover': {
                                                                            transform: 'scale(1.08)'
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
                                                    )}
                                                </Box>

                                                {/* Fichiers du questionnaire */}
                                                {q.files && q.files.length > 0 && (
                                                    <Accordion
                                                        expanded={!!expandedFiles[q._id]}
                                                        onChange={handleFilesAccordionChange(q._id)}
                                                        sx={{
                                                            backgroundColor: darkMode ? '#333' : '#f5f5f5',
                                                            mt: 2,
                                                            '&:before': { display: 'none' },
                                                            boxShadow: 'none',
                                                            border: `1px solid ${darkMode ? '#444' : '#ddd'}`
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />}
                                                            sx={{
                                                                backgroundColor: darkMode ? '#3a3a3a' : '#efefef',
                                                                '&:hover': {
                                                                    backgroundColor: darkMode ? '#444' : '#e5e5e5'
                                                                }
                                                            }}
                                                        >
                                                            <Typography sx={{ color: darkMode ? '#bbb' : '#666' }}>
                                                                Pièces jointes ({q.files.length})
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails sx={{ backgroundColor: darkMode ? '#333' : '#fff' }}>
                                                            {q.files.map(file => (
                                                                <Box
                                                                    key={file.fileId}
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    gap={2}
                                                                    sx={{
                                                                        p: 2,
                                                                        mb: 1,
                                                                        backgroundColor: darkMode ? '#2a2a2a' : '#f8f8f8',
                                                                        borderRadius: '4px',
                                                                        '&:hover': {
                                                                            backgroundColor: darkMode ? '#3a3a3a' : '#f0f0f0'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            flex: 1,
                                                                            color: darkMode ? '#bbb' : '#666'
                                                                        }}
                                                                    >
                                                                        {file.fileName}
                                                                    </Typography>
                                                                    <Box display="flex" gap={1}>
                                                                        <Tooltip title="Télécharger le fichier" arrow>
                                                                            <Button
                                                                                sx={{
                                                                                    minWidth: '36px',
                                                                                    width: '36px',
                                                                                    height: '36px',
                                                                                    padding: 0
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
                                                                                <FileUploadIcon sx={{ fontSize: 20 }} />
                                                                            </Button>
                                                                        </Tooltip>
                                                                        {isAdminOrDevOrConseiller && (
                                                                            <Tooltip title="Renommer le fichier" arrow>
                                                                                <Button
                                                                                    sx={{
                                                                                        backgroundColor: blueGrey[500],
                                                                                        minWidth: '36px',
                                                                                        width: '36px',
                                                                                        height: '36px',
                                                                                        padding: 0,
                                                                                        '&:hover': {
                                                                                            backgroundColor: blueGrey[700],
                                                                                            transform: 'scale(1.08)'
                                                                                        }
                                                                                    }}
                                                                                    onClick={() => handleRenameFile(
                                                                                        file.fileId,
                                                                                        file.fileName,
                                                                                        q._id,
                                                                                        enterprise.AddEntreName,
                                                                                        (fileId, newFileName) => handleRename(q._id, fileId, newFileName),
                                                                                        logAction
                                                                                    )}
                                                                                    variant="contained"
                                                                                    color="info"
                                                                                >
                                                                                    <EditIcon sx={{ fontSize: 20 }} />
                                                                                </Button>
                                                                            </Tooltip>
                                                                        )}
                                                                        <Tooltip title="Visualiser le fichier" arrow>
                                                                            <Button
                                                                                sx={{
                                                                                    minWidth: '36px',
                                                                                    width: '36px',
                                                                                    height: '36px',
                                                                                    padding: 0
                                                                                }}
                                                                                onClick={() => handleOpenPreview(file.fileId, file.fileName)}
                                                                                variant="contained"
                                                                                color="secondary"
                                                                            >
                                                                                <VisibilityIcon sx={{ fontSize: 20 }} />
                                                                            </Button>
                                                                        </Tooltip>
                                                                        {isAdminOrDevOrConseiller && (
                                                                            <Tooltip title="Supprimer le fichier" arrow>
                                                                                <Button
                                                                                    sx={{
                                                                                        minWidth: '36px',
                                                                                        width: '36px',
                                                                                        height: '36px',
                                                                                        padding: 0
                                                                                    }}
                                                                                    onClick={() => handleDelete(q._id, file.fileId, enterprise._id, 'file')}
                                                                                    variant="contained"
                                                                                    color="error"
                                                                                >
                                                                                    <DeleteForeverIcon sx={{ fontSize: 20 }} />
                                                                                </Button>
                                                                            </Tooltip>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                )}

                                                {qIndex < questionnaires.length - 1 && (
                                                    <Divider
                                                        sx={{
                                                            my: 2,
                                                            backgroundColor: darkMode ? '#0b5a59' : '#01aeac',
                                                            opacity: 0.7,
                                                            height: '2px'
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </CardContent>
                    </Card>

                ))
            }
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="file-viewer-modal"
                keepMounted={false}
                disableEnforceFocus={false}
                disableAutoFocus={false}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        handleCloseModal();
                    }
                }}
            >
                <Box sx={modalStyles}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="file-preview-title"
                    tabIndex={-1}
                >
                    <Typography
                        id="file-preview-title"
                        variant="h6"
                        sx={{ position: 'absolute', left: -9999 }}
                    >
                        Prévisualisation du fichier: {selectedFile?.fileName}
                    </Typography>
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
                            aria-label="Fermer la fenêtre"
                        >
                            <CloseIcon />
                        </Button>
                    </Tooltip>
                    {selectedFile && (
                        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}
                            tabIndex={-1}
                        >
                            <pre>{JSON.stringify(selectedFile.fileName, null, 5)}</pre>
                            <FileViewer
                                file={selectedFile.file}
                                accidentId={null}
                                isEntreprise={true}
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
        </Box >
    );
};

export default EnterpriseDivers;