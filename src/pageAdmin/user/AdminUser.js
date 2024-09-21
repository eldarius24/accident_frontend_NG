import React, { useState, useEffect, useCallback, useTransition } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinearProgress from '@mui/material/LinearProgress';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import getUsers from './_actions/get-users';
import deleteUser from './_actions/delete-user';
import { Link } from 'react-router-dom';

export default function Adminuser() {
    const [users, setUsers] = useState([]);
    const [usersIsPending, startGetUsers] = useTransition();

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
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'utilisateur:', error.message);
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

                if (!users)
                    throw new Error('Aucun utilisateur trouvé');

                setUsers(users);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error.message);
            }
        });
    }, []);

    useEffect(() => {
        getAllUsers();
    }, [setUsers]);

    /**
     * PopUp de confirmation de suppression
     */
    const popUpDelete = () => {
        confirmAlert(
            {
                customUI: ({ onClose }) => {
                    return (
                        <div className="custom-confirm-dialog">
                            <h1 className="custom-confirm-title">Supprimer</h1>
                            <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet User?</p>
                            <div className="custom-confirm-buttons">
                                <button className="custom-confirm-button" onClick={() => {
                                    handleDelete(user._id);
                                    onClose();
                                }} >
                                    Oui
                                </button>
                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                    Non
                                </button>
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
                                <TableRow style={{ backgroundColor: '#0098f9' }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Login</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Password</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#e62a5665' : '#95519b62', borderBottom: '2px solid #000000' }}>
                                        <TableCell>{user.userLogin}</TableCell>
                                        <TableCell>{user.userPassword}</TableCell>
                                        <TableCell>{user.userName}</TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="primary" component={Link} to={`/addUser?userId=${user._id}`}>
                                                <EditIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="error" onClick={() => popUpDelete()}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TableContainer>

            </div>

            <div className="image-cortigroupe"></div>
            <h5> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>

        </form>

    );
}
