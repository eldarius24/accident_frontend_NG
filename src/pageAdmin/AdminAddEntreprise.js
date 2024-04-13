import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import Button from '@mui/material/Button';
import config from '../config.json';
export default function AdminPanelSettings({ accidentData }) {

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
    const [AddEntrSecteur1, setAddEntrSecteur1] = useState(watch('AddEntrSecteur1') ? watch('AddEntrSecteur1') : (accidentData && accidentData.AddEntrSecteur1 ? accidentData.AddEntrSecteur1 : null));
    const [AddEntrSecteur2, setAddEntrSecteur2] = useState(watch('AddEntrSecteur2') ? watch('AddEntrSecteur2') : (accidentData && accidentData.AddEntrSecteur2 ? accidentData.AddEntrSecteur2 : null));
    const [AddEntrSecteur3, setAddEntrSecteur3] = useState(watch('AddEntrSecteur3') ? watch('AddEntrSecteur3') : (accidentData && accidentData.AddEntrSecteur3 ? accidentData.AddEntrSecteur3 : null));
    const [AddEntrSecteur4, setAddEntrSecteur4] = useState(watch('AddEntrSecteur4') ? watch('AddEntrSecteur4') : (accidentData && accidentData.AddEntrSecteur4 ? accidentData.AddEntrSecteur4 : null));
    const [AddEntrSecteur5, setAddEntrSecteur5] = useState(watch('AddEntrSecteur5') ? watch('AddEntrSecteur5') : (accidentData && accidentData.AddEntrSecteur5 ? accidentData.AddEntrSecteur5 : null));
    const [AddEntrSecteur6, setAddEntrSecteur6] = useState(watch('AddEntrSecteur6') ? watch('AddEntrSecteur6') : (accidentData && accidentData.AddEntrSecteur6 ? accidentData.AddEntrSecteur6 : null));
    const [AddEntrSecteur7, setAddEntrSecteur7] = useState(watch('AddEntrSecteur7') ? watch('AddEntrSecteur7') : (accidentData && accidentData.AddEntrSecteur7 ? accidentData.AddEntrSecteur7 : null));
    const [AddEntrSecteur8, setAddEntrSecteur8] = useState(watch('AddEntrSecteur8') ? watch('AddEntrSecteur8') : (accidentData && accidentData.AddEntrSecteur8 ? accidentData.AddEntrSecteur8 : null));
    const [AddEntrSecteur9, setAddEntrSecteur9] = useState(watch('AddEntrSecteur9') ? watch('AddEntrSecteur9') : (accidentData && accidentData.AddEntrSecteur9 ? accidentData.AddEntrSecteur9 : null));
    const [AddEntrSecteur10, setAddEntrSecteur10] = useState(watch('AddEntrSecteur10') ? watch('AddEntrSecteur10') : (accidentData && accidentData.AddEntrSecteur10 ? accidentData.AddEntrSecteur10 : null));
    const [AddEntrSecteur11, setAddEntrSecteur11] = useState(watch('AddEntrSecteur11') ? watch('AddEntrSecteur11') : (accidentData && accidentData.AddEntrSecteur11 ? accidentData.AddEntrSecteur11 : null));
    const [AddEntrSecteur12, setAddEntrSecteur12] = useState(watch('AddEntrSecteur12') ? watch('AddEntrSecteur12') : (accidentData && accidentData.AddEntrSecteur12 ? accidentData.AddEntrSecteur12 : null));
    const [AddEntrSecteur13, setAddEntrSecteur13] = useState(watch('AddEntrSecteur13') ? watch('AddEntrSecteur13') : (accidentData && accidentData.AddEntrSecteur13 ? accidentData.AddEntrSecteur13 : null));
    const [AddEntrSecteur14, setAddEntrSecteur14] = useState(watch('AddEntrSecteur14') ? watch('AddEntrSecteur14') : (accidentData && accidentData.AddEntrSecteur14 ? accidentData.AddEntrSecteur14 : null));
    const [AddEntrSecteur15, setAddEntrSecteur15] = useState(watch('AddEntrSecteur15') ? watch('AddEntrSecteur15') : (accidentData && accidentData.AddEntrSecteur15 ? accidentData.AddEntrSecteur15 : null));
    const [AddEntrSecteur16, setAddEntrSecteur16] = useState(watch('AddEntrSecteur16') ? watch('AddEntrSecteur16') : (accidentData && accidentData.AddEntrSecteur16 ? accidentData.AddEntrSecteur16 : null));
    const [AddEntrSecteur17, setAddEntrSecteur17] = useState(watch('AddEntrSecteur17') ? watch('AddEntrSecteur17') : (accidentData && accidentData.AddEntrSecteur17 ? accidentData.AddEntrSecteur17 : null));
    const [AddEntrSecteur18, setAddEntrSecteur18] = useState(watch('AddEntrSecteur18') ? watch('AddEntrSecteur18') : (accidentData && accidentData.AddEntrSecteur18 ? accidentData.AddEntrSecteur18 : null));
    const [AddEntrSecteur19, setAddEntrSecteur19] = useState(watch('AddEntrSecteur19') ? watch('AddEntrSecteur19') : (accidentData && accidentData.AddEntrSecteur19 ? accidentData.AddEntrSecteur19 : null));
    const [AddEntrSecteur20, setAddEntrSecteur20] = useState(watch('AddEntrSecteur20') ? watch('AddEntrSecteur20') : (accidentData && accidentData.AddEntrSecteur20 ? accidentData.AddEntrSecteur20 : null));







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
        setValue('AddEntrSecteur1', AddEntrSecteur1)
        setValue('AddEntrSecteur2', AddEntrSecteur2)
        setValue('AddEntrSecteur3', AddEntrSecteur3)
        setValue('AddEntrSecteur4', AddEntrSecteur4)
        setValue('AddEntrSecteur5', AddEntrSecteur5)
        setValue('AddEntrSecteur6', AddEntrSecteur6)
        setValue('AddEntrSecteur7', AddEntrSecteur7)
        setValue('AddEntrSecteur8', AddEntrSecteur8)
        setValue('AddEntrSecteur9', AddEntrSecteur9)
        setValue('AddEntrSecteur10', AddEntrSecteur10)
        setValue('AddEntrSecteur11', AddEntrSecteur11)
        setValue('AddEntrSecteur12', AddEntrSecteur12)
        setValue('AddEntrSecteur13', AddEntrSecteur13)
        setValue('AddEntrSecteur14', AddEntrSecteur14)
        setValue('AddEntrSecteur15', AddEntrSecteur15)
        setValue('AddEntrSecteur16', AddEntrSecteur16)
        setValue('AddEntrSecteur17', AddEntrSecteur17)
        setValue('AddEntrSecteur18', AddEntrSecteur18)
        setValue('AddEntrSecteur19', AddEntrSecteur19)
        setValue('AddEntrSecteur20', AddEntrSecteur20)




    }, [AddEntreName, AddEntrePolice, AddEntrOnss, AddEntrEnite, AddEntrIban, AddEntrBic, AddEntrRue, AddEntrCodpost, AddEntrLocalite, AddEntrTel, AddEntrEmail, AddEntreActiventre, AddEntrSecsoci, AddEntrNumaffi, AddEntrScadresse, AddEntrSccpost, AddEntrSclocalite, AddEntrNumentr, AddEntrSecteur1, AddEntrSecteur2,
        AddEntrSecteur1,
        AddEntrSecteur2,
        AddEntrSecteur3,
        AddEntrSecteur4,
        AddEntrSecteur5,
        AddEntrSecteur6,
        AddEntrSecteur7,
        AddEntrSecteur8,
        AddEntrSecteur9,
        AddEntrSecteur10,
        AddEntrSecteur11,
        AddEntrSecteur12,
        AddEntrSecteur13,
        AddEntrSecteur14,
        AddEntrSecteur15,
        AddEntrSecteur16,
        AddEntrSecteur17,
        AddEntrSecteur18,
        AddEntrSecteur19,
        AddEntrSecteur20,
    ]);

   

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
                <TextFieldP id='AddEntrSecteur1' label="Secteur 1" onChange={setAddEntrSecteur1} defaultValue={AddEntrSecteur1}></TextFieldP>
                {AddEntrSecteur1  && (
                <TextFieldP id='AddEntrSecteur2' label="Secteur 2" onChange={setAddEntrSecteur2} defaultValue={AddEntrSecteur2}></TextFieldP>
                )}
                {AddEntrSecteur2 && (
                <TextFieldP id='AddEntrSecteur3' label="Secteur 3" onChange={setAddEntrSecteur3} defaultValue={AddEntrSecteur3}></TextFieldP>
                )}
                {AddEntrSecteur3 && (
                <TextFieldP id='AddEntrSecteur4' label="Secteur 4" onChange={setAddEntrSecteur4} defaultValue={AddEntrSecteur4}></TextFieldP>
                )}
                {AddEntrSecteur4 && (
                <TextFieldP id='AddEntrSecteur5' label="Secteur 5" onChange={setAddEntrSecteur5} defaultValue={AddEntrSecteur5}></TextFieldP>
                )}
                {AddEntrSecteur5 && (
                <TextFieldP id='AddEntrSecteur6' label="Secteur 6" onChange={setAddEntrSecteur6} defaultValue={AddEntrSecteur6}></TextFieldP>
                )}
                {AddEntrSecteur6 && (
                <TextFieldP id='AddEntrSecteur7' label="Secteur 7" onChange={setAddEntrSecteur7} defaultValue={AddEntrSecteur7}></TextFieldP>
                )}
                {AddEntrSecteur7 && (
                <TextFieldP id='AddEntrSecteur8' label="Secteur 8" onChange={setAddEntrSecteur8} defaultValue={AddEntrSecteur8}></TextFieldP>
                )}
                {AddEntrSecteur8 && (
                <TextFieldP id='AddEntrSecteur9' label="Secteur 9" onChange={setAddEntrSecteur9} defaultValue={AddEntrSecteur9}></TextFieldP>
                )}
                {AddEntrSecteur9 && (
                <TextFieldP id='AddEntrSecteur10' label="Secteur 10" onChange={setAddEntrSecteur10} defaultValue={AddEntrSecteur10}></TextFieldP>
                )}
                {AddEntrSecteur10 && (
                <TextFieldP id='AddEntrSecteur11' label="Secteur 11" onChange={setAddEntrSecteur11} defaultValue={AddEntrSecteur11}></TextFieldP>
                )}
                {AddEntrSecteur11 && (
                <TextFieldP id='AddEntrSecteur12' label="Secteur 12" onChange={setAddEntrSecteur12} defaultValue={AddEntrSecteur12}></TextFieldP>
                )}
                {AddEntrSecteur12 && (
                <TextFieldP id='AddEntrSecteur13' label="Secteur 13" onChange={setAddEntrSecteur13} defaultValue={AddEntrSecteur13}></TextFieldP>
                )}
                {AddEntrSecteur13 && (
                <TextFieldP id='AddEntrSecteur14' label="Secteur 14" onChange={setAddEntrSecteur14} defaultValue={AddEntrSecteur14}></TextFieldP>
                )}
                {AddEntrSecteur14 && (
                <TextFieldP id='AddEntrSecteur15' label="Secteur 15" onChange={setAddEntrSecteur15} defaultValue={AddEntrSecteur15}></TextFieldP>
                )}
                {AddEntrSecteur15 && (
                <TextFieldP id='AddEntrSecteur16' label="Secteur 16" onChange={setAddEntrSecteur16} defaultValue={AddEntrSecteur16}></TextFieldP>
                )}
                {AddEntrSecteur16 && (
                <TextFieldP id='AddEntrSecteur17' label="Secteur 17" onChange={setAddEntrSecteur17} defaultValue={AddEntrSecteur17}></TextFieldP>
                )}
                {AddEntrSecteur17 && (
                <TextFieldP id='AddEntrSecteur18' label="Secteur 18" onChange={setAddEntrSecteur18} defaultValue={AddEntrSecteur18}></TextFieldP>
                )}
                {AddEntrSecteur18 && (
                <TextFieldP id='AddEntrSecteur19' label="Secteur 19" onChange={setAddEntrSecteur19} defaultValue={AddEntrSecteur19}></TextFieldP>
                )}
                {AddEntrSecteur19 && (
                <TextFieldP id='AddEntrSecteur20' label="Secteur 20" onChange={setAddEntrSecteur20} defaultValue={AddEntrSecteur20}></TextFieldP>
                )}








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
                        Crée l'Entreprise
                    </Button>
                </div>


            </div>

        </form>
    );
}