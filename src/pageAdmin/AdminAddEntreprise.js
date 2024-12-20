import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../_composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import { Button, Tooltip, Paper, Box, Typography } from '@mui/material/';
import config from '../config.json';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';

/**
 * AdminPanelSettings est un composant qui permet de créer une nouvelle entreprise
 * via un formulaire.
 * Les données sont enregistrées dans la base de données via une requête PUT.
 * Après enregistrement, l'utilisateur est redirigé vers la page d'accueil.
 * @param {object} accidentData - Les données de l'accident.
 * @returns {JSX.Element} - Le composant AdminPanelSettings.
 */
export default function AdminPanelSettings({ accidentData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        defaultValues: entrepriseToEdit || {},
        mode: 'onChange' // Active la validation en temps réel
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

        // Prendre les deux premières lettres (code pays)
        const countryCode = value.slice(0, 2).replace(/[^A-Z]/g, '');
        const numbers = value.slice(2).replace(/[^\d]/g, '');

        // Construire l'IBAN formaté
        let formatted = countryCode;

        // Ajouter les chiffres avec des espaces tous les 4 caractères
        if (numbers.length > 0) formatted += ' ';

        // Format: XX 00 0000 0000 0000
        let chunks = [];
        chunks.push(numbers.slice(0, 2));  // 00
        chunks.push(numbers.slice(2, 6));  // 0000
        chunks.push(numbers.slice(6, 10)); // 0000
        chunks.push(numbers.slice(10, 14)); // 0000

        formatted += chunks.filter(chunk => chunk).join(' ');

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

        // Format: XX 00 0000 0000 0000 (deux lettres puis groupes de chiffres)
        const pattern = /^[A-Z]{2}\s\d{2}\s\d{4}\s\d{4}\s\d{4}$/;
        return pattern.test(value) || "Le format doit être XX 00 0000 0000 0000 (où XX sont des lettres)";
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

        if (isSubmitting) return;

        // Marquer comme en cours de soumission
        setIsSubmitting(true);

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
            setTimeout(() => navigate('/adminEntreprises'), 500);
        } catch (error) {
            console.error('Erreur de requête:', error.message);
            showSnackbar(`Erreur lors de la ${entrepriseToEdit ? 'modification' : 'création'} de l'entreprise`, 'error');
            setIsSubmitting(false);
        }
    };

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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        margin: '1.5rem 0',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '45px',
                            background: darkMode
                                ? 'rgba(122,142,28,0.1)'
                                : 'rgba(238,117,45,0.1)',
                            filter: 'blur(10px)',
                            borderRadius: '10px',
                            zIndex: 0
                        }
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                            fontWeight: 600,
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            position: 'relative',
                            padding: '0.5rem 1.5rem',
                            zIndex: 1,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
                            }
                        }}
                    >
                        Créer une nouvelle entreprise
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '1px',
                                background: darkMode
                                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
                            }
                        }}
                    />
                </Box>
                <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Toutes les champs doivent êtres obligatoirement remplie</h3>
                <TextFieldP id='AddEntreName' label="Nom de la nouvelle entreprise" onChange={setAddEntreName} defaultValue={AddEntreName}></TextFieldP>
                <TextFieldP id='AddEntrRue' label="Rue et numéro" onChange={setAddEntrRue} defaultValue={AddEntrRue}></TextFieldP>
                <TextFieldP id='AddEntrCodpost' label="Code postal" onChange={setAddEntrCodpost} defaultValue={AddEntrCodpost}></TextFieldP>
                <TextFieldP id='AddEntrLocalite' label="Localité" onChange={setAddEntrLocalite} defaultValue={AddEntrLocalite}></TextFieldP>
                <TextFieldP id='AddEntrTel' label="Téléphone" onChange={setAddEntrTel} defaultValue={AddEntrTel}></TextFieldP>
                <TextFieldP id='AddEntrEmail' label="Adresse e-mail" onChange={setAddEntrEmail} defaultValue={AddEntrEmail}></TextFieldP>
                <TextFieldP
                    id='AddEntrNumentr'
                    label="Numéro d'entreprise"
                    {...register('AddEntrNumentr', {
                        required: "Le numéro d'entreprise est requis",
                        validate: validateNumeroEntreprise
                    })}
                    onChange={handleNumeroEntrepriseChange}
                    defaultValue={AddEntrNumentr}
                    error={Boolean(errors.AddEntrNumentr)}
                    helperText={errors.AddEntrNumentr?.message || "Format: 0000.000.000"}
                    inputProps={{
                        maxLength: 12,
                        placeholder: "0000.000.000",
                        value: AddEntrNumentr || '',
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
                    {...register('AddEntrEnite', {
                        required: "Le numéro d'unité d'établissement est requis",
                        validate: validateUniteEtablissement
                    })}
                    onChange={handleUniteEtablissementChange}
                    defaultValue={AddEntrEnite}
                    error={Boolean(errors.AddEntrEnite)}
                    helperText={errors.AddEntrEnite?.message || "Format: 0-000-000-000"}
                    inputProps={{
                        maxLength: 13,
                        placeholder: "0-000-000-000",
                        value: AddEntrEnite || '',
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
                    {...register('AddEntrIban', {
                        required: "Le numéro IBAN est requis",
                        validate: validateIBAN
                    })}
                    onChange={handleIBANChange}
                    defaultValue={AddEntrIban}
                    error={Boolean(errors.AddEntrIban)}
                    helperText={errors.AddEntrIban?.message || "Format: XX00 0000 0000 0000"}
                    inputProps={{
                        maxLength: 20,
                        placeholder: "XX00 0000 0000 0000",
                        value: AddEntrIban || '',
                        onKeyPress: (e) => {
                            if (e.key === ' ') {
                                e.preventDefault();
                            }
                        },
                        style: { textTransform: 'uppercase' }
                    }}
                />

                <TextFieldP
                    id='AddEntrBic'
                    label="BIC"
                    {...register('AddEntrBic', {
                        required: "Le code BIC est requis",
                        validate: validateBIC
                    })}
                    onChange={handleBICChange}
                    defaultValue={AddEntrBic}
                    error={Boolean(errors.AddEntrBic)}
                    helperText={errors.AddEntrBic?.message || "Format: AAAA-AA-AA"}
                    inputProps={{
                        maxLength: 10,
                        placeholder: "AAAA-AA-AA",
                        value: AddEntrBic || '',
                        onKeyPress: (e) => {
                            if (e.key === '-') {
                                e.preventDefault();
                            }
                        },
                        style: { textTransform: 'uppercase' }
                    }}
                />

                <TextFieldP id='AddEntreActiventre' label="Activité de l'entreprise" onChange={setAddEntreActiventre} defaultValue={AddEntreActiventre}></TextFieldP>
                <TextFieldP id='AddEntrSecsoci' label="Secrétariat sociale" onChange={setAddEntrSecsoci} defaultValue={AddEntrSecsoci}></TextFieldP>
                <TextFieldP id='AddEntrNumaffi' label="Numéro d'affiliation" onChange={setAddEntrNumaffi} defaultValue={AddEntrNumaffi}></TextFieldP>
                <TextFieldP id='AddEntrScadresse' label="Adresse du secrétariat sociale" onChange={setAddEntrScadresse} defaultValue={AddEntrScadresse}></TextFieldP>
                <TextFieldP id='AddEntrSccpost' label="Code postal du secrétariat sociale" onChange={setAddEntrSccpost} defaultValue={AddEntrSccpost}></TextFieldP>
                <TextFieldP id='AddEntrSclocalite' label="Localité du secrétariat sociale" onChange={setAddEntrSclocalite} defaultValue={AddEntrSclocalite}></TextFieldP>

                <h6 style={{
                    color: darkMode ? '#790a0a' : '#ff0000',
                    fontSize: '1.2em',
                    fontWeight: 'bold'
                }}>
                    Attention de bien crée des secteurs après la création de l'entreprise
                </h6>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Cliquez ici pour crée et enregistrer l'entreprise" arrow>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: darkMode ? '#424242' : '#ee742d59',
                                color: darkMode ? '#ffffff' : 'black',
                                transition: 'all 0.1s ease-in-out',
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
                            {isSubmitting
                            ? (entrepriseToEdit ? "Modification en cours..." : "Création en cours...")
                            : (entrepriseToEdit ? "Modifier l'entreprise" : "Créer l'entreprise")
                        }
                        </Button>
                    </Tooltip>
                </div>

                <div style={{ marginTop: '30px' }}></div>

            </Paper>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </form>
    );
}