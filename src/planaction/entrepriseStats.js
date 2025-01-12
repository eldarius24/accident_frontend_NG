import React, { useMemo } from 'react';
import { useTheme } from '../Hook/ThemeContext';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import listeaddaction from '../liste/listeaddaction.json';

const DARK_MODE_COLORS = {
    100: '#50A150',
    75: '#7A9E7A', 
    50: '#BFA980',
    25: '#B67F7F',
    0: '#B68080'
  };
  
  const LIGHT_MODE_COLORS = {
    100: '#90EE90',
    75: '#B7E4B7',
    50: '#FFE4B5',
    25: '#FFCCCB',
    0: '#FFB6B6'  
  };


const EnterpriseStats = React.memo(({ actions }) => {
    const { darkMode } = useTheme();

    const stats = useMemo(() => {
        if (!actions || !Array.isArray(actions)) return {};

        const statsObj = {};
        actions.forEach(action => {
            const enterprise = action.AddActionEntreprise;
            if (!enterprise) return; // Skip if no enterprise

            if (!statsObj[enterprise]) {
                statsObj[enterprise] = {
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
            statsObj[enterprise].total += 1;
            if (action.AddboolStatus) {
                statsObj[enterprise].completed += 1;
            }
            if (action.priority) {
                statsObj[enterprise].priorities[action.priority] += 1;
            } else {
                statsObj[enterprise].priorities["A définir"] += 1;
            }
        });
        return statsObj;
    }, [actions]);

    const getCardStyle = useMemo(() => (completed, total) => {
        const completionRate = (completed / total) * 100;
        
        // Get color threshold
        const threshold = 
          completionRate === 100 ? 100 :
          completionRate >= 75 ? 75 :
          completionRate >= 50 ? 50 :
          completionRate >= 25 ? 25 : 0;
    
        // Get color from lookup table
        const backgroundColor = darkMode 
          ? DARK_MODE_COLORS[threshold]
          : LIGHT_MODE_COLORS[threshold];
    
        return {
            backgroundColor,
            color: darkMode ? '#ffffff' : 'inherit',
            boxShadow: darkMode ? '0 4px 8px 0 rgba(0,0,0,0.2)' : 3,
            transition: 'all 0.1s ease-in-out',
            '&:hover': {
                transform: 'scale(1.02)', 
                boxShadow: darkMode ? '0 8px 16px 0 rgba(0,0,0,0.3)' : 6,
            }
        };
    }, [darkMode]);

    const getProgressBarColor = useMemo(() => (completed, total) => {
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
                const remaining = total - completed;
                return (
                    <Grid item xs={12} sm={6} md={4} key={enterprise}>
                        <Card sx={getCardStyle(completed, total)}>
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
                                <Typography color="text.secondary">
                                    Nombre d'actions: {total}
                                </Typography>
                                <Typography color="text.secondary">
                                    Nombre d'actions terminées: {completed}
                                </Typography>
                                <Typography color="text.secondary">
                                    Nombre d'actions restantes: {remaining}
                                </Typography>
                                <Typography color="text.secondary">
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
                                <div style={{
                                    width: '100%',
                                    height: '4px',
                                    backgroundColor: '#e0e0e0',
                                    marginTop: '8px',
                                    borderRadius: '2px'
                                }}>
                                    <div style={{
                                        width: `${completionRate}%`,
                                        height: '100%',
                                        backgroundColor: getProgressBarColor(completed, total),
                                        transition: 'width 0.3s ease-in-out',
                                        borderRadius: '2px'
                                    }} />
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