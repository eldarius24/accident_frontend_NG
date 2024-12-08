import React, { useState, useEffect } from 'react';
import { Chip, TextField, Button, Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import TextFieldP from '../_composants/textFieldP';
import { useTheme } from '../Hook/ThemeContext';

const EmailNotificationManager = ({ vehicleId }) => {
    const [inputValue, setInputValue] = useState('');

    const { darkMode } = useTheme();
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const apiUrl = config.apiUrl;
    const handleEmailChange = (value) => {
        setInputValue(value);
    };


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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!inputValue) {
            return;
        }

        if (!emailRegex.test(inputValue)) {
            return;
        }

        if (emails.includes(inputValue)) {
            return;
        }

        try {
            const updatedEmails = [...emails, inputValue];
            // Appel API pour sauvegarder
            await axios.post(`http://${apiUrl}:3100/api/vehicles/${vehicleId}/notifications`, {
                emails: updatedEmails
            });

            // Mettre à jour l'état local uniquement après succès de l'API
            setEmails(updatedEmails);
            setInputValue('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'email:', error);
            // Ajouter gestion d'erreur UI si nécessaire
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
                width: '100%'
            }}>
                {emails.map((email, index) => (
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