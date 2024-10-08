import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import config from '../config.json';

export default function AddSecteur() {
    const location = useLocation();
    const entreprise = location.state.entreprise;
    const [secteurs, setSecteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const apiUrl = config.apiUrl;
    const [secteurName, setSecteurName] = useState('');
    

    useEffect(() => {
        setValue('secteurName', secteurName);
    }, [secteurName, setValue]);

    const fetchSecteurs = async () => {
        try {
            console.log('Fetching secteurs...');
            const response = await axios.get(`http://${apiUrl}:3100/api/secteurs`);
            console.log('Fetched secteurs:', response.data);
            const filteredSecteurs = response.data.filter(secteur => secteur.entrepriseId === entreprise._id);
            console.log('Filtered secteurs:', filteredSecteurs);
            setSecteurs(filteredSecteurs);
        } catch (error) {
            console.error('Error fetching secteurs:', error);
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSecteurs();
    }, [apiUrl, entreprise._id]);

    const onSubmit = async (data) => {
        try {
            data.entrepriseId = entreprise._id;
            console.log('Adding secteur:', data);
            const response = await axios.put(`http://${apiUrl}:3100/api/secteurs`, data);
            console.log('Secteur added:', response.data);
            await fetchSecteurs();
            setSecteurName('');
            
        } catch (error) {
            console.error('Error adding secteur:', error);
            
        }
    };

    const handleDelete = async (secteurId) => {
        try {
            console.log('Deleting secteur:', secteurId);
            const response = await axios.delete(`http://${apiUrl}:3100/api/secteurs/${secteurId}`);
            console.log('Delete response:', response);
            
            if (response.status === 200 || response.status === 204) {
                console.log('Secteur deleted successfully');
                await fetchSecteurs();
                
            } else {
                console.error('Unexpected response status:', response.status);
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error deleting secteur:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            
        }
    };

    
    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Créer un nouveau secteur pour {entreprise.AddEntreName}</h2>

                <TextFieldP id='secteurName' label="Nom du secteur" onChange={setSecteurName} value={secteurName} />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: '#0098f9',
                            '&:hover': { backgroundColor: 'green' },
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            fontSize: '2rem',
                            '@media (min-width: 750px)': {
                                fontSize: '3rem',
                            },
                            '@media (max-width: 550px)': {
                                fontSize: '1.5rem',
                            },
                        }}
                        variant="contained"
                    >
                        Ajouter le secteur
                    </Button>
                </div>

                <div>
                    <h2>Secteurs de l'entreprise</h2>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#0098f950' }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Nom du secteur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {secteurs.map((secteur) => (
                                    <TableRow key={secteur._id}>
                                        <TableCell>{secteur.secteurName}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary">
                                                <EditIcon />
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="error" 
                                                onClick={() => {
                                                    confirmAlert({
                                                        customUI: ({ onClose }) => {
                                                            return (
                                                                <div className="custom-confirm-dialog">
                                                                    <h1 className="custom-confirm-title">Supprimer</h1>
                                                                    <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer ce secteur ?</p>
                                                                    <div className="custom-confirm-buttons">
                                                                        <button 
                                                                            className="custom-confirm-button" 
                                                                            onClick={() => {
                                                                                handleDelete(secteur._id);
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
                    </TableContainer>
                </div>
            </div>
            
                
            
        </form>
    );
}