import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const DocumentPreviewDialog = ({ open, onClose, document, apiUrl }) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Prévisualisation : {document?.filename}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ height: '600px', width: '100%', mb: 2 }}>
                    <iframe
                        src={`http://${apiUrl}:3100/api/signatures/preview/${document?._id}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: '1px solid #ccc'
                        }}
                        title="Prévisualisation du document"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentPreviewDialog;