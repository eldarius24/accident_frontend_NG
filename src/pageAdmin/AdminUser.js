import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

// Supposons que vous avez défini apiurl quelque part dans votre code
const apiurl = "127.0.0.1";

export default function Adminusern() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = (userIdToDelete) => {
        axios.delete(`http://${apiurl}:3100/api/users/${userIdToDelete}`)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Utilisateur supprimé avec succès');
                    // Mettre à jour les données après suppression
                    setUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete));
                } else {
                    console.log('Erreur lors de la suppression de l\'utilisateur, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        axios.get(`http://${apiurl}:3100/api/users`)
            .then(response => {
                let users = response.data;
                setUsers(users);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#84a784' }}>
                        <TableCell style={{ fontWeight: 'bold' }}>Login</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Password</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#bed1be' : '#d2e2d2' }}>
                            <TableCell>{user.userLogin}</TableCell>
                            <TableCell>{user.userPassword}</TableCell>
                            <TableCell>{user.userName}</TableCell>
                            <TableCell style={{ padding: 0, width: '70px' }}>
                                <Button variant="contained" color="primary">
                                    <EditIcon />
                                </Button>
                            </TableCell>
                            <TableCell style={{ padding: 0, width: '70px' }}>
                                <Button variant="contained" color="error" onClick={() => { confirmAlert({ customUI: ({ onClose }) => { return (<div className="custom-confirm-dialog"> <h1 className="custom-confirm-title">Supprimer</h1> <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet User?</p> <div className="custom-confirm-buttons"> <button className="custom-confirm-button" onClick={() => { handleDelete(user._id); onClose(); }} > Oui </button> <button className="custom-confirm-button custom-confirm-no" onClick={onClose}> Non </button> </div> </div>); } }); }}>
                                    <DeleteForeverIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
