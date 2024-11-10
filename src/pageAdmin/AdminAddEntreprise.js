import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../_composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import { Button, Tooltip } from '@mui/material/';
import config from '../config.json';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../pageAdmin/user/ThemeContext';


/**
 * AdminPanelSettings est un composant qui permet de créer une nouvelle entreprise
 * via un formulaire.
 * Les données sont enregistrées dans la base de données via une requête PUT.
 * Après enregistrement, l'utilisateur est redirigé vers la page d'accueil.
 * @param {object} accidentData - Les données de l'accident.
 * @returns {JSX.Element} - Le composant AdminPanelSettings.
 */
export default function AdminPanelSettings({ accidentData }) {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const location = useLocation();
    const entrepriseToEdit = location.state?.entreprise;
    const { watch, register, setValue, handleSubmit, formState: { errors } } = useForm({
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

    const formatONSS = (value) => {
        // Supprimer tout ce qui n'est pas un chiffre
        const numbers = value.replace(/[^\d]/g, '');

        // Construire le numéro formaté
        let formatted = '';
        for (let i = 0; i < numbers.length && i < 12; i++) {
            if (i === 3) {
                formatted += '-';
            }
            if (i === 10) {
                formatted += '-';
            }
            formatted += numbers[i];
        }

        return formatted;
    };

    const handleONSSChange = (newValue) => {
        // Si l'utilisateur essaie de coller un numéro complet
        if (newValue.includes('-')) {
            newValue = newValue.replace(/-/g, '');
        }

        const formattedValue = formatONSS(newValue);
        setAddEntrOnss(formattedValue);
        setValue('AddEntrOnss', formattedValue);
    };

    const validateONSS = (value) => {
        if (!value) return "Le numéro ONSS est requis";
        const pattern = /^\d{3}-\d{7}-\d{2}$/;
        return pattern.test(value) || "Le format doit être 000-0000000-00";
    };

    const formatUniteEtablissement = (value) => {
        // Supprimer tout ce qui n'est pas un chiffre
        const numbers = value.replace(/[^\d]/g, '');

        // Construire le numéro formaté
        let formatted = '';
        for (let i = 0; i < numbers.length && i < 10; i++) {
            if (i === 1) {
                formatted += '-';
            }
            if (i === 4) {
                formatted += '-';
            }
            if (i === 7) {
                formatted += '-';
            }
            formatted += numbers[i];
        }

        return formatted;
    };

    const handleUniteEtablissementChange = (newValue) => {
        // Si l'utilisateur essaie de coller un numéro complet
        if (newValue.includes('-')) {
            newValue = newValue.replace(/-/g, '');
        }

        const formattedValue = formatUniteEtablissement(newValue);
        setAddEntrEnite(formattedValue);
        setValue('AddEntrEnite', formattedValue);
    };

    const validateUniteEtablissement = (value) => {
        if (!value) return "Le numéro d'unité d'établissement est requis";
        const pattern = /^\d{1}-\d{3}-\d{3}-\d{3}$/;
        return pattern.test(value) || "Le format doit être 0-000-000-000";
    };


    // Ajouter ces fonctions avec les autres fonctions de formatage
    const formatNumeroEntreprise = (value) => {
        // Supprimer tout ce qui n'est pas un chiffre
        const numbers = value.replace(/[^\d]/g, '');

        // Construire le numéro formaté
        let formatted = '';
        for (let i = 0; i < numbers.length && i < 10; i++) {
            if (i === 4) {
                formatted += '.';
            }
            if (i === 7) {
                formatted += '.';
            }
            formatted += numbers[i];
        }

        return formatted;
    };

    const handleNumeroEntrepriseChange = (newValue) => {
        // Si l'utilisateur essaie de coller un numéro complet
        if (newValue.includes('.')) {
            newValue = newValue.replace(/\./g, '');
        }

        const formattedValue = formatNumeroEntreprise(newValue);
        setAddEntrNumentr(formattedValue);
        setValue('AddEntrNumentr', formattedValue);
    };

    const validateNumeroEntreprise = (value) => {
        if (!value) return "Le numéro d'entreprise est requis";
        const pattern = /^\d{4}\.\d{3}\.\d{3}$/;
        return pattern.test(value) || "Le format doit être 0000.000.000";
    };

    // Ajouter ces fonctions avec les autres fonctions de formatage
    const formatIBAN = (value) => {
        // Convertir en majuscules
        value = value.toUpperCase();

        // Supprimer les espaces existants
        value = value.replace(/ /g, '');

        // Séparer les deux premiers caractères du reste
        const countryCode = value.slice(0, 2);
        const numbers = value.slice(2).replace(/[^\d]/g, '');

        // Construire l'IBAN formaté
        let formatted = countryCode;

        // Ajouter les chiffres avec des espaces tous les 4 caractères
        for (let i = 0; i < numbers.length && i < 14; i++) {
            if (i === 0) {
                formatted += ' ';
            }
            if (i === 2 || i === 6 || i === 10) {
                formatted += ' ';
            }
            formatted += numbers[i];
        }

        return formatted;
    };

    const handleIBANChange = (newValue) => {
        // Si l'utilisateur essaie de coller un numéro complet
        if (newValue.includes(' ')) {
            newValue = newValue.replace(/ /g, '');
        }

        const formattedValue = formatIBAN(newValue);
        setAddEntrIban(formattedValue);
        setValue('AddEntrIban', formattedValue);
    };

    const validateIBAN = (value) => {
        if (!value) return "Le numéro IBAN est requis";
        // Modifier le pattern pour accepter n'importe quelles lettres au début
        const pattern = /^[A-Z]{2}\d{2}( \d{4}){3}$/;
        return pattern.test(value) || "Le format doit être XX00 0000 0000 0000 (où XX sont des lettres)";
    };

    // Ajouter ces fonctions avec les autres fonctions de formatage
    const formatBIC = (value) => {
        // Convertir en majuscules et supprimer les tirets existants
        value = value.toUpperCase().replace(/-/g, '');

        // Construire le BIC formaté
        let formatted = '';
        for (let i = 0; i < value.length && i < 8; i++) {
            if (i === 4 || i === 6) {
                formatted += '-';
            }
            formatted += value[i];
        }

        return formatted;
    };

    const handleBICChange = (newValue) => {
        // Si l'utilisateur essaie de coller un BIC complet
        if (newValue.includes('-')) {
            newValue = newValue.replace(/-/g, '');
        }

        const formattedValue = formatBIC(newValue);
        setAddEntrBic(formattedValue);
        setValue('AddEntrBic', formattedValue);
    };

    const validateBIC = (value) => {
        if (!value) return "Le code BIC est requis";
        const pattern = /^[A-Z]{4}-[A-Z]{2}-[A-Z]{2}$/;
        return pattern.test(value) || "Le format doit être AAAA-AA-AA";
    };


    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = async (data) => {
        // Valider le format ONSS avant soumission
        const onssValidation = validateONSS(data.AddEntrOnss);
        if (onssValidation !== true) {
            showSnackbar(onssValidation, 'error');
            return;
        }

        try {
            const url = entrepriseToEdit
                ? `http://${apiUrl}:3100/api/entreprises/${entrepriseToEdit._id}`
                : `http://${apiUrl}:3100/api/entreprises`;

            const method = entrepriseToEdit ? 'put' : 'post';

            const response = await axios[method](url, data);
            showSnackbar(`Entreprise ${entrepriseToEdit ? 'modifiée' : 'créée'} avec succès`, 'success');
            setTimeout(() => navigate('/adminEntreprises'), 2000);
        } catch (error) {
            console.error('Erreur de requête:', error.message);
            showSnackbar(`Erreur lors de la ${entrepriseToEdit ? 'modification' : 'création'} de l'entreprise`, 'error');
        }
    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style" style={{
                backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            }}>
                <h2>Créer une nouvelle entreprise</h2>
                <h3>Toutes les données doivent êtres obligatoirement remplie</h3>
                <TextFieldP id='AddEntreName' label="Nom de la nouvelle entreprise" onChange={setAddEntreName} defaultValue={AddEntreName}></TextFieldP>
                <TextFieldP id='AddEntrRue' label="Rue et numéro" onChange={setAddEntrRue} defaultValue={AddEntrRue}></TextFieldP>
                <TextFieldP id='AddEntrCodpost' label="Code postal" onChange={setAddEntrCodpost} defaultValue={AddEntrCodpost}></TextFieldP>
                <TextFieldP id='AddEntrLocalite' label="Localité" onChange={setAddEntrLocalite} defaultValue={AddEntrLocalite}></TextFieldP>
                <TextFieldP id='AddEntrTel' label="Téléphone" onChange={setAddEntrTel} defaultValue={AddEntrTel}></TextFieldP>
                <TextFieldP id='AddEntrEmail' label="Adresse e-mail" onChange={setAddEntrEmail} defaultValue={AddEntrEmail}></TextFieldP>
                <TextFieldP
                    id='AddEntrNumentr'
                    label="Numéro d'entreprise"
                    onChange={handleNumeroEntrepriseChange}
                    defaultValue={AddEntrNumentr}
                    error={Boolean(errors.AddEntrNumentr)}
                    helperText={errors.AddEntrNumentr?.message || "Format: 0000.000.000"}
                    inputProps={{
                        maxLength: 12,
                        placeholder: "0000.000.000",
                        value: AddEntrNumentr || '',
                        // Empêcher l'utilisateur de saisir manuellement les points
                        onKeyPress: (e) => {
                            if (e.key === '.') {
                                e.preventDefault();
                            }
                        }
                    }}
                />
                <TextFieldP id='AddEntrePolice' label="Numéro de la Police d'assurance" onChange={setAddEntrePolice} defaultValue={AddEntrePolice}></TextFieldP>
                <TextFieldP
                    id='AddEntrOnss'
                    label="Numéro ONSS"
                    onChange={handleONSSChange}
                    defaultValue={AddEntrOnss}
                    error={Boolean(errors.AddEntrOnss)}
                    helperText={errors.AddEntrOnss?.message || "Format: 000-0000000-00"}
                    inputProps={{
                        maxLength: 14,
                        placeholder: "000-0000000-00",
                        value: AddEntrOnss || '',
                        // Empêcher l'utilisateur de saisir manuellement les tirets
                        onKeyPress: (e) => {
                            if (e.key === '-') {
                                e.preventDefault();
                            }
                        }
                    }}
                />
                <TextFieldP
                    id='AddEntrEnite'
                    label="Numéro d'unité de l'établissement"
                    onChange={handleUniteEtablissementChange}
                    defaultValue={AddEntrEnite}
                    error={Boolean(errors.AddEntrEnite)}
                    helperText={errors.AddEntrEnite?.message || "Format: 0-000-000-000"}
                    inputProps={{
                        maxLength: 13,
                        placeholder: "0-000-000-000",
                        value: AddEntrEnite || '',
                        // Empêcher l'utilisateur de saisir manuellement les tirets
                        onKeyPress: (e) => {
                            if (e.key === '-') {
                                e.preventDefault();
                            }
                        }
                    }}
                />
                <TextFieldP
                    id='AddEntrIban'
                    label="IBAN"
                    onChange={handleIBANChange}
                    defaultValue={AddEntrIban}
                    error={Boolean(errors.AddEntrIban)}
                    helperText={errors.AddEntrIban?.message || "Format: XX00 0000 0000 0000"}
                    inputProps={{
                        maxLength: 20, // 2 lettres + 16 chiffres + 3 espaces
                        placeholder: "XX00 0000 0000 0000",
                        value: AddEntrIban || '',
                        // Empêcher l'utilisateur de saisir manuellement les espaces
                        onKeyPress: (e) => {
                            if (e.key === ' ') {
                                e.preventDefault();
                            }
                        },
                        style: { textTransform: 'uppercase' } // Pour garder les lettres en majuscules
                    }}
                />

                <TextFieldP
                    id='AddEntrBic'
                    label="BIC"
                    onChange={handleBICChange}
                    defaultValue={AddEntrBic}
                    error={Boolean(errors.AddEntrBic)}
                    helperText={errors.AddEntrBic?.message || "Format: AAAA-AA-AA"}
                    inputProps={{
                        maxLength: 10, // 8 lettres + 2 tirets
                        placeholder: "AAAA-AA-AA",
                        value: AddEntrBic || '',
                        // Empêcher l'utilisateur de saisir manuellement les tirets
                        onKeyPress: (e) => {
                            if (e.key === '-') {
                                e.preventDefault();
                            }
                        },
                        style: { textTransform: 'uppercase' } // Pour garder les lettres en majuscules
                    }}
                />
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
                                // Media Queries restent les mêmes
                                '@media (min-width: 750px)': {
                                    fontSize: '3rem',
                                },
                                '@media (max-width: 550px)': {
                                    fontSize: '1.5rem',
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
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe.</h5>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />

        </form>
    );
}