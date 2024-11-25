import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Tooltip,
    Card,
    CardContent
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import axios from 'axios';
import config from '../config.json';

const apiUrl = config.apiUrl;

const BulkArchiveManager = ({ darkMode, onSuccess }) => {
    const [type, setType] = useState('');
    const [selectedYearArchive, setSelectedYearArchive] = useState('');
    const [selectedYearRestore, setSelectedYearRestore] = useState('');
    const [availableYearsArchive, setAvailableYearsArchive] = useState([]);
    const [availableYearsRestore, setAvailableYearsRestore] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ type: 'archive', count: 0 });
    const [loading, setLoading] = useState(false);

    // Fonction pour récupérer les années disponibles pour l'archivage
    const fetchActiveYears = async () => {
        if (!type) return;
        try {
            const endpoint = type === 'accident' ? 'accidents' : 'planaction';
            const response = await axios.get(`http://${apiUrl}:3100/api/${endpoint}`);
            const years = [...new Set(response.data.map(item =>
                type === 'accident'
                    ? new Date(item.DateHeureAccident).getFullYear()
                    : item.AddActionanne
            ))].sort((a, b) => b - a);
            setAvailableYearsArchive(years);
        } catch (error) {
            console.error('Erreur lors de la récupération des années actives:', error);
        }
    };

    // Fonction pour récupérer les années disponibles pour la restauration
    const fetchArchivedYears = async () => {
        if (!type) return;
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/archives/${type}`);
            const years = [...new Set(response.data.map(item => {
                const donnees = item.donnees;
                return type === 'accident'
                    ? new Date(donnees.DateHeureAccident).getFullYear()
                    : donnees.AddActionanne;
            }))].sort((a, b) => b - a);
            setAvailableYearsRestore(years);
        } catch (error) {
            console.error('Erreur lors de la récupération des années archivées:', error);
        }
    };

    useEffect(() => {
        if (type) {
            fetchActiveYears();
            fetchArchivedYears();
        }
    }, [type]);

    const handleArchive = async () => {
        if (!type || !selectedYearArchive) return;
        setLoading(true);
        try {
            const endpoint = type === 'accident' ? 'accidents' : 'planaction';
            const response = await axios.get(`http://${apiUrl}:3100/api/${endpoint}`);
            const itemsToArchive = response.data.filter(item => {
                const itemYear = type === 'accident'
                    ? new Date(item.DateHeureAccident).getFullYear().toString()
                    : item.AddActionanne;
                return itemYear === selectedYearArchive;
            });

            setDialogContent({
                type: 'archive',
                count: itemsToArchive.length
            });
            setDialogOpen(true);
        } catch (error) {
            console.error('Erreur lors de la préparation de l\'archivage:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        if (!type || !selectedYearRestore) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/archives/${type}`);
            const itemsToRestore = response.data.filter(item => {
                const itemYear = type === 'accident'
                    ? new Date(item.donnees.DateHeureAccident).getFullYear().toString()
                    : item.donnees.AddActionanne;
                return itemYear === selectedYearRestore;
            });

            setDialogContent({
                type: 'restore',
                count: itemsToRestore.length
            });
            setDialogOpen(true);
        } catch (error) {
            console.error('Erreur lors de la préparation de la restauration:', error);
        } finally {
            setLoading(false);
        }
    };

    const executeAction = async () => {
        setLoading(true);
        try {
            if (dialogContent.type === 'archive') {
                // Code pour l'archivage
                const endpoint = type === 'accident' ? 'accidents' : 'planaction';
                const response = await axios.get(`http://${apiUrl}:3100/api/${endpoint}`);
                const itemsToArchive = response.data.filter(item => {
                    const itemYear = type === 'accident'
                        ? new Date(item.DateHeureAccident).getFullYear().toString()
                        : item.AddActionanne;
                    return itemYear === selectedYearArchive;
                });

                for (const item of itemsToArchive) {
                    const archiveData = {
                        type: type,
                        donnees: item,
                        titre: type === 'accident'
                            ? `${item.entrepriseName} - ${item.typeAccident}`
                            : `${item.AddActionEntreprise} - ${item.AddAction}`,
                        taille: JSON.stringify(item).length
                    };

                    await axios.post(`http://${apiUrl}:3100/api/archives`, archiveData);
                    await axios.delete(`http://${apiUrl}:3100/api/${endpoint}/${item._id}`);
                }
            } else {
                // Code pour la restauration
                const response = await axios.get(`http://${apiUrl}:3100/api/archives/${type}`);
                const itemsToRestore = response.data.filter(item => {
                    const itemYear = type === 'accident'
                        ? new Date(item.donnees.DateHeureAccident).getFullYear().toString()
                        : item.donnees.AddActionanne;
                    return itemYear === selectedYearRestore;
                });

                let successCount = 0;
                for (const item of itemsToRestore) {
                    try {
                        console.log('Tentative de restauration pour:', {
                            id: item._id,
                            type: type,
                            donnees: item.donnees
                        });

                        const response = await axios.post(
                            `http://${apiUrl}:3100/api/archives/${item._id}/restore`,
                            {
                                type: type,
                                donnees: item.donnees
                            },
                            {
                                validateStatus: false
                            }
                        );

                        if (response.status === 500) {
                            console.error('Réponse du serveur:', response.data);
                            throw new Error(`Erreur serveur: ${response.data.message || 'Erreur inconnue'}`);
                        }

                        successCount++;
                        console.log(`Item ${item._id} restauré avec succès`);
                    } catch (restoreError) {
                        console.error(`Erreur détaillée pour l'item ${item._id}:`, {
                            message: restoreError.message,
                            response: restoreError.response?.data,
                            status: restoreError.response?.status,
                            config: restoreError.config
                        });
                    }
                }

                if (successCount === 0) {
                    throw new Error('Aucune restauration n\'a réussi');
                }
            }

            setDialogOpen(false);
            if (onSuccess) {
                onSuccess(`${dialogContent.type === 'archive' ? 'Archivage' : 'Restauration'} en masse effectué avec succès`);
            }

            // Rafraîchir les listes d'années après l'opération
            await fetchActiveYears();
            await fetchArchivedYears();

            // Réinitialiser les sélections
            if (dialogContent.type === 'archive') {
                setSelectedYearArchive('');
            } else {
                setSelectedYearRestore('');
            }
        } catch (error) {
            console.error(`Erreur lors de l'${dialogContent.type === 'archive' ? 'archivage' : 'restauration'}:`, error);
            if (onSuccess) {
                onSuccess(`Erreur lors de l'${dialogContent.type === 'archive' ? 'archivage' : 'restauration'}: ${error.message}`, 'error');
            }
        } finally {
            setLoading(false);
        }
    };


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

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <Typography variant="h6" sx={{ mb: 4, color: darkMode ? '#ffffff' : 'inherit', textAlign: 'center' }}>
                Archivage/Restauration en masse
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'center',
                width: '100%',
                maxWidth: '1200px'
            }}>
                <FormControl sx={{
                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                    minWidth: 220,
                    backgroundColor: darkMode ? '#424242' : '#ee752d60',
                    '& .MuiInputLabel-root': {
                        color: darkMode ? '#fff' : 'inherit'
                    },
                    '& .MuiOutlinedInput-root': {
                        color: darkMode ? '#fff' : 'inherit',
                        '& fieldset': {
                            borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                        },
                        '&:hover fieldset': {
                            borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                        }
                    }
                }}>
                    <InputLabel sx={{ color: darkMode ? '#fff' : 'inherit' }}>Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setSelectedYearArchive('');
                            setSelectedYearRestore('');
                        }}
                        label="Type"
                        sx={{
                            color: darkMode ? '#fff' : 'inherit',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: darkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                            }
                        }}
                    >
                        <MenuItem value="accident"
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#fff' : 'inherit',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                },
                                '&.Mui-selected': {
                                    backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                }
                            }}
                        >Accidents</MenuItem>
                        <MenuItem
                            value="planaction"
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#fff' : 'inherit',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                },
                                '&.Mui-selected': {
                                    backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                }
                            }}
                        >Actions</MenuItem>
                    </Select>
                </FormControl>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <FormControl sx={{
                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                            minWidth: 220,
                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                            '& .MuiInputLabel-root': {
                                color: darkMode ? '#fff' : 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                color: darkMode ? '#fff' : 'inherit',
                                '& fieldset': {
                                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                },
                                '&:hover fieldset': {
                                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                }
                            }
                        }}>
                            <InputLabel sx={{ color: darkMode ? '#fff' : 'inherit' }}>Année à archiver</InputLabel>
                            <Select
                                value={selectedYearArchive}
                                onChange={(e) => setSelectedYearArchive(e.target.value)}
                                label="Année à archiver"
                                disabled={!type || availableYearsArchive.length === 0}
                                sx={{
                                    color: darkMode ? '#fff' : 'inherit',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: darkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                                    }
                                }}
                            >
                                {availableYearsArchive.map(year => (
                                    <MenuItem
                                        key={year}
                                        value={year.toString()}
                                        sx={{
                                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                            }
                                        }}
                                    >{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title="Archiver tous les éléments de l'année sélectionnée">
                            <span>
                                <Button
                                    onClick={handleArchive}
                                    disabled={!type || !selectedYearArchive || loading}
                                    startIcon={<ArchiveIcon />}
                                    sx={{
                                        ...defaultStyle,
                                        color: darkMode ? '#ffffff !important' : 'black',
                                        backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                        transition: 'all 0.1s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                            transform: 'scale(1.08)',
                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                        },
                                        '&.Mui-disabled': {
                                            color: darkMode ? '#ffffff81 !important' : 'rgba(0, 0, 0, 0.26)',
                                            '& .MuiSvgIcon-root': {
                                                color: darkMode ? '#ffffff81 !important' : 'rgba(0, 0, 0, 0.26)'
                                            }
                                        },
                                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                        textTransform: 'none',
                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        '& .MuiSvgIcon-root': {
                                            color: darkMode ? '#ffffff' : 'inherit'
                                        }
                                    }}
                                >
                                    Archiver l'année
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>
                
                <Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <FormControl sx={{
                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                            minWidth: 220,
                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                            '& .MuiInputLabel-root': {
                                color: darkMode ? '#fff' : 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                color: darkMode ? '#fff' : 'inherit',
                                '& fieldset': {
                                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                },
                                '&:hover fieldset': {
                                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                }
                            }
                        }}>
                            <InputLabel sx={{ color: darkMode ? '#fff' : 'inherit' }}>Année à restaurer</InputLabel>
                            <Select
                                value={selectedYearRestore}
                                onChange={(e) => setSelectedYearRestore(e.target.value)}
                                label="Année à restaurer"
                                disabled={!type || availableYearsRestore.length === 0}
                                sx={{
                                    color: darkMode ? '#fff' : 'inherit',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: darkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                                    }
                                }}
                            >
                                {availableYearsRestore.map(year => (
                                    <MenuItem
                                        key={year}
                                        value={year.toString()}
                                        sx={{
                                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#505050' : '#ee742d80'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: darkMode ? '#424242 !important' : '#ee742d59 !important'
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: darkMode ? '#505050 !important' : '#ee742d80 !important'
                                            }
                                        }}
                                    >{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title="Restaurer tous les éléments de l'année sélectionnée">
                            <span>
                                <Button
                                    onClick={handleRestore}
                                    disabled={!type || !selectedYearRestore || loading}
                                    startIcon={<UnarchiveIcon />}
                                    sx={{
                                        ...defaultStyle,
                                        color: darkMode ? '#ffffff !important' : 'black',
                                        backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                        transition: 'all 0.1s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                            transform: 'scale(1.08)',
                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                        },
                                        '&.Mui-disabled': {
                                            color: darkMode ? '#ffffff81 !important' : 'rgba(0, 0, 0, 0.26)',
                                            '& .MuiSvgIcon-root': {
                                                color: darkMode ? '#ffffff81 !important' : 'rgba(0, 0, 0, 0.26)'
                                            }
                                        },
                                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                        textTransform: 'none',
                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        '& .MuiSvgIcon-root': {
                                            color: darkMode ? '#ffffff' : 'inherit'
                                        }
                                    }}
                                >
                                    Restaurer l'année
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        color: darkMode ? '#ffffff' : 'inherit',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: darkMode ? '#ffffff' : 'inherit',
                    backgroundColor: darkMode ? '#333333' : '#f5f5f5'
                }}>
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{
                        color: darkMode ? '#ffffff' : 'inherit',
                        mt: 2
                    }}>
                        Voulez-vous vraiment {dialogContent.type === 'archive' ? 'archiver' : 'restaurer'} {dialogContent.count} {type === 'accident' ? 'accident(s)' : 'action(s)'} de l'année {dialogContent.type === 'archive' ? selectedYearArchive : selectedYearRestore} ?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: darkMode ? '#333333' : '#f5f5f5',
                    padding: 2
                }}>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        disabled={loading}
                        sx={{
                            color: darkMode ? '#ffffff' : 'inherit',
                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                            '&:hover': {
                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                            },
                            '&.Mui-disabled': {
                                color: darkMode ? '#ffffff !important' : 'rgba(0, 0, 0, 0.26)'
                            }
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={executeAction}
                        disabled={loading}
                        autoFocus
                        sx={{
                            color: darkMode ? '#ffffff' : 'inherit',
                            backgroundColor: darkMode ? '#424242' : '#ee742d59',
                            '&:hover': {
                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                            },
                            '&.Mui-disabled': {
                                color: darkMode ? '#ffffff !important' : 'rgba(0, 0, 0, 0.26)'
                            }
                        }}
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BulkArchiveManager;