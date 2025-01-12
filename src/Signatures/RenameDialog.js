// RenameDialog.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';

const RenameDialog = ({ 
    open, 
    onClose, 
    document, 
    apiUrl, 
    onRenameComplete 
}) => {
    const [newFileName, setNewFileName] = useState(document?.filename || '');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleRename = async () => {
        if (!newFileName.trim()) {
            showSnackbar('Le nom du fichier ne peut pas être vide', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`http://${apiUrl}:3100/api/signatures/${document._id}/rename`, {
                newFileName: newFileName
            });

            if (response.data.success) {
                showSnackbar('Document renommé avec succès', 'success');
                if (onRenameComplete) {
                    onRenameComplete();
                }
                onClose();
            }
        } catch (error) {
            console.error('Erreur lors du renommage:', error);
            showSnackbar(error.response?.data?.message || 'Erreur lors du renommage du document', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Renommer le document</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nouveau nom"
                        type="text"
                        fullWidth
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button onClick={handleRename} disabled={loading} variant="contained" color="primary">
                        Renommer
                    </Button>
                </DialogActions>
            </Dialog>

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

export default RenameDialog;