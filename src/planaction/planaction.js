import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import config from '../config.json';
import { Link } from 'react-router-dom';
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
import DatePickerP from '../composants/datePickerP';
import RefreshIcon from '@mui/icons-material/Refresh';
import GetAppIcon from '@mui/icons-material/GetApp';

const apiUrl = config.apiUrl;

export default function PlanAction({ accidentData }) {
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const isFileUploadIcon = location.pathname === '/fichierdllaction';

    useEffect(() => {
        axios.get(`http://${apiUrl}:3100/api/planaction`)
            .then(response => {
                let users = response.data;
                setAddactions(users);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    const handleDelete = (userIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/planaction/${userIdToDelete}`)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Utilisateur supprimé avec succès');
                    // Mettre à jour les données après suppression
                    setAddactions(prevAddactions => prevAddactions.filter(addaction => addaction._id !== userIdToDelete));
                } else {
                    console.log('Erreur lors de la suppression de l\'utilisateur, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onSubmit = (data) => {
        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);

        axios.put(`http://${apiUrl}:3100/api/planaction`, data)
            .then(response => {
                console.log('Réponse du serveur en création :', response.data);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
            });
    };
    function refreshListAccidents() {
        // Mettre à jour l'état de chargement
        setLoading(true);

        // Effectuer la requête pour récupérer les données à jour
        axios.get(`http://${apiUrl}:3100/api/planaction`)
            .then(response => {
                // Mettre à jour les données d'utilisateur avec les nouvelles données
                setAddactions(response.data);
            })
            .catch(error => {
                // Gérer les erreurs en affichant un message ou en journalisant
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                // Mettre à jour l'état de chargement après que la requête est terminée
                setLoading(false);
            });
    }



    const [AddAction, setAddAction] = useState(watch('AddAction') ? watch('AddAction') : (accidentData && accidentData.AddAction ? accidentData.AddAction : null));
    const [AddActionDate, setAddActionDate] = useState(watch('AddActionDate') ? watch('AddActionDate') : (accidentData && accidentData.AddActionDate ? accidentData.AddActionDate : null));
    const [AddActionQui, setAddActionQui] = useState(watch('AddActionQui') ? watch('AddActionQui') : (accidentData && accidentData.AddActionQui ? accidentData.AddActionQui : null));
    const [AddActionSecteur, setAddActionSecteur] = useState(watch('AddActionSecteur') ? watch('AddActionSecteur') : (accidentData && accidentData.AddActionSecteur ? accidentData.AddActionSecteur : null));

    useEffect(() => {
        setValue('AddAction', AddAction);
        setValue('AddActionDate', AddActionDate);
        setValue('AddActionQui', AddActionQui);
        setValue('AddActionSecteur', AddActionSecteur);
    }, [AddAction, AddActionDate, AddActionQui, AddActionSecteur, setValue]);






    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Plant d'actions</h2>
                <Button
                    sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none', margin: '20px' }}
                    variant="contained"
                    color="secondary"
                    onClick={refreshListAccidents}
                    startIcon={<RefreshIcon />}
                >
                    Actualiser
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#84a784' }}>
                                <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>A faire pour quand</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Par qui</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Download</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((addaction, index) => (
                                <TableRow key={addaction._id} style={{ backgroundColor: index % 2 === 0 ? '#bed1be' : '#d2e2d2' }}>
                                    <TableCell>{addaction.AddAction}</TableCell>
                                    <TableCell>{addaction.AddActionDate}</TableCell>
                                    <TableCell>{addaction.AddActionQui}</TableCell>
                                    <TableCell>{addaction.AddActionSecteur}</TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Button variant="contained" color="primary">
                                            <EditIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}><Button component={Link} to={isFileUploadIcon ? '/' : '/fichierdllaction'} variant="contained" color="secondary"> <GetAppIcon /></Button></TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Button variant="contained" color="error" onClick={() => { confirmAlert({ customUI: ({ onClose }) => { return (<div className="custom-confirm-dialog"> <h1 className="custom-confirm-title">Supprimer</h1> <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet action?</p> <div className="custom-confirm-buttons"> <button className="custom-confirm-button" onClick={() => { handleDelete(addaction._id); onClose(); }} > Oui </button> <button className="custom-confirm-button custom-confirm-no" onClick={onClose}> Non </button> </div> </div>); } }); }}>
                                            <DeleteForeverIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <h3>Ajouter une action</h3>
                <TextFieldP id='AddAction' label="Ajouter une action" onChange={setAddAction} defaultValue={AddAction}></TextFieldP>
                <DatePickerP id='AddActionDate' label="Ajouter une date" onChange={setAddActionDate} defaultValue={AddActionDate}></DatePickerP>
                <TextFieldP id='AddActionQui' label="Ajouter qui" onChange={setAddActionQui} defaultValue={AddActionQui}></TextFieldP>
                <TextFieldP id='AddActionSecteur' label="Ajouter le secteur" onChange={setAddActionSecteur} defaultValue={AddActionSecteur}></TextFieldP>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: '#84a784',
                            '&:hover': { backgroundColor: 'green' },
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            fontSize: '2rem', // Taille de police de base
                            '@media (min-width: 750px)': {
                                fontSize: '3rem', // Taille de police plus grande pour les écrans plus larges
                            },
                            '@media (max-width: 550px)': {
                                fontSize: '1.5rem', // Taille de police plus petite pour les écrans plus étroits
                            },
                        }}
                        variant="contained"
                    >
                        Créer l'action
                    </Button>
                </div>
            </div>
        </form>
    );
}
