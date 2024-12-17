import React, { useState, useEffect } from 'react';
import { Chip, TextField, Button, Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import TextFieldP from '../_composants/textFieldP';
import { useTheme } from '../Hook/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';

const EmailNotificationManager = ({ vehicleId }) => {
    const { isDeveloppeur } = useUserConnected();
    const [inputValue, setInputValue] = useState('');
    const { darkMode } = useTheme();
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const apiUrl = config.apiUrl;

    const handleEmailChange = (value) => {
        setInputValue(value);
    };

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                setLoading(true);
                if (isDeveloppeur) {
                    console.log('Fetching emails for vehicleId:', vehicleId);
                }
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`);
                if (isDeveloppeur) {
                    console.log('API Response:', response.data);
                }

                // Vérifier la structure de la réponse et extraire le tableau d'emails
                const emailsData = response.data?.emails || [];
                if (isDeveloppeur) {
                    console.log('Extracted emails data:', emailsData);
                }

                setEmails(Array.isArray(emailsData) ? emailsData : []);
                setError('');
            } catch (error) {
                console.error('Erreur lors du chargement des emails:', error);
                if (isDeveloppeur) {
                    console.log('Error response:', error.response?.data);
                }
                setError('Erreur lors du chargement des emails');
            } finally {
                setLoading(false);
            }
        };

        if (vehicleId) {
            if (isDeveloppeur) {
                console.log('VehicleId changed, fetching emails...');
            }
            fetchEmails();
        }
    }, [vehicleId, apiUrl]);

    const handleAddEmail = async () => {
        if (isDeveloppeur) {
            console.log('Adding email:', inputValue);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!inputValue) {
            if (isDeveloppeur) {
                console.log('Empty input value');
            }
            setError('Veuillez entrer une adresse email');
            return;
        }

        if (!emailRegex.test(inputValue)) {
            if (isDeveloppeur) {
                console.log('Invalid email format');
            }
            setError('Format d\'email invalide');
            return;
        }

        if (emails.includes(inputValue)) {
            if (isDeveloppeur) {
                console.log('Email already exists');
            }
            setError('Cet email existe déjà');
            return;
        }

        try {
            const updatedEmails = [...emails, inputValue];
            if (isDeveloppeur) {
                console.log('Sending updated emails to API:', updatedEmails);
            }

            const response = await axios.post(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`, {
                emails: updatedEmails
            });
            if (isDeveloppeur) {
                console.log('API Response for add:', response.data);
            }

            if (response.data.success) {
                setEmails(updatedEmails);
                setInputValue('');
                setError('');
                console.log('Email added successfully');
            } else {
                if (isDeveloppeur) {
                    console.log('API returned error:', response.data.message);
                }
                setError(response.data.message || 'Erreur lors de l\'ajout de l\'email');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'email:', error);
            if (isDeveloppeur) {
                console.log('Error response:', error.response?.data);
            }
            setError(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'email');
        }
    };

    const handleDeleteEmail = async (emailToDelete) => {
        if (isDeveloppeur) {
            console.log('Deleting email:', emailToDelete);
        }
        try {
            const updatedEmails = emails.filter(email => email !== emailToDelete);
            if (isDeveloppeur) {
                console.log('Updated emails after deletion:', updatedEmails);
            }

            const response = await axios.post(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`, {
                emails: updatedEmails
            });
            if (isDeveloppeur) {
                console.log('API Response for delete:', response.data);
            }

            if (response.data.success) {
                setEmails(updatedEmails);
                setError('');
                if (isDeveloppeur) {
                    console.log('Email deleted successfully');
                }
            } else {
                if (isDeveloppeur) {
                    console.log('API returned error:', response.data.message);
                }
                setError(response.data.message || 'Erreur lors de la suppression de l\'email');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'email:', error);
            if (isDeveloppeur) {
                console.log('Error response:', error.response?.data);
            }
            setError(error.response?.data?.message || 'Erreur lors de la suppression de l\'email');
        }
    };
    if (isDeveloppeur) {
        console.log('Current emails state:', emails);
        console.log('Is emails an array?', Array.isArray(emails));
    }

    if (loading) {
        if (isDeveloppeur) {
            console.log('Component is loading');
        }
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography>Chargement des notifications...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6"
                sx={{
                    textAlign: 'center',
                    color: darkMode ? '#fff' : 'black',
                }}>
                Notifications par email
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center',
                color: darkMode ? '#fff' : 'black',
            }}>
                Ces adresses recevront une notification 15 jours & 1 jour avant le contrôle technique ou un entretien
            </Typography>

            <Box >
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={11.99999} sx={{ justifyContent: 'center' }}>
                        <TextFieldP
                            value={inputValue}
                            onChange={handleEmailChange}
                            placeholder="Ajouter une adresse email"
                            fullWidth
                            variant="outlined"
                            error={!!error}
                            helperText={error}
                        />
                    </Grid>
                    <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                        <Button
                            variant="contained"
                            onClick={handleAddEmail}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee752d60',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.1s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                padding: '10px 20px',
                                marginRight: '1rem',
                                '& .MuiSvgIcon-root': {
                                    color: darkMode ? '#fff' : 'inherit'
                                }
                            }}
                        >
                            Ajouter
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center',
                width: '100%',
                mt: 2
            }}>
                {Array.isArray(emails) && emails.map((email, index) => (
                    <Chip
                        key={index}
                        label={email}
                        onDelete={() => handleDeleteEmail(email)}
                        sx={{
                            backgroundColor: darkMode ? '#17583648' : '#269c5b48',
                            color: darkMode ? '#ffffff' : 'black',
                            '& .MuiChip-deleteIcon': {
                                color: darkMode ? '#8f2922' : '#f44336',
                                '&:hover': {
                                    color: darkMode ? '#8f2922' : '#f44336',
                                }
                            },
                            '& .MuiChip-deleteIcon:hover': {
                                color: darkMode ? '#8f2922' : '#f44336',
                            }
                        }}
                        variant="outlined"
                    />
                ))}
            </Box>
        </Box>
    );
};

export default EmailNotificationManager;