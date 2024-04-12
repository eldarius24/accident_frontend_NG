import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import TextFieldP from '../composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import ControlLabelAdminP from '../composants/controlLabelAdminP';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import config from '../config.json';

export default function AdminPanelSettings({ accidentData }) {
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const { setValue, watch, handleSubmit} = useForm();


    const [userLogin, setuserLogin] = useState(watch('userLogin') ? watch('userLogin') : (accidentData && accidentData.userLogin ? accidentData.userLogin : null));
    const [userPassword, setuserPassword] = useState(watch('userPassword') ? watch('userPassword') : (accidentData && accidentData.userPassword ? accidentData.userPassword : null));
    const [userName, setuserName] = useState(watch('userName') ? watch('userName') : (accidentData && accidentData.userName ? accidentData.userName : null));
    const [boolCortil, setboolCortil] = useState(watch('boolCortil') ? watch('boolCortil') : (accidentData && accidentData.boolCortil ? accidentData.boolCortil : false));
    const [boolCortibat, setboolCortibat] = useState(watch('boolCortibat') ? watch('boolCortibat') : (accidentData && accidentData.boolCortibat ? accidentData.boolCortibat : false));
    const [boolCortibel, setboolCortibel] = useState(watch('boolCortibel') ? watch('boolCortibel') : (accidentData && accidentData.boolCortibel ? accidentData.boolCortibel : false));
    const [boolNns, setboolNns] = useState(watch('boolNns') ? watch('boolNns') : (accidentData && accidentData.boolNns ? accidentData.boolNns : false));
    const [boolHmns, setboolHmns] = useState(watch('boolHmns') ? watch('boolHmns') : (accidentData && accidentData.boolHmns ? accidentData.boolHmns : false));
    const [boolCortidess, setboolCortidess] = useState(watch('boolCortidess') ? watch('boolCortidess') : (accidentData && accidentData.boolCortidess ? accidentData.boolCortidess : false));
    const [boolAvs, setboolAvs] = useState(watch('boolAvs') ? watch('boolAvs') : (accidentData && accidentData.boolAvs ? accidentData.boolAvs : false));
    const [boolCortitreize, setboolCortitreize] = useState(watch('boolCortitreize') ? watch('boolCortitreize') : (accidentData && accidentData.boolCortitreize ? accidentData.boolCortitreize : false));
    const [boolBipExpresse, setboolBipExpresse] = useState(watch('boolBipExpresse') ? watch('boolBipExpresse') : (accidentData && accidentData.boolBipExpresse ? accidentData.boolBipExpresse : false));
    const [boolNCJ, setboolNCJ] = useState(watch('boolNCJ') ? watch('boolNCJ') : (accidentData && accidentData.boolNCJ ? accidentData.boolNCJ : false));
    const [boolAdministrateur, setboolAdministrateur] = useState(watch('boolAdministrateur') ? watch('boolAdministrateur') : (accidentData && accidentData.boolAdministrateur ? accidentData.boolAdministrateur : false));
    const [boolCortilr, setboolCortilr] = useState(watch('boolCortilr') ? watch('boolCortilr') : (accidentData && accidentData.boolCortilr ? accidentData.boolCortilr : false));
    const [boolCortibatr, setboolCortibatr] = useState(watch('boolCortibatr') ? watch('boolCortibatr') : (accidentData && accidentData.boolCortibatr ? accidentData.boolCortibatr : false));
    const [boolCortibelr, setboolCortibelr] = useState(watch('boolCortibelr') ? watch('boolCortibelr') : (accidentData && accidentData.boolCortibelr ? accidentData.boolCortibelr : false));
    const [boolNnsr, setboolNnsr] = useState(watch('boolNnsr') ? watch('boolNnsr') : (accidentData && accidentData.boolNnsr ? accidentData.boolNnsr : false));
    const [boolHmnsr, setboolHmnsr] = useState(watch('boolHmnsr') ? watch('boolHmnsr') : (accidentData && accidentData.boolHmnsr ? accidentData.boolHmnsr : false));
    const [boolCortidessr, setboolCortidessr] = useState(watch('boolCortidessr') ? watch('boolCortidessr') : (accidentData && accidentData.boolCortidessr ? accidentData.boolCortidessr : false));
    const [boolAvsr, setboolAvsr] = useState(watch('boolAvsr') ? watch('boolAvsr') : (accidentData && accidentData.boolAvsr ? accidentData.boolAvsr : false));
    const [boolCortitreizer, setboolCortitreizer] = useState(watch('boolCortitreizer') ? watch('boolCortitreizer') : (accidentData && accidentData.boolCortitreizer ? accidentData.boolCortitreizer : false));
    const [boolBipExpresser, setboolBipExpresser] = useState(watch('boolBipExpresser') ? watch('boolBipExpresser') : (accidentData && accidentData.boolBipExpresser ? accidentData.boolBipExpresser : false));
    const [boolNCJr, setboolNCJr] = useState(watch('boolNCJr') ? watch('boolNCJr') : (accidentData && accidentData.boolNCJr ? accidentData.boolNCJr : false));



    useEffect(() => {
        setValue('userLogin', userLogin)
        setValue('userPassword', userPassword)
        setValue('userName', userName)
        setValue('boolCortil', boolCortil)
        setValue('boolCortibat', boolCortibat)
        setValue('boolCortibel', boolCortibel)
        setValue('boolNns', boolNns)
        setValue('boolHmns', boolHmns)
        setValue('boolCortidess', boolCortidess)
        setValue('boolAvs', boolAvs)
        setValue('boolCortitreize', boolCortitreize)
        setValue('boolBipExpresse', boolBipExpresse)
        setValue('boolNCJ', boolNCJ)
        setValue('boolAdministrateur', boolAdministrateur)
        setValue('boolCortilr', boolCortilr)
        setValue('boolCortibatr', boolCortibatr)
        setValue('boolCortibelr', boolCortibelr)
        setValue('boolNnsr', boolNnsr)
        setValue('boolHmnsr', boolHmnsr)
        setValue('boolCortidessr', boolCortidessr)
        setValue('boolAvsr', boolAvsr)
        setValue('boolCortitreizer', boolCortitreizer)
        setValue('boolBipExpresser', boolBipExpresser)
        setValue('boolNCJr', boolNCJr)

    }, [userLogin, userPassword, userName, boolCortil, boolCortibat, boolCortibel, boolNns, boolHmns, boolCortidess, boolAvs, boolCortitreize, boolBipExpresse, boolNCJ, boolAdministrateur, boolCortilr, boolCortibatr, boolCortibelr, boolNnsr, boolHmnsr, boolCortidessr, boolAvsr, boolCortitreizer, boolBipExpresser, boolNCJr]);


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


        // Naviguer vers la page d'accueil
        navigate('/');
    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h3>Administration des droits</h3>

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

                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                    <ControlLabelAdminP id="boolCortil" label="Cortil" onChange={(boolCortilCoche) => {
                        setboolCortil(boolCortilCoche);
                        setValue('boolCortil', boolCortilCoche);
                    }} defaultValue={boolCortil}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolCortibat" label="Cortibat" onChange={(boolCortibatCoche) => {
                        setboolCortibat(boolCortibatCoche);
                        setValue('boolCortibat', boolCortibatCoche);
                    }} defaultValue={boolCortibat}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolCortibel" label="Cortibel" onChange={(boolCortibelCoche) => {
                        setboolCortibel(boolCortibelCoche);
                        setValue('boolCortibel', boolCortibelCoche);
                    }} defaultValue={boolCortibel}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolNns" label="NNS" onChange={(boolNnsCoche) => {
                        setboolNns(boolNnsCoche);
                        setValue('boolNns', boolNnsCoche);
                    }} defaultValue={boolNns}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolHmns" label="Hmns" onChange={(boolHmnsCoche) => {
                        setboolHmns(boolHmnsCoche);
                        setValue('boolHmns', boolHmnsCoche);
                    }} defaultValue={boolHmns}></ControlLabelAdminP>


                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>

                    <ControlLabelAdminP id="boolCortidess" label="Cortidess" onChange={(boolCortidessCoche) => {
                        setboolCortidess(boolCortidessCoche);
                        setValue('boolCortidess', boolCortidessCoche);
                    }} defaultValue={boolCortidess}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolAvs" label="Avs" onChange={(boolAvsCoche) => {
                        setboolAvs(boolAvsCoche);
                        setValue('boolAvs', boolAvsCoche);
                    }} defaultValue={boolAvs}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolCortitreize" label="Cortitreize" onChange={(boolCortitreizeCoche) => {
                        setboolCortitreize(boolCortitreizeCoche);
                        setValue('boolCortitreize', boolCortitreizeCoche);
                    }} defaultValue={boolCortitreize}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolBipExpresse" label="Bip Expresse" onChange={(boolBipExpresseCoche) => {
                        setboolBipExpresse(boolBipExpresseCoche);
                        setValue('boolBipExpresse', boolBipExpresseCoche);
                    }} defaultValue={boolBipExpresse}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolNCJ" label="NCJ" onChange={(boolNCJCoche) => {
                        setboolNCJ(boolNCJCoche);
                        setValue('boolNCJ', boolNCJCoche);
                    }} defaultValue={boolNCJ}></ControlLabelAdminP>

                </Box>

                <h3>Donner les accès consulter les ATs:</h3>

                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                    <ControlLabelAdminP id="boolCortilr" label="Cortil" onChange={(boolCortilrCoche) => {
                        setboolCortilr(boolCortilrCoche);
                        setValue('boolCortilr', boolCortilrCoche);
                    }} defaultValue={boolCortilr}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolCortibatr" label="Cortibat" onChange={(boolCortibatrCoche) => {
                        setboolCortibatr(boolCortibatrCoche);
                        setValue('boolCortibatr', boolCortibatrCoche);
                    }} defaultValue={boolCortibatr}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolCortibelr" label="Cortibel" onChange={(boolCortibelrCoche) => {
                        setboolCortibelr(boolCortibelrCoche);
                        setValue('boolCortibelr', boolCortibelrCoche);
                    }} defaultValue={boolCortibelr}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolNnsr" label="NNS" onChange={(boolNnsrCoche) => {
                        setboolNnsr(boolNnsrCoche);
                        setValue('boolNnsr', boolNnsrCoche);
                    }} defaultValue={boolNnsr}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolHmnsr" label="Hmns" onChange={(boolHmnsrCoche) => {
                        setboolHmnsr(boolHmnsrCoche);
                        setValue('boolHmnsr', boolHmnsrCoche);
                    }} defaultValue={boolHmnsr}></ControlLabelAdminP>




                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>

                    <ControlLabelAdminP id="boolCortidessr" label="Cortidess" onChange={(boolCortidessrCoche) => {
                        setboolCortidessr(boolCortidessrCoche);
                        setValue('boolCortidessr', boolCortidessrCoche);
                    }} defaultValue={boolCortidess}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolAvsr" label="Avs" onChange={(boolAvsrCoche) => {
                        setboolAvsr(boolAvsrCoche);
                        setValue('boolAvsr', boolAvsrCoche);
                    }} defaultValue={boolAvs}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolCortitreizer" label="Cortitreize" onChange={(boolCortitreizerCoche) => {
                        setboolCortitreizer(boolCortitreizerCoche);
                        setValue('boolCortitreizer', boolCortitreizerCoche);
                    }} defaultValue={boolCortitreize}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolBipExpresser" label="Bip Expresse" onChange={(boolBipExpresserCoche) => {
                        setboolBipExpresser(boolBipExpresserCoche);
                        setValue('boolBipExpresser', boolBipExpresserCoche);
                    }} defaultValue={boolBipExpresse}></ControlLabelAdminP>

                    <ControlLabelAdminP id="boolNCJr" label="NCJ" onChange={(boolNCJrCoche) => {
                        setboolNCJr(boolNCJrCoche);
                        setValue('boolNCJr', boolNCJrCoche);
                    }} defaultValue={boolNCJ}></ControlLabelAdminP>

                </Box>

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