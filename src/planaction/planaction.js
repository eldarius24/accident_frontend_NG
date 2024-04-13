import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom'; // Importez useLocation
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
    Checkbox,
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
    const location = useLocation(); // Utilisez useLocation
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
                if (response.status === 204 || response.status === 200) {
                    console.log('Utilisateur supprimé avec succès');
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
        setLoading(true);
        axios.get(`http://${apiUrl}:3100/api/planaction`)
            .then(response => {
                setAddactions(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const [AddAction, setAddAction] = useState(watch('AddAction') ? watch('AddAction') : (accidentData && accidentData.AddAction ? accidentData.AddAction : null));
    const [AddActionDate, setAddActionDate] = useState(watch('AddActionDate') ? watch('AddActionDate') : (accidentData && accidentData.AddActionDate ? accidentData.AddActionDate : null));
    const [AddActionQui, setAddActionQui] = useState(watch('AddActionQui') ? watch('AddActionQui') : (accidentData && accidentData.AddActionQui ? accidentData.AddActionQui : null));
    const [AddActionSecteur, setAddActionSecteur] = useState(watch('AddActionSecteur') ? watch('AddActionSecteur') : (accidentData && accidentData.AddActionSecteur ? accidentData.AddActionSecteur : null));
    const [AddActionEntreprise, setAddActionEntreprise] = useState(watch('AddActionEntreprise') ? watch('AddActionEntreprise') : (accidentData && accidentData.AddActionEntreprise ? accidentData.AddActionEntreprise : null));
    const [AddboolStatus, setAddboolStatus] = useState(watch('AddboolStatus') ? watch('AddboolStatus') : (accidentData && accidentData.AddboolStatus ? accidentData.AddboolStatus : false));

    useEffect(() => {
        setValue('AddAction', AddAction);
        setValue('AddActionDate', AddActionDate);
        setValue('AddActionQui', AddActionQui);
        setValue('AddActionSecteur', AddActionSecteur);
        setValue('AddActionEntreprise', AddActionEntreprise);
        setValue('AddboolStatus', AddboolStatus);
    }, [AddAction, AddActionDate, AddActionQui, AddActionSecteur, AddActionEntreprise, AddboolStatus, setValue]);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    const rowColors = ['#bed1be', '#d2e2d2']; // Tableau de couleurs pour les lignes

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Plan d'actions</h2>
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
                    <div className="frameStyle-style">
                        <Table>
                            <TableHead>
                                <React.Fragment>
                                    <TableRow style={{ backgroundColor: '#84a784' }} key={"CellTowerSharp"}>
                                        <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>A faire pour quand</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Par qui</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Download</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                                    </TableRow>
                                    <TableRow className="table-row-separatormenu"></TableRow>
                                </React.Fragment>
                            </TableHead>
                            <TableBody>
                                {users.map((addaction, index) => (
                                    <TableRow key={addaction._id} style={{ backgroundColor: rowColors[index % rowColors.length], borderBottom: '3px solid #84a784'}}>
                                        <TableCell>
                                            <Checkbox
                                                defaultChecked
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }}
                                                color="success"
                                                checked={addaction.AddboolStatus}
                                                onChange={() => {
                                                    // Inversez la valeur de AddboolStatus lors du changement de case à cocher
                                                    setAddboolStatus(!addaction.AddboolStatus);
                                                    // Mettez à jour le statut dans la base de données immédiatement après le changement
                                                    axios.put(`http://${apiUrl}:3100/api/planaction/${addaction._id}`, {
                                                        // Ajoutez le statut mis à jour à la requête PUT
                                                        AddboolStatus: !addaction.AddboolStatus
                                                    })
                                                        .then(response => {
                                                            console.log('Statut mis à jour avec succès:', response.data);
                                                            // Actualisez la liste des accidents après la mise à jour du statut
                                                            refreshListAccidents();
                                                        })
                                                        .catch(error => {
                                                            console.error('Erreur lors de la mise à jour du statut:', error.message);
                                                        });
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{addaction.AddActionEntreprise}</TableCell>
                                        <TableCell>{addaction.AddActionSecteur}</TableCell>
                                        <TableCell>{addaction.AddAction}</TableCell>
                                        <TableCell>{addaction.AddActionDate}</TableCell>
                                        <TableCell>{addaction.AddActionQui}</TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="primary">
                                                <EditIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button component={Link} to={isFileUploadIcon ? '/' : '/fichierdllaction'} variant="contained" color="secondary">
                                                <GetAppIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="error" onClick={() => {
                                                confirmAlert({
                                                    customUI: ({ onClose }) => (
                                                        <div className="custom-confirm-dialog">
                                                            <h1 className="custom-confirm-title">Supprimer</h1>
                                                            <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet action?</p>
                                                            <div className="custom-confirm-buttons">
                                                                <button className="custom-confirm-button" onClick={() => { handleDelete(addaction._id); onClose(); }}>Oui</button>
                                                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>Non</button>
                                                            </div>
                                                        </div>
                                                    )
                                                });
                                            }}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TableContainer>
                <h3>Ajouter une action</h3>
                <TextFieldP id='AddActionEntreprise' label="Entreprise" onChange={setAddActionEntreprise} defaultValue={AddActionEntreprise}></TextFieldP>
                <TextFieldP id='AddActionSecteur' label="Ajouter le secteur" onChange={setAddActionSecteur} defaultValue={AddActionSecteur}></TextFieldP>
                <TextFieldP id='AddAction' label="Ajouter une action" onChange={setAddAction} defaultValue={AddAction}></TextFieldP>
                <DatePickerP id='AddActionDate' label="Ajouter une date" onChange={setAddActionDate} defaultValue={AddActionDate}></DatePickerP>
                <TextFieldP id='AddActionQui' label="Ajouter qui" onChange={setAddActionQui} defaultValue={AddActionQui}></TextFieldP>

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
