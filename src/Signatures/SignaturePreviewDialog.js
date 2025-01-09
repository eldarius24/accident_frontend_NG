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
import InfoIcon from '@mui/icons-material/Info';
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
    const { isAdmin,
            isAdminOuConseiller,
            isConseiller,
            isAdminOrDev,
            isAdminOrDevOrConseiller,
            isUserPreventionOrAdminOrConseiller,
            isVehicleAdminManager,
            isFleetManager,
            isDeveloppeur,
            isVehicleAdmin
        } = useUserConnected();

    useEffect(() => {
        checkSystem();
        if (document && document.signers) {
            if (isDeveloppeur) {
            console.log('Document:', document);
            console.log('Signers:', document.signers);
            }
        }
    }, [open, document]);

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
                if (onSignatureComplete) {
                    onSignatureComplete();
                }
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