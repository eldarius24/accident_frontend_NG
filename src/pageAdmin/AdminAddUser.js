import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import ControlLabelAdminP from '../composants/controlLabelAdminP';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import config from '../config.json';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
export default function AdminAddUser({ accidentData }) {

    const apiUrl = config.apiUrl;
    const { setValue, watch, handleSubmit } = useForm();


    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;



    const [userLogin, setuserLogin] = useState(watch('userLogin') ? watch('userLogin') : (accidentData && accidentData.userLogin ? accidentData.userLogin : null));
    const [userPassword, setuserPassword] = useState(watch('userPassword') ? watch('userPassword') : (accidentData && accidentData.userPassword ? accidentData.userPassword : null));
    const [userName, setuserName] = useState(watch('userName') ? watch('userName') : (accidentData && accidentData.userName ? accidentData.userName : null));
    const [boolAdministrateur, setboolAdministrateur] = useState(watch('boolAdministrateur') ? watch('boolAdministrateur') : (accidentData && accidentData.boolAdministrateur ? accidentData.boolAdministrateur : false));




    useEffect(() => {
        setValue('userLogin', userLogin)
        setValue('userPassword', userPassword)
        setValue('userName', userName)
        setValue('boolAdministrateur', boolAdministrateur)


    }, [userLogin, userPassword, userName, boolAdministrateur]);

    const CpEntreprise = [
        { title: 'Le Cortil' },
        { title: 'Cortibat' },
        { title: 'Cortibel' },
        { title: 'Nns' },
        { title: 'Hmns' },
        { title: 'Cortidess' },
        { title: 'Avs' },
        { title: 'Cortitreize' },
        { title: 'BipExpresse' },
        { title: 'NCJ' },

    ];

    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = (data) => {

        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);

        //mode CREATION
        axios.put("http://" + apiUrl + ":3100/api/users", data)
            .then(response => {
                console.log('Réponse du serveur en création :', response.data);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
            });

    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Administration des droits</h2>

                <h3>Créer un nouvelle utilisateur</h3>

                <TextFieldP id='userLogin' label="Adresse email" onChange={setuserLogin} defaultValue={userLogin}></TextFieldP>

                <TextFieldP id='userPassword' label="Mot de passe" onChange={setuserPassword} defaultValue={userPassword}></TextFieldP>

                <TextFieldP id='userName' label="Nom et Prénom" onChange={setuserName} defaultValue={userName}></TextFieldP>


                <h3>Donner les accès administration du site:</h3>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                    <ControlLabelAdminP id="boolAdministrateur" label="Administrateur du site" onChange={(boolAdministrateurCoche) => {
                        setboolAdministrateur(boolAdministrateurCoche);
                        setValue('boolAdministrateur', boolAdministrateurCoche);
                    }} defaultValue={boolAdministrateur}></ControlLabelAdminP>

                </Box>

                <h3>Donner les accès conseiller en prévention:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={CpEntreprise}
                    disableCloseOnSelect
                    sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    getOptionLabel={(option) => option.title}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: '#257525' }}
                                checked={selected}
                            />
                            {option.title}
                        </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sélectionnez l'entreprise"
                            placeholder="Favorites"
                            sx={{ backgroundColor: '#84a784', color: '#257525', boxShadow: 3 }}
                        />
                    )}
                />

                <h3>Donner les accès Visiteur:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={CpEntreprise}
                    disableCloseOnSelect
                    sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    getOptionLabel={(option) => option.title}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: '#257525' }}
                                checked={selected}
                            />
                            {option.title}
                        </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sélectionnez l'entreprise"
                            placeholder="Favorites"
                            sx={{ backgroundColor: '#84a784', color: '#257525', boxShadow: 3 }}
                        />
                    )}
                />

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
                        Enregistrer les données
                    </Button>
                </div>


            </div>

        </form>
    );
}