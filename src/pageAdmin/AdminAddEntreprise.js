import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import Button from '@mui/material/Button';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';

export default function AdminPanelSettings({ accidentData }) {
    const navigate = useNavigate();

    const apiUrl = config.apiUrl;
    const { setValue, watch, handleSubmit } = useForm();


    const [AddEntreName, setAddEntreName] = useState(watch('AddEntreName') ? watch('AddEntreName') : (accidentData && accidentData.AddEntreName ? accidentData.AddEntreName : null));
    const [AddEntrePolice, setAddEntrePolice] = useState(watch('AddEntrePolice') ? watch('AddEntrePolice') : (accidentData && accidentData.AddEntrePolice ? accidentData.AddEntrePolice : null));
    const [AddEntrNumentr, setAddEntrNumentr] = useState(watch('AddEntrNumentr') ? watch('AddEntrNumentr') : (accidentData && accidentData.AddEntrNumentr ? accidentData.AddEntrNumentr : null));
    const [AddEntrOnss, setAddEntrOnss] = useState(watch('AddEntrOnss') ? watch('AddEntrOnss') : (accidentData && accidentData.AddEntrOnss ? accidentData.AddEntrOnss : null));
    const [AddEntrEnite, setAddEntrEnite] = useState(watch('AddEntrEnite') ? watch('AddEntrEnite') : (accidentData && accidentData.AddEntrEnite ? accidentData.AddEntrEnite : null));
    const [AddEntrIban, setAddEntrIban] = useState(watch('AddEntrIban') ? watch('AddEntrIban') : (accidentData && accidentData.AddEntrIban ? accidentData.AddEntrIban : null));
    const [AddEntrBic, setAddEntrBic] = useState(watch('AddEntrBic') ? watch('AddEntrBic') : (accidentData && accidentData.AddEntrBic ? accidentData.AddEntrBic : null));
    const [AddEntrRue, setAddEntrRue] = useState(watch('AddEntrRue') ? watch('AddEntrRue') : (accidentData && accidentData.AddEntrRue ? accidentData.AddEntrRue : null));
    const [AddEntrCodpost, setAddEntrCodpost] = useState(watch('AddEntrCodpost') ? watch('AddEntrCodpost') : (accidentData && accidentData.AddEntrCodpost ? accidentData.AddEntrCodpost : null));
    const [AddEntrLocalite, setAddEntrLocalite] = useState(watch('AddEntrLocalite') ? watch('AddEntrLocalite') : (accidentData && accidentData.AddEntrLocalite ? accidentData.AddEntrLocalite : null));
    const [AddEntrTel, setAddEntrTel] = useState(watch('AddEntrTel') ? watch('AddEntrTel') : (accidentData && accidentData.AddEntrTel ? accidentData.AddEntrTel : null));
    const [AddEntrEmail, setAddEntrEmail] = useState(watch('AddEntrEmail') ? watch('AddEntrEmail') : (accidentData && accidentData.AddEntrEmail ? accidentData.AddEntrEmail : null));
    const [AddEntreActiventre, setAddEntreActiventre] = useState(watch('AddEntreActiventre') ? watch('AddEntreActiventre') : (accidentData && accidentData.AddEntreActiventre ? accidentData.AddEntreActiventre : null));
    const [AddEntrSecsoci, setAddEntrSecsoci] = useState(watch('AddEntrSecsoci') ? watch('AddEntrSecsoci') : (accidentData && accidentData.AddEntrSecsoci ? accidentData.AddEntrSecsoci : null));
    const [AddEntrNumaffi, setAddEntrNumaffi] = useState(watch('AddEntrNumaffi') ? watch('AddEntrNumaffi') : (accidentData && accidentData.AddEntrNumaffi ? accidentData.AddEntrNumaffi : null));
    const [AddEntrScadresse, setAddEntrScadresse] = useState(watch('AddEntrScadresse') ? watch('AddEntrScadresse') : (accidentData && accidentData.AddEntrScadresse ? accidentData.AddEntrScadresse : null));
    const [AddEntrSccpost, setAddEntrSccpost] = useState(watch('AddEntrSccpost') ? watch('AddEntrSccpost') : (accidentData && accidentData.AddEntrSccpost ? accidentData.AddEntrSccpost : null));
    const [AddEntrSclocalite, setAddEntrSclocalite] = useState(watch('AddEntrSclocalite') ? watch('AddEntrSclocalite') : (accidentData && accidentData.AddEntrSclocalite ? accidentData.AddEntrSclocalite : null));


    useEffect(() => {
        setValue('AddEntreName', AddEntreName)
        setValue('AddEntrePolice', AddEntrePolice)
        setValue('AddEntrNumentr', AddEntrNumentr)
        setValue('AddEntrOnss', AddEntrOnss)
        setValue('AddEntrEnite', AddEntrEnite)
        setValue('AddEntrIban', AddEntrIban)
        setValue('AddEntrBic', AddEntrBic)
        setValue('AddEntrRue', AddEntrRue)
        setValue('AddEntrCodpost', AddEntrCodpost)
        setValue('AddEntrLocalite', AddEntrLocalite)
        setValue('AddEntrTel', AddEntrTel)
        setValue('AddEntrEmail', AddEntrEmail)
        setValue('AddEntreActiventre', AddEntreActiventre)
        setValue('AddEntrSecsoci', AddEntrSecsoci)
        setValue('AddEntrNumaffi', AddEntrNumaffi)
        setValue('AddEntrScadresse', AddEntrScadresse)
        setValue('AddEntrSccpost', AddEntrSccpost)
        setValue('AddEntrSclocalite', AddEntrSclocalite)
    }, [AddEntreName, AddEntrePolice, AddEntrOnss, AddEntrEnite, AddEntrIban, AddEntrBic, AddEntrRue, AddEntrCodpost, AddEntrLocalite, AddEntrTel, AddEntrEmail, AddEntreActiventre, AddEntrSecsoci, AddEntrNumaffi, AddEntrScadresse, AddEntrSccpost, AddEntrSclocalite, AddEntrNumentr]);



    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = (data) => {

        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);

        //mode CREATION
        axios.put("http://" + apiUrl + ":3100/api/entreprises", data)
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
                <h2>Créer une nouvelle entreprise</h2>
                <h3>Toutes les données doivent êtres obligatoirement remplie</h3>


                <TextFieldP id='AddEntreName' label="Nom de la nouvelle entreprise" onChange={setAddEntreName} defaultValue={AddEntreName}></TextFieldP>
                <TextFieldP id='AddEntrRue' label="Rue et numéro" onChange={setAddEntrRue} defaultValue={AddEntrRue}></TextFieldP>
                <TextFieldP id='AddEntrCodpost' label="Code postal" onChange={setAddEntrCodpost} defaultValue={AddEntrCodpost}></TextFieldP>
                <TextFieldP id='AddEntrLocalite' label="Localité" onChange={setAddEntrLocalite} defaultValue={AddEntrLocalite}></TextFieldP>
                <TextFieldP id='AddEntrTel' label="Téléphone" onChange={setAddEntrTel} defaultValue={AddEntrTel}></TextFieldP>
                <TextFieldP id='AddEntrEmail' label="Adresse e-mail" onChange={setAddEntrEmail} defaultValue={AddEntrEmail}></TextFieldP>
                <TextFieldP id='AddEntrNumentr' label="Numéro d'entreprise" onChange={setAddEntrNumentr} defaultValue={AddEntrNumentr}></TextFieldP>
                <TextFieldP id='AddEntrePolice' label="Numéro de la Police d'assurance" onChange={setAddEntrePolice} defaultValue={AddEntrePolice}></TextFieldP>
                <TextFieldP id='AddEntrOnss' label="Numéro ONSS" onChange={setAddEntrOnss} defaultValue={AddEntrOnss}></TextFieldP>
                <TextFieldP id='AddEntrEnite' label="Numéro d'unité de l'établissement" onChange={setAddEntrEnite} defaultValue={AddEntrEnite}></TextFieldP>
                <TextFieldP id='AddEntrIban' label="IBAN" onChange={setAddEntrIban} defaultValue={AddEntrIban}></TextFieldP>
                <TextFieldP id='AddEntrBic' label="BIC" onChange={setAddEntrBic} defaultValue={AddEntrBic}></TextFieldP>
                <TextFieldP id='AddEntreActiventre' label="Activité de l'entreprise" onChange={setAddEntreActiventre} defaultValue={AddEntreActiventre}></TextFieldP>
                <TextFieldP id='AddEntrSecsoci' label="Secrétariat sociale" onChange={setAddEntrSecsoci} defaultValue={AddEntrSecsoci}></TextFieldP>
                <TextFieldP id='AddEntrNumaffi' label="Numéro d'affiliation" onChange={setAddEntrNumaffi} defaultValue={AddEntrNumaffi}></TextFieldP>
                <TextFieldP id='AddEntrScadresse' label="Adresse du secrétariat sociale" onChange={setAddEntrScadresse} defaultValue={AddEntrScadresse}></TextFieldP>
                <TextFieldP id='AddEntrSccpost' label="Code postal du secrétariat sociale" onChange={setAddEntrSccpost} defaultValue={AddEntrSccpost}></TextFieldP>
                <TextFieldP id='AddEntrSclocalite' label="Localité du secrétariat sociale" onChange={setAddEntrSclocalite} defaultValue={AddEntrSclocalite}></TextFieldP>
                
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
                        Créer l'Entreprise
                    </Button>
                </div>


            </div>

        </form>
    );
}