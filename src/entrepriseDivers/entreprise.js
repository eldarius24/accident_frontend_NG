import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Card, CardContent, Typography, Grid, LinearProgress,
    Chip, Box, Divider, Button, Select, MenuItem,
    FormControl, Tooltip, InputLabel, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
    const { isAdmin, isConseiller, userInfo } = useUserConnected();
    const apiUrl = config.apiUrl;
    const [questionnaires, setQuestionnaires] = useState({});
    const [filteredEnterprises, setFilteredEnterprises] = useState([]);
    const [selectedEnterprises, setSelectedEnterprises] = useState([]);
    
    const isConseillerPrevention = useCallback((entrepriseName) => {
        return userInfo?.entreprisesConseillerPrevention?.includes(entrepriseName) || false;
    }, [userInfo]);

    const fetchEnterprises = useCallback(async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
            const filteredData = isAdmin
                ? response.data
                : response.data.filter(enterprise => isConseiller && isConseillerPrevention(enterprise.AddEntreName));
            setEnterprises(filteredData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching enterprises:', error);
            setLoading(false);
        }
    }, [apiUrl, isAdmin, isConseiller, isConseillerPrevention]);

    const fetchQuestionnaires = useCallback(async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/questionnaires`);
            const questionnairesByEnterprise = response.data.reduce((acc, q) => {
                if (!acc[q.entrepriseId]) {
                    acc[q.entrepriseId] = [];
                }
                acc[q.entrepriseId].push(q);
                return acc;
            }, {});
            setQuestionnaires(questionnairesByEnterprise);
        } catch (error) {
            console.error('Error fetching questionnaires:', error);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchEnterprises();
        fetchQuestionnaires();
    }, [fetchEnterprises, fetchQuestionnaires]);


    useEffect(() => {
        const initializeEnterprises = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
                const data = response.data;
                let enterprisesData;
    
                if (isAdmin) {
                    enterprisesData = data;
                } else {
                    enterprisesData = data.filter(enterprise =>
                        isConseiller && isConseillerPrevention(enterprise.AddEntreName)
                    );
                }
    
                setEnterprises(enterprisesData);
                setFilteredEnterprises(selectedEnterprises.length > 0 
                    ? enterprisesData.filter(e => selectedEnterprises.includes(e.AddEntreName))
                    : enterprisesData
                );
            } catch (error) {
                console.error('Error fetching enterprises:', error);
            } finally {
                setLoading(false);
            }
        };
    
        initializeEnterprises();
    }, [apiUrl, isAdmin, isConseiller, isConseillerPrevention, selectedEnterprises]);


    const handleDeleteQuestionnaire = async (questionnaireId, enterpriseId) => {
        try {
            await axios.delete(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`);
            setQuestionnaires((prev) => ({
                ...prev,
                [enterpriseId]: prev[enterpriseId].filter((q) => q._id !== questionnaireId),
            }));
        } catch (error) {
            console.error('Error deleting questionnaire:', error);
        }
    };


    const handleStartQuestionnaire = (enterprise) => {
        navigate('/quesEntrep', {
            state: { enterprise }
        });
    };

    const handleFilterChange = (event) => {
        const selectedValues = event.target.value;
        setSelectedEnterprises(selectedValues);
    };
    

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

    const clearFilter = () => {
        setSelectedEnterprises([]);
    };

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

            {isAdmin && (
                <Box sx={{ mb: 3, width: '100%', maxWidth: 500, mx: 'auto' }}>
                    <FormControl fullWidth>
                        <InputLabel>Filtrer les entreprises</InputLabel>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <Select
                                fullWidth
                                multiple
                                value={selectedEnterprises}
                                onChange={handleFilterChange}
                                renderValue={(selected) => selected.join(', ')}
                                style={{ minHeight: '48px' }}
                            >
                                {enterprises.sort((a, b) =>
                                    a.AddEntreName.localeCompare(b.AddEntreName)
                                ).map((enterprise) => (
                                    <MenuItem key={enterprise._id} value={enterprise.AddEntreName}>
                                        {enterprise.AddEntreName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {selectedEnterprises.length > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={clearFilter}
                                    sx={{
                                        minWidth: '120px',
                                        height: '48px',
                                        backgroundColor: darkMode ? '#2a2a2a' : '#fff',
                                        color: darkMode ? '#fff' : '#000',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#3a3a3a' : '#f5f5f5',
                                        }
                                    }}
                                >
                                    Effacer le filtre
                                </Button>
                            )}
                        </Box>
                    </FormControl>
                </Box>
            )}
            <Grid container spacing={3}>
                {filteredEnterprises.map((enterprise, index) => (
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

                                <Divider sx={{ my: 2, backgroundColor: darkMode ? '#555' : '#ddd' }} />

                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssignmentIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: darkMode ? '#fff' : 'inherit' }}
                                    >
                                        Questionnaires
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 3 }}>
                                    {questionnaires[enterprise._id]?.map((q) => (
                                        <Box key={q._id} display="flex" alignItems="center" gap={1} mb={1}>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: darkMode ? '#fff' : 'text.secondary' }}
                                            >
                                                Type: {q.typeFichier} | Années: {q.annees.join(', ')}
                                            </Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteQuestionnaire(q._id, enterprise._id)}
                                                sx={{ ml: 'auto' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    {(!questionnaires[enterprise._id] || questionnaires[enterprise._id].length === 0) && (
                                        <Typography variant="body2" sx={{ color: darkMode ? '#fff' : 'text.secondary' }}>
                                            Aucun questionnaire
                                        </Typography>
                                    )}
                                </Box>
                                
                                <Button
                                    variant="contained"
                                    startIcon={<AssignmentIcon />}
                                    onClick={() => handleStartQuestionnaire(enterprise)}
                                    sx={{
                                        mt: 2,
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
                <h5 style={{ marginBottom: '40px' }}>
                    Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be
                </h5>
            </Tooltip>
        </Box>
    );
};

export default Enterprise;