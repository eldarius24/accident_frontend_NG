import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { useUserConnected } from '../Hook/userConnected'; // Import correct
import { useLogger } from '../Hook/useLogger'; // Import du logger
import axios from 'axios';
import config from '../config.json';

const MessSupport = () => {
    const { darkMode } = useTheme();
    const apiUrl = config.apiUrl;
    const { userInfo, isAuthenticated } = useUserConnected(); // Utilisation correcte du hook
    const { logAction } = useLogger(); // Utilisation du logger
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

    // Style pour les composants en fonction du mode sombre/clair
    const cardStyle = {
        backgroundColor: darkMode ? '#424242' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        marginBottom: 2,
        '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out'
        }
    };

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

    // Récupération des messages

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

            console.log('Début de la mise à jour du statut:', {
                messageId: selectedMessage._id,
                newStatus: selectedStatus,
                userInfo
            });

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
                Messages de Support
            </Typography>
            {messages.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
                Aucun message de support à afficher
            </Alert>
        ) : (
            <Grid container spacing={3}>
                {messages.map((message) => (
                    <Grid item xs={12} md={6} lg={4} key={message._id}>
                        <Card sx={cardStyle}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" component="div">
                                        {message.subject}
                                    </Typography>
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
        </Box>
    );
};

export default MessSupport;