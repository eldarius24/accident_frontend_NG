import React, { useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip, Snackbar, Alert } from '@mui/material';

const RenameDialog = ({ fileId, currentFileName, accidentId, files, setFiles, onClose }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    let newFileName = currentFileName;

    return (
        <>
            <div className="custom-confirm-dialog">
                <h1 className="custom-confirm-title">Renommer le fichier</h1>
                <p className="custom-confirm-message">Entrez le nouveau nom du fichier:</p>
                <input
                    type="text"
                    defaultValue={currentFileName}
                    onChange={(e) => { newFileName = e.target.value; }}
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
                            onClick={async () => {
                                try {
                                    await axios.put(`http://localhost:3100/api/accidents/${accidentId}`, {
                                        files: files.map(file =>
                                            file.fileId === fileId
                                                ? { ...file, fileName: newFileName }
                                                : file
                                        )
                                    });
                                    
                                    setFiles(files.map(file =>
                                        file.fileId === fileId
                                            ? { ...file, fileName: newFileName }
                                            : file
                                    ));
                                    
                                    showSnackbar('Fichier renommé avec succès', 'success');
                                    onClose();
                                } catch (error) {
                                    console.error('Erreur lors du renommage du fichier:', error);
                                    showSnackbar('Erreur lors du renommage du fichier', 'error');
                                }
                            }}
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