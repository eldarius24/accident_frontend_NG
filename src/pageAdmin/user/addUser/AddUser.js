import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../../../_composants/textFieldP';
import ControlLabelAdminP from '../../../_composants/controlLabelAdminP';
import { Box, Paper, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getUser from './_actions/get-user';
import getEntreprises from './_actions/get-entreprises';
import putUser from './_actions/put-user';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../../_composants/CustomSnackbar';
import { useTheme } from '../../../pageAdmin/user/ThemeContext';

export default function AddUser() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const { setValue, watch, handleSubmit } = useForm();
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    // États
    const [user, setUser] = useState({
        userLogin: "",
        userPassword: "",
        userName: "",
        boolAdministrateur: false,
        boolDeveloppeur: false,
        entreprisesConseillerPrevention: [],
        entreprisesVisiteur: [],
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


        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
            showSnackbar('Erreur lors de la récupération de l\'utilisateur', 'error');
        }
    };

    // Récupération des entreprises
    const getEntreprisesData = async () => {
        try {
            const entreprisesData = await getEntreprises();
            if (!entreprisesData) throw new Error('Aucune entreprise trouvée');
            setEntreprises(entreprisesData.map(item => item.AddEntreName));
        } catch (error) {
            console.error('Erreur lors de la récupération des entreprises:', error.message);
            showSnackbar('Erreur lors de la récupération des entreprises', 'error');
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
        try {
            // Préparation des données utilisateur
            const userData = {
                ...user,
                darkMode: user.darkMode ?? false,
                selectedYears: user.selectedYears ?? [new Date().getFullYear().toString()]
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
                <h2>Administration des droits</h2>

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

                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès administration du site:</h3>
                <Tooltip title="Cocher cette case si l'utilisateur est administrateur du site. Il aura accès à tous les menus pour toutes les entreprises" arrow>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                    </Box>
                </Tooltip>
                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès developpeur du site:</h3>
                <Tooltip title="Cocher cette case si l'utilisateur est développeur du site. Il aura les mêmes droits qu'un administrateur" arrow>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                    </Box>
                </Tooltip>
                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès conseiller en prévention:</h3>
                <Tooltip title="Si le nouvel utilisateur est conseiller en prévention, sélectionner son entreprise" arrow>
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
                </Tooltip>

                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Donner les accès Visiteur:</h3>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo-visiteur"
                    options={entreprises}
                    onChange={(_, value) => handleChange('entreprisesVisiteur', value)}
                    value={user.entreprisesVisiteur}
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

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Cliquez ici pour enregistrer et créer le nouvel utilisateur" arrow>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.3s ease-in-out',
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
                            Enregistrer l'utilisateur
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
            <div className="image-cortigroupe"></div>
            <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
                <h5 style={{ marginBottom: '40px' }}>
                    Développé par Remy et Benoit pour Le Cortigroupe.
                </h5>
            </Tooltip>
        </form>
    );
}