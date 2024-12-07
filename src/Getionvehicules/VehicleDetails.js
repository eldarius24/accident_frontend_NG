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

    const fetchVehicle = async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}`);
            setVehicle(response.data);

            await logAction({
                actionType: 'consultation',
                details: `Consultation des détails du véhicule ${response.data.numPlaque}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

        } catch (error) {

            await logAction({
                actionType: 'error',
                details: 'Erreur lors du chargement des détails du véhicule',
                entity: 'Vehicle',
                entityId: vehicleId
            });

            setSnackbar({
                open: true,
                message: 'Erreur lors du chargement du véhicule',
                severity: 'error'
            });
        }
    };

    const fetchRecords = async () => {
        try {
            // D'abord récupérer les informations du véhicule
            const vehicleResponse = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}`);
            const vehicle = vehicleResponse.data;

            // Ensuite récupérer les enregistrements
            const recordsResponse = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/records`);
            setRecords(recordsResponse.data);

            await logAction({
                actionType: 'consultation',
                details: `Consultation des enregistrements du véhicule ${vehicle.numPlaque}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });
        } catch (error) {
            console.error('Erreur lors du chargement des enregistrements:', error);

            await logAction({
                actionType: 'error',
                details: `Erreur lors du chargement des enregistrements du véhicule ID: ${vehicleId}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

            setSnackbar({
                open: true,
                message: 'Erreur lors du chargement des enregistrements',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRenameFile = useCallback((record) => {
        if (!record?._id) {
            showSnackbar('ID de l\'enregistrement manquant', 'error');
            return;
        }

        confirmAlert({
            customUI: ({ onClose }) => {
                let newFileName = record.fileName || record.documentVehicle;

                return (
                    <div className="custom-confirm-dialog">
                        <h1 className="custom-confirm-title">Renommer le fichier</h1>
                        <p className="custom-confirm-message">Entrez le nouveau nom pour le fichier:</p>
                        <input
                            type="text"
                            defaultValue={newFileName}
                            onChange={(e) => { newFileName = e.target.value; }}
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
                            <button
                                className="custom-confirm-button"
                                onClick={async () => {
                                    try {
                                        await axios.put(`http://${apiUrl}:3100/api/vehicles/records/${record._id}`, {
                                            newFileName
                                        });
                                        fetchRecords();
                                        showSnackbar('Fichier renommé avec succès', 'success');
                                        onClose();
                                    } catch (error) {
                                        console.error('Erreur lors du renommage:', error);
                                        showSnackbar('Erreur lors du renommage du fichier', 'error');
                                    }
                                }}
                            >
                                Confirmer
                            </button>
                            <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                Annuler
                            </button>
                        </div>
                    </div>
                );
            }
        });
    }, [apiUrl, fetchRecords, showSnackbar]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleSaveRecord = async () => {
        try {
            const recordData = {
                ...newRecord,
                documentVehicle: newRecord.documentVechiule // Corriger le nom du champ
            };

            const response = await axios.post(
                `http://${apiUrl}:3100/api/vehicles/${vehicleId}/records`,
                recordData
            );

            await logAction({
                actionType: 'creation',
                details: `Ajout d'un enregistrement - Type: ${recordData.type}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });

            if (response.data) {
                setOpenDialog(false);
                fetchRecords();
                showSnackbar('Information ajoutée avec succès', 'success');
                setNewRecord({
                    type: '',
                    date: new Date(),
                    documentVehicle: '',
                    documentVechiule: '',
                    cost: '',
                    commentaire: '',
                    kilometrage: ''
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            showSnackbar(error.response?.data?.message || 'Erreur lors de l\'ajout', 'error');
        }
    };


    const handleDelete = async (recordId) => {
        try {
            // Get vehicle info for logging
            const vehicleResponse = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}`);
            const vehicle = vehicleResponse.data;
    
            const response = await axios.delete(`http://${apiUrl}:3100/api/vehicles/records/${recordId}`);
            
            if (response.status === 200) {
                // Update records list after deletion
                setRecords(records.filter(record => record._id !== recordId));
                
                // Show success message
                setSnackbar({
                    open: true,
                    message: "Enregistrement supprimé avec succès",
                    severity: "success"
                });
                
                // Log the deletion action using the logAction from useLogger hook
                await logAction({
                    actionType: 'suppression',
                    details: `Suppression d'un enregistrement pour le véhicule ${vehicle.numPlaque}`,
                    entity: 'Vehicle',
                    entityId: vehicleId
                });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            
            // Log the error
            await logAction({
                actionType: 'error',
                details: `Erreur lors de la suppression d'un enregistrement - ${error.message}`,
                entity: 'Vehicle',
                entityId: vehicleId
            });
            
            setSnackbar({
                open: true,
                message: "Erreur lors de la suppression de l'enregistrement",
                severity: "error"
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
            fetchVehicle();
            fetchRecords();
        }
    }, [vehicleId]);

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
                        <Tooltip title="Télécharger le fichier" arrow>
                            <Button
                                onClick={() => handleDownload(record.fileId, record.fileName)}
                                variant="contained"
                                color="secondary"
                                sx={{
                                    backgroundColor: darkMode ? '#14589c' : '#1976d2',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#1976d2' : '#14589c',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                            >
                                <FileUploadIcon />
                            </Button>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ padding: 0, width: '70px' }}>
                        <Tooltip title="Prévisualiser le fichier" arrow>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleOpenPreview(record.fileId, record.fileName)}
                                sx={{
                                    backgroundColor: darkMode ? '#7b1fa2' : '#9c27b0',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#4a0072' : '#7b1fa2',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: darkMode ? '#fff' : 'inherit'
                                    }
                                }}
                            >
                                <VisibilityIcon />
                            </Button>
                        </Tooltip>
                    </TableCell>
                    <TableCell style={{ padding: 0, width: '70px' }}>
                        <Tooltip title="Renommer le fichier" arrow>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleRenameFile(record)}
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
                <DialogTitle>Ajouter un enregistrement</DialogTitle>
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
                                defaultValue=""
                                value={newRecord.type}
                                onChange={(value) => setNewRecord(prev => ({ ...prev, type: value }))}
                                isOptionEqualToValue={(option, value) => option === value}
                                required={true}
                            />
                            <DatePickerQ
                                label="Date du document"
                                value={newRecord.date}
                                onChange={(value) => setNewRecord({ ...newRecord, date: value })}
                                required={true}
                            />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <TextFieldP
                                label="Document"
                                value={newRecord.documentVechiule}
                                onChange={(value) => setNewRecord({ ...newRecord, documentVechiule: value })}
                            />
                            <TextFieldP
                                label="Commentaire"
                                value={newRecord.commentaire}
                                onChange={(value) => setNewRecord({ ...newRecord, commentaire: value })}
                                multiline
                            />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <TextFieldP
                                label="Coût"
                                type="number"
                                value={newRecord.cost}
                                onChange={(value) => setNewRecord({ ...newRecord, cost: value })}
                                InputProps={{
                                    startAdornment: <span>€</span>
                                }}
                            />

                            <TextFieldQ
                                label="Kilometrage"
                                type="number"
                                value={newRecord.kilometrage}
                                onChange={(value) => setNewRecord({ ...newRecord, kilometrage: value })}
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
