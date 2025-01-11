// SignaturePreviewDialog.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    AlertTitle,
    Link,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import { useUserConnected } from '../Hook/userConnected.js';

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
    const [systemStatus, setSystemStatus] = useState(null);
    const [checkingSystem, setCheckingSystem] = useState(true);
    const [previewKey, setPreviewKey] = useState(Date.now());
    const { isDeveloppeur } = useUserConnected();
    const [statusCheckInterval, setStatusCheckInterval] = useState(null);

    const handleRefreshPreview = () => {
        setPreviewKey(Date.now());
    };

    // Vérifier si l'utilisateur actuel a déjà signé
    const hasUserSigned = useMemo(() => {
        if (!document || !document.signers || !userInfo) return false;
        const userSigner = document.signers.find(signer =>
            signer.userId._id === userInfo._id || signer.userId === userInfo._id
        );
        return userSigner?.signed || false;
    }, [document, userInfo]);

    // Fonction de vérification du système
    const checkSystem = async () => {
        try {
            setCheckingSystem(true);
            const response = await axios.get(`http://${apiUrl}:3100/api/signatures/check-system`);
            setSystemStatus(response.data);
        } catch (error) {
            console.error('Erreur lors de la vérification du système:', error);
            setSystemStatus({
                ready: false,
                message: 'Impossible de vérifier l\'état du système de signature'
            });
        } finally {
            setCheckingSystem(false);
        }
    };

    // Écouter les changements USB
    useEffect(() => {
        if (!open) return;

        // Vérification initiale
        checkSystem();
        handleRefreshPreview();
        setSigned(false);
        setError(null);

        // Établir la connexion SSE (Server-Sent Events)
        const eventSource = new EventSource(`http://${apiUrl}:3100/api/signatures/subscribe-status`);

        eventSource.onmessage = (event) => {
            const status = JSON.parse(event.data);
            setSystemStatus(status);
            setCheckingSystem(false);
        };

        eventSource.onerror = () => {
            console.error('Erreur de connexion SSE');
            setCheckingSystem(false);
        };

        // Cleanup
        return () => {
            eventSource.close();
        };
    }, [open, document, apiUrl]);

    const handleSign = async () => {
        if (!systemStatus?.ready) {
            setError({
                title: "Système non prêt",
                message: systemStatus?.message || "Le système de signature n'est pas prêt",
                hint: "Veuillez vérifier les prérequis ci-dessous"
            });
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `http://${apiUrl}:3100/api/signatures/sign-only/${document._id}`,
                { userId: userInfo._id }
            );

            if (response.data.success) {
                setSigned(true);
                // Attendre un peu pour que le serveur finisse de traiter le document
                setTimeout(() => {
                    handleRefreshPreview();
                    if (onSignatureComplete) {
                        // Mettre à jour la liste des documents sans fermer la dialog
                        onSignatureComplete(false);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Erreur lors de la signature:', error);
            setError({
                title: error.response?.data?.message || "Erreur de signature",
                message: "Une erreur est survenue lors de la signature du document",
                hint: "Veuillez réessayer ou vérifier l'état du système"
            });
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
            setError({
                title: "Erreur lors du téléchargement",
                message: "Impossible de télécharger le document"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (onClose) {
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
                setStatusCheckInterval(null);
            }
            setSigned(false);
            setError(null);
            onClose();
        }
    };

    const renderSignersList = () => {
        if (!document?.signers || document.signers.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary">
                    Aucun signataire sélectionné
                </Typography>
            );
        }

        return (
            <List>
                {document.signers.map((signer, index) => (
                    <React.Fragment key={signer._id || index}>
                        {index > 0 && <Divider />}
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon color={signer.signed ? "success" : "action"} />
                            </ListItemIcon>
                            <ListItemText
                                primary={signer.userId?.userName || signer.userId?.userLogin || "Utilisateur inconnu"}
                                secondary={signer.signed ?
                                    `Signé le ${new Date(signer.signedDate).toLocaleDateString()}` :
                                    "En attente de signature"}
                            />
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
        );
    };

    const renderSystemStatus = () => {
        if (checkingSystem) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                    <CircularProgress size={20} />
                    <Typography>Vérification du système de signature...</Typography>
                </Box>
            );
        }

        return (
            <Card variant="outlined" sx={{ my: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        État du système de signature
                    </Typography>

                    {systemStatus?.details?.map((detail, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {detail.includes('✅') ? (
                                <CheckCircleIcon color="success" />
                            ) : detail.includes('❌') ? (
                                <ErrorIcon color="error" />
                            ) : (
                                <WarningIcon color="warning" />
                            )}
                            <Typography>
                                {detail.replace(/[✅❌⚠️]/g, '')}
                            </Typography>
                        </Box>
                    ))}

                    {systemStatus?.issues?.length > 0 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Action(s) requise(s)</AlertTitle>
                            {systemStatus.issues.map((issue, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography>{issue.message}</Typography>
                                    {issue.type === 'middleware' && (
                                        <Box sx={{ mt: 1 }}>
                                            <Link
                                                href="https://eid.belgium.be"
                                                target="_blank"
                                                rel="noopener"
                                            >
                                                Télécharger le middleware eID
                                            </Link>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Alert>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="full"
            fullWidth
        >
            <DialogTitle>
                Signature du document : {document?.filename}
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <AlertTitle>{error.title}</AlertTitle>
                        <Typography>{error.message}</Typography>
                        {error.hint && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {error.hint}
                            </Typography>
                        )}
                    </Alert>
                )}

                {signed && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <AlertTitle>Succès</AlertTitle>
                        Document signé avec succès !
                    </Alert>
                )}

                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Signataires
                        </Typography>
                        {renderSignersList()}
                    </CardContent>
                </Card>

                {renderSystemStatus()}

                <Box sx={{ height: '500px', width: '100%', mb: 2 }}>
                    <iframe
                        key={previewKey}
                        src={`http://${apiUrl}:3100/api/signatures/preview/${document?._id}?t=${previewKey}`}
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
                <Button onClick={handleClose} color="inherit">
                    Fermer
                </Button>
                <Button onClick={handleRefreshPreview} color="info">
                    Rafraîchir
                </Button>
                <Button onClick={handleDownload}>
                    Télécharger
                </Button>
                {!signed && !hasUserSigned && document?.status !== 'completed' && (
                    <Button
                        onClick={handleSign}
                        variant="contained"
                        color="primary"
                        disabled={loading || !systemStatus?.ready}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Signer avec eID'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SignaturePreviewDialog;