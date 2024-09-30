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
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinearProgress from '@mui/material/LinearProgress';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';


export default function Adminusern() {
    const navigate = useNavigate();
    const [entreprises, setEntreprises] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = config.apiUrl;

    const secteursInEntreprise = (idEntreprise) => {
        return secteurs.filter((secteur) => secteur.EntrepriseId === idEntreprise);
    };

    const handleAddSecteur = (entreprise) => {
        console.log("AdminEntreprises -> handleAddSecteur -> entreprise", entreprise);
        try {
            navigate("/addSecteur", { state: { entreprise } });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = (entrepriseIdToDelete) => {
        axios.delete(`http://${apiUrl}:3100/api/entreprises/${entrepriseIdToDelete}`)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Entreprise supprimée avec succès');
                    // Mettre à jour les données après suppression
                    setEntreprises(prevUsers => prevUsers.filter(entreprise => entreprise._id !== entrepriseIdToDelete));
                } else {
                    console.log('Erreur lors de la suppression de l\'utilisateur, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        axios.get(`http://${apiUrl}:3100/api/entreprises`)
            .then(response => {
                let entreprises = response.data;
                let listSecteurs = "";
                entreprises.map ((entreprise) => {
                    secteursInEntreprise(entreprise._id).map((secteur) => {
                       listSecteurs = listSecteurs + " " + secteur.NomSecteur + " , "
                })})
                console.log(listSecteurs);
                console.log(entreprises);
                setEntreprises(entreprises);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        //demande a l'apide m'envoyer la liste des secteurs
        axios.get(`http://${apiUrl}:3100/api/secteurs`)
            .then(response => {
                let secteurs = response.data;
                setSecteurs(secteurs);
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
        <form>
            <div className="frameStyle-style">
                <h2>Getion des entreprise</h2>
                <TableContainer>
                    <div className="frameStyle-style">
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#0098f950' }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Rue et n°</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Code postal</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Localisté</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Tel</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Mail</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° Police</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Secteur</TableCell>
                                    {/*<TableCell style={{ fontWeight: 'bold' }}>ONSS</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° d'unité de l'établissement</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Iban</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Bic</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Activité de l'entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>secrétariat social</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° d'affiliation</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Rue et n°</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Code postal</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Localité</TableCell>*/}
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Secteur</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
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
                                        <TableCell>{entreprise.listSecteurs}</TableCell>
                                        {/*<TableCell>{entreprise.AddEntrOnss}</TableCell>
                                        <TableCell>{entreprise.AddEntrEnite}</TableCell>
                                        <TableCell>{entreprise.AddEntrIban}</TableCell>
                                        <TableCell>{entreprise.AddEntrBic}</TableCell>
                                        <TableCell>{entreprise.AddEntreActiventre}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecsoci}</TableCell>
                                        <TableCell>{entreprise.AddEntrNumaffi}</TableCell>
                                        <TableCell>{entreprise.AddEntrScadresse}</TableCell>
                                        <TableCell>{entreprise.AddEntrSccpost}</TableCell>
                                        <TableCell>{entreprise.AddEntrSclocalite}</TableCell>*/}
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button type="submit" variant="contained" color="secondary" onClick={() => handleAddSecteur(entreprise)}>
                                                <AddRoundedIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="primary">
                                                <EditIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ padding: 0, width: '70px' }}>
                                            <Button variant="contained" color="error" onClick={() => { confirmAlert({ customUI: ({ onClose }) => { return (<div className="custom-confirm-dialog"> <h1 className="custom-confirm-title">Supprimer</h1> <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet entreprise?</p> <div className="custom-confirm-buttons"> <button className="custom-confirm-button" onClick={() => { handleDelete(entreprise._id); onClose(); }} > Oui </button> <button className="custom-confirm-button custom-confirm-no" onClick={onClose}> Non </button> </div> </div>); } }); }}>
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
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>

        </form>
    );
}
