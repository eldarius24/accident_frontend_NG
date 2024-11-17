import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import TextFieldP from '../_composants/textFieldP';
import '../pageFormulaire/formulaire.css';
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
    Paper
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import config from '../config.json';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../pageAdmin/user/ThemeContext';

/**
 * AddSecteur
 * @description Page pour ajouter un secteur à une entreprise.
 * @param {object} location - L'objet location du router.
 * @returns {JSX.Element} La page pour ajouter un secteur.
 */
export default function AddSecteur() {
    const { darkMode } = useTheme();
    const location = useLocation();
    const entreprise = location.state.entreprise;
    const [secteurs, setSecteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { register, setValue, handleSubmit } = useForm();
    const apiUrl = config.apiUrl;
    const [secteurName, setSecteurName] = useState('');
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

    /**
     * Affiche un message dans une snackbar.
     * @param {string} message - Le message à afficher.
     * @param {string} [severity='info'] - La gravité du message. Les valeurs possibles sont 'info', 'success', 'warning' et 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Closes the snackbar when the user clicks outside of it.
     * 
     * @param {object} event - The event that triggered the function.
     * @param {string} reason - The reason the function was triggered. If the user
     *                         clicked outside of the snackbar, this will be
     *                         'clickaway'.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        setValue('secteurName', secteurName);
    }, [secteurName, setValue]);

    /**
     * Fetches secteurs from the API and filters them by entrepriseId.
     * Updates the component state with the filtered secteurs.
     * Shows a success snackbar if the operation is successful, an error snackbar otherwise.
     * Finally, sets loading to false.
     */
    const fetchSecteurs = async () => {
        try {

            const response = await axios.get(`http://${apiUrl}:3100/api/secteurs`);
            const filteredSecteurs = response.data.filter(secteur => secteur.entrepriseId === entreprise._id);
            setSecteurs(filteredSecteurs);
            showSnackbar('Secteurs chargés avec succès', 'success');
        } catch (error) {
            console.error('Error fetching secteurs:', error);
            showSnackbar('Erreur lors du chargement des secteurs', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSecteurs();
    }, [apiUrl, entreprise._id]);

    /**
     * Submits the form data to add a new secteur to the specified entreprise.
     * 
     * - Sets the entrepriseId in the data object.
     * - Sends a PUT request to the server to add the secteur.
     * - Fetches the updated list of secteurs upon success.
     * - Resets the secteurName field.
     * - Displays a success or error message via a snackbar.
     * 
     * @param {object} data - The form data containing secteur details.
     * @async
     */
    const onSubmit = async (data) => {
        try {
            // Vérifier que le nom du secteur n'est pas vide
            if (!data.secteurName?.trim()) {
                showSnackbar('Le nom du secteur est requis', 'error');
                return;
            }

            const sectorData = {
                secteurName: data.secteurName,
                entrepriseId: entreprise._id
            };

            const response = await axios.post(`http://${apiUrl}:3100/api/secteurs`, sectorData);

            if (response.status === 201) {
                await fetchSecteurs();
                setSecteurName('');
                showSnackbar('Secteur ajouté avec succès', 'success');
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding secteur:', error);
            showSnackbar('Erreur lors de l\'ajout du secteur', 'error');
        }
    };

    /**
     * Deletes a secteur by sending a DELETE request to the server.
     * 
     * @param {string} secteurId - The ID of the secteur to be deleted.
     * @async
     */
    const handleDelete = async (secteurId) => {
        try {
            const response = await axios.delete(`http://${apiUrl}:3100/api/secteurs/${secteurId}`);

            if (response.status === 200 || response.status === 204) {
                await fetchSecteurs();
                showSnackbar('Secteur supprimé avec succès', 'success');
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting secteur:', error);
            showSnackbar(
                error.response?.data?.message || 'Erreur lors de la suppression du secteur',
                'error'
            );
        }
    };

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <form style={{ margin: '0 20px' }} onSubmit={handleSubmit(onSubmit)}>
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
                <h2>Créer un nouveau secteur pour {entreprise.AddEntreName}</h2>

                <TextFieldP
                    id='secteurName'
                    label="Nom du secteur"
                    {...register('secteurName')} // Assurez-vous que ceci est défini
                    value={secteurName} // Vérifiez que secteurName est bien défini
                    onChange={(e) => {
                        // Assurez-vous que 'e' est un événement valide
                        const value = e; // e contient la valeur ici, pas l'événement
                        setSecteurName(value); // Mettez à jour secteurName
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Cliquez ici pour enregistrer le secteur dans l'entreprise" arrow>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                padding: '10px 20px',
                                width: '50%',
                                marginTop: '1cm',
                                height: '300%',
                                fontSize: '2rem',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                textTransform: 'none',
                                '@media (min-width: 750px)': {
                                    fontSize: '3rem',
                                },
                                '@media (max-width: 550px)': {
                                    fontSize: '1.5rem',
                                }
                            }}
                            variant="contained"
                        >
                            Enregistrer le secteur
                        </Button>
                    </Tooltip>
                </div>
</Paper>
                <div>
                    <h2>Secteurs de l'entreprise</h2>
                    <TableContainer
                        className="frameStyle-style"
                        style={{
                            maxHeight: '600px',
                            overflowY: 'auto',
                            backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                    style={{
                                        backgroundColor: darkMode ? '#535353' : '#0098f950',
                                    }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Nom du secteur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {secteurs.map((secteur, index) => (
                                    <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                        key={secteur._id}
                                        style={{
                                            backgroundColor: rowColors[index % rowColors.length],
                                        }}>
                                        <TableCell>{secteur.secteurName}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Cliquez ici pour supprimer cette entreprise" arrow>
                                                <Button
                                                    sx={{
                                                        backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? '#d32f2f' : '#b71c1c',
                                                            transform: 'scale(1.08)',
                                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        },
                                                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                                    }}
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        confirmAlert({
                                                            customUI: ({ onClose }) => {
                                                                return (
                                                                    <div
                                                                        className="custom-confirm-dialog"
                                                                        style={{
                                                                            backgroundColor: darkMode ? '#424242' : '#fff',
                                                                            color: darkMode ? '#fff' : 'inherit',
                                                                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                                                                        }}
                                                                    >
                                                                        <h1
                                                                            className="custom-confirm-title"
                                                                            style={{ color: darkMode ? '#fff' : 'inherit' }}
                                                                        >
                                                                            Supprimer
                                                                        </h1>
                                                                        <p
                                                                            className="custom-confirm-message"
                                                                            style={{ color: darkMode ? '#fff' : 'inherit' }}
                                                                        >
                                                                            Êtes-vous sûr de vouloir supprimer ce secteur ?
                                                                        </p>
                                                                        <div className="custom-confirm-buttons">
                                                                            <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                                                                <button
                                                                                    className="custom-confirm-button"
                                                                                    onClick={() => {
                                                                                        handleDelete(secteur._id);
                                                                                        onClose();
                                                                                    }}
                                                                                    style={{
                                                                                        backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                                                        color: '#fff',
                                                                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                                                                    }}
                                                                                >
                                                                                    Oui
                                                                                </button>
                                                                            </Tooltip>
                                                                            <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                                                                <button
                                                                                    className="custom-confirm-button custom-confirm-no"
                                                                                    onClick={onClose}
                                                                                    style={{
                                                                                        backgroundColor: darkMode ? '#424242' : '#f5f5f5',
                                                                                        color: darkMode ? '#fff' : 'inherit',
                                                                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                                                                    }}
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
                </div>
           
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </form>
    );
}
