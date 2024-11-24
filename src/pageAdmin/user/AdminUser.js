import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Tooltip,
    Box,
    Typography
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

    /**
     * Détermine le rôle/statut de l'utilisateur
     */
    const getRole = useCallback((user) => {
        if (user.boolAdministrateur && user.boolDeveloppeur) return 'Administrateur et Développeur';
        if (user.boolAdministrateur) return 'Administrateur';
        if (user.boolDeveloppeur) return 'Développeur';
        if (user.entreprisesConseillerPrevention && user.entreprisesConseillerPrevention.length > 0) {
            return 'Conseiller en prévention';
        }
        return 'Utilisateur';
    }, []);

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']
            : ['#e62a5625', '#95519b25'],
        [darkMode]
    );

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
                        Gestion des utilisateurs
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
                                <TableCell style={{ fontWeight: 'bold' }}>Statut</TableCell>
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
                                    <TableCell>{getRole(user)}</TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Cliquez ici pour éditer cet utilisateur" arrow>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component={Link}
                                                to={`/addUser?userId=${user._id}`}
                                                sx={{
                                                    backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                                    transition: 'all 0.1s ease-in-out',
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
            <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
                <h5 style={{ marginBottom: '40px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '1rem',
                            marginBottom: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '300%',
                                height: '100%',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                                animation: 'shine 3s infinite linear',
                                '@keyframes shine': {
                                    to: {
                                        transform: 'translateX(50%)'
                                    }
                                }
                            }
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                fontWeight: 500,
                                letterSpacing: '0.1em',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '50px',
                                background: darkMode
                                    ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                                    : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                                backdropFilter: 'blur(5px)',
                                border: darkMode
                                    ? '1px solid rgba(122,142,28,0.2)'
                                    : '1px solid rgba(238,117,45,0.2)',
                                color: darkMode ? '#ffffff' : '#2D3748',
                                boxShadow: darkMode
                                    ? '0 4px 6px rgba(0,0,0,0.1)'
                                    : '0 4px 6px rgba(238,117,45,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                position: 'relative',
                                transform: 'translateY(0)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: darkMode
                                        ? '0 6px 12px rgba(0,0,0,0.2)'
                                        : '0 6px 12px rgba(238,117,45,0.2)',
                                    '& .highlight': {
                                        color: darkMode ? '#7a8e1c' : '#ee752d'
                                    }
                                }
                            }}
                        >
                            <span>Développé par </span>
                            <span className="highlight" style={{
                                transition: 'color 0.3s ease',
                                fontWeight: 700
                            }}>
                                Remy
                            </span>
                            <span> & </span>
                            <span className="highlight" style={{
                                transition: 'color 0.3s ease',
                                fontWeight: 700
                            }}>
                                Benoit
                            </span>
                            <span> pour </span>
                            <span style={{
                                background: darkMode
                                    ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                    : 'linear-gradient(45deg, #ee752d, #f4a261)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: 700
                            }}>
                                Le Cortigroupe
                            </span>
                            <span style={{
                                fontSize: '1.2em',
                                marginLeft: '4px',
                                background: darkMode
                                    ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                    : 'linear-gradient(45deg, #ee752d, #f4a261)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                ®
                            </span>
                        </Typography>
                    </Box>
                </h5>
            </Tooltip>
        </form>
    );
}