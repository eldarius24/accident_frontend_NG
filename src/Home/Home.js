import React, { useState } from 'react';
import { Box, Paper, Tooltip, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { LineChart, Line } from 'recharts';
import { useTheme } from '../Hook/ThemeContext.js'; // Add this import
import { useUserConnected } from '../Hook/userConnected.js';
import {ElectronicSignatureIcon, ActionPlanIcon, WorkAccidentStatsIcon, WorkAccidentIcon, VehicleManagementIcon, VehicleStatsIcon, PreventionDocsIcon } from './iconePerso';

export default function Navigation() {
    const {
        isAdmin,
        isAdminOuConseiller,
        userInfo,
        isConseiller,
        isAdminOrDev,
        isAdminOrDevOrConseiller,
        isUserPreventionOrAdminOrConseiller,
        isVehicleAdminManager,
        isUserPrevention,
        isFleetManager,
        isVehicleAdmin
    } = useUserConnected();
    const { darkMode } = useTheme(); // Add this hook
    const [hoverStates, setHoverStates] = useState({
        accident: false,
        stats: false,
        plan: false,
        business: false,
        vehicule: false
    });

    // Données simulées pour le graphique
    const data = [
        { value: 30 }, { value: 10 }, { value: 45 }, { value: 25 },
        { value: 35 }, { value: 20 }, { value: 40 }
    ];

    // Animations keyframes
    const pulse = keyframes`
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    `;

    const float = keyframes`
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(-3deg); }
        75% { transform: translateY(10px) rotate(3deg); }
    `;

    const sparkle = keyframes`
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
    `;

    const slideIn = keyframes`
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    `;

    const rotateIn = keyframes`
        from { transform: rotate(-180deg) scale(0); opacity: 0; }
        to { transform: rotate(0) scale(1); opacity: 1; }
    `;

    // Style de base des boutons avec animations avancées et darkMode
    const buttonStyle = (index) => ({
        minHeight: '220px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '30px',
        borderRadius: '25px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `${slideIn} 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`,
        background: darkMode
            ? 'linear-gradient(135deg, rgba(122,142,28,0.1) 0%, rgba(66,66,66,0.95) 50%, rgba(122,142,28,0.2) 100%)'
            : 'linear-gradient(135deg, rgba(238,117,45,0.1) 0%, rgba(255,255,255,0.95) 50%, rgba(238,117,45,0.2) 100%)',
        color: darkMode ? '#ffffff' : '#000000',
        border: darkMode
            ? '2px solid #a5d6a7'  // Light orange for dark mode
            : '2px solid #f57c00', // Darker orange for light mode
        '&:hover': {
            border: darkMode
                ? '2px solid #ffd54f'  // Brighter orange for dark mode hover
                : '2px solid #ff9800', // Lighter orange for light mode hover
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            backgroundColor: darkMode ? 'rgba(122,142,28,0.1)' : 'rgba(238,117,45,0.1)',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            transition: 'all 0.8s ease',
        },
        '&:hover': {
            transform: 'scale(1.05)',
            '&::before': {
                transform: 'translate(-50%, -50%) rotate(180deg)',
            },
            '& .button-content': {
                animation: `${float} 3s ease infinite`,
            },
            '& .sparkle': {
                animation: `${sparkle} 1.5s ease infinite`,
            },
        },
        '@media (max-width: 768px)': {
            minHeight: '180px',
        },
    });

    // Update animations with darkMode colors
    const AccidentAnimation = ({ isHovered }) => (
        <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '60px',
            height: '60px',
            opacity: isHovered ? 1 : 0.3,
            transition: 'all 0.3s ease'
        }}>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: darkMode ? '#7a8e1c' : '#ee752d',
                        animation: isHovered ? `${pulse} ${1 + i * 0.2}s infinite` : 'none',
                    }}
                />
            ))}
        </Box>
    );

    // Update StatsAnimation with darkMode colors
    const StatsAnimation = ({ isHovered }) => (
        <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '80px',
            height: '40px',
            opacity: isHovered ? 1 : 0.3,
            transition: 'all 0.3s ease'
        }}>
            <LineChart width={80} height={40} data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={darkMode ? "#7a8e1c" : "#ee752d"}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={isHovered ? 1500 : 0}
                />
            </LineChart>
        </Box>
    );

    // Update PlanAnimation with darkMode colors
    const PlanAnimation = ({ isHovered }) => (
        <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '60px',
            height: '60px',
            opacity: isHovered ? 1 : 0.3,
            transition: 'all 0.3s ease'
        }}>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        top: i * 20,
                        width: '40px',
                        height: '4px',
                        backgroundColor: darkMode ? '#7a8e1c' : '#ee752d',
                        animation: isHovered ? `${slideIn} ${0.3 + i * 0.1}s ease` : 'none',
                    }}
                />
            ))}
        </Box>
    );

    const VehicleAnimation = ({ isHovered }) => (
        <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '60px',
            height: '60px',
            opacity: isHovered ? 1 : 0.3,
            transition: 'all 3s ease'
        }}>
            {/* Corps du véhicule */}
            <Box sx={{
                position: 'absolute',
                top: '20px',
                width: '50px',
                height: '20px',
                backgroundColor: darkMode ? '#7a8e1c' : '#ee752d',
                borderRadius: '5px',
                animation: isHovered ? `${slideIn} 3s ease` : 'none',
            }} />

            {/* Toit du véhicule */}
            <Box sx={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                width: '25px',
                height: '15px',
                backgroundColor: darkMode ? '#7a8e1c' : '#ee752d',
                borderRadius: '3px',
                animation: isHovered ? `${slideIn} 3s ease` : 'none',
            }} />

            {/* Roues */}
            {[15, 35].map((left, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        top: '35px',
                        left: `${left}px`,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: darkMode ? '#a4bd24' : '#f4a261',
                        animation: isHovered ? `${rotateIn} 1s infinite linear` && `${slideIn} 3s ease` : 'none',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: darkMode ? '#4a5411' : '#cc5a1d',
                            transform: 'translate(-50%, -50%)',
                        }
                    }}
                />
            ))}
        </Box>
    );

    // Update BusinessAnimation with darkMode colors
    const BusinessAnimation = ({ isHovered }) => (
        <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '60px',
            height: '60px',
            opacity: isHovered ? 1 : 0.3,
            transition: 'all 0.3s ease'
        }}>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        bottom: i * 20,
                        width: '20px',
                        height: (i + 1) * 15,
                        backgroundColor: darkMode ? '#7a8e1c' : '#ee752d',
                        animation: isHovered ? `${rotateIn} ${0.3 + i * 0.1}s ease` : 'none',
                    }}
                />
            ))}
        </Box>
    );

    /*
    console.log("User roles:", {
        isFleetManager,
        isVehicleAdmin,
        isVehicleAdminManager,
        userInfo
    });
    console.log("Vehicle access roles:", {
        isFleetManager,
        isVehicleAdmin,
        isVehicleAdminManager,
        boolGetionaireVehicule: userInfo.boolGetionaireVehicule
    });
*/
    return (
        <div style={{
            backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
        }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0rem 0',
                    position: 'relative',
                    padding: '30px 0',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '-100%',
                        width: '300%',
                        height: '100%',
                        background: darkMode
                            ? 'linear-gradient(90deg, transparent 0%, rgba(122,142,28,0.1) 45%, rgba(122,142,28,0.3) 50%, rgba(122,142,28,0.1) 55%, transparent 100%)'
                            : 'linear-gradient(90deg, transparent 0%, rgba(238,117,45,0.1) 45%, rgba(238,117,45,0.3) 50%, rgba(238,117,45,0.1) 55%, transparent 100%)',
                        animation: 'shine 3s infinite linear',
                    },
                    '@keyframes shine': {
                        to: {
                            transform: 'translateX(50%)',
                        },
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: '-2px',
                        padding: '3px',
                        background: darkMode
                            ? 'linear-gradient(45deg, #7a8e1c, transparent, #a4bd24, transparent, #7a8e1c)'
                            : 'linear-gradient(45deg, #ee752d, transparent, #f4a261, transparent, #ee752d)',
                        borderRadius: '16px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        animation: 'borderRotate 4s linear infinite',
                    },
                    '@keyframes borderRotate': {
                        from: {
                            transform: 'rotate(0deg)',
                        },
                        to: {
                            transform: 'rotate(360deg)',
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        padding: '20px 40px',
                        borderRadius: '15px',
                        background: darkMode
                            ? 'rgba(0,0,0,0.3)'
                            : 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: darkMode
                            ? '0 8px 32px 0 rgba(0,0,0, 0.37)'
                            : '0 8px 32px 0 rgba(238,117,45, 0.37)',
                        zIndex: 1,
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            fontWeight: 900,
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c 0%, #a4bd24 25%, #d4e157 50%, #a4bd24 75%, #7a8e1c 100%)'
                                : 'linear-gradient(45deg, #ee752d 0%, #f4a261 25%, #ffb74d 50%, #f4a261 75%, #ee752d 100%)',
                            backgroundSize: '200% auto',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            textAlign: 'center',
                            animation: 'gradient 3s linear infinite',
                            '@keyframes gradient': {
                                '0%': {
                                    backgroundPosition: '0% center',
                                },
                                '100%': {
                                    backgroundPosition: '200% center',
                                },
                            },
                            textShadow: darkMode
                                ? '0 0 20px rgba(122,142,28,0.5)'
                                : '0 0 20px rgba(238,117,45,0.5)',
                            position: 'relative',
                            '&::before': {
                                content: 'attr(data-text)',
                                position: 'absolute',
                                left: '2px',
                                top: '2px',
                                width: '100%',
                                height: '100%',
                                backgroundImage: darkMode
                                    ? 'linear-gradient(45deg, #7a8e1c 0%, transparent 100%)'
                                    : 'linear-gradient(45deg, #ee752d 0%, transparent 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                zIndex: -1,
                                filter: 'blur(1px)',
                            },
                        }}
                        data-text="T.I.G.R.E ➕"
                    >
                        T.I.G.R.E ➕
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                            fontWeight: 500,
                            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(128, 128, 128, 0.8)', // Ajout de la couleur grise
                            textAlign: 'center',
                            letterSpacing: '0.2em',
                            marginTop: '15px',
                            position: 'relative',
                            textTransform: 'uppercase',
                            animation: 'fadeIn 0.5s ease-in-out',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(10px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '50%',
                                height: '2px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)',
                            },
                        }}
                    >
                        Traitement Informatisé pour la Gestion des Risques en Entreprise
                    </Typography>
                </Box>
            </Box>
            <form style={{ margin: '0 20px' }}>
                <Paper
                    elevation={24}
                    sx={{
                        borderRadius: '30px',
                        padding: '0',
                        margin: '0',
                        background: darkMode
                            ? 'linear-gradient(135deg, #6e6e6e 0%, #2a2a2a 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
                        boxShadow: darkMode
                            ? '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                            : '0 20px 40px rgba(238,117,45,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
                    }}
                >
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
                            Navigation Principale
                        </Typography>
                    </Box>


                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: '40px',
                            padding: '20px',
                        }}
                    >
                        {isUserPreventionOrAdminOrConseiller  && (
                            <Tooltip title="Gérer les accidents" arrow>
                                <Button
                                    component={Link}
                                    to="/Accident"
                                    sx={buttonStyle(0)}
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, accident: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, accident: false }))}
                                >
                                    <AccidentAnimation isHovered={hoverStates.accident} />
                                    <Box className="button-content" sx={{ zIndex: 1 }}>
                                        <WorkAccidentIcon sx={{ fontSize: '3rem', mb: 2 }} />
                                        <Typography variant="h5">Accidents prévention</Typography>
                                    </Box>
                                </Button>
                            </Tooltip>
                        )}
                        {isUserPreventionOrAdminOrConseiller  && (
                            <Tooltip title="Consulter les statistiques" arrow>
                                <Button
                                    component={Link}
                                    to="/statistiques"
                                    sx={buttonStyle(1)}
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, stats: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, stats: false }))}
                                >
                                    <StatsAnimation isHovered={hoverStates.stats} />
                                    <Box className="button-content" sx={{ zIndex: 1 }}>
                                        <WorkAccidentStatsIcon sx={{ fontSize: '3rem', mb: 2 }} />
                                        <Typography variant="h5">Statistiques prévention</Typography>
                                    </Box>
                                </Button>
                            </Tooltip>
                        )}
                        {isUserPreventionOrAdminOrConseiller && (
                            <Tooltip title="Gérer le plan d'action" arrow>
                                <Button
                                    component={Link}
                                    to="/planAction"
                                    sx={buttonStyle(2)}
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, plan: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, plan: false }))}
                                >
                                    <PlanAnimation isHovered={hoverStates.plan} />
                                    <Box className="button-content" sx={{ zIndex: 1 }}>
                                        <ActionPlanIcon sx={{ fontSize: '3rem', mb: 2 }} />
                                        <Typography variant="h5">Plan d'actions prévention</Typography>
                                    </Box>
                                </Button>
                            </Tooltip>
                        )}
                        {isUserPreventionOrAdminOrConseiller && (
                            <Tooltip title="Gérer les documents divers" arrow>
                                <Button
                                    component={Link}
                                    to="/entreprise"
                                    sx={buttonStyle(3)}
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, business: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, business: false }))}
                                >
                                    <BusinessAnimation isHovered={hoverStates.business} />
                                    <Box className="button-content" sx={{ zIndex: 1 }}>
                                        <PreventionDocsIcon sx={{ fontSize: '3rem', mb: 2 }} />
                                        <Typography variant="h5"> Documents divers prévention</Typography>
                                    </Box>
                                </Button>
                            </Tooltip>
                        )}
                        {isVehicleAdminManager && (
                            <Tooltip title="Gérer les véhicules" arrow>
                                <Button
                                    component={Link}
                                    to="/gestionVehicules"
                                    sx={buttonStyle(2)}
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, vehicule: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, vehicule: false }))}
                                >
                                    <VehicleAnimation isHovered={hoverStates.vehicule} />
                                    <Box className="button-content" sx={{ zIndex: 1 }}>
                                        <VehicleManagementIcon sx={{ fontSize: '3rem', mb: 2 }} />
                                        <Typography variant="h5">Gestion des véhicules</Typography>
                                    </Box>
                                </Button>
                            </Tooltip>
                        )}
                        {isVehicleAdminManager && (
                            <Tooltip title="Consulter les statistiques des véhicules" arrow>
                                <Button
                                    component={Link}
                                    to="/statistiquesVehicules"
                                    sx={buttonStyle(1)}
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, stats: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, stats: false }))}
                                >
                                    <StatsAnimation isHovered={hoverStates.stats} />
                                    <Box className="button-content" sx={{ zIndex: 1 }}>
                                        <VehicleStatsIcon sx={{ fontSize: '3rem', mb: 2 }} />
                                        <Typography variant="h5">Statistiques véhicules</Typography>
                                    </Box>
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip title="Gérer les signatures électroniques" arrow>
                            <Button
                                component={Link}
                                to="/signatures"
                                sx={buttonStyle(3)}
                                onMouseEnter={() => setHoverStates(prev => ({ ...prev, signature: true }))}
                                onMouseLeave={() => setHoverStates(prev => ({ ...prev, signature: false }))}
                            >
                                <StatsAnimation isHovered={hoverStates.signature} />
                                <Box className="button-content" sx={{ zIndex: 1 }}>
                                    <ElectronicSignatureIcon sx={{ fontSize: '3rem', mb: 2 }} /> {/* importée de lucide-react */}
                                    <Typography variant="h5">Signatures électroniques</Typography>
                                </Box>
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>
            </form>
        </div>
    );
}