// Home.js
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    LinearProgress,
    TextField,
    Grid,
} from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import config from './config.json';
import { useNavigate } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import * as ExcelJS from 'exceljs';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import editPDF from './Model/pdfGenerator.js';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
/* IMPORT PERSO */
import './pageFormulaire/formulaire.css';

function Home() {
    const navigate = useNavigate();
    const apiUrl = config.apiUrl;
    const [data, setData] = useState([]); // Stocker les données de l'API
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    //au chargerment de la page, on met à jour les données de la liste des accidents
    useEffect(() => {
        refreshListAccidents();
    }, []);

    const handleDelete = (accidentIdToDelete) => {
        axios.delete("http://" + apiUrl + ":3100/api/accidents/" + accidentIdToDelete)
            .then(response => {
                // Vérifier le code de statut de la réponse
                if (response.status === 204 || response.status === 200) {
                    console.log('Accident supprimé avec succès');
                    // Mettre à jour les données après suppression
                    refreshListAccidents();
                    const updatedData = data.filter(item => item._id !== accidentIdToDelete);
                    setData(updatedData);
                }
                else {
                    console.log('Erreur lors de la suppression de l\'accident, code d erreur : ' + response.status + ' ' + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleGeneratePDF = async (accidentIdToGenerate) => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentIdToGenerate}`);
            const accidents = response.data;
            editPDF(accidents);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (accidentIdToModify) => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentIdToModify}`);
            const accidents = response.data;
            navigate("/formulaire", { state: accidents });
        } catch (error) {
            console.log(error);
        }
    };

    function refreshListAccidents() {
        axios.get("http://" + apiUrl + ":3100/api/accidents")
            .then(response => {
                const accidents = response.data;
                console.log(accidents);

                if (Array.isArray(accidents)) {
                    setData(accidents);
                } else {
                    console.error("La réponse de l'API n'est pas un tableau.");
                }

                setLoading(false);
            })
            .catch((error) => {
                console.log("Home.js => refresh list accident error =>", error);
                setLoading(false);
            });
    };

    const filteredData = data.filter((item) => {
        return (
            Object.values(item).some((value) =>
                typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    });

    if (loading) {
        return <LinearProgress color="success" />;
    }

    //=======================================================================================================
    //===========================================Comportement======================================
    //=======================================================================================================

    /**
     * Fonction pour exporter les données vers Excel
     * @returns {void}
     * @param {void}
     */
    const handleExportData = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Accidents');

        worksheet.addRow([
            'Nom de l entreprise',
            'Nom du secteur',
            'Type de travailleur',
            //'Numéro d\'accident du groupe',
            //'Numéro d\'accident de l'entreprise',
            //'Jours de l\'accident',
            //'Heure de l\'accident',
            //'Date de l\'accident',
            'Date de l\'accident',
            'Date de début de l incapacité',
            'Nom du travailleur',
            'Prénon du Travailleur',
            //'Age du travailleur le jours de l\'accident',
            'Date de naissance',
            'Circonstance de l accident',
            'Code siège lésion',
            'Code nature lésion',
            'Code déviation',
            'code agent materiel',
            'Chausure de sécurité',
            'Date ce début de la derniere absence longue avant AT (+ 15 jours)',
            'Date de fin de la derniere absence longue avant AT (+ 15 jours)',
            'Blessures',
            'Date de fin de l incapacité',
            //'Nombre de jours d\'IT',
            'Indeminisation',
            'Type d accident',
            'Nombre d heures de travail par semaine',
            //'Nombre de jours de travail perdus',
            //'Ancienneté en Années',
            //'Ancienneté en jours',
            //'Heures pernues',
            //'Nombre de jours accident/maladie',
        ]);

        filteredData.forEach(item => {
            worksheet.addRow([
                item.entrepriseName,
                item.secteur,
                item.typeTravailleur,
                //,
                //,
                //,
                //,
                //,
                item.DateHeureAccident,
                item.DateJourIncapDebut,
                item.nomTravailleur,
                item.prenomTravailleur,
                //,
                item.dateNaissance,
                item.circonstanceAccident,
                item.codeSiegeLesion,
                item.codeNatureLesion,
                item.codeDeviation,
                item.codeAgentMateriel,
                item.boolChausure,
                item.dateDebutArret,
                item.dateFinArret,
                item.blessures,
                item.DateJourIncapFin,
                //,
                item.indemnisationAccident,
                item.typeAccident,
                item.nbHeuresSemaine,
                //,
                //,
                //,
                //,
                //,
            ]);
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const fileName = 'accidents.xlsx';

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // Pour Internet Explorer
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                // Pour les autres navigateurs
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url); // Libérer l'URL
            }
        });
    };


    /**
     * Fonction pour exporter les données filtrées
     * @returns {void}
     * @param {void}
     */
    const handleExportDataAss = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Accidents');

        // Ajouter l'en-tête
        worksheet.addRow([
            'entrepriseName',
            'secteur',
            'typeTravailleur',
            'AssureurStatus',
            'Date de l\'accident',
            'DateEnvoieDeclarationAccide',
            'Getionnaiesinistre',
            'NumeroPoliceAssurance',
            'boolAsCloture',
            'commentaireetSuivit',
            'referenceduSinistre',
            'typeAccident',
            'circonstanceAccident',
            'DateHeureAccide',
            'DateJourIncapDeb',
            'DateJourIncapF',
            'indemnisationAccident',
            'blessures',
            'boolAucun',
            'boolChausure',
            'boolLunette',
            'boolGant',
            'boolCasque',
            'boolAuditive',
            'boolMasque',
            'boolEcran',
            'boolTenue',
            'boolFiltre',
            'boolVeste',
            'boolMaire',
            'boolChute',
            'boolAutre',
            'codeDeviation',
            'codeAgentMateriel',
            'codeNatureLesion',
            'codeSiegeLesion',
            'nomTravailleur',
            'prenomTravailleur',
            'dateNaissan',
            'lieuxnaissance',
            'niss',
            'nbHeuresSemaine',
            'dateDebutArr',
            'dateFinArr',
            'dateEntrEntrepri',
            'sexe',
            'nationalité',
            'etatCivil',
            'adresseRue',
            'adresseCodepostal',
            'adresseCommune',
            'adressePays',
            'adresseMail',
            'telephone',
            'adresseRuecorrespondance',
            'adresseCodecorrespondance',
            'adresseCommunecorrespondance',
            'ListeadressePaysCorrespondance',
            'telephoneCorrespondance',
            'ListeLangueCorr',
            'CodeMutuelle',
            'nomMutuelle',
            'adresseRueMutuelle',
            'adresseCodepostalMutuelle',
            'adresseCommuneMutuelle',
            'numAffiliation',
            'numCompteBancaire',
            'etabliFinancier',
            'numDimona',
            'ListeDurContra',
            'ListeDateSortie',
            'dateSort',
            'profesEntreprise',
            'citp',
            'ListeDureeDsEntreprise',
            'ListeVicInterimaire',
            'VicInterimaireOui',
            'VicInterimaireOuiNom',
            'VicInterimaireOuiAdresse',
            'ListeVicTravailExt',
            'VicTravailExtOui',
            'VicTravailExtOuiNom',
            'VicTravailExtOuiAdresse',
            'dateNotifEmploye',
            'ListeLieuxAt',
            'ListeVoiePublic',
            'LieuxAtAdresse',
            'LieuxAtCodePostal',
            'LieuxAtCommune',
            'ListeLieuxAtPays',
            'NumdeChantier',
            'environementLieux',
            'activiteSpecifique',
            'ListeTypedePost',
            'ListeProfHabituelle',
            'ListeProfHabituelleNon',
            'evenementDeviant',
            'ListeProcesVerbal',
            'ProcesVerbalOui',
            'ProcesVerbalOuiRedige',
            'dateProcesVerbalOuiRedigeQua',
            'ProcesVerbalOuiPar',
            'ListeTierResponsable',
            'TierResponsableOui',
            'TierResponsableOuiNomAdresse',
            'TierResponsableOuiNumPolice',
            'ListeTemoins',
            'TemoinsOui',
            'TemoinDirecte',
            'blessureVictume',
            'ListeSoinsMedicaux',
            'dateSoinsMedicauxDa',
            'SoinsMedicauxDispansateur',
            'SoinsMedicauxDescriptions',
            'ListeSoinsMedicauxMedecin',
            'dateSoinsMedicauxMedec',
            'SoinsMedicauxMedecinInami',
            'SoinsMedicauxMedecinNom',
            'SoinsMedicauxMedecinRue',
            'SoinsMedicauxMedecinCodePostal',
            'SoinsMedicauxMedecinCommune',
            'ListeSoinsMedicauxHopital',
            'dateSoinsMedicauxHopit',
            'SoinsMedicauxHopitalInami',
            'SoinsMedicauxHopitaldenomi',
            'SoinsMedicauxHopitalRue',
            'SoinsMedicauxHopitalCodePostal',
            'SoinsMedicauxHopitalCommune',
            'ListeConseqAccident',
            'dateRepriseEffecti',
            'JourIncaCompl',
            'ListeMesureRepetition',
            'ListeMesureRepetition2',
            'CodeRisqueEntreprise',
            'ListeVictimeOnss',
            'victimeOnssNon',
            'codeTravailleurSocial',
            'ListeCategoProfess',
            'CategoProfessAutre',
            'ListeNonOnss',
            'ListeApprentiFormat',
            'CommissionParitaireDénomination',
            'CommissionParitaireNumn',
            'ListeTypeContrat',
            'Nbrjoursregime',
            'NbrHeureSemaine',
            'NbrHeureSemaineReference',
            'ListeVictiPension',
            'ListeModeRemuneration',
            'ListeMontantRemuneration',
            'MontantRemunerationVariable',
            'remunerationTotalAssOnns',
            'ListePrimeFinAnnee',
            'PrimeFinAnneeRemuAnnuel',
            'PrimeFinAnneeRemuAnnuelForfetaire',
            'PrimeFinAnneeRemuAnnuelNbrHeure',
            'AvantegeAssujOnns',
            'AvantegeAssujOnnsNature',
            'ListechangementFonction',
            'dateChangementFoncti',
            'heureTravaillePerdu',
            'salaireTravaillePerdu',
            'activiteGenerale',
        ]);

        // Ajouter les données filtrées
        filteredData.forEach(item => {
            worksheet.addRow([


                item.entrepriseName,
                item.secteur,
                item.typeTravailleur,
                item.AssureurStatus,
                item.DateHeureAccident,
                item.DateEnvoieDeclarationAccide,
                item.Getionnaiesinistre,
                item.NumeroPoliceAssurance,
                item.boolAsCloture,
                item.commentaireetSuivit,
                item.referenceduSinistre,
                item.typeAccident,
                item.circonstanceAccident,
                item.DateHeureAccide,
                item.DateJourIncapDeb,
                item.DateJourIncapF,
                item.indemnisationAccident,
                item.blessures,
                item.boolAucun,
                item.boolChausure,
                item.boolLunette,
                item.boolGant,
                item.boolCasque,
                item.boolAuditive,
                item.boolMasque,
                item.boolEcran,
                item.boolTenue,
                item.boolFiltre,
                item.boolVeste,
                item.boolMaire,
                item.boolChute,
                item.boolAutre,
                item.codeDeviation,
                item.codeAgentMateriel,
                item.codeNatureLesion,
                item.codeSiegeLesion,
                item.nomTravailleur,
                item.prenomTravailleur,
                item.dateNaissan,
                item.lieuxnaissance,
                item.niss,
                item.nbHeuresSemaine,
                item.dateDebutArr,
                item.dateFinArr,
                item.dateEntrEntrepri,
                item.sexe,
                item.nationalité,
                item.etatCivil,
                item.adresseRue,
                item.adresseCodepostal,
                item.adresseCommune,
                item.adressePays,
                item.adresseMail,
                item.telephone,
                item.adresseRuecorrespondance,
                item.adresseCodecorrespondance,
                item.adresseCommunecorrespondance,
                item.ListeadressePaysCorrespondance,
                item.telephoneCorrespondance,
                item.ListeLangueCorr,
                item.CodeMutuelle,
                item.nomMutuelle,
                item.adresseRueMutuelle,
                item.adresseCodepostalMutuelle,
                item.adresseCommuneMutuelle,
                item.numAffiliation,
                item.numCompteBancaire,
                item.etabliFinancier,
                item.numDimona,
                item.ListeDurContra,
                item.ListeDateSortie,
                item.dateSort,
                item.profesEntreprise,
                item.citp,
                item.ListeDureeDsEntreprise,
                item.ListeVicInterimaire,
                item.VicInterimaireOui,
                item.VicInterimaireOuiNom,
                item.VicInterimaireOuiAdresse,
                item.ListeVicTravailExt,
                item.VicTravailExtOui,
                item.VicTravailExtOuiNom,
                item.VicTravailExtOuiAdresse,
                item.dateNotifEmploye,
                item.ListeLieuxAt,
                item.ListeVoiePublic,
                item.LieuxAtAdresse,
                item.LieuxAtCodePostal,
                item.LieuxAtCommune,
                item.ListeLieuxAtPays,
                item.NumdeChantier,
                item.environementLieux,
                item.activiteSpecifique,
                item.ListeTypedePost,
                item.ListeProfHabituelle,
                item.ListeProfHabituelleNon,
                item.evenementDeviant,
                item.ListeProcesVerbal,
                item.ProcesVerbalOui,
                item.ProcesVerbalOuiRedige,
                item.dateProcesVerbalOuiRedigeQua,
                item.ProcesVerbalOuiPar,
                item.ListeTierResponsable,
                item.TierResponsableOui,
                item.TierResponsableOuiNomAdresse,
                item.TierResponsableOuiNumPolice,
                item.ListeTemoins,
                item.TemoinsOui,
                item.TemoinDirecte,
                item.blessureVictume,
                item.ListeSoinsMedicaux,
                item.dateSoinsMedicauxDa,
                item.SoinsMedicauxDispansateur,
                item.SoinsMedicauxDescriptions,
                item.ListeSoinsMedicauxMedecin,
                item.dateSoinsMedicauxMedec,
                item.SoinsMedicauxMedecinInami,
                item.SoinsMedicauxMedecinNom,
                item.SoinsMedicauxMedecinRue,
                item.SoinsMedicauxMedecinCodePostal,
                item.SoinsMedicauxMedecinCommune,
                item.ListeSoinsMedicauxHopital,
                item.dateSoinsMedicauxHopit,
                item.SoinsMedicauxHopitalInami,
                item.SoinsMedicauxHopitaldenomi,
                item.SoinsMedicauxHopitalRue,
                item.SoinsMedicauxHopitalCodePostal,
                item.SoinsMedicauxHopitalCommune,
                item.ListeConseqAccident,
                item.dateRepriseEffecti,
                item.JourIncaCompl,
                item.ListeMesureRepetition,
                item.ListeMesureRepetition2,
                item.CodeRisqueEntreprise,
                item.ListeVictimeOnss,
                item.victimeOnssNon,
                item.codeTravailleurSocial,
                item.ListeCategoProfess,
                item.CategoProfessAutre,
                item.ListeNonOnss,
                item.ListeApprentiFormat,
                item.CommissionParitaireDénomination,
                item.CommissionParitaireNumn,
                item.ListeTypeContrat,
                item.Nbrjoursregime,
                item.NbrHeureSemaine,
                item.NbrHeureSemaineReference,
                item.ListeVictiPension,
                item.ListeModeRemuneration,
                item.ListeMontantRemuneration,
                item.MontantRemunerationVariable,
                item.remunerationTotalAssOnns,
                item.ListePrimeFinAnnee,
                item.PrimeFinAnneeRemuAnnuel,
                item.PrimeFinAnneeRemuAnnuelForfetaire,
                item.PrimeFinAnneeRemuAnnuelNbrHeure,
                item.AvantegeAssujOnns,
                item.AvantegeAssujOnnsNature,
                item.ListechangementFonction,
                item.dateChangementFoncti,
                item.heureTravaillePerdu,
                item.salaireTravaillePerdu,
                item.activiteGenerale,

            ]);
        });



        // Générer le fichier Excel et le télécharger
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const fileName = 'accidents.xlsx';

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // Pour Internet Explorer
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                // Pour les autres navigateurs
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url); // Libérer l'URL
            }
        });
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0rem' }}>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="secondary"
                        onClick={refreshListAccidents}
                        startIcon={<RefreshIcon />}
                    >
                        Actualiser
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <TextField
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        variant="outlined"
                        sx={{ boxShadow: 3, backgroundColor: '#84a784' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="primary"
                        onClick={handleExportData}
                        startIcon={<GetAppIcon />}
                    >
                        Accident
                    </Button>
                </Grid>
                <Grid item xs={6} style={{ marginRight: '20px' }}>
                    <Button
                        sx={{ color: 'black', padding: '14px 60px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, boxShadow: 3, textTransform: 'none' }}
                        variant="contained"
                        color="primary"
                        onClick={handleExportDataAss}
                        startIcon={<GetAppIcon />}
                    >
                        Assurance
                    </Button>
                </Grid>
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow key={"CellTowerSharp"}>
                            <TableCell>N° Groupe</TableCell>
                            <TableCell>N° Entreprise</TableCell>
                            <TableCell>Date accident</TableCell>
                            <TableCell>Entreprise</TableCell>
                            <TableCell>Secteur</TableCell>
                            <TableCell>Nom du travailleur</TableCell>
                            <TableCell>Prénom du travailleur</TableCell>
                            <TableCell>Type accident</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.recordNumberGroupoe}</TableCell>
                                <TableCell>{item.recordNumberEntreprise}</TableCell>
                                <TableCell>{item.DateHeureAccident}</TableCell>
                                <TableCell>{item.entrepriseName}</TableCell>
                                <TableCell>{item.secteur}</TableCell>
                                <TableCell>{item.nomTravailleur}</TableCell>
                                <TableCell>{item.prenomTravailleur}</TableCell>
                                <TableCell>{item.typeAccident}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(item._id)}> <EditIcon /></Button>
                                    <Button style={{ marginLeft: '8px' }} variant="contained" color="success" onClick={() => handleGeneratePDF(item._id)}> <PictureAsPdfIcon /></Button>
                                    <Button
                                        style={{ marginLeft: '38px' }}
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            confirmAlert({
                                                customUI: ({ onClose }) => {
                                                    return (
                                                        <div className="custom-confirm-dialog">
                                                            <h1 className="custom-confirm-title">Supprimer</h1>
                                                            <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                                                            <div className="custom-confirm-buttons">
                                                                <button
                                                                    className="custom-confirm-button"
                                                                    onClick={() => {
                                                                        handleDelete(item._id);
                                                                        onClose();
                                                                    }}
                                                                >
                                                                    Oui
                                                                </button>
                                                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                                                    Non
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            });
                                        }}
                                    >
                                        <DeleteForeverIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Home;
