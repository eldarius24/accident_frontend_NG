import React, { useState, useEffect } from 'react';
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
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { useUserConnected } from '../Hook/userConnected.js';

const SignaturePreviewDialog = ({
    open,
    onClose,
    document: signatureDoc,
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
    const { isConseiller, isAdminOrDev, isAdminOrDevOrConseiller, isDeveloppeur } = useUserConnected();

    const checkEIDSystem = async () => {
        try {
            if (isDeveloppeur) {
                console.log('Vérification sur l\'ordinateur client :', {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                });
            }


            // Utilisation de la librairie Belgium e-ID
            if (typeof eID === 'undefined') {
                if (isDeveloppeur) {
                    console.log('Tentative de chargement de eID...');
                }
                // Attendez que l'API soit chargée
                await new Promise((resolve) => {
                    if (document.querySelector('script[src*="eid.js"]')) {
                        resolve();
                    } else {
                        const script = document.createElement('script');
                        // Utiliser l'URL correcte du script eID
                        script.src = 'https://eid.belgium.be/js/eid.js';
                        script.onload = resolve;
                        script.onerror = () => {
                            if (isDeveloppeur) {
                                console.log('Erreur de chargement du script eID, tentative avec URL alternative...');
                            }
                            // En cas d'erreur, essayer une URL alternative
                            script.src = 'https://beidpkcs11.belgium.be/js/beid.js';
                            script.onload = resolve;
                        };
                        document.head.appendChild(script);
                    }
                });
            }

            // Vérification de la présence du middleware et du lecteur
            let hasReader = false;
            let hasCard = false;

            try {
                // La présence de navigator.smartcard indique que le middleware est installé
                if (navigator.smartcard || window.navigator.smartcard) {
                    if (isDeveloppeur) {
                        console.log('Middleware détecté via navigator.smartcard');
                    }

                    // Tenter de détecter le lecteur et la carte
                    const readers = await new Promise((resolve) => {
                        if (navigator.smartcard) {
                            navigator.smartcard.getReaders().then(resolve);
                        } else if (window.navigator.smartcard) {
                            window.navigator.smartcard.getReaders().then(resolve);
                        } else {
                            resolve([]);
                        }
                    });
                    hasReader = readers.length > 0;
                    if (hasReader) {
                        // Vérifier si une carte est présente
                        for (const reader of readers) {
                            if (reader.card) {
                                hasCard = true;
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('Erreur lors de la détection smartcard:', error);
            }
            const details = [
                '✅ Middleware eID détecté', // On suppose que si le script est chargé, le middleware est présent
                hasReader ? '✅ Lecteur de carte détecté' : '❌ Lecteur de carte non détecté',
                hasCard ? '✅ Carte eID détectée' : '❌ Carte eID non détectée'
            ];
            const issues = [];
            if (!hasReader) {
                issues.push({
                    type: 'reader',
                    message: 'Veuillez connecter un lecteur de carte'
                });
            } else if (!hasCard) {
                issues.push({
                    type: 'card',
                    message: 'Veuillez insérer votre carte eID'
                });
            }
            setSystemStatus({
                success: hasReader && hasCard,
                ready: hasReader && hasCard,
                details,
                issues
            });
        } catch (error) {
            console.error('Erreur vérification système:', error);
            setSystemStatus({
                success: false,
                ready: false,
                details: ['❌ Service de signature non disponible'],
                issues: [{
                    type: 'system',
                    message: 'Le service de signature n\'est pas accessible',
                    detail: error.message
                }]
            });
        } finally {
            setCheckingSystem(false);
        }
    };

    useEffect(() => {
        let intervalId;
        if (open) {
            checkEIDSystem();
            intervalId = setInterval(checkEIDSystem, 2000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [open]);

    const handleClose = () => {
        setError(null);
        setSigned(false);
        setSystemStatus(null);
        setCheckingSystem(true);
        if (onClose) {
            onClose();
        }
    };

    const handleRefreshPreview = () => {
        setPreviewKey(Date.now());
    };

    const handleSign = async () => {
        if (!signatureDoc?._id || !userInfo?._id) {
            setError({
                title: "Erreur de signature",
                message: "Document ou utilisateur non trouvé"
            });
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // 1. Vérifier le système eID
            const beIDStatus = await window.beID?.getStatus();
            if (!beIDStatus?.card || !beIDStatus?.reader) {
                throw new Error("Le système eID n'est pas prêt. Vérifiez votre lecteur et votre carte.");
            }
            // 2. Récupérer le PDF
            const pdfResponse = await axios.get(
                `http://${apiUrl}:3100/api/signatures/preview/${signatureDoc._id}`,
                { responseType: 'arraybuffer' }
            );
            // 3. Créer un hash du document
            const hashBuffer = await crypto.subtle.digest('SHA-256', pdfResponse.data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            // 4. Signer avec eID
            const signatureResult = await window.beID.sign({
                algorithm: 'SHA256withRSA',
                data: hashHex
            });
            // 5. Envoyer au serveur
            const signResponse = await axios.post(
                `http://${apiUrl}:3100/api/signatures/sign/${signatureDoc._id}`,
                {
                    userId: userInfo._id,
                    signature: signatureResult.signature,
                    certificate: signatureResult.certificate,
                    userName: userInfo.userName
                },
                { responseType: 'blob' } // Important pour recevoir le PDF signé
            );
            // 6. Traiter la réponse
            const contentType = signResponse.headers['content-type'];
            if (contentType.includes('application/json')) {
                // En cas d'erreur retournée en JSON
                const text = await new Response(signResponse.data).text();
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || 'Erreur lors de la signature');
            }

            // 7. Succès
            setSigned(true);
            handleRefreshPreview();

            // 8. Télécharger le PDF signé
            const blob = new Blob([signResponse.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${signatureDoc.filename}_signé.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            if (onSignatureComplete) {
                onSignatureComplete(false);
            }

        } catch (error) {
            console.error('Erreur lors de la signature:', error);
            setError({
                title: "Erreur de signature",
                message: error.message || "Une erreur est survenue lors de la signature",
                hint: error.message.includes('eID') ?
                    "Vérifiez que votre carte eID est bien insérée et que le middleware est installé" :
                    "Une erreur technique est survenue"
            });
        } finally {
            setLoading(false);
        }
    };

    // Les fonctions renderSystemStatus et renderSignersList restent identiques...
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
                                            <a
                                                href="https://eid.belgium.be"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Télécharger le middleware eID
                                            </a>
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

    const renderSignersList = () => {
        if (!signatureDoc?.signers || signatureDoc.signers.length === 0) {
            return (
                <Typography variant="body2" color="text.secondary">
                    Aucun signataire sélectionné
                </Typography>
            );
        }

        return (
            <List>
                {signatureDoc.signers.map((signer, index) => (
                    <ListItem key={signer._id || index}>
                        <ListItemIcon>
                            <PersonIcon color={signer.signed ? "success" : "action"} />
                        </ListItemIcon>
                        <ListItemText
                            primary={signer.userId?.userName || "Utilisateur inconnu"}
                            secondary={signer.signed ?
                                `Signé le ${new Date(signer.signedDate).toLocaleDateString()}` :
                                "En attente de signature"
                            }
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
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

                <Box sx={{ height: '600px', width: '100%', mb: 2 }}>
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
                <Button
                    onClick={handleRefreshPreview}
                    color="info"
                    disabled={loading}
                >
                    Rafraîchir
                </Button>
                {!signed && systemStatus?.ready && (
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