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

/**
 * Page pour la création/modification d'un utilisateur
 * @returns Formulaires pour la création/modification d'un utilisateur
 */
export default function AddUser() {
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const { setValue, watch, handleSubmit } = useForm();
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    /**
     * Affiche un message dans une snackbar.
     * @param {string} message - Le message à afficher.
     * @param {string} [severity='info'] - La gravité du message. Les valeurs possibles sont 'info', 'success', 'warning' et 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     * 
     * @param {object} event - L'événement qui a déclenché la fermeture de la snackbar.
     * @param {string} reason - La raison pour laquelle la snackbar se ferme. Si elle vaut 'clickaway', cela signifie que l'utilisateur a cliqué en dehors de la snackbar.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    /**
     * Récupère les données de l'utilisateur en fonction de son ID si celui-ci est fourni.
     * Si l'utilisateur n'est pas trouvé, il est considéré comme inexistant.
     * Si l'utilisateur est trouvé, ses données sont stockées dans l'état user.
     */
    const getUserData = async () => {
        try {
            if (!userId)
                return;

            const user = await getUser(userId);

            if (!user)
                throw new Error('Aucun utilisateur trouvé');

            setUser(user);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
        }
    }

    useEffect(() => {
        getUserData();
    }, [userId]);

    const [user, setUser] = useState({
        userLogin: watch('userLogin') || "",
        userPassword: watch('userPassword') || "",
        userName: watch('userName') || "",
        boolAdministrateur: watch('boolAdministrateur') || false,
        entreprisesConseillerPrevention: watch('entreprisesConseillerPrevention') || [],
        entreprisesVisiteur: watch('entreprisesVisiteur') || [],
    });

    //listes des entreprises
    const [entreprises, setEntreprises] = useState([]);

    /**
     * Récupère les noms des entreprises à partir de l'API.
     * Si l'appel à l'API échoue, une erreur est logguée dans la console.
     * Si l'appel à l'API réussit, les noms des entreprises sont stockés dans l'état entreprises.
     */
    const getEntreprisesData = async () => {
        try {
            const entreprisesData = await getEntreprises();

            if (!entreprisesData)
                throw new Error('Aucune entreprise trouvée');

            setEntreprises(entreprisesData.map((item) => item.AddEntreName) || []);
        } catch (error) {
            console.error('Erreur de la récupération des entreprises:', error.message);
        }
    };

    useEffect(() => {
        getEntreprisesData();
    }, []);


    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = async () => {
        try {

            const result = await putUser(userId, user);
            setTimeout(() => navigate('/adminUser'), 2000);
            if (!result)
                return console.error('Erreur lors de la création/modification de l\'utilisateur');

            console.log('Utilisateur créé/modifié:', result);
            showSnackbar('Utilisateur en cours de création', 'success');
            setTimeout(() => showSnackbar('Utilisateur créée avec succès', 'success'), 1000);

        } catch (error) {
            console.error('Erreur de requête:', error.message);
            showSnackbar('Erreur lors de la création de l\'utilisateur', 'error');
        }
    };

    /**
     * Handles the change of a key-value pair in the user data object.
     * 
     * @param {string} key - The key to be updated in the user data object.
     * @param {any} value - The new value to be assigned to the key in the user data object.
     */
    const handleChange = (key, value) => {
        setUser((prevData) => ({ ...prevData, [key]: value }));
    };

    /**
     * PaperComponent is a custom component that wraps the MUI Paper component.
     * It overrides the default background color of the Paper component to #bed7f6.
     * This component is used as the PaperComponent prop in the Autocomplete component.
     */
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
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style" style={{
                backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            }}>
                <h2>Administration des droits</h2>

                <h3>Créer un nouvelle utilisateur</h3>

                <TextFieldP id='userLogin' label="Adresse email" onChange={(value) => handleChange('userLogin', value)} defaultValue={user.userLogin}></TextFieldP>

                <TextFieldP id='userPassword' label="Mot de passe" onChange={(value) => handleChange('userPassword', value)} defaultValue={user.userPassword}></TextFieldP>

                <TextFieldP id='userName' label="Nom et Prénom" onChange={(value) => handleChange('userName', value)} defaultValue={user.userName}></TextFieldP>


                <h3>Donner les accès administration du site:</h3>
                <Tooltip title="Cocher cette case si l'utilisateur est administrateur du site. Il aura acces a tous les menus pour toutes les entreprises" arrow>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                        <ControlLabelAdminP id="boolAdministrateur" label="Administrateur du site" onChange={(boolAdministrateurCoche) => {
                            handleChange('boolAdministrateur', boolAdministrateurCoche);
                            setValue('boolAdministrateur', boolAdministrateurCoche);
                        }} defaultValue={user.boolAdministrateur}></ControlLabelAdminP>

                    </Box>
                </Tooltip>

                <h3>Donner les accès conseiller en prévention:</h3>
                <Tooltip title="Si le nouvelle utilisateur est conseiller en prévention, sélèctioner son entrepriseafin qu'il ne puisse puisse pas gérer d'autres entreprise" arrow>
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

                <h3>Donner les accès Visiteur:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo-visiteur"
                    options={entreprises}
                    onChange={(_, value) => { handleChange('entreprisesVisiteur', value) }}
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
                    <Tooltip title="Cliquez ici pour enregistrer et créer le nouvelle utilisateur" arrow>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: '#ee742d59',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': { backgroundColor: '#95ad22', transform: 'scale(1.08)', boxShadow: 6 },
                                padding: '10px 20px',
                                width: '50%',
                                marginTop: '1cm',
                                height: '300%',
                                fontSize: '2rem', // Taille de police de base

                                // Utilisation de Media Queries pour ajuster la taille de police
                                '@media (min-width: 750px)': {
                                    fontSize: '3rem', // Taille de police plus grande pour les écrans plus larges
                                },
                                '@media (max-width: 550px)': {
                                    fontSize: '1.5rem', // Taille de police plus petite pour les écrans plus étroits
                                },
                            }}
                            variant="contained"
                        >
                            Enregistrer l'utilisateur
                        </Button>
                    </Tooltip>
                </div>

                <div style={{ marginTop: '30px' }}></div>
                <CustomSnackbar
                    open={snackbar.open}
                    handleClose={handleCloseSnackbar}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
            </div>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe.</h5>
            </Tooltip>

        </form>

    );
}