import React, { useState, useEffect } from 'react';
import {useForm } from 'react-hook-form';
import TextFieldP from '../../../_composants/textFieldP';
import ControlLabelAdminP from '../../../_composants/controlLabelAdminP';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getUser from './_actions/get-user';
import getEntreprises from './_actions/get-entreprises';
import putUser from './_actions/put-user';

export default function AddUser() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const { setValue, watch, handleSubmit } = useForm();

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

            if (!result)
                return console.error('Erreur lors de la création/modification de l\'utilisateur');

            console.log('Utilisateur créé/modifié:', result);

        } catch (error) {
            console.error('Erreur de requête:', error.message);
        }
    };

    const handleChange = (key, value) => {
        setUser((prevData) => ({ ...prevData, [key]: value }));
    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Administration des droits</h2>

                <h3>Créer un nouvelle utilisateur</h3>

                <TextFieldP id='userLogin' label="Adresse email" onChange={(value) => handleChange('userLogin', value)} defaultValue={user.userLogin}></TextFieldP>

                <TextFieldP id='userPassword' label="Mot de passe" onChange={(value) => handleChange('userPassword', value)} defaultValue={user.userPassword}></TextFieldP>

                <TextFieldP id='userName' label="Nom et Prénom" onChange={(value) => handleChange('userName', value)} defaultValue={user.userName}></TextFieldP>


                <h3>Donner les accès administration du site:</h3>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                    <ControlLabelAdminP id="boolAdministrateur" label="Administrateur du site" onChange={(boolAdministrateurCoche) => {
                        handleChange('boolAdministrateur', boolAdministrateurCoche);
                        setValue('boolAdministrateur', boolAdministrateurCoche);
                    }} defaultValue={user.boolAdministrateur}></ControlLabelAdminP>

                </Box>

                <h3>Donner les accès conseiller en prévention:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={entreprises}
                    disableCloseOnSelect
                    sx={{ backgroundColor: '#0098f9', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    getOptionLabel={(option) => option}
                    onChange={(_, value) => handleChange('entreprisesConseillerPrevention', value)}
                    value={user.entreprisesConseillerPrevention}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: 'green' }}
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
                            sx={{ backgroundColor: '#0098f9', color: '#95519b', boxShadow: 3 }}
                        />
                    )}
                />

                <h3>Donner les accès Visiteur:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={entreprises}
                    onChange={(_, value) => {handleChange('entreprisesVisiteur', value) }}
                    value={user.entreprisesVisiteur}
                    disableCloseOnSelect
                    sx={{ backgroundColor: '#0098f9', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: 'green' }}
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
                            sx={{ backgroundColor: '#0098f9', color: '#257525', boxShadow: 3 }}
                        />
                    )}
                />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: '#ee752d',
                            '&:hover': { backgroundColor: '#95ad22' },
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