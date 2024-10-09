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
    LinearProgress
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';

export default function Adminusern() {
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

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const getSecteursByEntreprise = (entrepriseId) => {
        return secteurs.filter(secteur => secteur.entrepriseId === entrepriseId)
            .map(secteur => secteur.secteurName)
            .join(', ');
    };

    const handleAddSecteur = (entreprise) => {
        try {
            navigate("/addSecteur", { state: { entreprise } });
        } catch (error) {
            console.error("Error navigating to addSecteur:", error);
        }
    };

    const handleDelete = (entrepriseIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/entreprises/${entrepriseIdToDelete}`)
            .then(response => {
                if (response.status === 204 || response.status === 200) {
                    showSnackbar('Entreprise supprimée avec succès', 'success');
                    console.log('Entreprise supprimée avec succès');
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
            <div className="frameStyle-style">
                <h2>Gestion des entreprises</h2>
                <TableContainer>
                    <div className="frameStyle-style">
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#0098f950' }}>
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
                                    <TableRow key={entreprise._id} style={{ backgroundColor: index % 2 === 0 ? '#e62a5625' : '#95519b25', borderBottom: '2px solid #000000' }}>
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
                                            <Button type="button" variant="contained" color="secondary" onClick={() => handleAddSecteur(entreprise)}>
                                                <AddRoundedIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="primary">
                                                <EditIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button 
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
                                                                        <button 
                                                                            className="custom-confirm-button" 
                                                                            onClick={() => {
                                                                                handleDelete(entreprise._id);
                                                                                onClose();
                                                                            }}
                                                                        >
                                                                            Oui
                                                                        </button>
                                                                        <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                                                            Non
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    });
                                                }}
                                            >
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TableContainer>
                <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
            </div>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}>Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
        </form>
    );
}