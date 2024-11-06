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
import { Link } from 'react-router-dom';
import CustomSnackbar from '../../_composants/CustomSnackbar';
import { useTheme } from '../../pageAdmin/user/ThemeContext';
import showDeleteConfirm from '../../pageFormulaire/FileManagement/showDeleteConfirm';
import getUsers from './_actions/get-users';
import deleteUser from './_actions/delete-user';
import { blueGrey } from '@mui/material/colors';
/**
 * Adminuser est un composant React qui permet de gérer les utilisateurs.
 * Il affiche une table avec les informations de chaque utilisateur, 
 * ainsi que des boutons pour modifier et supprimer.
 */
export default function Adminuser() {
    const { darkMode } = useTheme();
    const [users, setUsers] = useState([]);
    const [usersIsPending, startGetUsers] = useTransition();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']
            : ['#e62a5625', '#95519b25'],
        [darkMode]
    );

    /**
     * Affiche un message dans une snackbar.
     */
    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    /**
     * Ferme la snackbar
     */
    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    /**
     * Supprime un utilisateur
     */
    const handleUserDeletion = useCallback(async (userIdToDelete) => {
        try {
            await deleteUser(userIdToDelete);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete));
            showSnackbar('Utilisateur supprimé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            showSnackbar('Erreur lors de la suppression de l\'utilisateur', 'error');
        }
    }, [showSnackbar]);

    /**
     * Affiche la confirmation de suppression
     */
    const handleUserDelete = useCallback((userId) => {
        showDeleteConfirm({
            message: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
            onConfirm: () => handleUserDeletion(userId)
        });
    }, [handleUserDeletion]);

    /**
     * Récupère tous les utilisateurs
     */
    const getAllUsers = useCallback(async () => {
        try {
            const fetchedUsers = await getUsers();
            if (!fetchedUsers) {
                throw new Error('Aucun utilisateur trouvé');
            }
            setUsers(fetchedUsers);
            showSnackbar('Utilisateurs chargés avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            showSnackbar('Erreur lors de la récupération des utilisateurs', 'error');
        }
    }, [showSnackbar]);

    useEffect(() => {
        startGetUsers(getAllUsers);
    }, [getAllUsers, startGetUsers]);

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
                <h2>Gestion des utilisateurs</h2>

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
                            <TableRow
                                className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                style={{
                                    backgroundColor: darkMode ? '#535353' : '#0098f950',
                                }}
                            >
                                <TableCell style={{ fontWeight: 'bold' }}>Login</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Password</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow
                                    key={user._id}
                                    className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                    style={{
                                        backgroundColor: rowColors[index % rowColors.length],
                                    }}
                                >
                                    <TableCell>{user.userLogin}</TableCell>
                                    <TableCell>{user.userPassword}</TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour éditer cet utilisateur" arrow>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component={Link}
                                                to={`/addUser?userId=${user._id}`}
                                                sx={{
                                                    backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                                    transition: 'all 0.3s ease-in-out',
                                                    '&:hover': {
                                                        backgroundColor: darkMode ? blueGrey[900] : blueGrey[700],
                                                        transform: 'scale(1.08)',
                                                        boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: darkMode ? '#fff' : 'inherit'
                                                    }
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour supprimer cet utilisateur" arrow>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleUserDelete(user._id)}
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
                                                    }
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

            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}>
                    Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be
                </h5>
            </Tooltip>
        </form>
    );
}