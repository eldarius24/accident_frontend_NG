import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Chip,
    Box,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    Tooltip,
    InputLabel
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import config from '../config.json';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { useUserConnected } from '../Hook/userConnected';
import { useNavigate } from 'react-router-dom';
import '../pageFormulaire/formulaire.css';
const Enterprise = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [enterprises, setEnterprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, isConseiller, userInfo } = useUserConnected(); // Ajout de isConseiller
    const apiUrl = config.apiUrl;

    const isConseillerPrevention = useCallback((entrepriseName) => {
        return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
    }, [userInfo]);

    const fetchEnterprises = useCallback(async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
            if (isAdmin) {
                setEnterprises(response.data);
            } else {
                // Modification du filtrage pour utiliser isConseillerPrevention
                const filteredEnterprises = response.data.filter(enterprise =>
                    isConseiller && isConseillerPrevention(enterprise.AddEntreName)
                );
                setEnterprises(filteredEnterprises);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching enterprises:', error);
            setLoading(false);
        }
    }, [apiUrl, isAdmin, isConseiller, isConseillerPrevention]);

    const handleStartQuestionnaire = (enterprise) => {
        navigate('/quesEntrep', {
            state: { enterprise }  // On passe l'entreprise sélectionnée à la page du questionnaire
        });
    };

    useEffect(() => {
        fetchEnterprises();
    }, [fetchEnterprises]);

    const getCardStyle = useCallback(() => ({
        height: '100%',
        backgroundColor: darkMode ? '#2a2a2a' : '#fff',
        color: darkMode ? '#fff' : 'inherit',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }
    }), [darkMode]);

    const IconWrapper = ({ icon: Icon, text }) => (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Icon fontSize="small" sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#fff' : 'text.secondary' }}>
                {text}
            </Typography>
        </Box>
    );

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                sx={{ color: darkMode ? '#fff' : 'inherit' }}
            >
                Liste des Entreprises
            </Typography>
            <Grid container spacing={3}>
                {enterprises.map((enterprise, index) => (
                    <Grid item xs={12} md={6} lg={4} key={enterprise._id || index}>
                        <Card sx={getCardStyle()}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                    >
                                        {enterprise.AddEntreName}
                                    </Typography>
                                    <Chip
                                        label="Active"
                                        color="success"
                                        size="small"
                                        sx={{
                                            backgroundColor: darkMode ? '#1b5e20' : '#c8e6c9',
                                            color: darkMode ? '#fff' : 'inherit'
                                        }}
                                    />
                                </Box>

                                {/* Contact Information */}
                                <IconWrapper
                                    icon={LocationOnIcon}
                                    text={`${enterprise.AddEntrRue}, ${enterprise.AddEntrCodpost} ${enterprise.AddEntrLocalite}`}
                                />
                                <IconWrapper
                                    icon={PhoneIcon}
                                    text={enterprise.AddEntrTel}
                                />
                                <IconWrapper
                                    icon={EmailIcon}
                                    text={enterprise.AddEntrEmail}
                                />

                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#555' : '#ddd' }} />

                                {/* Business Information */}
                                <IconWrapper
                                    icon={BusinessIcon}
                                    text={`N° Entreprise: ${enterprise.AddEntrNumentr}`}
                                />
                                <IconWrapper
                                    icon={AccountBalanceIcon}
                                    text={`IBAN: ${enterprise.AddEntrIban}`}
                                />
                                <IconWrapper
                                    icon={WorkIcon}
                                    text={`Activité: ${enterprise.AddEntreActiventre}`}
                                />

                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#555' : '#ddd' }} />

                                {/* Social Secretary */}
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <GroupIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                    >
                                        Secrétariat Social
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 3, mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: darkMode ? '#fff' : 'text.secondary' }}
                                    >
                                        {enterprise.AddEntrSecsoci}
                                        <br />
                                        N° Affiliation: {enterprise.AddEntrNumaffi}
                                        <br />
                                        {enterprise.AddEntrScadresse}, {enterprise.AddEntrSccpost} {enterprise.AddEntrSclocalite}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#555' : '#ddd' }} />

                                {/* Legal Information */}
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SecurityIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                    >
                                        Informations Légales
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 3 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: darkMode ? '#fff' : 'text.secondary' }}
                                    >
                                        Police N°: {enterprise.AddEntrePolice}
                                        <br />
                                        ONSS: {enterprise.AddEntrOnss}
                                        <br />
                                        Unité: {enterprise.AddEntrEnite}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<AssignmentIcon />}
                                    onClick={() => handleStartQuestionnaire(enterprise)}
                                    sx={{
                                        backgroundColor: darkMode ? '#90caf9' : '#1976d2',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#5f9bd1' : '#115293',
                                        }
                                    }}
                                >
                                    Questionnaire
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </Box>

    );

};

export default Enterprise;