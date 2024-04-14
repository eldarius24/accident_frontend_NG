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

    const handleDelete = (entrepriseIdToDelete) => {
        axios.delete(`http://${apiurl}:3100/api/entreprises/${entrepriseIdToDelete}`)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Entreprise supprimée avec succès');
                    // Mettre à jour les données après suppression
                    setUsers(prevUsers => prevUsers.filter(entreprise => entreprise._id !== entrepriseIdToDelete));
                } else {
                    console.log('Erreur lors de la suppression de l\'utilisateur, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        axios.get(`http://${apiurl}:3100/api/entreprises`)
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
        <form>
            <div className="frameStyle-style">
                <h2>Getion des utilisateur</h2>
                <TableContainer>
                <div className="frameStyle-style">
                    <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#84a784' }}>
                                    <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Rue et n°</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Code postal</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Localisté</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Tel</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Mail</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° Police</TableCell>
                                    {/*<TableCell style={{ fontWeight: 'bold' }}>ONSS</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° d'unité de l'établissement</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Iban</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Bic</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Activité de l'entreprise</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>secrétariat social</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>N° d'affiliation</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Rue et n°</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Code postal</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Localité</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur1</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur2</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur3</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur4</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur5</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur6</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur7</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur8</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur9</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur10</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur11</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur12</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur13</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur14</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur15</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur16</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur17</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur18</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur19</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>AddEntrSecteur20</TableCell>*/}
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Edit</TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((entreprise, index) => (
                                    <TableRow key={entreprise._id} style={{ backgroundColor: index % 2 === 0 ? '#bed1be' : '#d2e2d2', borderBottom: '2px solid #84a784' }}>
                                        <TableCell>{entreprise.AddEntreName}</TableCell>
                                        <TableCell>{entreprise.AddEntrRue}</TableCell>
                                        <TableCell>{entreprise.AddEntrCodpost}</TableCell>
                                        <TableCell>{entreprise.AddEntrLocalite}</TableCell>
                                        <TableCell>{entreprise.AddEntrTel}</TableCell>
                                        <TableCell>{entreprise.AddEntrEmail}</TableCell>
                                        <TableCell>{entreprise.AddEntrNumentr}</TableCell>
                                        <TableCell>{entreprise.AddEntrePolice}</TableCell>
                                        {/*<TableCell>{entreprise.AddEntrOnss}</TableCell>
                                        <TableCell>{entreprise.AddEntrEnite}</TableCell>
                                        <TableCell>{entreprise.AddEntrIban}</TableCell>
                                        <TableCell>{entreprise.AddEntrBic}</TableCell>
                                        <TableCell>{entreprise.AddEntreActiventre}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecsoci}</TableCell>
                                        <TableCell>{entreprise.AddEntrNumaffi}</TableCell>
                                        <TableCell>{entreprise.AddEntrScadresse}</TableCell>
                                        <TableCell>{entreprise.AddEntrSccpost}</TableCell>
                                        <TableCell>{entreprise.AddEntrSclocalite}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur1}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur2}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur3}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur4}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur5}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur6}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur7}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur8}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur9}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur10}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur11}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur12}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur13}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur14}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur15}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur16}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur17}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur18}</TableCell>
                                        <TableCell>{entreprise.AddEntrSecteur19}</TableCell>
                                <TableCell>{entreprise.AddEntrSecteur20}</TableCell>*/}
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
        </form>
    );
}
