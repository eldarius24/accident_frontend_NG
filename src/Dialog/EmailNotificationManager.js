import React, { useState, useEffect } from 'react';
import { Chip, TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import config from '../config.json';

const EmailNotificationManager = ({ vehicleId }) => {
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const apiUrl = config.apiUrl;

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`);
                setEmails(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des emails:', error);
            }
        };
        fetchEmails();
    }, [vehicleId, apiUrl]);

    const handleAddEmail = async () => {
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
            setError('Email invalide');
            return;
        }

        try {
            await axios.post(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`, {
                emails: [...emails, newEmail]
            });
            setEmails([...emails, newEmail]);
            setNewEmail('');
            setError('');
        } catch (error) {
            setError('Erreur lors de l\'ajout de l\'email');
        }
    };

    const handleDeleteEmail = async (emailToDelete) => {
        try {
            const updatedEmails = emails.filter(email => email !== emailToDelete);
            await axios.post(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`, {
                emails: updatedEmails
            });
            setEmails(updatedEmails);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'email:', error);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Notifications par email</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ces adresses recevront une notification 15 jours avant le contrôle technique
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    size="small"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    error={!!error}
                    helperText={error}
                    placeholder="Ajouter un email"
                    fullWidth
                />
                <Button 
                    variant="contained" 
                    onClick={handleAddEmail}
                    sx={{ minWidth: '120px' }}
                >
                    Ajouter
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {emails.map((email, index) => (
                    <Chip
                        key={index}
                        label={email}
                        onDelete={() => handleDeleteEmail(email)}
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Box>
        </Box>
    );
};

export default EmailNotificationManager;