import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AutoCompleteP from '../_composants/autoCompleteP';
import AutoCompleteQ from '../_composants/autoCompleteQ';
import AutoCompleteCM from '../_composants/autoCompleteCM';
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

export default function FormulaireAction() {
    const { state: actionData } = useLocation();
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const navigate = useNavigate();
    const [availableSectors, setAvailableSectors] = useState([]);



    const [AddAction, setAddAction] = useState(watch('AddAction') ? watch('AddAction') : (actionData && actionData.AddAction ? actionData.AddAction : null));
    const [AddActionDate, setAddActionDate] = useState(watch('AddActionDate') ? watch('AddActionDate') : (actionData && actionData.AddActionDate ? actionData.AddActionDate : null));
    const [AddActionQui, setAddActionQui] = useState(watch('AddActionQui') ? watch('AddActionQui') : (actionData && actionData.AddActionQui ? actionData.AddActionQui : null));
    const [AddActionEntreprise, setAddActionEntreprise] = useState(watch('AddActionEntreprise') ? watch('AddActionEntreprise') : (actionData && actionData.AddActionEntreprise ? actionData.AddActionEntreprise : null));
    const [AddActionSecteur, setAddActionSecteur] = useState(watch('AddActionSecteur') ? watch('AddActionSecteur') : (actionData && actionData.AddActionSecteur ? actionData.AddActionSecteur : null));
    const [AddboolStatus, setAddboolStatus] = useState(watch('AddboolStatus') ? watch('AddboolStatus') : (actionData && actionData.AddboolStatus ? actionData.AddboolStatus : null));
    const [AddActionanne, setAddActionanne] = useState(watch('AddActionanne') ? watch('AddActionanne') : (actionData && actionData.AddActionanne ? actionData.AddActionanne : null));
    const [AddActoinmoi, setAddActoinmoi] = useState(watch('AddActoinmoi') ? watch('AddActoinmoi') : (actionData && actionData.AddActoinmoi ? actionData.AddActoinmoi : null));
    const [AddActionDange, setAddActionDange] = useState(watch('AddActionDange') ? Array.isArray(watch('AddActionDange')) ? watch('AddActionDange') : [watch('AddActionDange')] : (actionData && actionData.AddActionDange ? Array.isArray(actionData.AddActionDange) ? actionData.AddActionDange : [actionData.AddActionDange] : []));


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const generateYearOptions = useCallback(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 7 }, (_, i) => String(currentYear + i - 1));
    }, []);

    const [yearOptions] = useState(generateYearOptions());

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
        if (actionData) {
            setAddAction(actionData.AddAction || '');
            setAddActionDate(actionData.AddActionDate || null);
            setAddActionQui(actionData.AddActionQui || '');
            setAddActionEntreprise(actionData.AddActionEntreprise || null);
            setAddActionSecteur(actionData.AddActionSecteur || null);
            setAddboolStatus(actionData.AddboolStatus || false);
            setAddActionDange(actionData.AddActionDange || '');
            setAddActionanne(actionData.AddActionanne || '');
            setAddActoinmoi(actionData.AddActoinmoi || '');

            Object.keys(actionData).forEach(key => {
                setValue(key, actionData[key]);
            });
        }
    }, [actionData, setValue]);

    const handleEnterpriseSelect = useCallback((entrepriseSelect) => {
        const selectedEnterprise = enterprises.find(e => e.label === entrepriseSelect);
        if (selectedEnterprise) {
            setAddActionEntreprise(selectedEnterprise.label);
            setAddActionSecteur('');
            setValue('AddActionSecteur', '');
            setAvailableSectors(getLinkedSecteurs(selectedEnterprise.id));
        } else {
            setAddActionEntreprise(null);
            setAddActionSecteur('');
            setValue('AddActionSecteur', '');
            setAvailableSectors([]);
        }
    }, [enterprises, setValue]);

    const getLinkedSecteurs = useCallback((entrepriseId) => {
        if (!entrepriseId) return [];
        return allSectors
            .filter(s => s.entrepriseId === entrepriseId)
            .map(s => s.secteurName);
    }, [allSectors]);

    useEffect(() => {
        if (AddActionEntreprise) {
            const selectedEnterprise = enterprises.find(e => e.label === AddActionEntreprise);
            if (selectedEnterprise) {
                const linkedSectors = getLinkedSecteurs(selectedEnterprise.id);
                setAvailableSectors(linkedSectors);
                if (!linkedSectors.includes(AddActionSecteur)) {
                    setAddActionSecteur('');
                    setValue('AddActionSecteur', '');
                }
            } else {
                setAvailableSectors(allSectors.map(s => s.secteurName));
            }
        }
    }, [AddActionEntreprise, enterprises, allSectors, setValue, getLinkedSecteurs, AddActionSecteur]);

    const onSubmit = useCallback((data) => {
        // Vérifier que AddActionDange n'est pas vide
        if (!AddActionDange || AddActionDange.length === 0) {
            showSnackbar('Le type de risque est obligatoire', 'error');
            return; // Arrête la soumission du formulaire
        }

        console.log('Data reçue:', data);
        console.log('AddActionDange avant formatage:', AddActionDange, typeof AddActionDange);

        const formData = {
            ...data,
            AddActionEntreprise,
            AddActionSecteur,
            AddActionDate,
            AddActionQui,
            AddAction,
            AddboolStatus,
            AddActionDange: Array.isArray(AddActionDange) ? AddActionDange : [AddActionDange],
            AddActionanne,
            AddActoinmoi
        };

        console.log('FormData final envoyé au serveur:', formData);

        const url = actionData
            ? `http://${apiUrl}:3100/api/planaction/${actionData._id}`
            : `http://${apiUrl}:3100/api/planaction`;
        const method = actionData ? 'put' : 'post';

        axios[method](url, formData)
            .then(response => {
                console.log(`Réponse du serveur:`, response.data);
                showSnackbar(`Action ${actionData ? 'modifiée' : 'créée'} avec succès`, 'success');
                setTimeout(() => navigate('/planAction'), 750);
            })
            .catch(error => {
                console.error('Erreur complète:', error);
                console.error('Erreur détaillée:', error.response?.data);
                console.error('Status de l\'erreur:', error.response?.status);
                console.error('Headers de l\'erreur:', error.response?.headers);
                showSnackbar(`Erreur lors de la ${actionData ? 'modification' : 'création'} de l'action`, 'error');
            });
    }, [actionData, apiUrl, navigate, showSnackbar, AddActionEntreprise, AddActionSecteur, AddActionDate, AddActionQui, AddAction, AddboolStatus, AddActionDange, AddActionanne, AddActoinmoi]);


    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <h3>{actionData ? 'Modifier une action' : 'Ajouter une action'}</h3>
            <AutoCompleteQ
                id='AddActionanne'
                option={yearOptions}
                label="L'action est pour le plan d'actions de l'année"
                onChange={(yearSelect) => {
                    setAddActionanne(yearSelect);
                    setValue('AddActionanne', yearSelect);
                }}
                defaultValue={AddActionanne}
                required={true}
            />
            <AutoCompleteP id='AddActoinmoi' option={listeaddaction.AddActoinmoi} label="L'action doit être réalisée au plus tard pour" onChange={(AddActoinmoiSelect) => {
                setAddActoinmoi(AddActoinmoiSelect);
                setValue('AddActoinmoi', AddActoinmoiSelect);
            }} defaultValue={AddActoinmoi} />
            <AutoCompleteQ
                id='AddActionEntreprise'
                option={enterprises.map(e => e.label)}
                label="L'action vise l'entreprise"
                onChange={handleEnterpriseSelect}
                defaultValue={AddActionEntreprise}
                required={true}
            />
            <AutoCompleteQ
                id='AddActionSecteur'
                option={AddActionEntreprise ? availableSectors : ['No options']}
                label="L'action vise le secteur"
                onChange={(sector) => {
                    if (sector !== 'No options') {
                        setAddActionSecteur(sector);
                        setValue('AddActionSecteur', sector);
                    }
                }}
                defaultValue={AddActionSecteur}
                disabled={!AddActionEntreprise}
                required={true}
            />
            <TextFieldQ id='AddAction' label="Quelle action ajouter" onChange={setAddAction} defaultValue={AddAction} required={true} />
            <DatePickerQ id='AddActionDate' label="Date de l'ajout de l'action" onChange={setAddActionDate} defaultValue={AddActionDate} required={true} />
            <TextFieldP id='AddActionQui' label="Qui doit s'occuper de l'action" onChange={setAddActionQui} defaultValue={AddActionQui} />
            <AutoCompleteCM
                id='AddActionDange'
                option={listeaddaction.AddActionDange}
                label="Type de risque"
                onChange={(AddActionDangeSelect) => {
                    if (!Array.isArray(AddActionDangeSelect) || AddActionDangeSelect.length === 0) {
                        showSnackbar('Au moins un type de risque doit être sélectionné', 'warning');
                    }
                    setAddActionDange(AddActionDangeSelect);
                    setValue('AddActionDange', AddActionDangeSelect);
                }}
                defaultValue={AddActionDange}
                required={true}
            />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title={`Cliquez ici pour ${actionData ? 'modifier' : 'créer'} l'action (certains champs doivent être obligatoirement remplis)`} arrow>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: '#ee752d60',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 },
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
                        {actionData ? 'Modifier l\'action' : 'Créer l\'action'}
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
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyez un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquez le problème rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
        </form>
    );
}
