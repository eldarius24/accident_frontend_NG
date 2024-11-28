import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../Hook/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import { useLogger } from '../Hook/useLogger';
import axios from 'axios';
import config from '../config.json';

const MessSupport = () => {
    const { darkMode } = useTheme();
    const apiUrl = config.apiUrl;
    const { userInfo, isAuthenticated } = useUserConnected();
    const { logAction } = useLogger();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const statusOptions = [
        { value: 'En attente', label: 'En attente' },
        { value: 'En cours', label: 'En cours' },
        { value: 'En test', label: 'En test' }
    ];

    const Legend = () => (
        <Box sx={{
            mb: 3,
            p: 2,
            borderRadius: 1,
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center'
        }}>
            <Typography variant="subtitle2" sx={{ mr: 2, color: darkMode ? '#ffffff' : '#000000' }}>Destinataire :</Typography>
            {[
                { type: 'dev', label: 'Développeurs', color: darkMode ? '#2c3e50' : '#aa90598a' },
                { type: 'admin', label: 'Administrateurs', color: darkMode ? '#433c51' : '#4aa3a28e' },
                { type: 'both', label: 'Développeurs & Administrateurs', color: darkMode ? '#424242' : '#55ac5c9c' }
            ].map(({ type, label, color }) => (
                <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: color,
                        border: '1px solid',
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 0.5
                    }} />
                    <Typography variant="body2">{label}</Typography>
                </Box>
            ))}
        </Box>
    );

    // Support type routing configuration
    const SUPPORT_TYPE_ROUTING = {
        'Bug': 'dev',
        'Améliorations de fonctionnalités': 'dev',
        'Connexion et accès': 'admin',
        'Autorisation et permissions': 'admin',
        'Mise à jour des informations de profil': 'admin',
        'Suppression de compte': 'admin',
        'Autre': 'both'
    };

    const getDestinationInfo = (typeSupport) => {
        const routingType = SUPPORT_TYPE_ROUTING[typeSupport];
        switch (routingType) {
            case 'dev':
                return {
                    label: 'Développeurs',
                    color: darkMode ? '#90caf9' : '#1976d2',  // Bleu plus clair en mode sombre
                    bgColor: darkMode ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.1)'
                };
            case 'admin':
                return {
                    label: 'Administrateurs',
                    color: darkMode ? '#ce93d8' : '#9c27b0',  // Violet plus clair en mode sombre
                    bgColor: darkMode ? 'rgba(206, 147, 216, 0.2)' : 'rgba(156, 39, 176, 0.1)'
                };
            case 'both':
                return {
                    label: 'Tous',
                    color: darkMode ? '#b0bec5' : '#78909c',  // Gris plus clair en mode sombre
                    bgColor: darkMode ? 'rgba(176, 190, 197, 0.2)' : 'rgba(120, 144, 156, 0.1)'
                };
            default:
                return {
                    label: 'Non défini',
                    color: darkMode ? '#bdbdbd' : '#9e9e9e',  // Gris neutre plus clair en mode sombre
                    bgColor: darkMode ? 'rgba(189, 189, 189, 0.2)' : 'rgba(158, 158, 158, 0.1)'
                };
        }
    };

    // Function to get card background color based on support type
    const getCardBackgroundColor = (typeSupport) => {
        const routingType = SUPPORT_TYPE_ROUTING[typeSupport];
        if (darkMode) {
            switch (routingType) {
                case 'dev':
                    return '#2c3e50'; // Dark blue for dev
                case 'admin':
                    return '#433c51'; // Dark purple for admin
                case 'both':
                    return '#424242'; // Default dark for both
                default:
                    return '#424242';
            }
        } else {
            switch (routingType) {
                case 'dev':
                    return '#aa90598a'; // Light blue for dev 
                case 'admin':
                    return '#4aa3a28e'; // Light purple for admin
                case 'both':
                    return '#55ac5c9c'; // Default white for both
                default:
                    return '#ffffff';
            }
        }
    };

    // Style pour les composants en fonction du mode sombre/clair
    const getCardStyle = (typeSupport) => ({
        backgroundColor: getCardBackgroundColor(typeSupport),
        color: darkMode ? '#ffffff' : '#000000',
        marginBottom: 2,
        transition: 'all 0.1s ease',
        '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out'
        }
    });

    const buttonStyle = {
        backgroundColor: darkMode ? '#535353' : '#ee752d60',
        color: darkMode ? '#ffffff' : '#000000',
        '&:hover': {
            backgroundColor: '#95ad22',
            transform: 'scale(1.05)',
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setError('Vous devez être connecté pour accéder à cette fonctionnalité');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/support/messages`);
                setMessages(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors de la récupération des messages');
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchMessages();
        }
    }, [apiUrl, isAuthenticated]);

    // Suppression d'un message
    const handleDelete = async () => {
        try {
            if (!isAuthenticated || !userInfo) {
                setError('Vous devez être connecté pour effectuer cette action');
                return;
            }

            await axios.delete(
                `http://${apiUrl}:3100/api/support/messages/${selectedMessage._id}`,
                {
                    data: {
                        userId: userInfo._id,
                        userName: userInfo.userName
                    }
                }
            );

            // Log de l'action
            await logAction({
                actionType: 'suppression',
                details: `Suppression du message de support - Sujet: "${selectedMessage.subject}" - 
                         Type: ${selectedMessage.typeSupport} - 
                         Envoyé par: ${selectedMessage.userName} (${selectedMessage.userEmail}) - 
                         Statut au moment de la suppression: ${selectedMessage.status}`,
                entity: 'support_message',
                entityId: selectedMessage._id
            });

            setMessages(messages.filter(msg => msg._id !== selectedMessage._id));
            setDeleteDialogOpen(false);
            setSelectedMessage(null);
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            setError('Erreur lors de la suppression du message');
        }
    };

    // Mise à jour du statut
    const handleStatusUpdate = async () => {
        try {
            if (!isAuthenticated || !userInfo) {
                setError('Vous devez être connecté pour effectuer cette action');
                return;
            }

            const response = await axios.put(
                `http://${apiUrl}:3100/api/support/messages/${selectedMessage._id}/status`,
                {
                    status: selectedStatus,
                    userId: userInfo._id,
                    userName: userInfo.userName
                }
            );

            if (response.data.success) {
                // Log de l'action
                await logAction({
                    actionType: 'modification',
                    details: `Modification du statut d'un message de support: ${selectedStatus}`,
                    entity: 'support_message',
                    entityId: selectedMessage._id
                });

                setMessages(messages.map(msg =>
                    msg._id === selectedMessage._id
                        ? { ...msg, status: selectedStatus }
                        : msg
                ));

                setStatusDialogOpen(false);
                setSelectedMessage(null);
            }
        } catch (err) {
            console.error('Erreur détaillée:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.message || err.message || 'Erreur lors de la mise à jour du statut');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'En attente':
                return '#ff9800';
            case 'En cours':
                return '#2196f3';
            case 'En test':
                return '#4caf50';
            default:
                return '#757575';
        }
    };

    const getStatusLabel = (status) => {
        return status || 'Inconnu';
    };

    if (loading) return <Typography>Chargement...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, color: darkMode ? '#ffffff' : '#000000' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        margin: '1.5rem 0',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '45px',
                            background: darkMode
                                ? 'rgba(122,142,28,0.1)'
                                : 'rgba(238,117,45,0.1)',
                            filter: 'blur(10px)',
                            borderRadius: '10px',
                            zIndex: 0
                        }
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                            fontWeight: 600,
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            position: 'relative',
                            padding: '0.5rem 1.5rem',
                            zIndex: 1,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
                            }
                        }}
                    >
                        Messages de Support
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '1px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
                            }
                        }}
                    />
                </Box>
            </Typography>
            <Legend />
            {messages.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2, color: darkMode ? '#ffffff' : '#000000' }}>
                    Aucun message de support à afficher
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {messages.map((message) => (
                        <Grid item xs={12} md={6} lg={4} key={message._id}>
                            <Card sx={getCardStyle(message.typeSupport)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" component="div">
                                            {message.subject}
                                        </Typography>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            ...getDestinationInfo(message.typeSupport),
                                            backgroundColor: getDestinationInfo(message.typeSupport).bgColor,
                                            color: getDestinationInfo(message.typeSupport).color,
                                            fontSize: '0.75rem',
                                            fontWeight: 'medium',
                                        }}>
                                            {getDestinationInfo(message.typeSupport).label}
                                        </Box>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedMessage(message);
                                                setDeleteDialogOpen(true);
                                            }}
                                            sx={{ color: darkMode ? '#ff1744' : '#d32f2f' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        De: {message.userName} ({message.userEmail})
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Type: {message.typeSupport}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {message.message}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                ...buttonStyle,
                                                backgroundColor: getStatusColor(message.status)
                                            }}
                                            onClick={() => {
                                                setSelectedMessage(message);
                                                setSelectedStatus(message.status);
                                                setStatusDialogOpen(true);
                                            }}
                                        >
                                            {getStatusLabel(message.status)}
                                        </Button>
                                        <Typography variant="caption">
                                            {new Date(message.timestamp).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    style: {
                        backgroundColor: darkMode ? '#424242' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                    }
                }}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <Typography>
                        Êtes-vous sûr de vouloir supprimer ce message ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={buttonStyle}>
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} sx={{ ...buttonStyle, backgroundColor: '#d32f2f' }}>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de modification du statut */}
            <Dialog
                open={statusDialogOpen}
                onClose={() => setStatusDialogOpen(false)}
                PaperProps={{
                    style: {
                        backgroundColor: darkMode ? '#424242' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                    }
                }}
            >
                <DialogTitle>Modifier le statut</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="status-select-label">Statut</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={selectedStatus}
                            label="Statut"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            sx={{
                                backgroundColor: darkMode ? '#535353' : '#ee752d60',
                                color: darkMode ? '#ffffff' : '#000000',
                            }}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)} sx={buttonStyle}>
                        Annuler
                    </Button>
                    <Button onClick={handleStatusUpdate} sx={buttonStyle}>
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="image-cortigroupe"></div>
                <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
                    <h5 style={{ marginBottom: '40px' }}> <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '1rem',
                            marginBottom: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '300%',
                                height: '100%',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                                animation: 'shine 3s infinite linear',
                                '@keyframes shine': {
                                    to: {
                                        transform: 'translateX(50%)'
                                    }
                                }
                            }
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                fontWeight: 500,
                                letterSpacing: '0.1em',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '50px',
                                background: darkMode
                                    ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                                    : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                                backdropFilter: 'blur(5px)',
                                border: darkMode
                                    ? '1px solid rgba(122,142,28,0.2)'
                                    : '1px solid rgba(238,117,45,0.2)',
                                color: darkMode ? '#ffffff' : '#2D3748',
                                boxShadow: darkMode
                                    ? '0 4px 6px rgba(0,0,0,0.1)'
                                    : '0 4px 6px rgba(238,117,45,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                position: 'relative',
                                transform: 'translateY(0)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: darkMode
                                        ? '0 6px 12px rgba(0,0,0,0.2)'
                                        : '0 6px 12px rgba(238,117,45,0.2)',
                                    '& .highlight': {
                                        color: darkMode ? '#7a8e1c' : '#ee752d'
                                    }
                                }
                            }}
                        >
                            <span>Développé par </span>
                            <span className="highlight" style={{
                                transition: 'color 0.3s ease',
                                fontWeight: 700
                            }}>
                                Remy
                            </span>
                            <span> & </span>
                            <span className="highlight" style={{
                                transition: 'color 0.3s ease',
                                fontWeight: 700
                            }}>
                                Benoit
                            </span>
                            <span> pour </span>
                            <span style={{
                                backgroundImage: darkMode
                                    ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                    : 'linear-gradient(45deg, #ee752d, #f4a261)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: 700
                            }}>
                                Le Cortigroupe
                            </span>
                            <span style={{
                                fontSize: '1.2em',
                                marginLeft: '4px',
                                backgroundImage: darkMode
                                    ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                    : 'linear-gradient(45deg, #ee752d, #f4a261)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                ®
                            </span>
                        </Typography>
                    </Box></h5>
                </Tooltip>
        </Box>
        
    );
};

export default MessSupport;