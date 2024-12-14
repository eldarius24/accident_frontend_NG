import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, LinearProgress, Tooltip, Box, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import TextFieldP from '../_composants/textFieldP';
import TextFieldQ from '../_composants/textFieldQ';
import DatePickerQ from '../_composants/datePickerQ';
import axios from 'axios';
import AutocompleteQ from '../_composants/autoCompleteQ';
import { confirmAlert } from 'react-confirm-alert';
import { useLogger } from '../Hook/useLogger';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileViewer from './VehicleFileViewer';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { blueGrey } from '@mui/material/colors';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import '../pageFormulaire/formulaire.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useUserConnected } from '../Hook/userConnected';
import dayjs from 'dayjs';

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

export default function VehicleDetails() {
    const [modalOpen, setModalOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { logAction } = useLogger();
    const { darkMode } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller, isAdminOrDev, isDeveloppeur } = useUserConnected();
    const [vehicle, setVehicle] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newRecord, setNewRecord] = useState({
        type: 'repair',
        date: new Date(),
        documentVechiule: '',
        cost: '',
        commentaire: '',
        kilometrage: ''

    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

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

    const vehicleId = location.state?.vehicleId;
    const apiUrl = config.apiUrl;

    const showSnackbar = useCallback((message, severity) => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };


    const handleOpenPreview = async (fileId, fileName) => {
        if (!fileId || !fileName) {
            console.error('FileId ou fileName manquant:', { fileId, fileName });
            showSnackbar('Informations du fichier manquantes', 'error');
            return;
        }

        setSelectedFile({
            fileId: fileId,
            fileName: fileName,
            file: {
                fileId: fileId,
                fileName: fileName
            }
        });
        setModalOpen(true);

        try {
            // Récupérer d'abord les informations du véhicule
            const vehicleResponse = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}`);
            const vehicle = vehicleResponse.data;

            await logAction({
                actionType: 'consultation',
                details: `Prévisualisation du fichier - Nom: ${fileName} - Véhicule: ${vehicle.numPlaque}`,
                entity: 'Vehicle',
                entityId: fileId,
                vehicleId: vehicleId
            });
        } catch (error) {
            console.error('Erreur log prévisualisation:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedFile(null);
        setModalOpen(false);
    };

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        try {
            const response = await axios.post(`http://${apiUrl}:3100/api/stockFile`, formData);

            await logAction({
                actionType: 'import',
                details: `Import du fichier ${file.name} pour le véhicule`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

            setNewRecord(prev => ({
                ...prev,
                fileId: response.data.fileId,
                fileName: file.name
            }));
            showSnackbar('Fichier ajouté', 'success');
        } catch (error) {

            await logAction({
                actionType: 'error',
                details: `Erreur lors de l'import du fichier ${file.name}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

            showSnackbar('Erreur téléchargement', 'error');
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    }, [handleFileUpload]);

    const handleFileInputChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
    }, [handleFileUpload]);

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

    const promptForFileName = useCallback((file) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                let fileName = file.name;

                return (
                    <div className="custom-confirm-dialog">
                        <h1 className="custom-confirm-title">Renommer le fichier</h1>
                        <p className="custom-confirm-message">Entrez le nouveau nom pour le fichier:</p>
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
                            <Tooltip title="Confirmer et envoyer le fichier" arrow>
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
                            <Tooltip title="Annuler l'envoi" arrow>
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

    const fetchData = useCallback(async (skipLog = false) => {
        if (!vehicleId) return;

        try {
            // Récupérer les données du véhicule en premier
            const vehicleResponse = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}`);
            const vehicleData = vehicleResponse.data;
            setVehicle(vehicleData);

            // Puis les enregistrements
            const recordsResponse = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/records`);
            setRecords(recordsResponse.data);

            // Ne logger que lors du chargement initial
            if (!skipLog && isInitialLoad) {
                await logAction({
                    actionType: 'consultation',
                    details: `Consultation des détails du véhicule ${vehicleData.numPlaque}`,
                    entity: 'Vehicle',
                    entityId: vehicleId
                });
                setIsInitialLoad(false);
            }

            if (!skipLog) {
                showSnackbar('Données chargées avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            if (!skipLog) {
                showSnackbar('Erreur lors du chargement des données', 'error');
                await logAction({
                    actionType: 'error',
                    details: 'Erreur lors du chargement des données du véhicule',
                    entity: 'Vehicle',
                    entityId: vehicleId
                });
            }
        } finally {
            setLoading(false);
        }
    }, [vehicleId, apiUrl, logAction, showSnackbar, isInitialLoad]);

    const handleEdit = useCallback((record) => {
        if (!record?._id) {
            showSnackbar('ID de l\'enregistrement manquant', 'error');
            return;
        }
        if (isDeveloppeur) {
            console.log("Record original:", record);
            console.log("Valeurs extraites pour newRecord:", {
                id: record._id,
                type: record.type || '',
                date: record.date ? new Date(record.date) : new Date(),
                documentVechiule: record.documentVechiule || '',
                cost: record.cost || '',
                commentaire: record.commentaire || '',
                kilometrage: record.kilometrage || '',
                fileId: record.fileId || null,
                fileName: record.fileName || null
            }
            );
        }

        const formattedDate = record.date ? dayjs(record.date) : dayjs();

        const recordToEdit = {
            id: record._id,
            type: record.type || '',
            date: formattedDate,  // Maintenant c'est un objet dayjs
            documentVechiule: record.documentVechiule || '',
            cost: record.cost || '',
            commentaire: record.commentaire || '',
            kilometrage: record.kilometrage || '',
            fileId: record.fileId || null,
            fileName: record.fileName || null
        };

        setNewRecord(recordToEdit);
        setOpenDialog(true);
    }, [showSnackbar]);



    const handleSaveRecord = async () => {
        try {
            const recordData = {
                type: newRecord.type,
                date: newRecord.date,  // DatePickerQ renvoie déjà une chaîne YYYY-MM-DD
                documentVechiule: newRecord.documentVechiule,
                cost: newRecord.cost,
                commentaire: newRecord.commentaire,
                kilometrage: newRecord.kilometrage,
                fileId: newRecord.fileId,
                fileName: newRecord.fileName
            };

            if (isDeveloppeur) {
                console.log("Données à enregistrer:", recordData);
                console.log("Mode:", newRecord.id ? "Modification" : "Création");
                console.log("Date envoyée:", recordData.date);
            }

            let response;
            if (newRecord.id) {
                if (isDeveloppeur) {
                    console.log("URL de mise à jour:", `http://${apiUrl}:3100/api/vehicles/records/${newRecord.id}`);
                    console.log("Données envoyées pour la mise à jour:", recordData);
                }

                response = await axios.put(
                    `http://${apiUrl}:3100/api/vehicles/records/${newRecord.id}`,
                    recordData
                );

                if (isDeveloppeur) {
                    console.log("Réponse de la mise à jour:", response.data);
                }

                await logAction({
                    actionType: 'modification',
                    details: `Modification d'un enregistrement - Type: ${recordData.type}`,
                    entity: 'Vehicle',
                    entityId: vehicleId
                });
            } else {
                if (isDeveloppeur) {
                    console.log("URL de création:", `http://${apiUrl}:3100/api/vehicles/${vehicleId}/records`);
                    console.log("Données envoyées pour la création:", recordData);
                }

                response = await axios.post(
                    `http://${apiUrl}:3100/api/vehicles/${vehicleId}/records`,
                    recordData
                );

                if (isDeveloppeur) {
                    console.log("Réponse de la création:", response.data);
                }

                await logAction({
                    actionType: 'creation',
                    details: `Ajout d'un enregistrement - Type: ${recordData.type}`,
                    entity: 'Vehicle',
                    entityId: vehicleId
                });
            }

            setOpenDialog(false);
            await fetchData(true);
            showSnackbar(
                `Enregistrement ${newRecord.id ? 'modifié' : 'ajouté'} avec succès`,
                'success'
            );

            if (isDeveloppeur) {
                console.log("État final de newRecord avant réinitialisation:", newRecord);
            }

            // Réinitialiser le formulaire avec des valeurs par défaut
            setNewRecord({
                type: '',
                date: dayjs(),
                documentVechiule: '',
                cost: '',
                commentaire: '',
                kilometrage: '',
                fileId: null,
                fileName: null
            });

            if (isDeveloppeur) {
                console.log("newRecord réinitialisé");
            }

        } catch (error) {
            if (isDeveloppeur) {
                console.error('Erreur détaillée:', error);
                console.log("Requête qui a échoué:", error.config);
                console.log("Réponse d'erreur:", error.response?.data);
            }
            console.error('Erreur lors de l\'opération:', error);
            showSnackbar(
                error.response?.data?.message || 'Erreur lors de l\'opération',
                'error'
            );
        }
    };


    const handleDelete = async (recordId) => {
        try {
            await axios.delete(`http://${apiUrl}:3100/api/vehicles/records/${recordId}`);

            await logAction({
                actionType: 'suppression',
                details: `Suppression d'un enregistrement pour le véhicule ${vehicle?.numPlaque}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

            // Recharger les données sans logger
            await fetchData(true);
            showSnackbar("Enregistrement supprimé avec succès", "success");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            showSnackbar("Erreur lors de la suppression de l'enregistrement", "error");

            await logAction({
                actionType: 'error',
                details: `Erreur lors de la suppression d'un enregistrement - ${error.message}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });
        }
    };

    const buttonStyle = useMemo(() => ({
        backgroundColor: darkMode ? '#424242' : '#01aeac',
        color: darkMode ? '#000' : '#fff',
        '&:hover': {
            backgroundColor: darkMode ? '#95519b' : '#95ad22',
            boxShadow: darkMode
                ? '0 0 10px rgba(255,255,255,0.2)'
                : '0 0 10px rgba(0,0,0,0.2)'
        },
        mr: 1,
        whiteSpace: 'nowrap',


        transition: 'all 0.1s ease-in-out',

        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        backdropFilter: darkMode ? 'blur(4px)' : 'none',
    }), [darkMode]);

    useEffect(() => {
        if (vehicleId) {
            setLoading(true);
            fetchData();
        }
    }, [vehicleId])

    if (loading) return <LinearProgress />;
    if (!vehicle) return <Typography>Véhicule non trouvé</Typography>;


    // Ajoutez la fonction de téléchargement
    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/getFile/${fileId}`, {
                responseType: 'blob',
                headers: {
                    'Accept': '*/*',
                },
                timeout: 30000
            });

            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/octet-stream'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'fichier-téléchargé';

            document.body.appendChild(link);
            link.click();

            await logAction({
                actionType: 'export',
                details: `Téléchargement du fichier ${fileName}`,
                entity: 'Vehicle',
                entityId: fileId,
                vehicleId: vehicleId
            });

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);

            showSnackbar('Téléchargement réussi', 'success');

        } catch (error) {

            await logAction({
                actionType: 'error',
                details: `Erreur lors du téléchargement du fichier ${fileName}`,
                entity: 'Vehicle',
                entityId: fileId,
                vehicleId: vehicleId
            });

            console.error('Erreur téléchargement:', error);
            showSnackbar('Erreur lors du téléchargement', 'error');
        }
    };

    const renderTableBody = () => (
        <TableBody>
            {records.map((record, index) => (
                <TableRow
                    className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                    style={{
                        backgroundColor: rowColors[index % rowColors.length]
                    }}
                    key={record._id}>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.kilometrage}</TableCell>
                    <TableCell>{record.documentVechiule}</TableCell>
                    <TableCell>{record.commentaire}</TableCell>
                    <TableCell>{record.cost}</TableCell>
                    <TableCell>{record.fileName}</TableCell>
                    <TableCell style={{ padding: 0, width: '70px' }}>
                        <Tooltip title={!record.fileId ? "Aucun fichier disponible" : "Télécharger le fichier"} arrow>
                            <span> {/* Utilisez un span comme wrapper pour maintenir le survol même quand désactivé */}
                                <Button
                                    onClick={() => handleDownload(record.fileId, record.fileName)}
                                    variant="contained"
                                    color="secondary"
                                    disabled={!record.fileId}
                                    sx={{
                                        backgroundColor: !record.fileId
                                            ? 'grey'
                                            : (darkMode ? '#14589c' : '#1976d2'),
                                        transition: 'all 0.1s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: !record.fileId
                                                ? 'grey'
                                                : (darkMode ? '#1976d2' : '#14589c'),
                                            transform: !record.fileId ? 'none' : 'scale(1.08)',
                                            boxShadow: !record.fileId ? 'none' : (darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6)
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: !record.fileId
                                                ? 'rgba(255,255,255,0.4)'
                                                : (darkMode ? '#fff' : 'inherit')
                                        }
                                    }}
                                >
                                    <FileUploadIcon />
                                </Button>
                            </span>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ padding: 0, width: '70px' }}>
                        <Tooltip title={!record.fileId ? "Aucun fichier disponible" : "Prévisualiser le fichier"} arrow>
                            <span>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleOpenPreview(record.fileId, record.fileName)}
                                    disabled={!record.fileId}
                                    sx={{
                                        backgroundColor: !record.fileId
                                            ? 'grey'
                                            : (darkMode ? '#7b1fa2' : '#9c27b0'),
                                        transition: 'all 0.1s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: !record.fileId
                                                ? 'grey'
                                                : (darkMode ? '#4a0072' : '#7b1fa2'),
                                            transform: !record.fileId ? 'none' : 'scale(1.08)',
                                            boxShadow: !record.fileId ? 'none' : (darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6)
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: !record.fileId
                                                ? 'rgba(255,255,255,0.4)'
                                                : (darkMode ? '#fff' : 'inherit')
                                        }
                                    }}
                                >
                                    <VisibilityIcon />
                                </Button>
                            </span>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ padding: 0, width: '70px' }}>
                        <Tooltip title="Modifier l'enregistrement" arrow>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEdit(record)}
                                sx={{
                                    backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? blueGrey[900] : blueGrey[700],
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                            >
                                <EditIcon />
                            </Button>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ padding: 0, width: '70px' }}>
                        <Tooltip title="Supprimer l'enregistrement" arrow>
                            <Button
                                sx={{
                                    backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#d32f2f' : '#b71c1c',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    confirmAlert({
                                        customUI: ({ onClose }) => {
                                            return (
                                                <div className="custom-confirm-dialog">
                                                    <h1 className="custom-confirm-title">Supprimer</h1>
                                                    <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet enregistrement ?</p>
                                                    <div className="custom-confirm-buttons">
                                                        <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                            <button
                                                                className="custom-confirm-button"
                                                                onClick={() => {
                                                                    handleDelete(record._id);
                                                                    onClose();
                                                                }}
                                                            >
                                                                Oui
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                                            <button
                                                                className="custom-confirm-button custom-confirm-no"
                                                                onClick={onClose}
                                                            >
                                                                Non
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    });
                                }}
                            >
                                <DeleteForeverIcon />
                            </Button>
                        </Tooltip>
                    </TableCell>


                </TableRow>
            ))
            }
        </TableBody >
    );


    return (
        <div style={{ margin: '0 20px' }}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '1.5rem 0'
            }}>
                <Typography variant="h2" sx={{
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                    fontWeight: 600,
                    background: darkMode
                        ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                        : 'linear-gradient(45deg, #ee752d, #f4a261)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '3px'
                }}>
                    Détails du véhicule - {vehicle.numPlaque}
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
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
                    Ajouter un enregistrement
                </Button>
            </Box>

            <TableContainer className="frameStyle-style"
                style={{
                    maxHeight: '900px',
                    overflowY: 'auto',
                    backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',

                }}>
                <Table>
                    <TableHead>
                        <TableRow
                            className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                            style={{
                                backgroundColor: darkMode ? '#535353' : '#0098f950'
                            }}
                        >
                            <TableCell>Type</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Kilometrage</TableCell>
                            <TableCell>Document</TableCell>
                            <TableCell>commentaire</TableCell>
                            <TableCell>Coût</TableCell>
                            <TableCell>Nom du fichier</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>DLL</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Vue</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Editer</TableCell>
                            <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                        </TableRow>
                    </TableHead>
                    {renderTableBody()}
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: {
                        backgroundColor: darkMode ? '#424242' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                        width: '800px',
                        maxWidth: '90vw'
                    }
                }}
            >
                <DialogTitle>
                    {newRecord.id ? 'Modifier l\'enregistrement' : 'Ajouter un enregistrement'}
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Tooltip title="Déposez un fichier ici" arrow>
                            <div
                                style={dropZoneStyle}
                                onDrop={handleDrop}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <span>Glissez et déposez un fichier ici</span>
                            </div>
                        </Tooltip>
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                        />
                        <label htmlFor="file-upload" style={{ ...labelStyle, textAlign: 'center', display: 'block', width: '100%' }}>
                            Ajouter un fichier
                        </label>
                        {/* Nouvelle section pour afficher le fichier ajouté */}
                        {newRecord.fileId && newRecord.fileName && (
                            <Box sx={{
                                mt: 2,
                                p: 2,
                                border: '1px solid',
                                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FileUploadIcon color="primary" />
                                    <Typography>{newRecord.fileName}</Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => setNewRecord(prev => ({ ...prev, fileId: null, fileName: null }))}
                                    sx={{ color: darkMode ? '#ff5252' : '#d32f2f' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </div>
                    <Box sx={{ gap: 2, mt: 6 }}>
                        <Box sx={{ width: '100%' }}>
                            <AutocompleteQ
                                id="type"
                                label="Type de document"
                                option={[
                                    'Certificat de Conformité',
                                    'Carte Grise',
                                    'Contrôle technique',
                                    'Assurance',
                                    'Contrôle Technique',
                                    'Facture',
                                    'Réparation',
                                    'Entretien',
                                    'Autre'
                                ]}
                                defaultValue={newRecord.type}  // Ajout du defaultValue
                                value={newRecord.type}         // Assurez-vous que value est défini
                                onChange={(value) => setNewRecord(prev => ({ ...prev, type: value }))}
                                isOptionEqualToValue={(option, value) => option === value}
                                required={true}
                            />
                            <DatePickerQ
                                label="Date du document"
                                defaultValue={newRecord.date}  // DatePickerQ s'attend à recevoir un objet dayjs
                                onChange={(value) => {
                                    setNewRecord(prev => ({
                                        ...prev,
                                        date: value
                                    }));
                                }}
                                required={true}
                            />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <TextFieldP
                                label="Document"
                                value={newRecord.documentVechiule || ''}  // Assurez-vous d'avoir une valeur par défaut
                                onChange={(value) => setNewRecord(prev => ({ ...prev, documentVechiule: value }))}
                            />
                            <TextFieldP
                                label="Commentaire"
                                value={newRecord.commentaire || ''}  // Assurez-vous d'avoir une valeur par défaut
                                onChange={(value) => setNewRecord(prev => ({ ...prev, commentaire: value }))}
                                multiline
                            />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <TextFieldP
                                label="Coût"
                                type="number"
                                value={newRecord.cost?.toString() || ''}  // Convertir en string et valeur par défaut
                                onChange={(value) => setNewRecord(prev => ({ ...prev, cost: value }))}
                                InputProps={{
                                    startAdornment: <span>€</span>
                                }}
                            />

                            <TextFieldQ
                                label="Kilometrage"
                                type="number"
                                value={newRecord.kilometrage?.toString() || ''}  // Convertir en string et valeur par défaut
                                onChange={(value) => setNewRecord(prev => ({ ...prev, kilometrage: value }))}
                                required={true}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button onClick={handleSaveRecord}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedFile(null);
                }}
            >
                <Box sx={modalStyles}>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            }
                        }}
                        onClick={() => {
                            setModalOpen(false);
                            setSelectedFile(null);
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {selectedFile && (
                        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                            <FileViewer
                                file={selectedFile}
                                accidentId={null}
                                isVehicle={true}
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
        </div>
    );
}
