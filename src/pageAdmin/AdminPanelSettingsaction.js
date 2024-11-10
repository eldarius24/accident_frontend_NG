import React, { useMemo } from 'react';
import '../pageFormulaire/formulaire.css';
import { Box, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useTheme } from '../pageAdmin/user/ThemeContext';
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
    const { darkMode } = useTheme();
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
    }

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

    return (
        <div>
            <div className="frameStyle-style" style={{
                backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                margin: '0 20px'
            }}>
                <h3>Administration des droits</h3>

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
                                transition: 'all 0.3s ease-in-out',
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
                                transition: 'all 0.3s ease-in-out',
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
                            Consulter les utilisateurs
                        </Button>
                    </Tooltip>
                </Box>
                <h3>Administration des entreprises</h3>

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
                                transition: 'all 0.3s ease-in-out',
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
                                transition: 'all 0.3s ease-in-out',
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
                            Consulter les entreprises
                        </Button>
                    </Tooltip>
                </Box>

                {/* Titre adapté au mode sombre */}
                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Visualisation des logs et des messages de support</h3>

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
                                transition: 'all 0.3s ease-in-out',
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
                                transition: 'all 0.3s ease-in-out',
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
                            Visualisation des supports
                        </Button>
                    </Tooltip>
                </Box>
            </div>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe.</h5>
            </Tooltip>

        </div>



    );
}