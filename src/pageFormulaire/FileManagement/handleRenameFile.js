import React, { useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip, Snackbar, Alert } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';
import config from '../../config.json';

const apiUrl = config.apiUrl;
// Fonction pour récupérer les détails de l'accident
const getAccidentDetails = async (accidentId) => {
    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentId}`);
        if (response.data) {
            return {
                nomTravailleur: response.data.nomTravailleur || '',
                prenomTravailleur: response.data.prenomTravailleur || '',
                entreprise: response.data.entrepriseName || '',
                dateAccident: response.data.DateHeureAccident ?
                    new Date(response.data.DateHeureAccident).toLocaleDateString() : ''
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'accident:', error);
        return null;
    }
};

const RenameDialog = ({ fileId, currentFileName, accidentId, files, setFiles, onClose }) => {
    const { logAction } = useLogger();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const [newFileName, setNewFileName] = useState(currentFileName); // État pour le nouveau nom

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleRename = async () => {
        try {
            // Récupérer les détails de l'accident
            const accidentDetails = await getAccidentDetails(accidentId);
            if (!accidentDetails) {
                throw new Error('Impossible de récupérer les détails de l\'accident');
            }

            // Mettre à jour le nom du fichier
            await axios.put(`http://${apiUrl}:3100/api/accidents/${accidentId}`, {
                files: files.map(file =>
                    file.fileId === fileId
                        ? { ...file, fileName: newFileName }
                        : file
                )
            });

            // Mettre à jour l'état local
            setFiles(files.map(file =>
                file.fileId === fileId
                    ? { ...file, fileName: newFileName }
                    : file
            ));

            // Créer le log
            await logAction({
                actionType: 'modification',
                details: `Renommage de fichier - Ancien nom: ${currentFileName} - Nouveau nom: ${newFileName} - Travailleur: ${accidentDetails.nomTravailleur} ${accidentDetails.prenomTravailleur} - Date accident: ${accidentDetails.dateAccident}`,
                entity: 'Fichier Accident',
                entityId: fileId,
                entreprise: accidentDetails.entreprise
            });

            showSnackbar('Fichier renommé avec succès', 'success');
            onClose();
        } catch (error) {
            console.error('Erreur lors du renommage du fichier:', error);
            showSnackbar('Erreur lors du renommage du fichier', 'error');
        }
    };

    return (
        <>
            <div className="custom-confirm-dialog">
                <h1 className="custom-confirm-title">Renommer le fichier</h1>
                <p className="custom-confirm-message">Entrez le nouveau nom du fichier:</p>
                <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                />
                <div className="custom-confirm-buttons">
                    <Tooltip title="Cliquez pour confirmer le nouveau nom" arrow>
                        <button
                            className="custom-confirm-button"
                            onClick={handleRename}
                        >
                            Confirmer
                        </button>
                    </Tooltip>
                    <Tooltip title="Cliquez pour annuler le renommage" arrow>
                        <button
                            className="custom-confirm-button custom-confirm-no"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </Tooltip>
                </div>
            </div>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

const handleRenameFile = (fileId, currentFileName, accidentId, files, setFiles) => {
    confirmAlert({
        customUI: ({ onClose }) => (
            <RenameDialog
                fileId={fileId}
                currentFileName={currentFileName}
                accidentId={accidentId}
                files={files}
                setFiles={setFiles}
                onClose={onClose}
            />
        )
    });
};

export default handleRenameFile;