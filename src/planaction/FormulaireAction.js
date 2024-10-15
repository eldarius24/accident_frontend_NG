import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import AutoCompleteP from '../_composants/autoCompleteP';
import AutoCompleteQ from '../_composants/autoCompleteQ';
import '../pageFormulaire/formulaire.css';
import config from '../config.json';
import {
    Button,
    LinearProgress,
    Tooltip
} from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import TextFieldQ from '../_composants/textFieldQ';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DatePickerQ from '../_composants/datePickerQ';
import listeaddaction from '../liste/listeaddaction.json';
import { useUserConnected } from '../Hook/userConnected';
import CustomSnackbar from '../_composants/CustomSnackbar';

const apiUrl = config.apiUrl;

export default function PlanAction({ accidentData }) {
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const location = useLocation();
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const navigate = useNavigate();
    const [AddAction, setAddAction] = useState(watch('AddAction') || (accidentData && accidentData.AddAction) || '');
    const [AddActionDate, setAddActionDate] = useState(watch('AddActionDate') || (accidentData && accidentData.AddActionDate) || null);
    const [AddActionQui, setAddActionQui] = useState(watch('AddActionQui') || (accidentData && accidentData.AddActionQui) || '');
    const [AddActionSecteur, setAddActionSecteur] = useState(watch('AddActionSecteur') || (accidentData && accidentData.AddActionSecteur) || null);
    const [AddActionEntreprise, setAddActionEntreprise] = useState(watch('AddActionEntreprise') || (accidentData && accidentData.AddActionEntreprise) || null);
    const [AddboolStatus, setAddboolStatus] = useState(watch('AddboolStatus') || (accidentData && accidentData.AddboolStatus) || false);
    const [AddActionDange, setAddActionDange] = useState(watch('AddActionDange') || (accidentData && accidentData.AddActionDange) || '');
    const [AddActionanne, setAddActionanne] = useState(watch('AddActionanne') || (accidentData && accidentData.AddActionanne) || '');
    const [AddActoinmoi, setAddActoinmoi] = useState(watch('AddActoinmoi') || (accidentData && accidentData.AddActoinmoi) || '');

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [actionsResponse, enterprisesResponse, sectorsResponse] = await Promise.all([
                    axios.get(`http://${apiUrl}:3100/api/planaction`),
                    axios.get(`http://${apiUrl}:3100/api/entreprises`),
                    axios.get(`http://${apiUrl}:3100/api/secteurs`)
                ]);
                setAddactions(actionsResponse.data);
                let entreprisesData = enterprisesResponse.data.map(e => ({
                    label: e.AddEntreName,
                    id: e._id
                }));

                if (!isAdmin) {
                    entreprisesData = entreprisesData.filter(e =>
                        userInfo.entreprisesConseillerPrevention?.includes(e.label)

                    );
                }



                setEntreprises(entreprisesData);
                const secteursData = sectorsResponse.data;
                setAllSectors(secteursData);
                setAvailableSectors(secteursData.map(s => s.secteurName));
            } catch (error) {
                console.error('Error fetching data:', error);
                showSnackbar('Erreur lors de la récupération des données', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, isAdmin, isConseiller]);

    useEffect(() => {
        setValue('AddAction', AddAction);
        setValue('AddActionDate', AddActionDate);
        setValue('AddActionQui', AddActionQui);
        setValue('AddActionSecteur', AddActionSecteur);
        setValue('AddActionEntreprise', AddActionEntreprise);
        setValue('AddboolStatus', AddboolStatus);
        setValue('AddActionDange', AddActionDange);
        setValue('AddActionanne', AddActionanne);
        setValue('AddActoinmoi', AddActoinmoi);
    }, [AddActionDange, AddAction, AddActionDate, AddActionQui, AddActionSecteur, AddActionEntreprise, AddboolStatus, AddActionanne, AddActoinmoi, setValue]);


    const handleEnterpriseSelect = (entrepriseSelect) => {
        const selectedEnterprise = enterprises.find(e => e.label === entrepriseSelect);  // Assurez-vous de comparer avec le label
        if (selectedEnterprise) {
            setAddActionEntreprise(selectedEnterprise.label);
            setAddActionSecteur(''); // Réinitialisez la sélection de secteur
            setAvailableSectors(getLinkedSecteurs(selectedEnterprise.id)); // Mettez à jour les secteurs disponibles en fonction de l'entreprise
        }
    };

    const getLinkedSecteurs = (entrepriseId) => {
        if (!entrepriseId) return []; // Retourne un tableau vide si aucune entreprise n'est sélectionnée
        return allSectors
            .filter(s => s.entrepriseId === entrepriseId)  // Filtrer par l'ID de l'entreprise
            .map(s => s.secteurName);  // Retourner uniquement les noms des secteurs
    };

    // Filtrer les secteurs en fonction de l'entreprise sélectionnée
    useEffect(() => {
        if (AddActionEntreprise) {
            const selectedEnterprise = enterprises.find(e => e.label === AddActionEntreprise);
            if (selectedEnterprise) {
                const linkedSectors = getLinkedSecteurs(selectedEnterprise.id);
                setAvailableSectors(linkedSectors);
                // Réinitialiser la sélection de secteur
                setAddActionSecteur('');
                setValue('AddActionSecteur', '');
            } else {
                // Si aucune entreprise n'est sélectionnée, afficher tous les secteurs
                setAvailableSectors(allSectors.map(s => s.secteurName));
            }
        }
    }, [AddActionEntreprise, enterprises, allSectors, setValue]);

    if (loading) {
        return <LinearProgress color="success" />;
    }


    const onSubmit = (data) => {
        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);

        axios.put(`http://${apiUrl}:3100/api/planaction`, data)
            .then(response => {
                console.log('Réponse du serveur en création :', response.data);
                showSnackbar('Action en cours d\'enregistrement', 'success');
                setTimeout(() => showSnackbar('Action enregistrée avec succès', 'success'), 1000);
                setTimeout(() => window.location.reload(), 2000); // Actualise la page au lieu de navigate
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
                showSnackbar('Erreur lors de la création de l\'action', 'error');
            });
    };





    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>



            <h3>Ajouter une action</h3>
            <TextFieldP id='AddActionanne' label="L'action est pour le plan d'actions de l'année" onChange={setAddActionanne} defaultValue={AddActionanne}></TextFieldP>
            <AutoCompleteP id='AddActoinmoi' option={listeaddaction.AddActoinmoi} label="L'action doit être réalisée au plus tard pour" onChange={(AddActoinmoiSelect) => {
                setAddActoinmoi(AddActoinmoiSelect);
                setValue('AddActoinmoi', AddActoinmoiSelect);
            }} defaultValue={AddActoinmoi} />
            <AutoCompleteQ
                id='AddActionEntreprise'
                option={enterprises.map(e => e.label)}
                label="L'action vise l'entreprise"
                onChange={handleEnterpriseSelect}
                Value={AddActionEntreprise}
                required={true}
            />
            <AutoCompleteQ
                id='AddActionSecteur'
                option={availableSectors}  // Utilisez la liste des secteurs filtrés
                label="L'action vise le secteur"
                onChange={setAddActionSecteur}
                Value={AddActionSecteur}
                disabled={!AddActionEntreprise}
                required={true}  // Désactivez si aucune entreprise n'est sélectionnée
            />
            <TextFieldQ id='AddAction' label="Quel action a jouter" onChange={setAddAction} defaultValue={AddAction} required={true}></TextFieldQ>
            <DatePickerQ id='AddActionDate' label="Date de l'ajout de l'action" onChange={setAddActionDate} defaultValue={AddActionDate} required={true}></DatePickerQ>
            <TextFieldP id='AddActionQui' label="qui doit s'occuper de l'action" onChange={setAddActionQui} defaultValue={AddActionQui}></TextFieldP>
            <TextFieldP id='AddActionDange' label="Catégorie du risque" onChange={setAddActionDange} defaultValue={AddActionDange}></TextFieldP>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Cliquez ici pour crée l'action (certaine champs doivent être obligatoirement remplis)" arrow>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: '#ee752d60',
                            '&:hover': { backgroundColor: '#95ad22' },
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
                </Tooltip>
                <CustomSnackbar
                    open={snackbar.open}
                    handleClose={handleCloseSnackbar}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
            </div>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </form >


    );
}
