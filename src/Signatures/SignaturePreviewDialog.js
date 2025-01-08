import React, { useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import axios from 'axios';

const SignaturePreviewDialog = ({ 
    open, 
    onClose, 
    document, 
    apiUrl, 
    userInfo,
    onSignatureComplete 
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signed, setSigned] = useState(false);

    const handleSign = async () => {
        try {
            setLoading(true);
            setError(null);

            // Appel à l'API pour signer le document
            const response = await axios.post(
                `http://${apiUrl}:3100/api/signatures/sign-only/${document._id}`,
                { userId: userInfo._id }
            );

            if (response.data.success) {
                setSigned(true);
                if (onSignatureComplete) {
                    onSignatureComplete();
                }
            }
        } catch (error) {
            console.error('Erreur lors de la signature:', error);
            setError(error.response?.data?.message || "Erreur lors de la signature");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://${apiUrl}:3100/api/signatures/download/${document._id}`,
                { responseType: 'blob' }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.filename}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError("Erreur lors du téléchargement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Signature du document : {document?.filename}
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {signed ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Document signé avec succès !
                    </Alert>
                ) : null}

                <Box sx={{ height: '500px', width: '100%', mb: 2 }}>
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

                <Typography variant="body2" color="textSecondary">
                    En signant ce document, vous confirmez avoir lu et approuvé son contenu.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Fermer
                </Button>
                <Button onClick={handleDownload}>
                    Télécharger
                </Button>
                {!signed && (
                    <Button 
                        onClick={handleSign}
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Signer'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SignaturePreviewDialog;