import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../_composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import { Button, Tooltip } from '@mui/material/';
import config from '../config.json';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';


/**
 * AdminPanelSettings est un composant qui permet de créer une nouvelle entreprise
 * via un formulaire.
 * Les données sont enregistrées dans la base de données via une requête PUT.
 * Après enregistrement, l'utilisateur est redirigé vers la page d'accueil.
 * @param {object} accidentData - Les données de l'accident.
 * @returns {JSX.Element} - Le composant AdminPanelSettings.
 */
export default function AdminPanelSettings({ accidentData }) {
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const location = useLocation();
    const entrepriseToEdit = location.state?.entreprise;
    const { watch, register, setValue, handleSubmit } = useForm({
        defaultValues: entrepriseToEdit || {}
    });

    /**
     * Display a snackbar message with the given message and severity.
     * 
     * @param {string} message - The message to display in the snackbar.
     * @param {string} [severity='info'] - The severity of the snackbar. Can be 'info', 'success', 'warning', or 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Closes the snackbar when the user clicks outside of it.
     * 
     * @param {object} event - The event that triggered the function.
     * @param {string} reason - The reason the function was triggered. If the user clicked outside of the snackbar, this will be 'clickaway'.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        if (entrepriseToEdit) {
            Object.keys(entrepriseToEdit).forEach(key => {
                setValue(key, entrepriseToEdit[key]);
            });
        }
    }, [entrepriseToEdit, setValue]);

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
    const onSubmit = async (data) => {
        try {
            const url = entrepriseToEdit
                ? `http://${apiUrl}:3100/api/entreprises/${entrepriseToEdit._id}`
                : `http://${apiUrl}:3100/api/entreprises`;

            const method = entrepriseToEdit ? 'put' : 'post';

            const response = await axios[method](url, data);
            console.log(`Réponse du serveur en ${entrepriseToEdit ? 'modification' : 'création'} :`, response.data);
            showSnackbar(`Entreprise ${entrepriseToEdit ? 'modifiée' : 'créée'} avec succès`, 'success');
            // Rediriger vers la liste des entreprises après un court délai
            setTimeout(() => navigate('/adminEntreprises'), 2000);
        } catch (error) {
            console.error('Erreur de requête:', error.message);
            showSnackbar(`Erreur lors de la ${entrepriseToEdit ? 'modification' : 'création'} de l'entreprise`, 'error');
        }



        // Naviguer vers la page d'accueil
        //navigate('/');
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
                    <Tooltip title="Cliquez ici pour crée et enregistrer l'entreprise" arrow>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: '#ee742d59',
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
                            {entrepriseToEdit ? "Modifier l'entreprise" : "Créer l'entreprise"}
                        </Button>
                    </Tooltip>
                </div>

                <div style={{ marginTop: '30px' }}></div>

            </div>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />

        </form>
    );
}