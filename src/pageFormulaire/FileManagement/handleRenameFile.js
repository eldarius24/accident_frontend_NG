import React, { useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip, Snackbar, Alert } from '@mui/material';

/**
 * Component for renaming a file within an accident record.
 *
 * This component displays a dialog for renaming a specific file.
 * It includes a text input for entering the new file name and buttons
 * for confirming or canceling the renaming operation.
 * On confirmation, it updates the file name in the database and the
 * local state, and displays a snackbar message indicating success or error.
 *
 * @param {string} fileId - The ID of the file to rename.
 * @param {string} currentFileName - The current name of the file.
 * @param {string} accidentId - The ID of the accident associated with the file.
 * @param {Array} files - The array of files associated with the accident.
 * @param {Function} setFiles - Function to update the files state.
 * @param {Function} onClose - Function to close the dialog.
 */
const RenameDialog = ({ fileId, currentFileName, accidentId, files, setFiles, onClose }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    /**
     * Affiche un message dans une snackbar.
     * @param {string} message - Le message à afficher.
     * @param {string} [severity='info'] - La gravité du message. Les valeurs possibles sont 'info', 'success', 'warning' et 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     */
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

/**
 * Opens a confirmation dialog for renaming a file.
 *
 * This function triggers a custom confirmation alert that displays 
 * a dialog for renaming a specific file associated with an accident record.
 * Within the dialog, the user can enter a new file name, which, upon 
 * confirmation, updates the file name both in the local state and 
 * in the database.
 *
 * @param {string} fileId - The ID of the file to rename.
 * @param {string} currentFileName - The current name of the file.
 * @param {string} accidentId - The ID of the accident associated with the file.
 * @param {Array} files - The array of files associated with the accident.
 * @param {Function} setFiles - Function to update the files state.
 */
const handleRenameFile = (fileId, currentFileName, accidentId, files, setFiles) => {
    confirmAlert({
        /**
         * Boîte de dialogue personnalisée pour renommer un fichier
         * 
         * La boîte de dialogue affiche un champ de saisie pour renommer le fichier
         * et deux boutons : "Confirmer" et "Annuler".
         * Lorsque le bouton "Confirmer" est cliqué, la fonction handleRename est appelée
         * avec le fichier à renommer, le nouveau nom du fichier et l'id de l'accident.
         * Lorsque le bouton "Annuler" est cliqué, la fonction onClose est appelée pour fermer la boîte de dialogue.
         * 
         * @param {{ onClose: () => void }} props - Fonction pour fermer la boîte de dialogue
         * @returns {JSX.Element} Le JSX Element qui contient la boîte de dialogue personnalisée
         */
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