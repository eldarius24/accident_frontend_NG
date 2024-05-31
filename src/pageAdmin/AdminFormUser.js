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

export default function AdminFormUser({ accidentData }) {
    const apiUrl = config.apiUrl;
    const { setValue, watch, handleSubmit } = useForm();

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const [formData, setFormData] = useState({
        userLogin: watch('userLogin') || accidentData?.userLogin || null,
        userPassword: watch('userPassword') || accidentData?.userPassword || null,
        userName: watch('userName') || accidentData?.userName || null,
        boolAdministrateur: watch('boolAdministrateur') || accidentData?.boolAdministrateur || false,
        entrepriseConseillerPrevention: watch('entrepriseConseillerPrevention') || accidentData?.boolConseiller || false,
        entrepriseVisiteur: watch('entrepriseVisiteur') || accidentData?.boolVisiteur || false,
    });

    //listes des entreprises
    const [entreprises, setEntreprises] = useState([]);

    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur de requête:', error.message);
        }
    };

    useEffect(() => {
        const init = async () => {
            const entreprise = await fetchData(`http://${apiUrl}:3100/api/entreprises`);
            setEntreprises(entreprise.map((item) => item.AddEntreName) || []);
        };

        init();
    }, []);

    useEffect(() => {
        Object.keys(formData).forEach((key) => {
            setValue(key, formData[key]);
        });
    }, [formData]);

    console.log("entreprises :", entreprises);
    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = async (data) => {
        try {
            const response = await axios.put(`http://${apiUrl}:3100/api/users`, data);
            console.log('Réponse du serveur en création :', response.data);
        } catch (error) {
            console.error('Erreur de requête:', error.message);
        }
    };

    const handleChange = (key, value) => {
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Administration des droits</h2>

                <h3>Créer un nouvelle utilisateur</h3>

                <TextFieldP id='userLogin' label="Adresse email" onChange={(e) => handleChange('email', e.target.value)} defaultValue={formData.userLogin}></TextFieldP>

                <TextFieldP id='userPassword' label="Mot de passe" onChange={(e) => handleChange('password', e.target.value)} defaultValue={formData.userPassword}></TextFieldP>

                <TextFieldP id='userName' label="Nom et Prénom" onChange={(e) => handleChange('name', e.target.value)} defaultValue={formData.userName}></TextFieldP>


                <h3>Donner les accès administration du site:</h3>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                    <ControlLabelAdminP id="boolAdministrateur" label="Administrateur du site" onChange={(boolAdministrateurCoche) => {
                        handleChange('boolAdministrateur', boolAdministrateurCoche);
                        setValue('boolAdministrateur', boolAdministrateurCoche);
                    }} defaultValue={formData.boolAdministrateur}></ControlLabelAdminP>

                </Box>

                <h3>Donner les accès conseiller en prévention:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={entreprises}
                    disableCloseOnSelect
                    sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    getOptionLabel={(option) => option}
                    onChange={(value) => handleChange('entrepriseConseiller', value.map((item) => item.title))}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: '#257525' }}
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
                            sx={{ backgroundColor: '#84a784', color: '#257525', boxShadow: 3 }}
                        />
                    )}
                />

                <h3>Donner les accès Visiteur:</h3>

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={entreprises}
                    onChange={handleChange('entrepriseVisiteur', value.map((item) => item.title))}
                    disableCloseOnSelect
                    sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3, margin: '0 auto 1rem' }}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: '#257525' }}
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