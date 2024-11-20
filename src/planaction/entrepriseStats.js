import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import listeaddaction from '../liste/listeaddaction.json';

const EnterpriseStats = React.memo(({ actions }) => {
    const { darkMode } = useTheme();
    const [, forceUpdate] = useState();

    useEffect(() => {
        forceUpdate({});
    }, [darkMode]);

    const stats = {};
    actions.forEach(action => {
        const enterprise = action.AddActionEntreprise;
        if (!stats[enterprise]) {
            stats[enterprise] = {
                total: 0,
                completed: 0,
                priorities: {
                    "Basse": 0,
                    "Moyenne": 0,
                    "Haute": 0,
                    "A définir": 0
                }
            };
        }
        stats[enterprise].total += 1;
        if (action.AddboolStatus) {
            stats[enterprise].completed += 1;
        }
        if (action.priority) {
            stats[enterprise].priorities[action.priority] += 1;
        } else {
            stats[enterprise].priorities["A définir"] += 1;
        }
    });

    const getCardStyle = useCallback((completed, total) => {
        const completionRate = (completed / total) * 100;
        /**
         * Renvoie une couleur en fonction de la progression d'une t che (0-100%).
         * En mode sombre, les couleurs sont plus sombres.
         * @param {number} rate - Pourcentage de progression (0-100)
         * @returns {string} La couleur correspondante
         */
        const getColorByCompletion = (rate) => {
            if (darkMode) {
                // Couleurs plus sombres pour le mode sombre
                if (rate === 100) return '#50A150'; // Vert assombri
                if (rate >= 75) return '#7A9E7A'; // Vert clair assombri
                if (rate >= 50) return '#BFA980'; // Beige assombri
                if (rate >= 25) return '#B67F7F'; // Rose assombri
                return '#B68080'; // Rouge clair assombri
            } else {
                // Couleurs originales pour le mode clair
                if (rate === 100) return '#90EE90';
                if (rate >= 75) return '#B7E4B7';
                if (rate >= 50) return '#FFE4B5';
                if (rate >= 25) return '#FFB6B6';
                return '#FFCCCB';
            }
        };

        return {
            backgroundColor: getColorByCompletion(completionRate),
            color: darkMode ? '#ffffff' : 'inherit',
            boxShadow: darkMode ? '0 4px 8px 0 rgba(0,0,0,0.2)' : 3,
            transition: 'all 0.3s ease-in-out',

            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: darkMode ? '0 8px 16px 0 rgba(0,0,0,0.3)' : 6,
            }
        };
    }, [darkMode]);

    const getProgressBarColor = useCallback((completed, total) => {
        const completionRate = (completed / total) * 100;
        if (completionRate === 100) return '#006400';
        if (completionRate > 75) return '#4CAF50';
        if (completionRate > 50) return '#8BC34A';
        if (completionRate > 25) return '#FFA726';
        return '#FF5722';
    }, []);

    return (
        <Grid container spacing={2}>
            {Object.entries(stats).map(([enterprise, { total, completed, priorities }]) => {
                const completionRate = (completed / total) * 100;
                return (
                    <Grid item xs={12} sm={6} md={4} key={enterprise}>
                        <Card
                            sx={{
                                ...getCardStyle(completed, total),
                                '&:hover': {
                                    boxShadow: 6, // augmente l'ombre au survol
                                    transform: 'scale(1.02)', // agrandit légèrement la carte
                                    transition: 'all 0.1s ease-in-out'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: completionRate === 100 ? 'bold' : 'normal',
                                        color: completionRate === 100 ? '#006400' : 'inherit'
                                    }}
                                >
                                    {enterprise}
                                    {completionRate === 100 &&
                                        <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>✓</span>
                                    }
                                </Typography>
                                <Typography color="text.secondary"
                                    sx={{
                                        color: completionRate === 100 ? '#006400' : 'inherit'
                                    }}
                                >
                                    Actions totales: {total}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        color: completionRate === 100 ? '#006400' : 'inherit'
                                    }}
                                >
                                    Actions terminées: {completed}
                                </Typography>
                                <Typography color="text.secondary"
                                    sx={{
                                        color: completionRate === 100 ? '#006400' : 'inherit'
                                    }}
                                >
                                    Actions restantes: {total - completed}
                                </Typography>
                                <Typography color="text.secondary"
                                    sx={{
                                        color: completionRate === 100 ? '#006400' : 'inherit'
                                    }}
                                >
                                    Priorités:
                                    {Object.entries(listeaddaction.priority).map(([priority, color], index) => (
                                        <span key={priority} style={{
                                            color: color,
                                            marginLeft: index > 0 ? '8px' : 0
                                        }}>
                                            {index > 0 && ' | '}
                                            {priority} ({priorities[priority] || 0})
                                        </span>
                                    ))}
                                </Typography>
                                <div
                                    style={{
                                        width: '100%',
                                        height: '4px',
                                        backgroundColor: '#e0e0e0',
                                        marginTop: '8px',
                                        borderRadius: '2px'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${(completed / total) * 100}%`,
                                            height: '100%',
                                            backgroundColor: getProgressBarColor(completed, total),
                                            transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
                                            borderRadius: '2px'
                                        }}
                                    />
                                </div>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 1,
                                        textAlign: 'right',
                                        fontWeight: completionRate === 100 ? 'bold' : 'normal',
                                        color: completionRate === 100 ? '#006400' : 'inherit'
                                    }}
                                >
                                    {Math.round(completionRate)}% complété
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
});

export default EnterpriseStats;