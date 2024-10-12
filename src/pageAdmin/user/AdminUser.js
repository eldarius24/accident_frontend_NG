import React, { useState, useEffect, useCallback, useTransition } from 'react';
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

export default function Adminuser() {
    const [users, setUsers] = useState([]);
    const [usersIsPending, startGetUsers] = useTransition();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

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
            <div className="frameStyle-style">
                <h2>Getion des utilisateur</h2>

                <TableContainer>
                    <div className="frameStyle-style">
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#0098f950' }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Login</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Password</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#e62a5625' : '#95519b25', borderBottom: '2px solid #000000' }}>
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
                    </div>
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
