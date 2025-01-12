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
import { useLogger } from '../Hook/useLogger';
import SignatureClient from './SignatureClient';

const SignaturePreviewDialog = ({
    open,
    onClose,
    document: signatureDoc,
    apiUrl,
    userInfo,
    onSignatureComplete
}) => {
    const { logAction } = useLogger();
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



    const isUserAuthorizedToSign = useMemo(() => {
        if (!signatureDoc?.signers || !userInfo?._id) return false;

        return signatureDoc.signers.some(signer => {
            // Vérifier toutes les formes possibles de l'ID utilisateur
            const signerId = typeof signer.userId === 'object'
                ? signer.userId._id?.toString()
                : signer.userId?.toString();
            const currentUserId = userInfo._id.toString();

            return signerId === currentUserId;
        });
    }, [signatureDoc, userInfo]);

    const hasUserSigned = useMemo(() => {
        if (!signatureDoc?.signers || !userInfo?._id) return false;

        const userSigner = signatureDoc.signers.find(signer => {
            const signerId = typeof signer.userId === 'object'
                ? signer.userId._id?.toString()
                : signer.userId?.toString();
            const currentUserId = userInfo._id.toString();

            return signerId === currentUserId;
        });

        return userSigner?.signed || false;
    }, [signatureDoc, userInfo]);

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
    
        // Initialiser le client de signature
        const client = new SignatureClient();
        client.initialize().then(() => {
            setSignatureClient(client);
            
            // Écouter les changements d'état
            client.on('status', (status) => {
                setSystemStatus(status);
                setCheckingSystem(false);
            });
    
            // Démarrer le monitoring
            client.startMonitoring();
        });
    
        // Cleanup
        return () => {
            if (signatureClient) {
                signatureClient.stopMonitoring();
                signatureClient.cleanup();
            }
        };
    }, [open]);

    const handleSign = async () => {
        if (!signatureDoc?._id) {
            setError({
                title: "Erreur de signature",
                message: "Document non trouvé"
            });
            return;
        }
    
        try {
            setLoading(true);
            setError(null);
    
            // Récupérer le PDF
            const pdfResponse = await axios.get(
                `http://${apiUrl}:3100/api/signatures/preview/${signatureDoc._id}`,
                { responseType: 'arraybuffer' }
            );
            const pdfBuffer = Buffer.from(pdfResponse.data);
    
            // Signer avec la carte eID
            const signatureResult = await signatureClient.signData(pdfBuffer);
    
            // Envoyer le document signé au serveur
            const response = await axios.post(
                `http://${apiUrl}:3100/api/signatures/sign-only/${signatureDoc._id}`,
                {
                    userId: userInfo._id,
                    signature: signatureResult.signature.toString('base64'),
                    certificate: signatureResult.certificate.toString('base64')
                }
            );
    
            if (response.data.success) {
                setSigned(true);
                setTimeout(() => {
                    handleRefreshPreview();
                    if (onSignatureComplete) {
                        onSignatureComplete(false);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Erreur lors de la signature:', error);
            setError({
                title: "Erreur de signature",
                message: error.message || "Une erreur est survenue lors de la signature",
                hint: "Vérifiez que votre carte eID est bien insérée"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!signatureDoc?._id) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `http://${apiUrl}:3100/api/signatures/download/${signatureDoc._id}`,
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/pdf'
                    }
                }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement('a');
            link.href = url;
            const filename = signatureDoc.filename.toLowerCase().endsWith('.pdf')
                ? signatureDoc.filename
                : `${signatureDoc.filename}.pdf`;
            link.setAttribute('download', filename);
            window.document.body.appendChild(link);
            link.click();
            await logAction({
                actionType: 'export',
                details: `Document a signé téléchargé : ${filename}`,
                entity: 'Signature',
                entityId: signatureDoc._id,
                entreprise: userInfo?.entreprise || 'N/A'
            });
            setTimeout(() => {
                window.document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            setError({
                title: "Erreur lors du téléchargement",
                message: error.response?.data?.message || "Impossible de télécharger le document",
                hint: "Veuillez réessayer ultérieurement"
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
                Signature du document : {signatureDoc?.filename}
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
                        src={`http://${apiUrl}:3100/api/signatures/preview/${signatureDoc?._id}?t=${previewKey}`}
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