import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Container } from '@mui/material';
import AccidentCounter from '../login/accidentCounter';
import axios from 'axios';
import { useTheme } from '../Hook/ThemeContext';
import config from '../config.json';
import { useUserConnected } from '../Hook/userConnected';
const apiUrl = config.apiUrl;

const AccidentCounterPage = () => {
    const { isDeveloppeur } = useUserConnected();
    const [daysWithoutAccident, setDaysWithoutAccident] = useState(0);
    const [lastAccidentDate, setLastAccidentDate] = useState(null);
    const [scale, setScale] = useState(2);
    const { darkMode } = useTheme();
    const REFRESH_INTERVAL = 60 * 1000; // 30 minutes
    const fetchTimeoutRef = useRef(null);
    const lastFetchTimeRef = useRef(0);

    // Fonction de calcul des jours optimisée et mémorisée
    const calculateDaysDifference = useCallback((date1, date2) => {
        if (isDeveloppeur) {
            console.log('[DEBUG][calculate] Input dates:', { date1, date2 });
        }

        try {
            if (!date1 || !date2) return 0;

            const firstDate = new Date(date1);
            const secondDate = new Date(date2);

            if (isDeveloppeur) {
                console.log('[DEBUG][calculate] Parsed dates:', {
                    firstDate: firstDate.toISOString(),
                    secondDate: secondDate.toISOString()
                });
            }

            firstDate.setHours(0, 0, 0, 0);
            secondDate.setHours(0, 0, 0, 0);

            const diffTime = firstDate.getTime() - secondDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (isDeveloppeur) {
                console.log('[DEBUG][calculate] Days difference:', Math.abs(diffDays));
            }
            return Math.abs(diffDays);
        } catch (error) {
            if (isDeveloppeur) {
                console.log('[DEBUG][calculate] Error:', error);
            }
            console.error('Erreur dans le calcul des jours:', error);
            return 0;
        }
    }, []);

    // Fonction de récupération des données mémorisée
    const fetchLastAccident = useCallback(async () => {
        if (isDeveloppeur) {
            console.log('[DEBUG][fetch] Starting fetch');
            console.log('[DEBUG][fetch] Last fetch time:', new Date(lastFetchTimeRef.current).toLocaleString());
        }

        const now = Date.now();
        if (now - lastFetchTimeRef.current < REFRESH_INTERVAL) {
            if (isDeveloppeur) {
                console.log('[DEBUG][fetch] Skipping fetch - Too soon since last fetch');
            }
            return;
        }

        try {
            if (isDeveloppeur) {
                console.log('[DEBUG][fetch] Fetching from API:', `http://${apiUrl}:3100/api/accidents/filtered-fields`);
            }

            lastFetchTimeRef.current = now;
            const response = await axios.get(`http://${apiUrl}:3100/api/accidents/filtered-fields`, {
                params: {
                    fields: JSON.stringify(['DateHeureAccident']),
                    entreprises: JSON.stringify([])
                }
            });

            if (isDeveloppeur) {
                console.log('[DEBUG][fetch] Response received:', {
                    accidentsCount: response.data.accidents?.length || 0,
                    firstAccident: response.data.accidents?.[0]
                });
            }

            if (response.data.accidents && response.data.accidents.length > 0) {
                const sortedAccidents = response.data.accidents.sort((a, b) => {
                    const dateA = new Date(a.DateHeureAccident);
                    const dateB = new Date(b.DateHeureAccident);
                    return dateB - dateA;
                });

                const lastAccident = sortedAccidents[0];
                if (lastAccident && lastAccident.DateHeureAccident) {
                    const accidentDate = new Date(lastAccident.DateHeureAccident);
                    const today = new Date();

                    if (!isNaN(accidentDate.getTime())) {
                        const days = calculateDaysDifference(today, accidentDate);
                        setDaysWithoutAccident(days);
                        setLastAccidentDate(accidentDate);
                    }
                }
            }
        } catch (error) {
            if (isDeveloppeur) {
                console.log('[DEBUG][fetch] Error during fetch:', error);
            }
            console.error('Erreur lors de la récupération des accidents:', error);
        }
    }, [calculateDaysDifference]);

    // Gestion du redimensionnement
    useEffect(() => {
        const handleResize = () => {
            if (isDeveloppeur) {
                console.log('[DEBUG][resize] Window dimensions:', {
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }
            const width = window.innerWidth;
            const height = window.innerHeight;
            const baseWidth = 1920;
            const baseHeight = 1080;
            const widthRatio = width / baseWidth;
            const heightRatio = height / baseHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            const newScale = Math.max(0.8, Math.min(2, ratio * 2));
            if (isDeveloppeur) {
                console.log('[DEBUG][resize] New scale calculated:', newScale);
            }
            setScale(newScale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effet pour la récupération des données et le rafraîchissement périodique
    useEffect(() => {
        // Récupération initiale
        fetchLastAccident();

        // Configuration du rafraîchissement périodique
        const setupNextFetch = () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }

            fetchTimeoutRef.current = setTimeout(() => {
                fetchLastAccident();
                setupNextFetch(); // Planifier le prochain appel
            }, REFRESH_INTERVAL);
        };

        setupNextFetch();

        // Nettoyage
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [fetchLastAccident]);

    // Mise à jour quotidienne du compteur à minuit
    useEffect(() => {
        if (isDeveloppeur) {
            console.log('[DEBUG][midnight] Setting up midnight update');
            console.log('[DEBUG][midnight] Last accident date:', lastAccidentDate);
        }
    
        if (!lastAccidentDate) return;

        const updateAtMidnight = () => {
            if (isDeveloppeur) {
                console.log('[DEBUG][midnight] Updating counter at midnight');
            }
            const today = new Date();
            const days = calculateDaysDifference(today, lastAccidentDate);
            if (isDeveloppeur) {
                console.log('[DEBUG][midnight] New days count:', days);
            }
            setDaysWithoutAccident(days);
        };

        // Calcul du temps jusqu'à minuit
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeUntilMidnight = tomorrow - now;

        const midnightTimeout = setTimeout(() => {
            updateAtMidnight();
            // Ensuite, mettre à jour tous les jours à minuit
            setInterval(updateAtMidnight, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);

        return () => clearTimeout(midnightTimeout);
    }, [lastAccidentDate, calculateDaysDifference]);

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                height: '70vh',
                width: '100vw',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '20px',
                '& > *': {
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease',
                }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    margin: 'auto'
                }}
            >
                <AccidentCounter
                    days={isNaN(daysWithoutAccident) ? 0 : daysWithoutAccident}
                    lastDate={lastAccidentDate}
                    darkMode={darkMode}
                />
            </Box>
        </Container>
    );
};

export default AccidentCounterPage;