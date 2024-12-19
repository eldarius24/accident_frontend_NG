import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    LinearProgress,
    Tooltip,
    Box,
    Typography
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
/**
 * Adminusern est un composant React qui permet de gérer les entreprises
 * 
 * Il affiche une table avec les informations de chaque entreprise, 
 * ainsi que des boutons pour ajouter un secteur, modifier et supprimer.
 * 
 * Il utilise les hooks useState et useEffect pour gérer les données 
 * des entreprises et des secteurs.
 * 
 * @returns Un JSX element représentant le composant Adminusern
 */
export default function Adminusern() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [entreprises, setEntreprises] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = config.apiUrl;
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

    const handleEdit = (entreprise) => {
        try {
            navigate("/addEntreprise", { state: { entreprise } });
            showSnackbar('Modification de l\'entreprise initiée', 'info');
        } catch (error) {
            console.error("Erreur lors de la navigation vers editEntreprise:", error);
            showSnackbar('Erreur lors de l\'initialisation de l\'édition', 'error');
        }
    };

    /**
     * Affiche un message dans une snackbar.
     * @param {string} message - Le message à afficher.
     * @param {string} [severity='info'] - La gravité du message. Les valeurs possibles sont 'info', 'success', 'warning' et 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     * 
     * @param {object} event - L'événement qui a déclenché la fermeture de la snackbar.
     * @param {string} reason - La raison pour laquelle la snackbar se ferme. Si elle vaut 'clickaway', cela signifie que l'utilisateur a cliqué en dehors de la snackbar.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    /**
     * Retourne les noms des secteurs liés à une entreprise dont l'ID est donné en paramètre.
     * 
     * @param {string} entrepriseId - L'ID de l'entreprise pour laquelle on veut obtenir les secteurs.
     * @returns {string} Une chaine de caractères contenant les noms des secteurs liés à l'entreprise, séparés par des virgules.
     */
    const getSecteursByEntreprise = (entrepriseId) => {
        return secteurs.filter(secteur => secteur.entrepriseId === entrepriseId)
            .map(secteur => secteur.secteurName)
            .join(', ');
    };

    /**
     * Navigue vers la page d'ajout d'un secteur en passant l'entreprise en paramètre
     * @param {object} entreprise - L'objet entreprise contenant l'ID et le nom de l'entreprise
     */
    const handleAddSecteur = (entreprise) => {
        try {
            navigate("/addSecteur", { state: { entreprise } });
        } catch (error) {
            console.error("Error navigating to addSecteur:", error);
        }
    };

    /**
     * Supprime une entreprise
     * 
     * @param {string} entrepriseIdToDelete - L'ID de l'entreprise à supprimer
     * 
     * @returns {Promise} La promesse de suppression
     */
    const handleDelete = (entrepriseIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/entreprises/${entrepriseIdToDelete}`)
            .then(response => {
                if (response.status === 204 || response.status === 200) {
                    showSnackbar('Entreprise supprimée avec succès', 'success');
                    setEntreprises(prevEntreprises => prevEntreprises.filter(entreprise => entreprise._id !== entrepriseIdToDelete));
                } else {
                    console.error('Erreur lors de la suppression de l\'entreprise, code d\'erreur :', response.status, response.statusText);

                }

            })
            .catch(error => {
                console.error('Erreur lors de la suppression de l\'entreprise:', error);
                showSnackbar('Erreur lors de la suppression de l\'entreprise:', 'error');
            });
    };

    useEffect(() => {
        /**
         * Fetches entreprises and secteurs data from API
         * - sets entreprises and secteurs in component state
         * - sets loading to false when done
         * @async
         */
        const fetchData = async () => {
            try {
                const [entreprisesResponse, secteursResponse] = await Promise.all([
                    axios.get(`http://${apiUrl}:3100/api/entreprises`),
                    axios.get(`http://${apiUrl}:3100/api/secteurs`)
                ]);

                setEntreprises(entreprisesResponse.data);
                setSecteurs(secteursResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <form>
            <div style={{
                backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                margin: '0 20px'
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        margin: '1.5rem 0',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '45px',
                            background: darkMode
                                ? 'rgba(122,142,28,0.1)'
                                : 'rgba(238,117,45,0.1)',
                            filter: 'blur(10px)',
                            borderRadius: '10px',
                            zIndex: 0
                        }
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                            fontWeight: 600,
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            position: 'relative',
                            padding: '0.5rem 1.5rem',
                            zIndex: 1,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
                            }
                        }}
                    >
                        Gestion des entreprises
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '1px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
                            }
                        }}
                    />
                </Box>

                <TableContainer className="frameStyle-style"
                    style={{
                        maxHeight: '900px',
                        overflowY: 'auto',
                        backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                    }}>

                    <Table>
                        <TableHead>
                            <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                style={{
                                    backgroundColor: darkMode ? '#535353' : '#0098f950',
                                }}>
                                <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Rue et n°</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Code postal</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Localité</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Tel</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Mail</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>N° entreprise</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>N° Police</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Secteurs</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Ajouter Secteur</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Modifier</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entreprises.map((entreprise, index) => (
                                <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`} key={entreprise._id} style={{
                                    backgroundColor: rowColors[index % rowColors.length],
                                }}>
                                    <TableCell>{entreprise.AddEntreName}</TableCell>
                                    <TableCell>{entreprise.AddEntrRue}</TableCell>
                                    <TableCell>{entreprise.AddEntrCodpost}</TableCell>
                                    <TableCell>{entreprise.AddEntrLocalite}</TableCell>
                                    <TableCell>{entreprise.AddEntrTel}</TableCell>
                                    <TableCell>{entreprise.AddEntrEmail}</TableCell>
                                    <TableCell>{entreprise.AddEntrNumentr}</TableCell>
                                    <TableCell>{entreprise.AddEntrePolice}</TableCell>
                                    <TableCell>{getSecteursByEntreprise(entreprise._id)}</TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour créer un nouveaux secteur pour cette entreprise" arrow>
                                            <Button sx={{
                                                backgroundColor: darkMode ? '#7b1fa2' : '#9c27b0',
                                                transition: 'all 0.1s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#4a0072' : '#7b1fa2',
                                                    transform: 'scale(1.08)',
                                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }}
                                                type="button"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleAddSecteur(entreprise)}>
                                                <AddRoundedIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour éditer cette entreprise" arrow>
                                            <Button sx={{
                                                backgroundColor: darkMode ? '#424242' : '#1976d2',
                                                transition: 'all 0.1s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#505050' : '#1565c0',
                                                    transform: 'scale(1.08)',
                                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEdit(entreprise)}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour supprimer cette entreprise" arrow>
                                            <Button sx={{
                                                backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                transition: 'all 0.1s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#d32f2f' : '#b71c1c',
                                                    transform: 'scale(1.08)',
                                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    confirmAlert({
                                                        customUI: ({ onClose }) => {
                                                            return (
                                                                <div className="custom-confirm-dialog">
                                                                    <h1 className="custom-confirm-title">Supprimer</h1>
                                                                    <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cette entreprise?</p>
                                                                    <div className="custom-confirm-buttons">
                                                                        <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                                            <button
                                                                                className="custom-confirm-button"
                                                                                onClick={() => {
                                                                                    handleDelete(entreprise._id);
                                                                                    onClose();
                                                                                }}
                                                                            >
                                                                                Oui
                                                                            </button>
                                                                        </Tooltip>
                                                                        <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                                                            <button
                                                                                className="custom-confirm-button custom-confirm-no"
                                                                                onClick={onClose}
                                                                            >
                                                                                Non
                                                                            </button>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    });
                                                }}
                                            >
                                                <DeleteForeverIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>
                <CustomSnackbar
                    open={snackbar.open}
                    handleClose={handleCloseSnackbar}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
            </div>
        </form>
    );
}