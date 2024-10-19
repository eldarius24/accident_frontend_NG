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

/**
 * PlanAction component manages the form for adding a new action to the action plan.
 * It initializes form fields with data from `accidentData` if available or uses default values.
 * Fetches enterprise and sector data to populate options in the form.
 * Handles the submission of the form, sending data to the server and displaying feedback via a snackbar.
 * Additionally, manages the dynamic filtering of sectors based on the selected enterprise.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.accidentData - Data related to the accident, used to prefill form fields.
 * @returns {JSX.Element} The form for adding a new action.
 */
export default function PlanAction({ accidentData }) {
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const location = useLocation();
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
    const navigate = useNavigate();
    const [AddAction, setAddAction] = useState(watch('AddAction') || (accidentData && accidentData.AddAction) || '');
    const [AddActionDate, setAddActionDate] = useState(watch('AddActionDate') || (accidentData && accidentData.AddActionDate) || null);
    const [AddActionQui, setAddActionQui] = useState(watch('AddActionQui') || (accidentData && accidentData.AddActionQui) || '');
    const [AddActionEntreprise, setAddActionEntreprise] = useState(watch('AddActionEntreprise') || (accidentData && accidentData.AddActionEntreprise) || null);
    const [AddActionSecteur, setAddActionSecteur] = useState(watch('AddActionSecteur') || (accidentData && accidentData.AddActionSecteur) || null);
    const [availableSectors, setAvailableSectors] = useState([]);
    const [AddboolStatus, setAddboolStatus] = useState(watch('AddboolStatus') || (accidentData && accidentData.AddboolStatus) || false);
    const [AddActionDange, setAddActionDange] = useState(watch('AddActionDange') || (accidentData && accidentData.AddActionDange) || '');
    const [AddActionanne, setAddActionanne] = useState(watch('AddActionanne') || (accidentData && accidentData.AddActionanne) || '');
    const [AddActoinmoi, setAddActoinmoi] = useState(watch('AddActoinmoi') || (accidentData && accidentData.AddActoinmoi) || '');

    // Générer les options d'années
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = -1; i <= 5; i++) {
            years.push(String(currentYear + i));
        }
        return years;
    };

    const [yearOptions] = useState(generateYearOptions());


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    /**
     * Shows a snackbar with the given message and severity.
     * @param {string} message - The message to display in the snackbar.
     * @param {string} [severity='info'] - The severity of the snackbar. Can be 'info', 'success', 'warning', or 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Closes the snackbar when the user clicks outside of it.
     * @param {object} event - The event that triggered the function.
     * @param {string} reason - The reason the function was triggered. If the user
     *                        clicked outside of the snackbar, this will be
     *                        'clickaway'.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };


    useEffect(() => {
    /**
     * Fetches data from the server and updates the component state accordingly.
     * The data includes the list of actions, enterprises, and sectors.
     * If the user is not an admin, the list of enterprises is filtered to only include
     * those that the user is allowed to access.
     * If an error occurs while fetching the data, a snackbar is displayed with the error message.
     * Finally, the loading state is set to false.
     */
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


    /**
     * Handles the selection of an enterprise in the form.
     * @param {string} entrepriseSelect - The label of the selected enterprise.
     * @description
     * This function is called when the user selects an enterprise in the form.
     * It updates the state of the component by setting the selected enterprise,
     * resetting the selected sector, and updating the list of available sectors
     * based on the selected enterprise.
     */
    const handleEnterpriseSelect = (entrepriseSelect) => {
        const selectedEnterprise = enterprises.find(e => e.label === entrepriseSelect);
        if (selectedEnterprise) {
            setAddActionEntreprise(selectedEnterprise.label);
            setAddActionSecteur(''); // Réinitialiser le secteur quand l'entreprise change
            setValue('AddActionSecteur', '');
            setAvailableSectors(getLinkedSecteurs(selectedEnterprise.id));
        } else {
            setAddActionEntreprise(null);
            setAddActionSecteur('');
            setValue('AddActionSecteur', '');
            setAvailableSectors([]);
        }
    };


/**
 * Retrieves the list of sector names linked to a specified enterprise.
 * 
 * @param {string} entrepriseId - The ID of the enterprise for which to retrieve linked sectors.
 * @returns {Array<string>} An array of sector names associated with the given enterprise ID.
 *                          Returns an empty array if no enterprise is selected or if there are no linked sectors.
 */
const getLinkedSecteurs = (entrepriseId) => {
    if (!entrepriseId) return [];
    return allSectors
        .filter(s => s.entrepriseId === entrepriseId)
        .map(s => s.secteurName);
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


    /**
     * Envoie les données du formulaire pour enregistrer une action
     * @param {Object} data Données du formulaire
     * @returns {Promise} La promesse de création
     */
    const onSubmit = (data) => {
        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);

        axios.put(`http://${apiUrl}:3100/api/planaction`, data)
            .then(response => {
                console.log('Réponse du serveur en création :', response.data);
                showSnackbar('Action en cours d\'enregistrement', 'success');
                setTimeout(() => showSnackbar('Action enregistrée avec succès', 'success'), 500);
                setTimeout(() => navigate('/planAction'), 750); // Actualise la page au lieu de navigate
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
                showSnackbar('Erreur lors de la création de l\'action', 'error');
            });
    };





    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>



            <h3>Ajouter une action</h3>
            <AutoCompleteQ
                id='AddActionanne'
                option={yearOptions}
                label="L'action est pour le plan d'actions de l'année"
                onChange={(yearSelect) => {
                    setAddActionanne(yearSelect);
                    setValue('AddActionanne', yearSelect);
                }}
                Value={AddActionanne}
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
                Value={AddActionEntreprise}
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
                Value={AddActionSecteur}
                disabled={!AddActionEntreprise}
                required={true}
            />
            <TextFieldQ id='AddAction' label="Quel action a jouter" onChange={setAddAction} defaultValue={AddAction} required={true}></TextFieldQ>
            <DatePickerQ id='AddActionDate' label="Date de l'ajout de l'action" onChange={setAddActionDate} defaultValue={AddActionDate} required={true}></DatePickerQ>
            <TextFieldP id='AddActionQui' label="qui doit s'occuper de l'action" onChange={setAddActionQui} defaultValue={AddActionQui}></TextFieldP>


            <AutoCompleteQ id='AddActionDange'
                option={listeaddaction.AddActionDange}
                label="Type de risque"
                onChange={(AddActionDangeSelect) => {
                    setAddActionDange(AddActionDangeSelect);
                    setValue('AddActionDange', AddActionDangeSelect);
                }} Value={AddActionDange}
                required={true}
            />

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
