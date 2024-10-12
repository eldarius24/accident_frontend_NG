import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import AutoCompleteP from '../_composants/autoCompleteP';
import AutoCompleteQ from '../_composants/autoCompleteQ';
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
    Grid,
} from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinearProgress from '@mui/material/LinearProgress';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DatePickerP from '../_composants/datePickerP';
import RefreshIcon from '@mui/icons-material/Refresh';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import listeaddaction from '../liste/listeaddaction.json';

const apiUrl = config.apiUrl;

export default function PlanAction({ accidentData }) {
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const location = useLocation();
    const isFileUploadIcon = location.pathname === '/fichierdllaction';
    const [searchTerm, setSearchTerm] = useState('');

    // New state for enterprises and sectors
    const [enterprises, setEnterprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [actionsResponse, enterprisesResponse, sectorsResponse] = await Promise.all([
                    axios.get(`http://${apiUrl}:3100/api/planaction`),
                    axios.get(`http://${apiUrl}:3100/api/entreprises`),
                    axios.get(`http://${apiUrl}:3100/api/secteurs`)
                ]);

                setAddactions(actionsResponse.data);
                setEnterprises(enterprisesResponse.data.map(e => ({ id: e._id, name: e.AddEntreName })));
                setAllSectors(sectorsResponse.data);
                setAvailableSectors(sectorsResponse.data.map(s => s.secteurName));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(addaction => {
        if (!searchTerm) {
            return true; // Retourne true pour inclure toutes les entrées si searchTerm est vide
        }

        return (
            (addaction.AddActionEntreprise && addaction.AddActionEntreprise.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionSecteur && addaction.AddActionSecteur.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddAction && addaction.AddAction.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionQui && addaction.AddActionQui.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActoinmoi && addaction.AddActoinmoi.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (addaction.AddActionanne && addaction.AddActionanne.toLowerCase().includes(searchTerm.toLowerCase()))

        );
    });


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
                window.location.reload();
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

    const [AddAction, setAddAction] = useState(watch('AddAction') || (accidentData && accidentData.AddAction) || '');
    const [AddActionDate, setAddActionDate] = useState(watch('AddActionDate') || (accidentData && accidentData.AddActionDate) || null);
    const [AddActionQui, setAddActionQui] = useState(watch('AddActionQui') || (accidentData && accidentData.AddActionQui) || '');
    const [AddActionSecteur, setAddActionSecteur] = useState(watch('AddActionSecteur') || (accidentData && accidentData.AddActionSecteur) || '');
    const [AddActionEntreprise, setAddActionEntreprise] = useState(watch('AddActionEntreprise') || (accidentData && accidentData.AddActionEntreprise) || '');
    const [AddboolStatus, setAddboolStatus] = useState(watch('AddboolStatus') || (accidentData && accidentData.AddboolStatus) || false);
    const [AddActionanne, setAddActionanne] = useState(watch('AddActionanne') || (accidentData && accidentData.AddActionanne) || '');
    const [AddActoinmoi, setAddActoinmoi] = useState(watch('AddActoinmoi') || (accidentData && accidentData.AddActoinmoi) || '');

    useEffect(() => {
        setValue('AddAction', AddAction);
        setValue('AddActionDate', AddActionDate);
        setValue('AddActionQui', AddActionQui);
        setValue('AddActionSecteur', AddActionSecteur);
        setValue('AddActionEntreprise', AddActionEntreprise);
        setValue('AddboolStatus', AddboolStatus);
        setValue('AddActionanne', AddActionanne);
        setValue('AddActoinmoi', AddActoinmoi);
    }, [AddAction, AddActionDate, AddActionQui, AddActionSecteur, AddActionEntreprise, AddboolStatus, AddActionanne, AddActoinmoi, setValue]);

    const handleEnterpriseSelect = (entrepriseSelect) => {
        setAddActionEntreprise(entrepriseSelect);
        setValue('AddActionEntreprise', entrepriseSelect);

        // Filter sectors based on selected enterprise
        const selectedEnterprise = enterprises.find(e => e.name === entrepriseSelect);
        if (selectedEnterprise) {
            const linkedSectors = allSectors
                .filter(s => s.entrepriseId === selectedEnterprise.id)
                .map(s => s.secteurName);
            setAvailableSectors(linkedSectors);
            // Reset sector selection
            setAddActionSecteur('');
            setValue('AddActionSecteur', '');
        } else {
            // If no enterprise is selected, show all sectors
            setAvailableSectors(allSectors.map(s => s.secteurName));
        }
    };


    if (loading) {
        return <LinearProgress color="success" />;
    }

    const rowColors = ['#e62a5625', '#95519b25']; // Tableau de couleurs pour les lignes

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Plan d'actions</h2>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ marginLeft: '20px', marginRight: '20px', color: 'black', padding: '15px 60px', backgroundColor: '#ee742d59', '&:hover': { backgroundColor: '#95ad22' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="secondary"
                        onClick={refreshListAccidents}
                        startIcon={<RefreshIcon />}
                    >
                        Actualiser
                    </Button>
                    <TextFieldP
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ boxShadow: 3, backgroundColor: '#ee742d59' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <TableContainer>
                    <div className="frameStyle-style">
                        <Table>
                            <TableHead>
                                <React.Fragment>
                                    <TableRow style={{ backgroundColor: '#84a784' }} key={"CellTowerSharp"}>
                                        <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Année</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Mois</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Crée quand</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Par qui</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Download</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                                    </TableRow>
                                    <TableRow className="table-row-separatormenu"></TableRow>
                                </React.Fragment>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((addaction, index) => (
                                    <TableRow key={addaction._id} style={{ backgroundColor: rowColors[index % rowColors.length], borderBottom: '3px solid #84a784' }}>
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
                                        <TableCell>{addaction.AddActionanne}</TableCell>
                                        <TableCell>{addaction.AddActoinmoi}</TableCell>
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
                <TextFieldP id='AddActionanne' label="Pour quelle annee" onChange={setAddActionanne} defaultValue={AddActionanne}></TextFieldP>
                <AutoCompleteP id='AddActoinmoi' option={listeaddaction.AddActoinmoi} label='Réalisation en' onChange={(AddActoinmoiSelect) => {
                    setAddActoinmoi(AddActoinmoiSelect);
                    setValue('AddActoinmoi', AddActoinmoiSelect);
                }} defaultValue={AddActoinmoi} />
                <AutoCompleteQ
                    id='AddActionEntreprise'
                    option={enterprises.map(e => e.name)}
                    label="Entreprise"
                    onChange={handleEnterpriseSelect}
                    value={AddActionEntreprise}
                />
                <AutoCompleteQ
                    id='AddActionSecteur'
                    option={availableSectors}
                    label="Secteur"
                    onChange={(secteurSelect) => {
                        setAddActionSecteur(secteurSelect);
                        setValue('AddActionSecteur', secteurSelect);
                    }}
                    value={AddActionSecteur}
                    disabled={!AddActionEntreprise} // Disable if no enterprise is selected
                />
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
