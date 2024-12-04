import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Paper,
    Tooltip,
    Typography,
    Button,
    Grid,
} from '@mui/material';
import TextFieldP from '../_composants/textFieldP';
import AutoCompleteP from '../_composants/autoCompleteP';
import DatePickerP from '../_composants/datePickerP';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../_composants/CustomSnackbar';
import { useTheme } from '../Hook/ThemeContext';
import config from '../config.json';
import axios from 'axios';
import dayjs from 'dayjs';

const CARBURANT_TYPES = ['DIESEL', 'ESSENCE', 'HYBRID', 'ELECTRIC'];

export default function AddVehicle() {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const vehicleToEdit = location.state?.vehicle;
    const apiUrl = config.apiUrl;
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();

    const [numPlaque, setNumPlaque] = useState(vehicleToEdit?.numPlaque || "");
    const [marque, setMarque] = useState(vehicleToEdit?.marque || "");
    const [modele, setModele] = useState(vehicleToEdit?.modele || "");
    const [typeCarburant, setTypeCarburant] = useState(vehicleToEdit?.typeCarburant || "");
    const [nombrePlaces, setNombrePlaces] = useState(vehicleToEdit?.nombrePlaces?.toString() || "");
    const [anneeConstruction, setAnneeConstruction] = useState(vehicleToEdit?.anneeConstruction?.toString() || "");
    const [entrepriseName, setEntrepriseName] = useState(vehicleToEdit?.entrepriseName || "");
    const [kilometrage, setKilometrage] = useState(vehicleToEdit?.kilometrage?.toString() || "");
    const [dateAchat, setDateAchat] = useState(vehicleToEdit?.dateAchat || "");
    const [dateDerniereRevision, setDateDerniereRevision] = useState(vehicleToEdit?.dateDerniereRevision || "");
    const [dateDernierCT, setDateDernierCT] = useState(vehicleToEdit?.dateDernierCT || "");
    const [dateProchainCT, setDateProchainCT] = useState(vehicleToEdit?.dateProchainCT || "");

    useEffect(() => {
        setValue('numPlaque', numPlaque);
        setValue('marque', marque);
        setValue('modele', modele);
        setValue('typeCarburant', typeCarburant);
        setValue('nombrePlaces', nombrePlaces);
        setValue('anneeConstruction', anneeConstruction);
        setValue('entrepriseName', entrepriseName);
        setValue('kilometrage', kilometrage);
        setValue('dateAchat', dateAchat);
        setValue('dateDerniereRevision', dateDerniereRevision);
        setValue('dateDernierCT', dateDernierCT);
        setValue('dateProchainCT', dateProchainCT);
    }, [numPlaque, marque, modele, typeCarburant, nombrePlaces, anneeConstruction,
        entrepriseName, kilometrage, dateAchat, dateDerniereRevision, dateDernierCT,
        dateProchainCT, setValue]);

    const [companies, setCompanies] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/vehicleCompanies`);
                const companyNames = response.data.map(company => company.companyName);
                setCompanies(companyNames);
            } catch (error) {
                console.error('Erreur lors du chargement des entreprises:', error);
                showSnackbar('Erreur lors du chargement des entreprises', 'error');
            }
        };
    
        fetchCompanies();
    }, [apiUrl]);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };



    const validateForm = () => {
        const requiredFields = {
            numPlaque,
            marque,
            modele,
            typeCarburant,
            nombrePlaces,
            anneeConstruction,
            entrepriseName,
            dateAchat
        };

        const emptyFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            showSnackbar(`Les champs suivants sont requis : ${emptyFields.join(', ')}`, 'error');
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        try {
            if (!validateForm()) return;

            const vehicleData = {
                numPlaque,
                marque,
                modele,
                typeCarburant,
                nombrePlaces: parseInt(nombrePlaces),
                anneeConstruction: parseInt(anneeConstruction),
                entrepriseName,
                kilometrage: parseInt(kilometrage) || 0,
                dateAchat: dayjs(dateAchat).format('YYYY-MM-DD'),
                dateDerniereRevision: dateDerniereRevision ? dayjs(dateDerniereRevision).format('YYYY-MM-DD') : null,
                dateDernierCT: dateDernierCT ? dayjs(dateDernierCT).format('YYYY-MM-DD') : null,
                dateProchainCT: dateProchainCT ? dayjs(dateProchainCT).format('YYYY-MM-DD') : null
            };

            const method = vehicleToEdit ? 'put' : 'post';
            const endpoint = vehicleToEdit
                ? `http://${apiUrl}:3100/api/vehicles/${vehicleToEdit._id}`
                : `http://${apiUrl}:3100/api/vehicles`;

            const response = await axios[method](endpoint, vehicleData);

            await logAction({
                actionType: vehicleToEdit ? 'modification' : 'creation',
                details: `${vehicleToEdit ? 'Modification' : 'Création'} du véhicule ${vehicleData.numPlaque}`,
                entity: 'Vehicle',
                entityId: vehicleToEdit ? vehicleToEdit._id : response.data.vehicle._id
            });

            showSnackbar(vehicleToEdit ? 'Véhicule modifié avec succès' : 'Véhicule créé avec succès', 'success');
            setTimeout(() => navigate('/AdminVehicule'), 2000);
        } catch (error) {
            console.error('Erreur:', error);
            showSnackbar(error.response?.data?.message || 'Erreur lors de l\'opération', 'error');
        }
    };

    return (
        <form className="background-image" style={{ margin: '0 20px' }} onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={3} sx={{
                border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                '&:hover': {
                    boxShadow: darkMode ? '0 8px 16px rgba(255, 255, 255, 0.1)' : '0 8px 16px rgba(238, 116, 45, 0.2)'
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    margin: '1.5rem 0'
                }}>
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                        fontWeight: 600,
                        background: darkMode ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)' : 'linear-gradient(45deg, #ee752d, #f4a261)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        {vehicleToEdit ? 'Modifier un véhicule' : 'Ajouter un véhicule'}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextFieldP
                            id='numPlaque'
                            label="Numéro de plaque"
                            onChange={(value) => {
                                setNumPlaque(value);
                                setValue('numPlaque', value);
                            }}
                            defaultValue={numPlaque}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextFieldP
                            id='marque'
                            label="Marque"
                            onChange={(value) => {
                                setMarque(value);
                                setValue('marque', value);
                            }}
                            defaultValue={marque}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldP
                            id='modele'
                            label="Modèle"
                            onChange={(value) => {
                                setModele(value);
                                setValue('modele', value);
                            }}
                            defaultValue={modele}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <AutoCompleteP
                            id='typeCarburant'
                            label="Type de carburant"
                            option={CARBURANT_TYPES}
                            defaultValue={typeCarburant}
                            onChange={(value) => {
                                setTypeCarburant(value);
                                setValue('typeCarburant', value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldP
                            id='nombrePlaces'
                            label="Nombre de places"
                            type="number"
                            onChange={(value) => {
                                setNombrePlaces(value);
                                setValue('nombrePlaces', value);
                            }}
                            defaultValue={nombrePlaces}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldP
                            id='anneeConstruction'
                            label="Année de construction"
                            type="number"
                            onChange={(value) => {
                                setAnneeConstruction(value);
                                setValue('anneeConstruction', value);
                            }}
                            defaultValue={anneeConstruction}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <AutoCompleteP
                            id='entrepriseName'
                            label="Nom de l'entreprise"
                            option={companies}
                            defaultValue={entrepriseName}
                            onChange={(value) => {
                                setEntrepriseName(value);
                                setValue('entrepriseName', value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextFieldP
                            id='kilometrage'
                            label="Kilométrage"
                            type="number"
                            onChange={(value) => {
                                setKilometrage(value);
                                setValue('kilometrage', value);
                            }}
                            defaultValue={kilometrage}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateAchat'
                            label="Date d'achat"
                            onChange={(value) => {
                                setDateAchat(value);
                                setValue('dateAchat', value);
                            }}
                            defaultValue={dateAchat}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateDerniereRevision'
                            label="Date dernière révision"
                            onChange={(value) => {
                                setDateDerniereRevision(value);
                                setValue('dateDerniereRevision', value);
                            }}
                            defaultValue={dateDerniereRevision}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateDernierCT'
                            label="Date dernier CT"
                            onChange={(value) => {
                                setDateDernierCT(value);
                                setValue('dateDernierCT', value);
                            }}
                            defaultValue={dateDernierCT}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DatePickerP
                            id='dateProchainCT'
                            label="Date prochain CT"
                            onChange={(value) => {
                                setDateProchainCT(value);
                                setValue('dateProchainCT', value);
                            }}
                            defaultValue={dateProchainCT}
                        />
                    </Grid>
                </Grid>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Tooltip title={vehicleToEdit ? "Modifier le véhicule" : "Ajouter le véhicule"} arrow>
                        <Button
                            type="submit"
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
                                height: '300%',
                                fontSize: '2rem',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                '@media (min-width: 750px)': {
                                    fontSize: '3rem',
                                },
                                '@media (max-width: 550px)': {
                                    fontSize: '1.5rem',
                                },
                            }}
                            variant="contained"
                        >
                            {vehicleToEdit ? 'Modifier le véhicule' : 'Ajouter le véhicule'}
                        </Button>
                    </Tooltip>
                </div>
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