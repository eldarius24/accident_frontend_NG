import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const AccidentCounter = ({ days = 0, lastDate, darkMode }) => {
    // Fonction pour déterminer la couleur en fonction du nombre de jours
    const { color, gradient, message } = useMemo(() => {
        if (days <= 5) {
            return {
                color: '#ff0000',
                gradient: 'linear-gradient(90deg, #ff0000, #ff3333)',
                message: {
                    alert: 'Vigilance maximale requise.',
                    text: ' La sécurité est notre priorité. Continuons ensemble à maintenir un environnement de travail sûr.'
                }
            };
        } else if (days <= 15) {
            return {
                color: '#ff9800',
                gradient: 'linear-gradient(90deg, #ff9800, #ffb74d)',
                message: {
                    alert: 'Restons vigilants.',
                    text: ' La sécurité est notre priorité. Continuons ensemble à maintenir un environnement de travail sûr.'
                }
            };
        } else if (days <= 30) {
            return {
                color: '#ffd700',
                gradient: 'linear-gradient(90deg, #ffd700, #ffeb3b)',
                message: {
                    alert: 'Continuons nos efforts.',
                    text: ' La sécurité est notre priorité. Continuons ensemble à maintenir un environnement de travail sûr.'
                }
            };
        } else {
            return {
                color: '#4caf50',
                gradient: 'linear-gradient(90deg, #4caf50, #81c784)',
                message: {
                    alert: 'Excellent travail !',
                    text: ' La sécurité est notre priorité. Continuons ensemble à maintenir un environnement de travail sûr.'
                }
            };
        }
    }, [days]);

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                maxWidth: '800px',
                margin: '2rem auto',
                background: 'transparent',
                position: 'relative',
            }}
        >
            {/* Conteneur principal */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    gap: '1rem',
                    padding: '1rem',
                }}
            >
                {/* Section compteur principal */}
                <Box
                    sx={{
                        position: 'relative',
                        background: darkMode
                            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: darkMode
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : '0 8px 32px rgba(0, 0, 0, 0.15)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: gradient,
                            transition: 'background 0.3s ease',
                        }
                    }}
                >
                    {/* Icône trophée */}
                    <EmojiEventsIcon
                        sx={{
                            fontSize: '3rem',
                            color: color,
                            opacity: 0.9,
                            mb: 2,
                            transition: 'color 0.3s ease',
                        }}
                    />

                    {/* Nombre de jours */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                                fontWeight: 700,
                                color: color,
                                lineHeight: 1,
                                fontFamily: "'Digital-7', sans-serif",
                                textShadow: `0 0 20px ${color}40`,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {days}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                color: color,
                                mb: 1,
                                transition: 'color 0.3s ease',
                            }}
                        >
                            jours
                        </Typography>
                    </Box>

                    {/* Texte descriptif */}
                    <Typography
                        variant="h6"
                        sx={{
                            color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            textAlign: 'center',
                            fontWeight: 600
                        }}
                    >
                        Sans accident
                    </Typography>
                </Box>

                {/* Section information complémentaire */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}
                >
                    {/* Carte statistique */}
                    <Box
                        sx={{
                            background: darkMode
                                ? 'linear-gradient(135deg, #2a2a2a 0%, #333333 100%)'
                                : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                            borderRadius: '15px',
                            padding: '1.5rem',
                            flex: 1,
                            boxShadow: darkMode
                                ? '0 4px 16px rgba(0, 0, 0, 0.2)'
                                : '0 4px 16px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '30%',
                                height: '100%',
                                background: `linear-gradient(90deg, transparent, ${color}15)`,
                                transform: 'skewX(-15deg)',
                            }
                        }}
                    >
                        <CalendarTodayIcon
                            sx={{
                                fontSize: '2rem',
                                color: color,
                                transition: 'color 0.3s ease',
                            }}
                        />

                        {lastDate && !isNaN(lastDate.getTime()) && (
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                        marginBottom: '0.25rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Dernier incident
                                </Typography>
                                <Typography
                                    sx={{
                                        color: darkMode ? '#ffffff' : '#000000',
                                        fontWeight: 600,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {lastDate.toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Zone de message */}
                    <Box
                        sx={{
                            background: `${color}15`,
                            borderRadius: '15px',
                            padding: '1.5rem',
                            borderLeft: `4px solid ${color}`,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 500,
                                lineHeight: 1.6,
                                fontSize: '0.9rem'
                            }}
                        >
                            <span style={{
                                color: color,
                                fontWeight: 600
                            }}>
                                {message.alert}
                            </span>
                            <span style={{
                                color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                            }}>
                                {message.text}
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default AccidentCounter;