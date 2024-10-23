import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinearProgress from '@mui/material/LinearProgress';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import getUsers from './_actions/get-users';
import deleteUser from './_actions/delete-user';
import { Link } from 'react-router-dom';
import CustomSnackbar from '../../_composants/CustomSnackbar';
import { useTheme } from '../../pageAdmin/user/ThemeContext';
/**
 * Adminuser est un composant React qui permet de gérer les utilisateurs.
 * Il affiche une table avec les informations de chaque utilisateur, 
 * ainsi que des boutons pour modifier et supprimer.
 * Il utilise les hooks useState, useEffect et useCallback pour gérer les données
 * des utilisateurs et des secteurs.
 * 
 * @returns Un JSX element représentant le composant Adminuser
 */
export default function Adminuser() {
    const { darkMode, toggleDarkMode } = useTheme();
    const [users, setUsers] = useState([]);
    const [usersIsPending, startGetUsers] = useTransition();
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
     * Supression d'un utilisateur
     * 
     * @param {*} userIdToDelete id de l'utilisateur à supprimer 
     */
    const handleDelete = (userIdToDelete) => {
        startGetUsers(() => {
            try {
                deleteUser(userIdToDelete);
                setUsers(users.filter(user => user._id !== userIdToDelete));
                showSnackbar('Utilisateur supprimée avec succès', 'success');
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'utilisateur:', error.message);
                showSnackbar('Erreur lors de la suppression de l\'utilisateur:', 'error');
            }
        });
    };

    /**
     * Récupérer tous les utilisateurs
     * 
     * @returns {Promise<void>}
     */
    const getAllUsers = useCallback(() => {
        startGetUsers(async () => {
            try {
                const users = await getUsers();
                showSnackbar('Utilisateurs chargés avec succès', 'success');
                if (!users)
                    throw new Error('Aucun utilisateur trouvé');
                showSnackbar('Utilisateur Chargé avec succès', 'success');

                setUsers(users);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error.message);
                showSnackbar('Erreur lors de la récupération des utilisateurs:', 'error');
            }
        });
    }, []);

    useEffect(() => {
        getAllUsers();
    }, [setUsers]);

    /**
     * PopUp de confirmation de suppression
     */
    const popUpDelete = (userId) => {
        confirmAlert(
            {
                /**
                 * Fonction personnalisée pour afficher une boîte de dialogue de confirmation de suppression
                 * 
                 * Cette fonction retourne un JSX élément représentant une boîte de dialogue personnalisée.
                 * La boîte de dialogue affiche un titre, un message de confirmation et des boutons "Oui" et "Non".
                 * Lorsque l'utilisateur clique sur le bouton "Oui", la fonction handleDelete est appelée pour supprimer l'utilisateur.
                 * Lorsque l'utilisateur clique sur le bouton "Non", la boîte de dialogue se ferme.
                 * 
                 * @param {object} onClose - La fonction de rappel pour fermer la boîte de dialogue
                 */
                customUI: ({ onClose }) => {
                    return (
                        <div className="custom-confirm-dialog">
                            <h1 className="custom-confirm-title">Supprimer</h1>
                            <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet User?</p>
                            <div className="custom-confirm-buttons">
                                <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                    <button className="custom-confirm-button" onClick={() => {
                                        handleDelete(userId);
                                        onClose();
                                    }} >
                                        Oui
                                    </button>
                                </Tooltip>
                                <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                    <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                        Non
                                    </button>
                                </Tooltip>
                            </div>
                        </div>);
                }
            });
    };

    if (usersIsPending) {
        return <LinearProgress color="success" />;
    }

    return (
        <form>
            <div style={{
                backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                margin: '0 20px'
            }}>
                <h2>Getion des utilisateur</h2>

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
                                <TableCell style={{ fontWeight: 'bold' }}>Login</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Password</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`} style={{
                                    backgroundColor: rowColors[index % rowColors.length],
                                }}>
                                    <TableCell>{user.userLogin}</TableCell>
                                    <TableCell>{user.userPassword}</TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour éditer cette utilisateur" arrow>
                                            <Button variant="contained" color="primary" component={Link} to={`/addUser?userId=${user._id}`}>
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour supprimer cette utilisateur" arrow>
                                            <Button variant="contained" color="error" onClick={() => popUpDelete(user._id)}>
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

            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>

        </form>

    );
}
