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
    Paper,
    Tooltip,
    Box,
    Typography
} from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import TextFieldQ from '../_composants/textFieldQ';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DatePickerQ from '../_composants/datePickerQ';
import listeaddaction from '../liste/listeaddaction.json';
import { useUserConnected } from '../Hook/userConnected';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useLogger } from '../Hook/useLogger';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const apiUrl = config.apiUrl;

export default function FormulaireAction() {
    const { darkMode } = useTheme();
    const { logAction } = useLogger();
    const { state: actionData } = useLocation();
    const [users, setAddactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setValue, watch, handleSubmit } = useForm();
    const [enterprises, setEntreprises] = useState([]);
    const [allSectors, setAllSectors] = useState([]);
    const { isAdmin, isAdminOuConseiller, userInfo, isConseiller, isAdminOrDev } = useUserConnected();
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
    const [priority, setPriority] = useState(watch('priority') ? watch('priority') : (actionData && actionData.priority ? actionData.priority : null));

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

                if (!isAdminOrDev) {
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
    }, [apiUrl, isAdminOrDev, isConseiller]);

    useEffect(() => {
        if (actionData) {
            setPriority(actionData.priority || '');
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
            AddActoinmoi,
            priority
        };

        const url = actionData
            ? `http://${apiUrl}:3100/api/planaction/${actionData._id}`
            : `http://${apiUrl}:3100/api/planaction`;
        const method = actionData ? 'put' : 'post';

        axios[method](url, formData)
            .then(async response => {
                // Création du log
                try {
                    await logAction({
                        actionType: actionData ? 'modification' : 'creation',
                        details: `${actionData ? 'Modification' : 'Création'} d'un plan d'action: ${data.AddAction} - pour l'année: ${data.AddActionanne} Risque: ${AddActionDange.join(', ')} - Date: ${new Date(AddActionDate).toLocaleDateString()} - Entreprise: ${AddActionEntreprise}`,
                        entity: 'Plan Action',
                        entityId: actionData?._id || response.data._id,
                        entreprise: AddActionEntreprise
                    });
                } catch (logError) {
                    console.error('Erreur lors de la création du log:', logError);
                }
                showSnackbar(`Action ${actionData ? 'éditée' : 'créée'} avec succès`, 'success');
                setTimeout(() => navigate('/planAction'), 500);
            })
            .catch(error => {
                console.error('Erreur complète:', error);
                console.error('Erreur détaillée:', error.response?.data);
                console.error('Status de l\'erreur:', error.response?.status);
                console.error('Headers de l\'erreur:', error.response?.headers);
                showSnackbar(`Erreur lors de la ${actionData ? 'modification' : 'création'} de l'action`, 'error');
            });
    }, [logAction, actionData, apiUrl, navigate, showSnackbar, AddActionEntreprise, AddActionSecteur, AddActionDate, AddActionQui, AddAction, AddboolStatus, AddActionDange, AddActionanne, AddActoinmoi, priority]);

    if (loading) {
        return <LinearProgress color="success" />;
    }

    return (

        <form className="background-image" style={{ margin: '0 20px' }} onSubmit={handleSubmit(onSubmit)}>
            <Paper
                elevation={3}
                sx={{
                    border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                    borderRadius: '8px',
                    padding: '20px',
                    margin: '20px 0',
                    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                    '&:hover': {
                        boxShadow: darkMode
                            ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                            : '0 8px 16px rgba(238, 116, 45, 0.2)'
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        margin: '1.5rem 0',
                        gap: '1rem',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            background: darkMode
                                ? 'rgba(122,142,28,0.1)'
                                : 'rgba(238,117,45,0.1)',
                            filter: 'blur(10px)',
                            borderRadius: '10px',
                            zIndex: 0
                        }
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem' },
                            fontWeight: 700,
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            position: 'relative',
                            padding: '0.5rem 1.5rem',
                            textAlign: 'center',
                            zIndex: 1,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-5px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80%',
                                height: '2px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
                            }
                        }}
                    >
                        {actionData ? 'Modifier une action' : 'Ajouter une action'}
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                            fontWeight: 500,
                            color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 1,
                            padding: '0 1rem',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '0',
                                width: '100%',
                                height: '1px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)',
                                zIndex: -1
                            }
                        }}
                    >
                        Formulaire Pris en compte pour les statistiques
                    </Typography>
                </Box>
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
                <AutoCompleteQ
                    id='priority'
                    option={Object.keys(listeaddaction.priority)}
                    label="Priorité de l'action"
                    onChange={(prioritySelect) => {
                        setPriority(prioritySelect); // S'assurer que cette ligne existe
                        setValue('priority', prioritySelect);
                    }}
                    defaultValue={priority}
                    required={true}
                />

            </Paper>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title={`Cliquez ici pour ${actionData ? 'modifier' : 'créer'} l'action (certains champs doivent être obligatoirement remplis)`} arrow>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: darkMode ? '#424242' : '#ee752d60',
                            color: darkMode ? '#ffffff' : 'black',
                            transition: 'all 0.1s ease-in-out',
                            '&:hover': {
                                backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                transform: 'scale(1.08)',
                                boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                            },
                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            fontSize: '2rem',
                            '& .MuiSvgIcon-root': {
                                color: darkMode ? '#fff' : 'inherit'
                            },
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
                <h5 style={{ marginBottom: '40px' }}> <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '300%',
                            height: '100%',
                            background: darkMode
                                ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                                : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                            animation: 'shine 3s infinite linear',
                            '@keyframes shine': {
                                to: {
                                    transform: 'translateX(50%)'
                                }
                            }
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '50px',
                            background: darkMode
                                ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                                : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                            backdropFilter: 'blur(5px)',
                            border: darkMode
                                ? '1px solid rgba(122,142,28,0.2)'
                                : '1px solid rgba(238,117,45,0.2)',
                            color: darkMode ? '#ffffff' : '#2D3748',
                            boxShadow: darkMode
                                ? '0 4px 6px rgba(0,0,0,0.1)'
                                : '0 4px 6px rgba(238,117,45,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            position: 'relative',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: darkMode
                                    ? '0 6px 12px rgba(0,0,0,0.2)'
                                    : '0 6px 12px rgba(238,117,45,0.2)',
                                '& .highlight': {
                                    color: darkMode ? '#7a8e1c' : '#ee752d'
                                }
                            }
                        }}
                    >
                        <span>Développé par </span>
                        <span className="highlight" style={{
                            transition: 'color 0.3s ease',
                            fontWeight: 700
                        }}>
                            Remy
                        </span>
                        <span> & </span>
                        <span className="highlight" style={{
                            transition: 'color 0.3s ease',
                            fontWeight: 700
                        }}>
                            Benoit
                        </span>
                        <span> pour </span>
                        <span style={{
                            backgroundImage: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 700
                        }}>
                            Le Cortigroupe
                        </span>
                        <span style={{
                            fontSize: '1.2em',
                            marginLeft: '4px',
                            backgroundImage: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            ®
                        </span>
                    </Typography>
                </Box></h5>
            </Tooltip>
        </form>
    );
}
