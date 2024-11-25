import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Paper, Tooltip, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import SystemeArchivage from '../Archives/archivages';
import axios from 'axios';
import CustomSnackbar from '../_composants/CustomSnackbar'
import HelpIcon from '@mui/icons-material/Help';
import History from '@mui/icons-material/History';
import BulkArchiveManager from '../Archives/BulkArchiveManager';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
/**
 * Component React qui permet d'afficher le panel d'administration des droits
 * 
 * Ce component React permet d'afficher le panel d'administration des droits.
 * Il contient des boutons qui permettent de 
 * - Créer un nouvel utilisateur
 * - Consulter les utilisateurs
 * - Créer une nouvelle entreprise
 * - Consulter les entreprises
 * 
 * @returns Un component React qui affiche le panel d'administration des droits
 */
export default function AdminPanelSettingsaction() {
    const [archiveOuverte, setArchiveOuverte] = useState(false);
    const [users, setUsers] = useState([]);
    const { darkMode } = useTheme();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    // Fonction pour afficher les messages snackbar
    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    // Fonction pour fermer le snackbar
    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const refreshListAccidents = useCallback(() => {
        axios.get('http://localhost:3100/api/planaction')
            .then(response => {
                setUsers(response.data);
                showSnackbar('Liste actualisée', 'success');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                showSnackbar('Erreur lors de l\'actualisation', 'error');
            });
    }, [showSnackbar]);

    useEffect(() => {
        refreshListAccidents();
    }, []);

    const defaultStyle = {
        margin: '10px', backgroundColor: '#0098f9', '&:hover': { backgroundColor: '#95ad22' },
        fontSize: '1rem', // Taille de police de base
        // Utilisation de Media Queries pour ajuster la taille de police
        '@media (min-width: 750px)': {
            fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
        },
        '@media (max-width: 550px)': {
            fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
        },
        padding: '15px 60px',
    };

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

    return (
        <div style={{ margin: '0 20px' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2rem 0',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '4px',
                    background: darkMode
                        ? 'linear-gradient(90deg, rgba(122,142,28,0.2) 0%, rgba(122,142,28,1) 50%, rgba(122,142,28,0.2) 100%)'
                        : 'linear-gradient(90deg, rgba(238,117,45,0.2) 0%, rgba(238,117,45,1) 50%, rgba(238,117,45,0.2) 100%)',
                    borderRadius: '2px'
                }
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#2D3748',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textAlign: 'center',
                        textShadow: darkMode
                            ? '2px 2px 4px rgba(0,0,0,0.3)'
                            : '2px 2px 4px rgba(0,0,0,0.1)',
                        '&::first-letter': {
                            color: darkMode ? '#7a8e1c' : '#ee752d',
                            fontSize: '120%'
                        },
                        position: 'relative',
                        padding: '0 20px'
                    }}
                >
                    Administration
                </Typography>
            </Box>
            <Paper
                elevation={3}
                sx={{
                    border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                    borderRadius: '8px',
                    padding: '20px',
                    margin: '20px 0',
                    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                    '&:hover': {
                        boxShadow: darkMode
                            ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                            : '0 8px 16px rgba(238, 116, 45, 0.2)'
                    }
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#2e2e2e' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Administration des droits</h3>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginLeft: '120px',
                        marginRight: '120px',
                        gap: '20px' // Ajoute un espacement entre les boutons
                    }}>
                        <Tooltip title="Cliquez ici Créer un nouvel utilisateur" arrow>
                            <Button
                                type="submit"
                                component={Link}
                                to={'/addUser'}
                                sx={{
                                    ...defaultStyle,
                                    color: darkMode ? '#ffffff' : 'black',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                            >
                                <AddIcon />
                                Créer un nouvel utilisateur
                            </Button>
                        </Tooltip>
                        <Tooltip title="Cliquez ici afficher, éditér ou supprimer un utilisateur" arrow>
                            <Button
                                type="submit"
                                component={Link}
                                to={'/adminUser'}
                                sx={{
                                    ...defaultStyle,
                                    color: darkMode ? '#ffffff' : 'black',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                            >
                                <ViewListIcon />
                                Consulter les utilisateurs
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#2e2e2e' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Administration des entreprises</h3>
                    {/* Premier Box avec les boutons entreprise */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginLeft: '120px',
                        marginRight: '120px',
                        gap: '20px'
                    }}>
                        <Tooltip title="Cliquez ici Créer une nouvelle entreprise" arrow>
                            <Button
                                type="submit"
                                component={Link}
                                to={'/addEntreprise'}
                                sx={{
                                    ...defaultStyle,
                                    color: darkMode ? '#ffffff' : 'black',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                            >
                                <AddIcon />
                                Créer une nouvelle entreprise
                            </Button>
                        </Tooltip>
                        <Tooltip title="Cliquez ici pour afficher, éditez ou supprimer une entreprise ou créer un secteur d'activé" arrow>
                            <Button
                                type="submit"
                                component={Link}
                                to={'/adminEntreprises'}
                                sx={{
                                    ...defaultStyle,
                                    color: darkMode ? '#ffffff' : 'black',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                            >
                                <ViewListIcon />
                                Consulter les entreprises
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#2e2e2e' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Administration des logs et des messages de support</h3>
                    {/* Box pour le bouton des logs */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginLeft: '120px',
                        marginRight: '120px',
                        gap: '20px'
                    }}>
                        <Tooltip title="Visualisation des logs" arrow>
                            <Button
                                type="submit"
                                component={Link}
                                to={'/logView'}
                                sx={{
                                    ...defaultStyle,
                                    color: darkMode ? '#ffffff' : 'black',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                            >
                                <History />
                                Visualisation des logs
                            </Button>
                        </Tooltip>
                        <Tooltip title="Visualisation messages de support" arrow>
                            <Button
                                type="submit"
                                component={Link}
                                to={'/messSupport'}
                                sx={{
                                    ...defaultStyle,
                                    color: darkMode ? '#ffffff' : 'black',
                                    backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                    transition: 'all 0.1s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                        transform: 'scale(1.08)',
                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                    },
                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                    textTransform: 'none',
                                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                variant="contained"
                            >
                                <HelpIcon />
                                Visualisation des supports

                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#2e2e2e' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Administration des archives</h3>
                    <BulkArchiveManager
                        darkMode={darkMode}
                        onSuccess={(message) => showSnackbar(message, 'success')}
                    />
                    <Typography variant="h6" sx={{ mb: 4, color: darkMode ? '#ffffff' : 'inherit', textAlign: 'center' }}>
                        Accéder aux archives
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginLeft: '120px',
                        marginRight: '120px',
                        gap: '20px'
                    }}>
                        <SystemeArchivage
                            typeArchive="planaction"
                            donnees={users}
                            onArchiver={async (archiveData) => {
                                try {
                                    await axios.post('http://localhost:3100/api/archives', archiveData);
                                    refreshListAccidents();
                                    showSnackbar('Action archivée avec succès', 'success');
                                } catch (error) {
                                    console.error("Erreur lors de l'archivage:", error);
                                    showSnackbar('Erreur lors de l\'archivage', 'error');
                                }
                            }}
                            darkMode={darkMode}
                        />
                        {/* Deuxième système d'archivage pour les accidents */}
                        <SystemeArchivage
                            typeArchive="accident"
                            donnees={users}
                            onArchiver={async (archiveData) => {
                                try {
                                    await axios.post('http://localhost:3100/api/archives', archiveData);
                                    refreshListAccidents();
                                    showSnackbar('Accident archivé avec succès', 'success');
                                } catch (error) {
                                    console.error("Erreur lors de l'archivage:", error);
                                    showSnackbar('Erreur lors de l\'archivage', 'error');
                                }
                            }}
                            darkMode={darkMode}
                        />

                    </Box>
                </Paper>
            </Paper>
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
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </div >
    );
}