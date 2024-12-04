import React, { useState, useCallback } from 'react';
import {
    Box, Button, Typography, Modal, IconButton,
    Tooltip, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import FileViewer from '../Accidents/FileManagement/fileViewer';
import { confirmAlert } from 'react-confirm-alert';
import config from '../config.json';

const apiUrl = config.apiUrl;

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

const VehicleFileManagement = ({ 
    file, 
    vehicleId, 
    onDelete, 
    onRename, 
    darkMode, 
    showMessage,
    logAction,
    entrepriseName 
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileDownload = async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/getFile/${file.fileId}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            if (logAction) {
                await logAction({
                    actionType: 'export',
                    details: `Téléchargement du fichier - Nom: ${file.fileName} - Véhicule: ${vehicleId}`,
                    entity: 'Vehicle',
                    entityId: file.fileId,
                    vehicleId: vehicleId
                });
            }

            showMessage('Téléchargement réussi', 'success');
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            showMessage('Erreur lors du téléchargement', 'error');
        }
    };

    const handleRename = useCallback(() => {
        confirmAlert({
            customUI: ({ onClose }) => {
                let newFileName = file.fileName;

                return (
                    <div className="custom-confirm-dialog">
                        <h1>Renommer le fichier</h1>
                        <p>Entrez le nouveau nom pour le fichier:</p>
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
                                        const encodedOldFileName = encodeURIComponent(file.fileName);
                                        await axios.put(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/records/${encodedOldFileName}`, {
                                            newFileName
                                        });

                                        await logAction({
                                            actionType: 'modification',
                                            details: `Fichier renommé - Ancien nom: ${file.fileName} - Nouveau nom: ${newFileName}`,
                                            entity: 'Vehicle',
                                            entityId: file.fileId,
                                            vehicleId: vehicleId
                                        });

                                        onRename(file.fileId, newFileName);
                                        showMessage('Fichier renommé avec succès', 'success');
                                        onClose();
                                    } catch (error) {
                                        console.error('Erreur lors du renommage:', error);
                                        showMessage('Erreur lors du renommage', 'error');
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
    }, [file, vehicleId, onRename, showMessage, logAction]);

    const handlePreview = async () => {
        setSelectedFile({
            fileId: file.fileId,
            fileName: file.fileName
        });
        setModalOpen(true);

        await logAction({
            actionType: 'consultation',
            details: `Prévisualisation du fichier - Nom: ${file.fileName}`,
            entity: 'Vehicle',
            entityId: file.fileId,
            vehicleId: vehicleId
        });
    };

    return (
        <>
            <Box display="flex" gap={1}>
                <Tooltip title="Télécharger le fichier" arrow>
                    <IconButton onClick={handleFileDownload} color="primary">
                        <GetAppIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Renommer le fichier" arrow>
                    <IconButton onClick={handleRename}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Prévisualiser le fichier" arrow>
                    <IconButton onClick={handlePreview}>
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer le fichier" arrow>
                    <IconButton onClick={() => onDelete(file.fileId)} color="error">
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip>
            </Box>

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
                                vehicleId={vehicleId}
                                isVehicle={true}
                            />
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default VehicleFileManagement;