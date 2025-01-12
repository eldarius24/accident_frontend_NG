import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../../../_composants/textFieldP';
import ControlLabelAdminP from '../../../_composants/controlLabelAdminP';
import { Box, Paper, Tooltip, Typography, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getUser from './_actions/get-user';
import putUser from './_actions/put-user';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../../_composants/CustomSnackbar';
import { useTheme } from '../../../Hook/ThemeContext';
import InfoIcon from '@mui/icons-material/Info';
import InfosAdmin from './_actions/infosdroits/infosAdmin';
import InfosAdminVhe from './_actions/infosdroits/infosAdminvhe';
import InfosConseiller from './_actions/infosdroits/infosConseiller';
import InfosDev from './_actions/infosdroits/infosDev';
import InfosUserPrev from './_actions/infosdroits/infosUserPrev';
import InfosUserGetion from './_actions/infosdroits/infosUsergetio';
import Infosusersignataire from './_actions/infosdroits/infosusersignataire';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import config from '../../../config.json';
import { useUserConnected } from '../../../Hook/userConnected.js';

export default function AddUser() {
    const apiUrl = config.apiUrl;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const { setValue, watch, handleSubmit } = useForm();
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [openPreview, setOpenPreview] = useState(false);
    const [previewType, setPreviewType] = useState('');
    const [signatairesEmails, setSignatairesEmails] = useState({});
    const [entreprisesData, setEntreprisesData] = useState([]);
    const { userInfo, isDeveloppeur, isAdminOrDev, isAdminOrDevOrAdmVechi, isAdminOrDevOrSignataire, isAdminOrDevOrAdmSign, isAdmin } = useUserConnected();

    const handleOpenPreview = (type) => {
        setPreviewType(type);
        setOpenPreview(true);
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
        setPreviewType('');
    };

    const getPreviewContent = () => {
        switch (previewType) {
            case 'admin':
                return {
                    title: 'Info Admin',
                    content: <InfosAdmin />
                };
            case 'conseiller':
                return {
                    title: 'Info Conseiller en prévention',
                    content: <InfosConseiller />
                };
            case 'developpeur':
                return {
                    title: 'Info Developpeur',
                    content: <InfosDev />
                };
            case 'utilisateur':
                return {
                    title: 'Info utilisateur prévention',
                    content: <InfosUserPrev />
                };
            case 'adminVehicule':
                return {
                    title: 'Info Admin Véhicule',
                    content: <InfosAdminVhe />
                };
            case 'getionnaireVehicule':
                return {
                    title: 'Info Gestionnaire Véhicule',
                    content: <InfosUserGetion />
                }
            case 'usersignataire':
                return {
                    title: 'Info utilisateur signataire',
                    content: <Infosusersignataire />
                }
            default:
                return { title: '', content: null };
        }
    };




    // États
    const [user, setUser] = useState({
        userLogin: "",
        userPassword: "",
        userName: "",
        boolAdministrateur: false,
        boolDeveloppeur: false,
        entreprisesConseillerPrevention: [],
        entreprisesUserPrevention: [],
        userGetionaireVehicule: [],
        userSignataire: [],
        boolAdministrateurVehicule: false,
        boolAdministrateursignataire: false,
        darkMode: false,
        selectedYears: [new Date().getFullYear().toString()]
    });
    const [entreprises, setEntreprises] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Récupération des données utilisateur existantes
    const getUserData = async () => {
        try {
            if (!userId) {
                setUser({
                    ...user,
                    boolAdministrateur: false,
                    boolDeveloppeur: false
                });
                return;
            }

            const userData = await getUser(userId);
            if (!userData) throw new Error('Aucun utilisateur trouvé');

            // Forcer la conversion en booléen avec Boolean()
            const formattedData = {
                ...userData,
                boolAdministrateur: Boolean(userData.boolAdministrateur),
                boolDeveloppeur: Boolean(userData.boolDeveloppeur),
                darkMode: userData.darkMode ?? false,
                selectedYears: userData.selectedYears ?? [new Date().getFullYear().toString()]
            };

            setUser(formattedData);

            // Mettre à jour les champs du formulaire
            Object.entries(formattedData).forEach(([key, value]) => {
                setValue(key, value);
            });

            // Si l'utilisateur a des entreprises en tant que signataire, on charge les emails
            if (formattedData.userSignataire && formattedData.userSignataire.length > 0) {
                const entreprisesResponse = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
                const entreprises = entreprisesResponse.data;

                // On charge les emails pour chaque entreprise signataire
                const emails = {};
                formattedData.userSignataire.forEach(entrepriseName => {
                    const entreprise = entreprises.find(e => e.AddEntreName === entrepriseName);
                    if (entreprise?.signatairesEmails?.[entrepriseName]) {
                        emails[entrepriseName] = entreprise.signatairesEmails[entrepriseName];
                    }
                });
                if (isDeveloppeur) {
                    console.log('Emails chargés pour l\'édition:', emails);
                }
                setSignatairesEmails(emails);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
            showSnackbar('Erreur lors de la récupération de l\'utilisateur', 'error');
        }
    };

    // Récupération des entreprises
    // Modifiez la fonction getEntreprisesData pour utiliser axios et le bon endpoint
    const getEntreprisesData = async () => {
        try {
            if (isDeveloppeur) {
                console.log('Tentative de récupération des entreprises...');
            }
            const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
            if (isDeveloppeur) {
                console.log('Réponse brute de l\'API:', response);
            }

            const entreprisesData = response.data;
            if (isDeveloppeur) {
                console.log('Données des entreprises:', entreprisesData);
            }

            if (!entreprisesData) throw new Error('Aucune entreprise trouvée');

            setEntreprisesData(entreprisesData);
            const entrepriseNames = entreprisesData.map(item => item.AddEntreName);
            if (isDeveloppeur) {
                console.log('Noms des entreprises extraits:', entrepriseNames);
            }

            setEntreprises(entrepriseNames);
        } catch (error) {
            console.error('Erreur lors de la récupération des entreprises:', error);
            showSnackbar('Erreur lors de la récupération des entreprises', 'error');
        }
    };

    // Fonction pour mettre à jour l'email d'une entreprise
    // Modifiez la fonction updateEntrepriseEmail
    // Modifiez la fonction updateEntrepriseEmail
    const updateEntrepriseEmail = async (entrepriseName, email) => {
        try {
            const entreprise = entreprisesData.find(e => e.AddEntreName === entrepriseName);
            if (isDeveloppeur) {
                console.log('Mise à jour email pour entreprise:', {
                    entrepriseName,
                    email,
                    entrepriseData: entreprise
                });
            }

            if (!entreprise) {
                console.warn('Entreprise non trouvée:', entrepriseName);
                return;
            }

            // Convertir signatairesEmails en objet s'il n'existe pas
            const currentSignatairesEmails = entreprise.signatairesEmails || {};

            // Créer un nouvel objet avec toutes les données nécessaires
            const updatedData = {
                _id: entreprise._id,
                AddEntrEmail: email,
                signatairesEmails: { ...currentSignatairesEmails },
                // Copier tous les autres champs existants
                ...entreprise
            };

            // S'assurer que signatairesEmails est initialisé comme un objet
            if (!updatedData.signatairesEmails) {
                updatedData.signatairesEmails = {};
            }

            // Ajouter ou mettre à jour l'email pour cette entreprise
            updatedData.signatairesEmails[entrepriseName] = email;
            if (isDeveloppeur) {
                console.log('Données complètes à envoyer:', updatedData);
            }

            const response = await axios.put(`http://${apiUrl}:3100/api/entreprises/${entreprise._id}`, updatedData);
            if (isDeveloppeur) {
                console.log('Réponse mise à jour email:', response.data);
            }

            if (!response.data) {
                throw new Error('Erreur lors de la mise à jour de l\'email');
            }

            // Mettre à jour le state local
            setEntreprisesData(prevData => {
                return prevData.map(e =>
                    e._id === entreprise._id
                        ? { ...updatedData }
                        : e
                );
            });

            // Mettre à jour l'état local des emails signataires
            setSignatairesEmails(prev => ({
                ...prev,
                [entrepriseName]: email
            }));

        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'email:', error);
            if (error.response) {
                console.error('Réponse d\'erreur:', error.response.data);
            }
            showSnackbar('Erreur lors de la mise à jour de l\'email', 'error');
        }
    };



    useEffect(() => {
        getUserData();
        getEntreprisesData();
    }, [userId]);

    const handleChange = (key, value) => {
        setUser(prevData => ({ ...prevData, [key]: value }));
    };

    const onSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const userData = {
                ...user,
                darkMode: user.darkMode ?? false,
                selectedYears: user.selectedYears ?? [new Date().getFullYear().toString()],
                signatairesEmails // Ajout des emails des signataires
            };

            const result = await putUser(userId, userData);
            if (!result) throw new Error('Erreur lors de la création/modification de l\'utilisateur');

            showSnackbar('Utilisateur en cours de création', 'success');
            setTimeout(() => {
                showSnackbar('Utilisateur créé avec succès', 'success');
                navigate('/adminUser');
            }, 2000);

        } catch (error) {
            console.error('Erreur de requête:', error.message);
            showSnackbar('Erreur lors de la création de l\'utilisateur', 'error');
            setIsSubmitting(false);
        }
    };

    const PaperComponent = (props) => (
        <Paper
            {...props}
            sx={{
                backgroundColor: darkMode ? '#424242' : '#bed7f6',
                color: darkMode ? '#fff' : 'inherit',
                '& .MuiMenuItem-root': {
                    color: darkMode ? '#fff' : 'inherit'
                },
                '& .Mui-selected': {
                    backgroundColor: darkMode ? '#505050 !important' : '#bed7f6 !important'
                },
                '&:hover': {
                    backgroundColor: darkMode ? '#424242' : '#bed7f6'
                }
            }}
        />
    );

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
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '45px',
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
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                            fontWeight: 600,
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            position: 'relative',
                            padding: '0.5rem 1.5rem',
                            zIndex: 1,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
                            }
                        }}
                    >
                        Créer des utilisateurs
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '1px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
                            }
                        }}
                    />
                </Box>
                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Créer un nouvel utilisateur</h3>

                <TextFieldP
                    id='userLogin'
                    label="Adresse email"
                    onChange={(value) => handleChange('userLogin', value)}
                    defaultValue={user.userLogin}
                />

                <TextFieldP
                    id='userPassword'
                    label="Mot de passe"
                    onChange={(value) => handleChange('userPassword', value)}
                    defaultValue={user.userPassword}
                />

                <TextFieldP
                    id='userName'
                    label="Nom et Prénom"
                    onChange={(value) => handleChange('userName', value)}
                    defaultValue={user.userName}
                />

                {isAdminOrDev && (
                    <div>
                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès developpeur du site:</h3>
                        <Tooltip title="Cocher cette case si l'utilisateur est développeur du site. Il aura les mêmes droits qu'un administrateur" arrow>
                            <Grid container direction="row" alignItems="center">
                                <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ControlLabelAdminP
                                        id="boolDeveloppeur"
                                        label="Développeur du site"
                                        onChange={(value) => {
                                            handleChange('boolDeveloppeur', value);
                                            setValue('boolDeveloppeur', value);
                                        }}
                                        checked={Boolean(user.boolDeveloppeur)}
                                        defaultChecked={Boolean(user.boolDeveloppeur)}
                                    />

                                </Grid>
                                <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                    <IconButton onClick={() => handleOpenPreview('developpeur')}>
                                        <Tooltip title="Info rôle" arrow>
                                            <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                        </Tooltip>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Tooltip>

                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès administrateur site:</h3>
                        <Tooltip title="Cocher cette case si l'utilisateur est administrateur du site. Il aura accès à tous les menus pour toutes les entreprises" arrow>
                            <Grid container direction="row" alignItems="center">
                                <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ControlLabelAdminP
                                        id="boolAdministrateur"
                                        label="Administrateur du site"
                                        onChange={(value) => {
                                            handleChange('boolAdministrateur', value);
                                            setValue('boolAdministrateur', value);
                                        }}
                                        checked={Boolean(user.boolAdministrateur)}
                                        defaultChecked={Boolean(user.boolAdministrateur)}
                                    />
                                </Grid>
                                <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                    <IconButton onClick={() => handleOpenPreview('admin')}>
                                        <Tooltip title="Info rôle" arrow>
                                            <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                        </Tooltip>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Tooltip>

                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès Administrateur véhicule du site:</h3>
                        <Tooltip title="Cocher cette case si l'utilisateur est administrateur véhicule du site. " arrow>
                            <Grid container direction="row" alignItems="center">
                                <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ControlLabelAdminP
                                        id="boolAdministrateurVehicule"
                                        label="Administrateur véhicule du site"
                                        onChange={(value) => {
                                            handleChange('boolAdministrateurVehicule', value);
                                            setValue('boolAdministrateurVehicule', value);
                                        }}
                                        checked={Boolean(user.boolAdministrateurVehicule)}
                                        defaultChecked={Boolean(user.boolAdministrateurVehicule)}
                                    />
                                </Grid>
                                <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                    <IconButton onClick={() => handleOpenPreview('adminVehicule')}>
                                        <Tooltip title="Info rôle" arrow>
                                            <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                        </Tooltip>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Tooltip>

                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès Administrateur signataire:</h3>
                        <Tooltip title="Cocher cette case si l'utilisateur est administrateur signataire. " arrow>
                            <Grid container direction="row" alignItems="center">
                                <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ControlLabelAdminP
                                        id="boolAdministrateursignataire"
                                        label="Administrateur signataire"
                                        onChange={(value) => {
                                            handleChange('boolAdministrateursignataire', value);
                                            setValue('boolAdministrateursignataire', value);
                                        }}
                                        checked={Boolean(user.boolAdministrateursignataire)}
                                        defaultChecked={Boolean(user.boolAdministrateursignataire)}
                                    />
                                </Grid>
                                <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                    <IconButton onClick={() => handleOpenPreview('adminsignataire')}>
                                        <Tooltip title="Info rôle" arrow>
                                            <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                        </Tooltip>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Tooltip>

                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès conseiller en prévention:</h3>
                        <Tooltip title="Si le nouvel utilisateur est conseiller en prévention, sélectionner son entreprise" arrow>
                            <Grid container direction="row" alignItems="center">
                                <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Autocomplete
                                        multiple
                                        id="checkboxes-tags-demo-prevention"
                                        options={entreprises}
                                        disableCloseOnSelect
                                        sx={{
                                            width: '50%',
                                            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                            margin: '0 auto 1rem',
                                            '& .MuiOutlinedInput-root': {
                                                color: darkMode ? '#fff' : 'inherit',
                                                '& fieldset': {
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            },
                                            '& .MuiChip-root': {
                                                backgroundColor: darkMode ? '#505050' : '#e0e0e0',
                                                color: darkMode ? '#fff' : 'inherit',
                                                '& .MuiChip-deleteIcon': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }
                                        }}
                                        getOptionLabel={(option) => option}
                                        onChange={(_, value) => handleChange('entreprisesConseillerPrevention', value)}
                                        value={user.entreprisesConseillerPrevention}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    sx={{
                                                        marginRight: 1,
                                                        color: darkMode ? '#4CAF50' : 'green',
                                                        '&.Mui-checked': {
                                                            color: darkMode ? '#81C784' : 'green'
                                                        }
                                                    }}
                                                    checked={selected}
                                                />
                                                {option}
                                            </li>
                                        )}
                                        style={{ width: 500 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Sélectionnez l'entreprise"
                                                placeholder="entreprise"
                                                sx={{
                                                    backgroundColor: darkMode ? '#424242' : '#00479871',
                                                    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                                    '& .MuiInputLabel-root': {
                                                        color: darkMode ? '#fff' : 'inherit'
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& input': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                        PaperComponent={PaperComponent}
                                    />
                                </Grid>
                                <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                    <IconButton onClick={() => handleOpenPreview('conseiller')}>
                                        <Tooltip title="Info rôle" arrow>
                                            <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                        </Tooltip>
                                    </IconButton>
                                </Grid>
                            </Grid>

                        </Tooltip>

                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès Visiteur:</h3>
                        <Grid container direction="row" alignItems="center">
                            <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo-visiteur"
                                    options={entreprises}
                                    onChange={(_, value) => handleChange('entreprisesUserPrevention', value)}
                                    value={user.entreprisesUserPrevention}
                                    disableCloseOnSelect
                                    sx={{
                                        width: '50%',
                                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                        margin: '0 auto 1rem',
                                        '& .MuiOutlinedInput-root': {
                                            color: darkMode ? '#fff' : 'inherit',
                                            '& fieldset': {
                                                borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: darkMode ? '#fff' : 'inherit'
                                        },
                                        '& .MuiChip-root': {
                                            backgroundColor: darkMode ? '#505050' : '#e0e0e0',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '& .MuiChip-deleteIcon': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            }
                                        }
                                    }}
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                sx={{
                                                    marginRight: 1,
                                                    color: darkMode ? '#4CAF50' : 'green',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#81C784' : 'green'
                                                    }
                                                }}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    )}
                                    style={{ width: 500 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sélectionnez l'entreprise"
                                            placeholder="entreprise"
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#00479871',
                                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                                '& .MuiInputLabel-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& input': {
                                                        color: darkMode ? '#fff' : 'inherit'
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                    PaperComponent={PaperComponent}
                                />
                            </Grid>
                            <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                <IconButton onClick={() => handleOpenPreview('utilisateur')}>
                                    <Tooltip title="Info rôle" arrow>
                                        <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                )}

                {isAdminOrDevOrAdmVechi && (
                    <div>
                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès gestionnaire véhicule:</h3>
                        <Grid container direction="row" alignItems="center">
                            <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo-getionnaire"
                                    options={entreprises}
                                    onChange={(_, value) => handleChange('userGetionaireVehicule', value)}
                                    value={user.userGetionaireVehicule}
                                    disableCloseOnSelect
                                    sx={{
                                        width: '50%',
                                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                        margin: '0 auto 1rem',
                                        '& .MuiOutlinedInput-root': {
                                            color: darkMode ? '#fff' : 'inherit',
                                            '& fieldset': {
                                                borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: darkMode ? '#fff' : 'inherit'
                                        },
                                        '& .MuiChip-root': {
                                            backgroundColor: darkMode ? '#505050' : '#e0e0e0',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '& .MuiChip-deleteIcon': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            }
                                        }
                                    }}
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                sx={{
                                                    marginRight: 1,
                                                    color: darkMode ? '#4CAF50' : 'green',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#81C784' : 'green'
                                                    }
                                                }}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    )}
                                    style={{ width: 500 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sélectionnez l'entreprise"
                                            placeholder="entreprise"
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#00479871',
                                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                                '& .MuiInputLabel-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& input': {
                                                        color: darkMode ? '#fff' : 'inherit'
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                    PaperComponent={PaperComponent}
                                />
                            </Grid>


                            <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                <IconButton onClick={() => handleOpenPreview('getionnaireVehicule')}>
                                    <Tooltip title="Info rôle" arrow>
                                        <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                )}

                {isAdminOrDevOrAdmSign && (
                    <div>
                        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès signataire:</h3>
                        <Grid container direction="row" alignItems="center">
                            <Grid item xs={11.99999} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo-signataire"
                                    options={entreprises}
                                    onChange={(_, selectedCompanies) => {
                                        // Mettre à jour userSignataire
                                        handleChange('userSignataire', selectedCompanies);

                                        // Pour les nouvelles entreprises sélectionnées, initialiser leur email à vide
                                        const newEmails = { ...signatairesEmails };

                                        // Pour chaque entreprise actuellement sélectionnée
                                        selectedCompanies.forEach(company => {
                                            if (!newEmails.hasOwnProperty(company)) {
                                                const entrepriseData = entreprisesData.find(e => e.AddEntreName === company);
                                                newEmails[company] = ''; // Initialise à vide pour les nouvelles sélections
                                                if (entrepriseData?.signatairesEmails?.[company]) {
                                                    newEmails[company] = entrepriseData.signatairesEmails[company];
                                                }
                                            }
                                        });

                                        // Supprimer les entreprises qui ne sont plus sélectionnées
                                        Object.keys(newEmails).forEach(company => {
                                            if (!selectedCompanies.includes(company)) {
                                                delete newEmails[company];
                                            }
                                        });

                                        setSignatairesEmails(newEmails);
                                    }}
                                    value={user.userSignataire}
                                    disableCloseOnSelect
                                    sx={{
                                        width: '50%',
                                        boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                        margin: '0 auto',
                                        '& .MuiOutlinedInput-root': {
                                            color: darkMode ? '#fff' : 'inherit',
                                            '& fieldset': {
                                                borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: darkMode ? '#fff' : 'inherit'
                                        },
                                        '& .MuiChip-root': {
                                            backgroundColor: darkMode ? '#505050' : '#e0e0e0',
                                            color: darkMode ? '#fff' : 'inherit',
                                            '& .MuiChip-deleteIcon': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            }
                                        }
                                    }}
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                sx={{
                                                    marginRight: 1,
                                                    color: darkMode ? '#4CAF50' : 'green',
                                                    '&.Mui-checked': {
                                                        color: darkMode ? '#81C784' : 'green'
                                                    }
                                                }}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    )}
                                    style={{ width: 500 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sélectionnez l'entreprise"
                                            placeholder="entreprise"
                                            sx={{
                                                backgroundColor: darkMode ? '#424242' : '#00479871',
                                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                                '& .MuiInputLabel-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& input': {
                                                        color: darkMode ? '#fff' : 'inherit'
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                    PaperComponent={PaperComponent}
                                />

                                {/* Champs d'email dynamiques */}
                                {user.userSignataire && user.userSignataire.map((entreprise, index) => (
                                    <TextField
                                        key={entreprise}
                                        label={`Si ce champ est vide, rentrer l'E-mail pour ${entreprise}`}
                                        type="email"
                                        value={signatairesEmails[entreprise] ?? ''}
                                        onChange={(e) => {
                                            const email = e.target.value;
                                            setSignatairesEmails(prev => ({
                                                ...prev,
                                                [entreprise]: email
                                            }));
                                            updateEntrepriseEmail(entreprise, email);
                                        }}
                                        sx={{
                                            width: '50%',
                                            margin: '0 auto',
                                            backgroundColor: darkMode ? '#424242' : '#00479871',
                                            '& .MuiInputLabel-root': {
                                                color: darkMode ? '#fff' : 'inherit'
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                color: darkMode ? '#fff' : 'inherit',
                                                '& fieldset': {
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                                                },
                                                '& input': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }
                                        }}
                                    />
                                ))}
                            </Grid>


                            <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
                                <IconButton onClick={() => handleOpenPreview('usersignataire')}>
                                    <Tooltip title="Info rôle" arrow>
                                        <InfoIcon style={{ color: darkMode ? '#ffffff' : 'black' }} />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                )}









                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Cliquez ici pour enregistrer et créer le nouvel utilisateur" arrow>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.1s ease-in-out',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
                                    transform: 'scale(1.08)',
                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                },
                                boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
                                padding: '10px 20px',
                                width: '50%',
                                marginTop: '1cm',
                                height: '300%',
                                fontSize: '2rem',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
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
                            {isSubmitting ? 'Enregistrement en cours...' : "Enregistrer l'utilisateur"}
                        </Button>
                    </Tooltip>
                </div>
                <div style={{ marginTop: '30px' }}>
                    <CustomSnackbar
                        open={snackbar.open}
                        handleClose={handleCloseSnackbar}
                        message={snackbar.message}
                        severity={snackbar.severity}
                    />
                </div>
            </Paper>
            <Dialog
                open={openPreview}
                onClose={handleClosePreview}
                maxWidth="xl" // Changé à xl pour avoir plus d'espace
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#fff' : '#000',
                        height: '90vh', // Hauteur fixe pour éviter que ça prenne tout l'écran
                    },
                }}
            >
                <DialogActions
                    style={{
                        backgroundColor: darkMode ? '#424242' : '#f5f5f5',
                        padding: '10px',
                        margin: 0,
                        justifyContent: 'flex-end', // Aligne le bouton à droite
                        paddingRight: '20px' // Ajoute un peu d'espace à droite
                    }}
                >
                    <Button
                        onClick={handleClosePreview}
                        variant="contained"
                        startIcon={<CloseIcon />}
                        style={{
                            backgroundColor: darkMode ? '#666' : '#e0e0e0',
                            color: darkMode ? '#fff' : '#000',
                            minWidth: '120px' // Donne une largeur minimale au bouton
                        }}
                    >
                        Fermer
                    </Button>
                </DialogActions>

                <DialogContent
                    style={{
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#fff' : '#000',
                        padding: 0, // Retiré le padding pour que le composant prenne tout l'espace
                        overflow: 'auto'
                    }}
                >
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        {getPreviewContent().content}
                    </div>
                </DialogContent>

            </Dialog>
        </form >
    );
}



