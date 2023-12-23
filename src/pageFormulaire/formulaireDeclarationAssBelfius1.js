/* IMPORT REACT */
import * as React from 'react';
import { useState, useEffect } from 'react';
/* IMPORT MUI */
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');
import { InputAdornment, Autocomplete, TextField } from '@mui/material';
/* IMPORT PERSO */
import listeDeclarationAss from '../liste/listeDeclarationAssBelfius.json';
import AutoCompleteP from '../composants/autoCompleteP';
import TextFieldP from '../composants/textFieldP';
import DatePickerP from '../composants/datePickerP';


dayjs.locale('fr');

export default function FormulaireDeclarationASSBelfius({ setValue, accidentData, watch }) {




    const frameStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //height: `${frameWidth * 1.3}px`, // Adjust the coefficient as needed
        border: '2px solid #84a784',
        borderRadius: '10px',
        cursor: 'pointer',
        margin: '20px 1rem',
        backgroundColor: '#d2e2d2',
    };

    const [showtroiTextField, setShowListeVicInterimaire] = useState(false);
    const [showquatreTextField, setShowListeVicTravailExt] = useState(false);
    const [showcinqTextField, setShowListeVoiePublic] = useState(false);
    const [showsixTextField, setShowListeLieuxAt] = useState(false);
    const [showseptTextField, setShowListeProfHabituelle] = useState(false);
    const [showhuitTextField, setShowListeProcesVerbal] = useState(false);
    const [showneufTextField, setShowListeTierResponsable] = useState(false);
    const [showdixTextField, setShowListeTemoins] = useState(false);
    const [showonzeTextField, setShowListeSoinsMedicaux] = useState(false);
    const [showdouzeTextField, setShowListeSoinsMedicauxMedecin] = useState(false);
    const [showtreizeTextField, setShowListeSoinsMedicauxHopital] = useState(false);
    const [showquatorzeTextField, setShowListeVictimeOnss] = useState(false);

    // modifier le TextFieldP comme l'AutoCompleteP ligne 621
    const [showquinzeTextField, setShowcodeTravailleurSocial] = useState(false);

    /*const handloutlinedmultilinecodeTravailleurSocial = (event) => {
        const outlinedmultilinecodeTravailleurSocial = event.target.value;
        setshowquinzeTextField(outlinedmultilinecodeTravailleurSocial === '');
    };*/

    const [showSeizeTextField, setShowListeNonOnss] = useState(false);
    const [showdixseptTextField, setShowListeApprentiFormat] = useState(false);
    const [showdixhuitTextField, setShowListeModeRemuneration] = useState(false);
    const [showdixneufTextField, setShowListechangementFonction] = useState(false);
    const [showvingtTextField, setShowListeCategoProfess] = useState(false);
    const [showvingtetunTextField, setShowListeDateSortie] = useState(false);
    const [showvingtdeusTextField, setShowListeDurContra] = useState(false);





    const [CodeMutuelle, setCodeMutuelle] = useState(watch('CodeMutuelle') ? watch('CodeMutuelle') : (accidentData && accidentData.CodeMutuelle ? accidentData.CodeMutuelle : ''));
    const [adresseRueMutuelle, setadresseRueMutuelle] = useState(watch('adresseRueMutuelle') ? watch('adresseRueMutuelle') : (accidentData && accidentData.adresseRueMutuelle ? accidentData.adresseRueMutuelle : ''));
    const [adresseCodepostalMutuelle, setadresseCodepostalMutuelle] = useState(watch('adresseCodepostalMutuelle') ? watch('adresseCodepostalMutuelle') : (accidentData && accidentData.adresseCodepostalMutuelle ? accidentData.adresseCodepostalMutuelle : ''));
    const [adresseCommuneMutuelle, setadresseCommuneMutuelle] = useState(watch('adresseCommuneMutuelle') ? watch('adresseCommuneMutuelle') : (accidentData && accidentData.adresseCommuneMutuelle ? accidentData.adresseCommuneMutuelle : ''));
    const [numAffiliation, setnumAffiliation] = useState(watch('numAffiliation') ? watch('numAffiliation') : (accidentData && accidentData.numAffiliation ? accidentData.numAffiliation : ''));
    const [numCompteBancaire, setnumCompteBancaire] = useState(watch('numCompteBancaire') ? watch('numCompteBancaire') : (accidentData && accidentData.numCompteBancaire ? accidentData.numCompteBancaire : ''));
    const [etabliFinancier, setetabliFinancier] = useState(watch('etabliFinancier') ? watch('etabliFinancier') : (accidentData && accidentData.etabliFinancier ? accidentData.etabliFinancier : ''));
    const [numDimona, setnumDimona] = useState(watch('numDimona') ? watch('numDimona') : (accidentData && accidentData.numDimona ? accidentData.numDimona : ''));
    const [ListeDurContra, setListeDurContra] = useState(watch('ListeDurContra') ? watch('ListeDurContra') : (accidentData && accidentData.ListeDurContra ? accidentData.ListeDurContra : ''));
    const [ListeDateSortie, setListeDateSortie] = useState(watch('ListeDateSortie') ? watch('ListeDateSortie') : (accidentData && accidentData.ListeDateSortie ? accidentData.ListeDateSortie : ''));
    const [dateSortie, setdateSortie] = useState(watch('dateSortie') ? watch('dateSortie') : (accidentData && accidentData.dateSortie ? accidentData.dateSortie : ''));
    const [profesEntreprise, setprofesEntreprise] = useState(watch('profesEntreprise') ? watch('profesEntreprise') : (accidentData && accidentData.profesEntreprise ? accidentData.profesEntreprise : ''));
    const [ListeDureeDsEntreprise, setListeDureeDsEntreprise] = useState(watch('ListeDureeDsEntreprise') ? watch('ListeDureeDsEntreprise') : (accidentData && accidentData.ListeDureeDsEntreprise ? accidentData.ListeDureeDsEntreprise : ''));
    const [ListeVicInterimaire, setListeVicInterimaire] = useState(watch('ListeVicInterimaire') ? watch('ListeVicInterimaire') : (accidentData && accidentData.ListeVicInterimaire ? accidentData.ListeVicInterimaire : ''));
    const [VicInterimaireOui, setVicInterimaireOui] = useState(watch('VicInterimaireOui') ? watch('VicInterimaireOui') : (accidentData && accidentData.VicInterimaireOui ? accidentData.VicInterimaireOui : ''));
    const [VicInterimaireOuiNom, setVicInterimaireOuiNom] = useState(watch('VicInterimaireOuiNom') ? watch('VicInterimaireOuiNom') : (accidentData && accidentData.VicInterimaireOuiNom ? accidentData.VicInterimaireOuiNom : ''));
    const [VicInterimaireOuiAdresse, setVicInterimaireOuiAdresse] = useState(watch('VicInterimaireOuiAdresse') ? watch('VicInterimaireOuiAdresse') : (accidentData && accidentData.VicInterimaireOuiAdresse ? accidentData.VicInterimaireOuiAdresse : ''));
    const [ListeVicTravailExt, setListeVicTravailExt] = useState(watch('ListeVicTravailExt') ? watch('ListeVicTravailExt') : (accidentData && accidentData.ListeVicTravailExt ? accidentData.ListeVicTravailExt : ''));
    const [VicTravailExtOui, setVicTravailExtOui] = useState(watch('VicTravailExtOui') ? watch('VicTravailExtOui') : (accidentData && accidentData.VicTravailExtOui ? accidentData.VicTravailExtOui : ''));
    const [VicTravailExtOuiNom, setVicTravailExtOuiNom] = useState(watch('VicTravailExtOuiNom') ? watch('VicTravailExtOuiNom') : (accidentData && accidentData.VicTravailExtOuiNom ? accidentData.VicTravailExtOuiNom : ''));
    const [VicTravailExtOuiAdresse, setVicTravailExtOuiAdresse] = useState(watch('VicTravailExtOuiAdresse') ? watch('VicTravailExtOuiAdresse') : (accidentData && accidentData.VicTravailExtOuiAdresse ? accidentData.VicTravailExtOuiAdresse : ''));
    const [dateNotifEmployeur, setdateNotifEmployeur] = useState(watch('dateNotifEmployeur') ? watch('dateNotifEmployeur') : (accidentData && accidentData.dateNotifEmployeur ? accidentData.dateNotifEmployeur : ''));
    const [ListeLieuxAt, setListeLieuxAt] = useState(watch('ListeLieuxAt') ? watch('ListeLieuxAt') : (accidentData && accidentData.ListeLieuxAt ? accidentData.ListeLieuxAt : ''));
    const [ListeVoiePublic, setListeVoiePublic] = useState(watch('ListeVoiePublic') ? watch('ListeVoiePublic') : (accidentData && accidentData.ListeVoiePublic ? accidentData.ListeVoiePublic : ''));
    const [LieuxAtAdresse, setLieuxAtAdresse] = useState(watch('LieuxAtAdresse') ? watch('LieuxAtAdresse') : (accidentData && accidentData.LieuxAtAdresse ? accidentData.LieuxAtAdresse : ''));
    const [LieuxAtCodePostal, setLieuxAtCodePostal] = useState(watch('LieuxAtCodePostal') ? watch('LieuxAtCodePostal') : (accidentData && accidentData.LieuxAtCodePostal ? accidentData.LieuxAtCodePostal : ''));
    const [LieuxAtCommune, setLieuxAtCommune] = useState(watch('LieuxAtCommune') ? watch('LieuxAtCommune') : (accidentData && accidentData.LieuxAtCommune ? accidentData.LieuxAtCommune : ''));
    const [ListeLieuxAtPays, setListeLieuxAtPays] = useState(watch('ListeLieuxAtPays') ? watch('ListeLieuxAtPays') : (accidentData && accidentData.ListeLieuxAtPays ? accidentData.ListeLieuxAtPays : ''));
    const [NumdeChantier, setNumdeChantier] = useState(watch('NumdeChantier') ? watch('NumdeChantier') : (accidentData && accidentData.NumdeChantier ? accidentData.NumdeChantier : ''));
    const [environementLieux, setenvironementLieux] = useState(watch('environementLieux') ? watch('environementLieux') : (accidentData && accidentData.environementLieux ? accidentData.environementLieux : ''));
    const [activiteGeneral, setactiviteGeneral] = useState(watch('activiteGeneral') ? watch('activiteGeneral') : (accidentData && accidentData.activiteGeneral ? accidentData.activiteGeneral : ''));
    const [activiteSpecifique, setactiviteSpecifique] = useState(watch('activiteSpecifique') ? watch('activiteSpecifique') : (accidentData && accidentData.activiteSpecifique ? accidentData.activiteSpecifique : ''));
    const [ListeTypedePost, setListeTypedePost] = useState(watch('ListeTypedePost') ? watch('ListeTypedePost') : (accidentData && accidentData.ListeTypedePost ? accidentData.ListeTypedePost : ''));
    const [ListeProfHabituelle, setListeProfHabituelle] = useState(watch('ListeProfHabituelle') ? watch('ListeProfHabituelle') : (accidentData && accidentData.ListeProfHabituelle ? accidentData.ListeProfHabituelle : ''));
    const [ListeProfHabituelleNon, setListeProfHabituelleNon] = useState(watch('ListeProfHabituelleNon') ? watch('ListeProfHabituelleNon') : (accidentData && accidentData.ListeProfHabituelleNon ? accidentData.ListeProfHabituelleNon : ''));
    const [evenementDeviant, setevenementDeviant] = useState(watch('evenementDeviant') ? watch('evenementDeviant') : (accidentData && accidentData.evenementDeviant ? accidentData.evenementDeviant : ''));
    const [ListeProcesVerbal, setListeProcesVerbal] = useState(watch('ListeProcesVerbal') ? watch('ListeProcesVerbal') : (accidentData && accidentData.ListeProcesVerbal ? accidentData.ListeProcesVerbal : ''));
    const [ProcesVerbalOui, setProcesVerbalOui] = useState(watch('ProcesVerbalOui') ? watch('ProcesVerbalOui') : (accidentData && accidentData.ProcesVerbalOui ? accidentData.ProcesVerbalOui : ''));
    const [ProcesVerbalOuiRedige, setProcesVerbalOuiRedige] = useState(watch('ProcesVerbalOuiRedige') ? watch('ProcesVerbalOuiRedige') : (accidentData && accidentData.ProcesVerbalOuiRedige ? accidentData.ProcesVerbalOuiRedige : ''));
    const [dateProcesVerbalOuiRedigeQuand, setdateProcesVerbalOuiRedigeQuand] = useState(watch('dateProcesVerbalOuiRedigeQuand') ? watch('dateProcesVerbalOuiRedigeQuand') : (accidentData && accidentData.dateProcesVerbalOuiRedigeQuand ? accidentData.dateProcesVerbalOuiRedigeQuand : ''));
    const [ProcesVerbalOuiPar, setProcesVerbalOuiPar] = useState(watch('ProcesVerbalOuiPar') ? watch('ProcesVerbalOuiPar') : (accidentData && accidentData.ProcesVerbalOuiPar ? accidentData.ProcesVerbalOuiPar : ''));
    const [ListeTierResponsable, setListeTierResponsable] = useState(watch('ListeTierResponsable') ? watch('ListeTierResponsable') : (accidentData && accidentData.ListeTierResponsable ? accidentData.ListeTierResponsable : ''));
    const [TierResponsableOui, setTierResponsableOui] = useState(watch('TierResponsableOui') ? watch('TierResponsableOui') : (accidentData && accidentData.TierResponsableOui ? accidentData.TierResponsableOui : ''));
    const [TierResponsableOuiNomAdresse, setTierResponsableOuiNomAdresse] = useState(watch('TierResponsableOuiNomAdresse') ? watch('TierResponsableOuiNomAdresse') : (accidentData && accidentData.TierResponsableOuiNomAdresse ? accidentData.TierResponsableOuiNomAdresse : ''));
    const [TierResponsableOuiNumPolice, setTierResponsableOuiNumPolice] = useState(watch('TierResponsableOuiNumPolice') ? watch('TierResponsableOuiNumPolice') : (accidentData && accidentData.TierResponsableOuiNumPolice ? accidentData.TierResponsableOuiNumPolice : ''));
    const [ListeTemoins, setListeTemoins] = useState(watch('ListeTemoins') ? watch('ListeTemoins') : (accidentData && accidentData.ListeTemoins ? accidentData.ListeTemoins : ''));
    const [TemoinsOui, setTemoinsOui] = useState(watch('TemoinsOui') ? watch('TemoinsOui') : (accidentData && accidentData.TemoinsOui ? accidentData.TemoinsOui : ''));
    const [blessureVictume, setblessureVictume] = useState(watch('blessureVictume') ? watch('blessureVictume') : (accidentData && accidentData.blessureVictume ? accidentData.blessureVictume : ''));
    const [ListeSoinsMedicaux, setListeSoinsMedicaux] = useState(watch('ListeSoinsMedicaux') ? watch('ListeSoinsMedicaux') : (accidentData && accidentData.ListeSoinsMedicaux ? accidentData.ListeSoinsMedicaux : ''));
    const [dateSoinsMedicauxDate, setdateSoinsMedicauxDate] = useState(watch('dateSoinsMedicauxDate') ? watch('dateSoinsMedicauxDate') : (accidentData && accidentData.dateSoinsMedicauxDate ? accidentData.dateSoinsMedicauxDate : ''));
    const [SoinsMedicauxDispansateur, setSoinsMedicauxDispansateur] = useState(watch('SoinsMedicauxDispansateur') ? watch('SoinsMedicauxDispansateur') : (accidentData && accidentData.SoinsMedicauxDispansateur ? accidentData.SoinsMedicauxDispansateur : ''));
    const [SoinsMedicauxDescriptions, setSoinsMedicauxDescriptions] = useState(watch('SoinsMedicauxDescriptions') ? watch('SoinsMedicauxDescriptions') : (accidentData && accidentData.SoinsMedicauxDescriptions ? accidentData.SoinsMedicauxDescriptions : ''));
    const [ListeSoinsMedicauxMedecin, setListeSoinsMedicauxMedecin] = useState(watch('ListeSoinsMedicauxMedecin') ? watch('ListeSoinsMedicauxMedecin') : (accidentData && accidentData.ListeSoinsMedicauxMedecin ? accidentData.ListeSoinsMedicauxMedecin : ''));
    const [dateSoinsMedicauxMedecin, setdateSoinsMedicauxMedecin] = useState(watch('dateSoinsMedicauxMedecin') ? watch('dateSoinsMedicauxMedecin') : (accidentData && accidentData.dateSoinsMedicauxMedecin ? accidentData.dateSoinsMedicauxMedecin : ''));
    const [SoinsMedicauxMedecinInami, setSoinsMedicauxMedecinInami] = useState(watch('SoinsMedicauxMedecinInami') ? watch('SoinsMedicauxMedecinInami') : (accidentData && accidentData.SoinsMedicauxMedecinInami ? accidentData.SoinsMedicauxMedecinInami : ''));
    const [SoinsMedicauxMedecinNom, setSoinsMedicauxMedecinNom] = useState(watch('SoinsMedicauxMedecinNom') ? watch('SoinsMedicauxMedecinNom') : (accidentData && accidentData.SoinsMedicauxMedecinNom ? accidentData.SoinsMedicauxMedecinNom : ''));
    const [SoinsMedicauxMedecinRue, setSoinsMedicauxMedecinRue] = useState(watch('SoinsMedicauxMedecinRue') ? watch('SoinsMedicauxMedecinRue') : (accidentData && accidentData.SoinsMedicauxMedecinRue ? accidentData.SoinsMedicauxMedecinRue : ''));
    const [SoinsMedicauxMedecinCodePostal, setSoinsMedicauxMedecinCodePostal] = useState(watch('SoinsMedicauxMedecinCodePostal') ? watch('SoinsMedicauxMedecinCodePostal') : (accidentData && accidentData.SoinsMedicauxMedecinCodePostal ? accidentData.SoinsMedicauxMedecinCodePostal : ''));
    const [SoinsMedicauxMedecinCommune, setSoinsMedicauxMedecinCommune] = useState(watch('SoinsMedicauxMedecinCommune') ? watch('SoinsMedicauxMedecinCommune') : (accidentData && accidentData.SoinsMedicauxMedecinCommune ? accidentData.SoinsMedicauxMedecinCommune : ''));
    const [ListeSoinsMedicauxHopital, setListeSoinsMedicauxHopital] = useState(watch('ListeSoinsMedicauxHopital') ? watch('ListeSoinsMedicauxHopital') : (accidentData && accidentData.ListeSoinsMedicauxHopital ? accidentData.ListeSoinsMedicauxHopital : ''));
    const [dateSoinsMedicauxHopital, setdateSoinsMedicauxHopital] = useState(watch('dateSoinsMedicauxHopital') ? watch('dateSoinsMedicauxHopital') : (accidentData && accidentData.dateSoinsMedicauxHopital ? accidentData.dateSoinsMedicauxHopital : ''));
    const [SoinsMedicauxHopitalInami, setSoinsMedicauxHopitalInami] = useState(watch('SoinsMedicauxHopitalInami') ? watch('SoinsMedicauxHopitalInami') : (accidentData && accidentData.SoinsMedicauxHopitalInami ? accidentData.SoinsMedicauxHopitalInami : ''));
    const [SoinsMedicauxHopitaldenomi, setSoinsMedicauxHopitaldenomi] = useState(watch('SoinsMedicauxHopitaldenomi') ? watch('SoinsMedicauxHopitaldenomi') : (accidentData && accidentData.SoinsMedicauxHopitaldenomi ? accidentData.SoinsMedicauxHopitaldenomi : ''));
    const [SoinsMedicauxHopitalRue, setSoinsMedicauxHopitalRue] = useState(watch('SoinsMedicauxHopitalRue') ? watch('SoinsMedicauxHopitalRue') : (accidentData && accidentData.SoinsMedicauxHopitalRue ? accidentData.SoinsMedicauxHopitalRue : ''));
    const [SoinsMedicauxHopitalCodePostal, setSoinsMedicauxHopitalCodePostal] = useState(watch('SoinsMedicauxHopitalCodePostal') ? watch('SoinsMedicauxHopitalCodePostal') : (accidentData && accidentData.SoinsMedicauxHopitalCodePostal ? accidentData.SoinsMedicauxHopitalCodePostal : ''));
    const [SoinsMedicauxHopitalCommune, setSoinsMedicauxHopitalCommune] = useState(watch('SoinsMedicauxHopitalCommune') ? watch('SoinsMedicauxHopitalCommune') : (accidentData && accidentData.SoinsMedicauxHopitalCommune ? accidentData.SoinsMedicauxHopitalCommune : ''));
    const [ListeConseqAccident, setListeConseqAccident] = useState(watch('ListeConseqAccident') ? watch('ListeConseqAccident') : (accidentData && accidentData.ListeConseqAccident ? accidentData.ListeConseqAccident : ''));
    const [dateRepriseEffective, setdateRepriseEffective] = useState(watch('dateRepriseEffective') ? watch('dateRepriseEffective') : (accidentData && accidentData.dateRepriseEffective ? accidentData.dateRepriseEffective : ''));
    const [JourIncaCompl, setJourIncaCompl] = useState(watch('JourIncaCompl') ? watch('JourIncaCompl') : (accidentData && accidentData.JourIncaCompl ? accidentData.JourIncaCompl : ''));
    const [ListeMesureRepetition, setListeMesureRepetition] = useState(watch('ListeMesureRepetition') ? watch('ListeMesureRepetition') : (accidentData && accidentData.ListeMesureRepetition ? accidentData.ListeMesureRepetition : ''));
    const [CodeRisqueEntreprise, setCodeRisqueEntreprise] = useState(watch('CodeRisqueEntreprise') ? watch('CodeRisqueEntreprise') : (accidentData && accidentData.CodeRisqueEntreprise ? accidentData.CodeRisqueEntreprise : ''));
    const [ListeVictimeOnss, setListeVictimeOnss] = useState(watch('ListeVictimeOnss') ? watch('ListeVictimeOnss') : (accidentData && accidentData.ListeVictimeOnss ? accidentData.ListeVictimeOnss : ''));
    const [victimeOnssNon, setvictimeOnssNon] = useState(watch('victimeOnssNon') ? watch('victimeOnssNon') : (accidentData && accidentData.victimeOnssNon ? accidentData.victimeOnssNon : ''));
    const [codeTravailleurSocial, setcodeTravailleurSocial] = useState(watch('codeTravailleurSocial') ? watch('codeTravailleurSocial') : (accidentData && accidentData.codeTravailleurSocial ? accidentData.codeTravailleurSocial : ''));
    const [ListeCategoProfess, setListeCategoProfess] = useState(watch('ListeCategoProfess') ? watch('ListeCategoProfess') : (accidentData && accidentData.ListeCategoProfess ? accidentData.ListeCategoProfess : ''));
    const [CategoProfessAutre, setCategoProfessAutre] = useState(watch('CategoProfessAutre') ? watch('CategoProfessAutre') : (accidentData && accidentData.CategoProfessAutre ? accidentData.CategoProfessAutre : ''));
    const [ListeNonOnss, setListeNonOnss] = useState(watch('ListeNonOnss') ? watch('ListeNonOnss') : (accidentData && accidentData.ListeNonOnss ? accidentData.ListeNonOnss : ''));
    const [ListeApprentiFormat, setListeApprentiFormat] = useState(watch('ListeApprentiFormat') ? watch('ListeApprentiFormat') : (accidentData && accidentData.ListeApprentiFormat ? accidentData.ListeApprentiFormat : ''));
    const [CommissionParitaireDénomination, setCommissionParitaireDénomination] = useState(watch('CommissionParitaireDénomination') ? watch('CommissionParitaireDénomination') : (accidentData && accidentData.CommissionParitaireDénomination ? accidentData.CommissionParitaireDénomination : ''));
    const [CommissionParitaireNumn, setCommissionParitaireNumn] = useState(watch('CommissionParitaireNumn') ? watch('CommissionParitaireNumn') : (accidentData && accidentData.CommissionParitaireNumn ? accidentData.CommissionParitaireNumn : ''));
    const [ListeTypeContrat, setListeTypeContrat] = useState(watch('ListeTypeContrat') ? watch('ListeTypeContrat') : (accidentData && accidentData.ListeTypeContrat ? accidentData.ListeTypeContrat : ''));
    const [Nbrjoursregime, setNbrjoursregime] = useState(watch('Nbrjoursregime') ? watch('Nbrjoursregime') : (accidentData && accidentData.Nbrjoursregime ? accidentData.Nbrjoursregime : ''));
    const [NbrHeureSemaine, setNbrHeureSemaine] = useState(watch('NbrHeureSemaine') ? watch('NbrHeureSemaine') : (accidentData && accidentData.NbrHeureSemaine ? accidentData.NbrHeureSemaine : ''));
    const [NbrHeureSemaineReference, setNbrHeureSemaineReference] = useState(watch('NbrHeureSemaineReference') ? watch('NbrHeureSemaineReference') : (accidentData && accidentData.NbrHeureSemaineReference ? accidentData.NbrHeureSemaineReference : ''));
    const [ListeVictiPension, setListeVictiPension] = useState(watch('ListeVictiPension') ? watch('ListeVictiPension') : (accidentData && accidentData.ListeVictiPension ? accidentData.ListeVictiPension : ''));
    const [ListeModeRemuneration, setListeModeRemuneration] = useState(watch('ListeModeRemuneration') ? watch('ListeModeRemuneration') : (accidentData && accidentData.ListeModeRemuneration ? accidentData.ListeModeRemuneration : ''));
    const [ListeMontantRemuneration, setListeMontantRemuneration] = useState(watch('ListeMontantRemuneration') ? watch('ListeMontantRemuneration') : (accidentData && accidentData.ListeMontantRemuneration ? accidentData.ListeMontantRemuneration : ''));
    const [MontantRemunerationVariable, setMontantRemunerationVariable] = useState(watch('MontantRemunerationVariable') ? watch('MontantRemunerationVariable') : (accidentData && accidentData.MontantRemunerationVariable ? accidentData.MontantRemunerationVariable : ''));
    const [remunerationTotalAssOnns, setremunerationTotalAssOnns] = useState(watch('remunerationTotalAssOnns') ? watch('remunerationTotalAssOnns') : (accidentData && accidentData.remunerationTotalAssOnns ? accidentData.remunerationTotalAssOnns : ''));
    const [ListePrimeFinAnnee, setListePrimeFinAnnee] = useState(watch('ListePrimeFinAnnee') ? watch('ListePrimeFinAnnee') : (accidentData && accidentData.ListePrimeFinAnnee ? accidentData.ListePrimeFinAnnee : ''));
    const [PrimeFinAnneeRemuAnnuel, setPrimeFinAnneeRemuAnnuel] = useState(watch('PrimeFinAnneeRemuAnnuel') ? watch('PrimeFinAnneeRemuAnnuel') : (accidentData && accidentData.PrimeFinAnneeRemuAnnuel ? accidentData.PrimeFinAnneeRemuAnnuel : ''));
    const [PrimeFinAnneeRemuAnnuelForfetaire, setPrimeFinAnneeRemuAnnuelForfetaire] = useState(watch('PrimeFinAnneeRemuAnnuelForfetaire') ? watch('PrimeFinAnneeRemuAnnuelForfetaire') : (accidentData && accidentData.PrimeFinAnneeRemuAnnuelForfetaire ? accidentData.PrimeFinAnneeRemuAnnuelForfetaire : ''));
    const [PrimeFinAnneeRemuAnnuelNbrHeure, setPrimeFinAnneeRemuAnnuelNbrHeure] = useState(watch('PrimeFinAnneeRemuAnnuelNbrHeure') ? watch('PrimeFinAnneeRemuAnnuelNbrHeure') : (accidentData && accidentData.PrimeFinAnneeRemuAnnuelNbrHeure ? accidentData.PrimeFinAnneeRemuAnnuelNbrHeure : ''));
    const [AvantegeAssujOnns, setAvantegeAssujOnns] = useState(watch('AvantegeAssujOnns') ? watch('AvantegeAssujOnns') : (accidentData && accidentData.AvantegeAssujOnns ? accidentData.AvantegeAssujOnns : ''));
    const [AvantegeAssujOnnsNature, setAvantegeAssujOnnsNature] = useState(watch('AvantegeAssujOnnsNature') ? watch('AvantegeAssujOnnsNature') : (accidentData && accidentData.AvantegeAssujOnnsNature ? accidentData.AvantegeAssujOnnsNature : ''));
    const [ListechangementFonction, setListechangementFonction] = useState(watch('ListechangementFonction') ? watch('ListechangementFonction') : (accidentData && accidentData.ListechangementFonction ? accidentData.ListechangementFonction : ''));
    const [dateChangementFonction, setdateChangementFonction] = useState(watch('dateChangementFonction') ? watch('dateChangementFonction') : (accidentData && accidentData.dateChangementFonction ? accidentData.dateChangementFonction : ''));
    const [heureTravaillePerdu, setheureTravaillePerdu] = useState(watch('heureTravaillePerdu') ? watch('heureTravaillePerdu') : (accidentData && accidentData.heureTravaillePerdu ? accidentData.heureTravaillePerdu : ''));
    const [salaireTravaillePerdu, setsalaireTravaillePerdu] = useState(watch('salaireTravaillePerdu') ? watch('salaireTravaillePerdu') : (accidentData && accidentData.salaireTravaillePerdu ? accidentData.salaireTravaillePerdu : ''));
    const [activiteGenerale, setactiviteGenerale] = useState(watch('activiteGenerale') ? watch('activiteGenerale') : (accidentData && accidentData.activiteGenerale ? accidentData.activiteGenerale : ''));

    useEffect(() => {
        setValue('CodeMutuelle', CodeMutuelle)
        setValue('adresseRueMutuelle', adresseRueMutuelle)
        setValue('adresseCodepostalMutuelle', adresseCodepostalMutuelle)
        setValue('adresseCommuneMutuelle', adresseCommuneMutuelle)
        setValue('numAffiliation', numAffiliation)
        setValue('numCompteBancaire', numCompteBancaire)
        setValue('etabliFinancier', etabliFinancier)
        setValue('numDimona', numDimona)
        setValue('ListeDurContra', ListeDurContra)
        setValue('ListeDateSortie', ListeDateSortie)
        setValue('dateSortie', dateSortie)
        setValue('profesEntreprise', profesEntreprise)
        setValue('ListeDureeDsEntreprise', ListeDureeDsEntreprise)
        setValue('ListeVicInterimaire', ListeVicInterimaire)
        setValue('VicInterimaireOui', VicInterimaireOui)
        setValue('VicInterimaireOuiNom', VicInterimaireOuiNom)
        setValue('VicInterimaireOuiAdresse', VicInterimaireOuiAdresse)
        setValue('ListeVicTravailExt', ListeVicTravailExt)
        setValue('VicTravailExtOui', VicTravailExtOui)
        setValue('VicTravailExtOuiNom', VicTravailExtOuiNom)
        setValue('VicTravailExtOuiAdresse', VicTravailExtOuiAdresse)
        setValue('dateNotifEmployeur', dateNotifEmployeur)
        setValue('ListeLieuxAt', ListeLieuxAt)
        setValue('ListeVoiePublic', ListeVoiePublic)
        setValue('LieuxAtAdresse', LieuxAtAdresse)
        setValue('LieuxAtCodePostal', LieuxAtCodePostal)
        setValue('LieuxAtCommune', LieuxAtCommune)
        setValue('ListeLieuxAtPays', ListeLieuxAtPays)
        setValue('NumdeChantier', NumdeChantier)
        setValue('environementLieux', environementLieux)
        setValue('activiteGeneral', activiteGeneral)
        setValue('activiteSpecifique', activiteSpecifique)
        setValue('ListeTypedePost', ListeTypedePost)
        setValue('ListeProfHabituelle', ListeProfHabituelle)
        setValue('ListeProfHabituelleNon', ListeProfHabituelleNon)
        setValue('evenementDeviant', evenementDeviant)
        setValue('ListeProcesVerbal', ListeProcesVerbal)
        setValue('ProcesVerbalOui', ProcesVerbalOui)
        setValue('ProcesVerbalOuiRedige', ProcesVerbalOuiRedige)
        setValue('dateProcesVerbalOuiRedigeQuand', dateProcesVerbalOuiRedigeQuand)
        setValue('ProcesVerbalOuiPar', ProcesVerbalOuiPar)
        setValue('ListeTierResponsable', ListeTierResponsable)
        setValue('TierResponsableOui', TierResponsableOui)
        setValue('TierResponsableOuiNomAdresse', TierResponsableOuiNomAdresse)
        setValue('TierResponsableOuiNumPolice', TierResponsableOuiNumPolice)
        setValue('ListeTemoins', ListeTemoins)
        setValue('TemoinsOui', TemoinsOui)
        setValue('blessureVictume', blessureVictume)
        setValue('ListeSoinsMedicaux', ListeSoinsMedicaux)
        setValue('dateSoinsMedicauxDate', dateSoinsMedicauxDate)
        setValue('SoinsMedicauxDispansateur', SoinsMedicauxDispansateur)
        setValue('SoinsMedicauxDescriptions', SoinsMedicauxDescriptions)
        setValue('ListeSoinsMedicauxMedecin', ListeSoinsMedicauxMedecin)
        setValue('dateSoinsMedicauxMedecin', dateSoinsMedicauxMedecin)
        setValue('SoinsMedicauxMedecinInami', SoinsMedicauxMedecinInami)
        setValue('SoinsMedicauxMedecinNom', SoinsMedicauxMedecinNom)
        setValue('SoinsMedicauxMedecinRue', SoinsMedicauxMedecinRue)
        setValue('SoinsMedicauxMedecinCodePostal', SoinsMedicauxMedecinCodePostal)
        setValue('SoinsMedicauxMedecinCommune', SoinsMedicauxMedecinCommune)
        setValue('ListeSoinsMedicauxHopital', ListeSoinsMedicauxHopital)
        setValue('dateSoinsMedicauxHopital', dateSoinsMedicauxHopital)
        setValue('SoinsMedicauxHopitalInami', SoinsMedicauxHopitalInami)
        setValue('SoinsMedicauxHopitaldenomi', SoinsMedicauxHopitaldenomi)
        setValue('SoinsMedicauxHopitalRue', SoinsMedicauxHopitalRue)
        setValue('SoinsMedicauxHopitalCodePostal', SoinsMedicauxHopitalCodePostal)
        setValue('SoinsMedicauxHopitalCommune', SoinsMedicauxHopitalCommune)
        setValue('ListeConseqAccident', ListeConseqAccident)
        setValue('dateRepriseEffective', dateRepriseEffective)
        setValue('JourIncaCompl', JourIncaCompl)
        setValue('ListeMesureRepetition', ListeMesureRepetition)
        setValue('CodeRisqueEntreprise', CodeRisqueEntreprise)
        setValue('ListeVictimeOnss', ListeVictimeOnss)
        setValue('victimeOnssNon', victimeOnssNon)
        setValue('codeTravailleurSocial', codeTravailleurSocial)
        setValue('ListeCategoProfess', ListeCategoProfess)
        setValue('CategoProfessAutre', CategoProfessAutre)
        setValue('ListeNonOnss', ListeNonOnss)
        setValue('ListeApprentiFormat', ListeApprentiFormat)
        setValue('CommissionParitaireDénomination', CommissionParitaireDénomination)
        setValue('CommissionParitaireNumn', CommissionParitaireNumn)
        setValue('ListeTypeContrat', ListeTypeContrat)
        setValue('Nbrjoursregime', Nbrjoursregime)
        setValue('NbrHeureSemaine', NbrHeureSemaine)
        setValue('NbrHeureSemaineReference', NbrHeureSemaineReference)
        setValue('ListeVictiPension', ListeVictiPension)
        setValue('ListeModeRemuneration', ListeModeRemuneration)
        setValue('ListeMontantRemuneration', ListeMontantRemuneration)
        setValue('MontantRemunerationVariable', MontantRemunerationVariable)
        setValue('remunerationTotalAssOnns', remunerationTotalAssOnns)
        setValue('ListePrimeFinAnnee', ListePrimeFinAnnee)
        setValue('PrimeFinAnneeRemuAnnuel', PrimeFinAnneeRemuAnnuel)
        setValue('PrimeFinAnneeRemuAnnuelForfetaire', PrimeFinAnneeRemuAnnuelForfetaire)
        setValue('PrimeFinAnneeRemuAnnuelNbrHeure', PrimeFinAnneeRemuAnnuelNbrHeure)
        setValue('AvantegeAssujOnns', AvantegeAssujOnns)
        setValue('AvantegeAssujOnnsNature', AvantegeAssujOnnsNature)
        setValue('ListechangementFonction', ListechangementFonction)
        setValue('dateChangementFonction', dateChangementFonction)
        setValue('heureTravaillePerdu', heureTravaillePerdu)
        setValue('salaireTravaillePerdu', salaireTravaillePerdu)
        setValue('activiteGenerale', activiteGenerale)

    }, [CodeMutuelle,
        adresseRueMutuelle,
        adresseCodepostalMutuelle,
        adresseCommuneMutuelle,
        numAffiliation,
        numCompteBancaire,
        etabliFinancier,
        numDimona,
        ListeDurContra,
        ListeDateSortie,
        dateSortie,
        profesEntreprise,
        ListeDureeDsEntreprise,
        ListeVicInterimaire,
        VicInterimaireOui,
        VicInterimaireOuiNom,
        VicInterimaireOuiAdresse,
        ListeVicTravailExt,
        VicTravailExtOui,
        VicTravailExtOuiNom,
        VicTravailExtOuiAdresse,
        dateNotifEmployeur,
        ListeLieuxAt,
        ListeVoiePublic,
        LieuxAtAdresse,
        LieuxAtCodePostal,
        LieuxAtCommune,
        ListeLieuxAtPays,
        NumdeChantier,
        environementLieux,
        activiteGeneral,
        activiteSpecifique,
        ListeTypedePost,
        ListeProfHabituelle,
        ListeProfHabituelleNon,
        evenementDeviant,
        ListeProcesVerbal,
        ProcesVerbalOui,
        ProcesVerbalOuiRedige,
        dateProcesVerbalOuiRedigeQuand,
        ProcesVerbalOuiPar,
        ListeTierResponsable,
        TierResponsableOui,
        TierResponsableOuiNomAdresse,
        TierResponsableOuiNumPolice,
        ListeTemoins,
        TemoinsOui,
        blessureVictume,
        ListeSoinsMedicaux,
        dateSoinsMedicauxDate,
        SoinsMedicauxDispansateur,
        SoinsMedicauxDescriptions,
        ListeSoinsMedicauxMedecin,
        dateSoinsMedicauxMedecin,
        SoinsMedicauxMedecinInami,
        SoinsMedicauxMedecinNom,
        SoinsMedicauxMedecinRue,
        SoinsMedicauxMedecinCodePostal,
        SoinsMedicauxMedecinCommune,
        ListeSoinsMedicauxHopital,
        dateSoinsMedicauxHopital,
        SoinsMedicauxHopitalInami,
        SoinsMedicauxHopitaldenomi,
        SoinsMedicauxHopitalRue,
        SoinsMedicauxHopitalCodePostal,
        SoinsMedicauxHopitalCommune,
        ListeConseqAccident,
        dateRepriseEffective,
        JourIncaCompl,
        ListeMesureRepetition,
        CodeRisqueEntreprise,
        ListeVictimeOnss,
        victimeOnssNon,
        codeTravailleurSocial,
        ListeCategoProfess,
        CategoProfessAutre,
        ListeNonOnss,
        ListeApprentiFormat,
        CommissionParitaireDénomination,
        CommissionParitaireNumn,
        ListeTypeContrat,
        Nbrjoursregime,
        NbrHeureSemaine,
        NbrHeureSemaineReference,
        ListeVictiPension,
        ListeModeRemuneration,
        ListeMontantRemuneration,
        MontantRemunerationVariable,
        remunerationTotalAssOnns,
        ListePrimeFinAnnee,
        PrimeFinAnneeRemuAnnuel,
        PrimeFinAnneeRemuAnnuelForfetaire,
        PrimeFinAnneeRemuAnnuelNbrHeure,
        AvantegeAssujOnns,
        AvantegeAssujOnnsNature,
        ListechangementFonction,
        dateChangementFonction,
        heureTravaillePerdu,
        salaireTravaillePerdu,
        activiteGenerale,
        setValue
    ]);



    return (
        <div className="infoDeclarationAss">


            <div style={frameStyle}>
                <h5> Informations sur la Mutuelle</h5>
            </div>
            <TextFieldP id="CodeMutuelle" label="Code mutuelle" onChange={setCodeMutuelle} defaultValue={CodeMutuelle} />
            <TextFieldP id="adresseRueMutuelle" label="Rue / numéro / boite" onChange={setadresseRueMutuelle} defaultValue={adresseRueMutuelle} />
            <TextFieldP id="adresseCodepostalMutuelle" label="Code postal" onChange={setadresseCodepostalMutuelle} defaultValue={adresseCodepostalMutuelle} />
            <TextFieldP id="adresseCommuneMutuelle" label="Commune" onChange={setadresseCommuneMutuelle} defaultValue={adresseCommuneMutuelle} />
            <TextFieldP id="numAffiliation" label="Numéro d'affiliation" onChange={setnumAffiliation} defaultValue={numAffiliation} />
            <TextFieldP id="numCompteBancaire" label="Numéro de compte bancaire" onChange={setnumCompteBancaire} defaultValue={numCompteBancaire} />
            <TextFieldP id="etabliFinancier" label="Etablissement Financier BIC" onChange={setetabliFinancier} defaultValue={etabliFinancier} />
            <TextFieldP id="numDimona" label="Numéro de la Dimona" onChange={setnumDimona} defaultValue={numDimona} />
            <AutoCompleteP id="ListeDurContra" option={listeDeclarationAss.ListeDurContra} label="Durée du contrat de travail" onChange={(value) => { setListeDurContra(value); setShowListeDurContra(value === 'Déterminée') }} defaultValue={ListeDurContra} />
            {showvingtdeusTextField && (
                <AutoCompleteP id="ListeDateSortie" option={listeDeclarationAss.ListeDateSortie} label="Date de sortie" onChange={(value) => { setListeDateSortie(value); setShowListeDateSortie(value === 'Oui') }} defaultValue={ListeDateSortie} />

            )}

            {showvingtetunTextField && (
                <DatePickerP id="dateSortie" label="Date de sortie" onChange={setdateSortie} defaultValue={dateSortie} />
            )}

            <TextFieldP id="profesEntreprise" label="Profession habituelle dans l’entreprise" onChange={setprofesEntreprise} defaultValue={profesEntreprise} />
            <AutoCompleteP id="ListeDureeDsEntreprise" option={listeDeclarationAss.ListeDureeDsEntreprise} label="Durée d'exercice de cette profession par la victime dans l'entreprise" onChange={setListeDureeDsEntreprise} defaultValue={ListeDureeDsEntreprise} />
            <div>
                <AutoCompleteP id="ListeVicInterimaire" option={listeDeclarationAss.ListeVicInterimaire} label="La victime est-elle un(e) intérimaire" onChange={(value) => { setListeVicInterimaire(value); setShowListeVicInterimaire(value === 'Oui') }} defaultValue={ListeVicInterimaire} />

                {showtroiTextField && (
                    <TextFieldP id="VicInterimaireOui" label="Numéro ONSS de l’entreprise utilisatrice" onChange={setVicInterimaireOui} defaultValue={VicInterimaireOui} />
                )}

                {showtroiTextField && (
                    <TextFieldP id="VicInterimaireOuiNom" label="Nom" onChange={setVicInterimaireOuiNom} defaultValue={VicInterimaireOuiNom} />
                )}

                {showtroiTextField && (
                    <TextFieldP id="VicInterimaireOuiAdresse" label="Adresse" onChange={setVicInterimaireOuiAdresse} defaultValue={VicInterimaireOuiAdresse} />
                )}
            </div>
            <AutoCompleteP id="ListeVicTravailExt" option={listeDeclarationAss.ListeVicTravailExt} label="Au moment de l'accident, la victime travaillait-elle dans l'établissement d'un autre employeur dans le cadre de travaux effectuées par une entreprise extérieure" onChange={(value) => { setListeVicTravailExt(value); setShowListeVicTravailExt(value === 'Oui') }} defaultValue={ListeVicTravailExt} />

            {showquatreTextField && (
                <TextFieldP id="VicTravailExtOui" label="Numéro ONSS de l’entreprise de cet autre employeur" onChange={setVicTravailExtOui} defaultValue={VicTravailExtOui} />
            )}
            {showquatreTextField && (
                <TextFieldP id="VicTravailExtOuiNom" label="Nom" onChange={setVicTravailExtOuiNom} defaultValue={VicTravailExtOuiNom} />
            )}
            {showquatreTextField && (
                <TextFieldP id="VicTravailExtOuiAdresse" label="Adresse" onChange={setVicTravailExtOuiAdresse} defaultValue={VicTravailExtOuiAdresse} />
            )}

            <DatePickerP id="dateNotifEmployeur" label="Date de notification à l’employeur" onChange={setdateNotifEmployeur} defaultValue={dateNotifEmployeur} />

            <AutoCompleteP id="ListeLieuxAt" option={listeDeclarationAss.ListeLieuxAt} label="Lieu de l’accident" onChange={(value) => { setListeLieuxAt(value); setShowListeLieuxAt(value === 'Sur la voie publique') }} defaultValue={ListeLieuxAt} />

            {showsixTextField && (
                <AutoCompleteP id="ListeVoiePublic" option={listeDeclarationAss.ListeVoiePublic} label="Est-ce un accident de la circulation" onChange={(value) => { setListeVoiePublic(value); setShowListeVoiePublic(value === 'Oui') }} defaultValue={ListeVoiePublic} />
            )}

            {showcinqTextField && (
                <TextFieldP id="LieuxAtAdresse" label="Rue/numero/boite" onChange={setLieuxAtAdresse} defaultValue={LieuxAtAdresse} />
            )}

            {showcinqTextField && (
                <TextFieldP id="LieuxAtCodePostal" label="Code postal" onChange={setLieuxAtCodePostal} defaultValue={LieuxAtCodePostal} />
            )}

            {showcinqTextField && (
                <TextFieldP id="LieuxAtCommune" label="Commune" onChange={setLieuxAtCommune} defaultValue={LieuxAtCommune} />
            )}

            {showcinqTextField && (
                <AutoCompleteP id="ListeLieuxAtPays" option={listeDeclarationAss.ListeLieuxAtPays} label="Pays" onChange={setListeLieuxAtPays} defaultValue={ListeLieuxAtPays} />

            )}
            <TextFieldP id="NumdeChantier" label="Numéro du chantier" onChange={setNumdeChantier} defaultValue={NumdeChantier} />


            <div style={frameStyle}>
                <h5> Dans quel environnement ou dans quel type de lieu la victime se trouvait-elle lorsque l’accident s’est produit ? (p.ex. , aire de maintenance, chantier de
                    construction d’un tunnel, lieu d’élevage de bétail, bureau, école, magasin, hôpital, parking, salle de sports, toit d’un hôtel, maison privée, égout, jardin,
                    autoroute, navire à quai, sous l’eau, etc.). </h5>
            </div>
            <TextFieldP id="environementLieux" label="Expliquez" onChange={setenvironementLieux} defaultValue={environementLieux} />


            <div style={frameStyle}>
                <h5> Précisez l’activité général (le type de travail) qu’effectuait la victime ou la tâche (au sens large) qu’elle accomplissait lorsque l’accident s’est produit.
                    (p.ex., transformation de produits, stockage, terrassement, construction ou démolition d’un bâtiment, tâches de type agricole on forestier, tâches avec
                    des animaux, soins, assistance d’une personne ou de plusieurs, formation, travil de bureau, achat, vente, activité artistique, etc. ou les tâches auxiliaires
                    de ces différents travaux comme l’installation, le désassemblage, la maintenance, la réparation, le nettoyage, etc.)  </h5>
            </div>
            <TextFieldP id="activiteGenerale" label="Expliquez" onChange={setactiviteGenerale} defaultValue={activiteGenerale} />

            <div style={frameStyle}>
                <h5> Précisez l’activité spécifique de la victime lorsque l’accident s’est produit : (p.ex. , remplissage de la machine, utilisation d’ outillage à main, conduite d’un
                    moyen de transport, saisie, levage, roulage, portage d’un objet, fermeture d’une boite, montée d’une échelle, marche, prise de position assise, etc.) ET les
                    objets impliqués (p.ex. , outillage, machine, équipement, matériaux, objets, instruments, substances, etc.)</h5>
            </div>
            <TextFieldP id="activiteSpecifique" label="Expliquez" onChange={setactiviteSpecifique} defaultValue={activiteSpecifique} />
            <AutoCompleteP id="ListeTypedePost" option={listeDeclarationAss.ListeTypedePost} label="A quel type de poste de travail la victime se trouvait-elle" onChange={setListeTypedePost} defaultValue={ListeTypedePost} />
            <AutoCompleteP id="ListeProfHabituelle" option={listeDeclarationAss.ListeProfHabituelle} label="Lors de l'accident, la victime exerçait-elle une activité dans le cadre de sa profession habituelle" onChange={(value) => { setListeProfHabituelle(value); setShowListeProfHabituelle(value === 'Non') }} defaultValue={ListeProfHabituelle} />

            {showseptTextField && (
                <TextFieldP id="ListeProfHabituelleNon" label="Si non, quelle activité exerçait-elle" onChange={setListeProfHabituelleNon} defaultValue={ListeProfHabituelleNon} />
            )}
            <div style={frameStyle}>
                <h5> Quels événements déviant par rapport au processus normal du travail ont provoqué l’accident ? (p.ex. , problème électrique, explosion, feu, déborde-
                    ment, renversement, écoulement, émission de gaz, rupture, chute ou effondrement d’objet, démarrage ou fonctionnement anormal d’une machine, perte
                    de contrôle d’un moyen de transport ou d’un objet, glissade ou chute de personne, action inopportune, faux mouvement, surprise, frayeur, violence,
                    agression, etc.). Précisez tous ces faits ET les objets impliqués s’ils ont joué un rôle dans leur survenue (p.ex. , outillage, machine, équipement, matéri-
                    aux, objets, instruments, substances, etc.) </h5>
            </div>
            <TextFieldP id="evenementDeviant" label="Expliquez" onChange={setevenementDeviant} defaultValue={evenementDeviant} />

            <AutoCompleteP id="ListeProcesVerbal" option={listeDeclarationAss.ListeProcesVerbal} label="Un procès-verbal a-t-il été dressé" onChange={(value) => { setListeProcesVerbal(value); setShowListeProcesVerbal(value === 'Oui') }} defaultValue={ListeProcesVerbal} />

            {showhuitTextField && (
                <TextFieldP id="ProcesVerbalOui" label="Le procès-verbal porte le numéro d’identification" onChange={setProcesVerbalOui} defaultValue={ProcesVerbalOui} />
            )}

            {showhuitTextField && (
                <TextFieldP id="ProcesVerbalOuiRedige" label="Il a été rédigé à" onChange={setProcesVerbalOuiRedige} defaultValue={ProcesVerbalOuiRedige} />
            )}

            {showhuitTextField && (
                <DatePickerP id="dateProcesVerbalOuiRedigeQuand" label="Date de rédaction du PV" onChange={setdateProcesVerbalOuiRedigeQuand} defaultValue={dateProcesVerbalOuiRedigeQuand} />

            )}

            {showhuitTextField && (
                <TextFieldP id="ProcesVerbalOuiPar" label="Il a été rédigé par" onChange={setProcesVerbalOuiPar} defaultValue={ProcesVerbalOuiPar} />
            )}

            <AutoCompleteP id="ListeTierResponsable" option={listeDeclarationAss.ListeTierResponsable} label="Un tiers peut-il être rendu responsable de l’accident" onChange={(value) => { setListeTierResponsable(value); setShowListeTierResponsable(value === 'Oui') }} defaultValue={ListeTierResponsable} />

            {showneufTextField && (
                <TextFieldP id="TierResponsableOui" label="Nom et adresse" onChange={setTierResponsableOui} defaultValue={TierResponsableOui} />
            )}

            {showneufTextField && (
                <TextFieldP id="TierResponsableOuiNomAdresse" label="Nom et adresse de l’assureur" onChange={setTierResponsableOuiNomAdresse} defaultValue={TierResponsableOuiNomAdresse} />
            )}

            {showneufTextField && (
                <TextFieldP id="TierResponsableOuiNumPolice" label="Numéro de police" onChange={setTierResponsableOuiNumPolice} defaultValue={TierResponsableOuiNumPolice} />
            )}

            <AutoCompleteP id="ListeTemoins" option={listeDeclarationAss.ListeTemoins} label="Y a-t-il eu des témoins" onChange={(value) => { setListeTemoins(value); setShowListeTemoins(value === 'Oui') }} defaultValue={ListeTemoins} />

            {showdixTextField && (
                <TextFieldP id="TemoinsOui" label="Nom - rue/n°/boite - Code postal - Commune" onChange={setTemoinsOui} defaultValue={TemoinsOui} />
            )}
            <div style={frameStyle}>
                <h5> Comment la victime a-t-elle été blessée (lésion physique au psychique) ? Précisez chaque fois par ordre d’importance tous les différents contacts qui ont
                    provoqué la (les) blessure(s) (p. ex. , contact avec un courant électrique, avec une source de chaleur ou des substances dangereuses, noyade, ensevelis-
                    sement, enveloppement par quelque chose (gaz, liquide, solide), écrasement contre un objet ou heurt par un objet, collision, contact avec un objet coupant
                    ou pointu, coincement ou écrasement par un objet, problèmes d’appareil locomoteur, choc mental, blessure causée par un animal ou par une personne,
                    etc.) ET les objets impliqués (p. ex. , outillage, machine, équipement, matériaux, objets, instruments, substances, etc.). </h5>
            </div>
            <TextFieldP id="blessureVictume" label="Expliquez" onChange={setblessureVictume} defaultValue={blessureVictume} />
            <AutoCompleteP id="ListeSoinsMedicaux" option={listeDeclarationAss.ListeSoinsMedicaux} label="Des soins médicaux ont-ils été dispensés chez l’employeur" onChange={(value) => { setListeSoinsMedicaux(value); setShowListeSoinsMedicaux(value === 'Oui') }} defaultValue={ListeSoinsMedicaux} />

            {showonzeTextField && (
                <DatePickerP id="dateSoinsMedicauxDate" label="Date et heure" onChange={setdateSoinsMedicauxDate} defaultValue={dateSoinsMedicauxDate} />
            )}

            {showonzeTextField && (
                <TextFieldP id="SoinsMedicauxDispansateur" label="Qualité du dispensateur" onChange={setSoinsMedicauxDispansateur} defaultValue={SoinsMedicauxDispansateur} />
            )}

            {showonzeTextField && (
                <TextFieldP id="SoinsMedicauxDescriptions" label="Description des soins dispensés" onChange={setSoinsMedicauxDescriptions} defaultValue={SoinsMedicauxDescriptions} />
            )}

            <AutoCompleteP id="ListeSoinsMedicauxMedecin" option={listeDeclarationAss.ListeSoinsMedicauxMedecin} label="Des soins médicaux ont-ils été dispensés par un médecin externe" onChange={(value) => { setListeSoinsMedicauxMedecin(value); setShowListeSoinsMedicauxMedecin(value === 'Oui') }} defaultValue={ListeSoinsMedicauxMedecin} />

            {showdouzeTextField && (
                <DatePickerP id="dateSoinsMedicauxMedecin" label="Date et heure" onChange={setdateSoinsMedicauxMedecin} defaultValue={dateSoinsMedicauxMedecin} />
            )}

            {showdouzeTextField && (
                <TextFieldP id="SoinsMedicauxMedecinInami" label="Numéro d’identification du médecin externe à l’INAMI" onChange={setSoinsMedicauxMedecinInami} defaultValue={SoinsMedicauxMedecinInami} />
            )}

            {showdouzeTextField && (
                <TextFieldP id="SoinsMedicauxMedecinNom" label="Nom et prénom du médecin externe" onChange={setSoinsMedicauxMedecinNom} defaultValue={SoinsMedicauxMedecinNom} />
            )}

            {showdouzeTextField && (
                <TextFieldP id="SoinsMedicauxMedecinRue" label="Rue / n° / boite" onChange={setSoinsMedicauxMedecinRue} defaultValue={SoinsMedicauxMedecinRue} />
            )}

            {showdouzeTextField && (
                <TextFieldP id="SoinsMedicauxMedecinCodePostal" label="Code postal" onChange={setSoinsMedicauxMedecinCodePostal} defaultValue={SoinsMedicauxMedecinCodePostal} />
            )}

            {showdouzeTextField && (
                <TextFieldP id="SoinsMedicauxMedecinCommune" label="Commune" onChange={setSoinsMedicauxMedecinCommune} defaultValue={SoinsMedicauxMedecinCommune} />
            )}

            <AutoCompleteP id="ListeSoinsMedicauxHopital" option={listeDeclarationAss.ListeSoinsMedicauxHopital} label="Des soins médicaux ont-ils été dispensés à l’hôpital" onChange={(value) => { setListeSoinsMedicauxHopital(value); setShowListeSoinsMedicauxHopital(value === 'Oui') }} defaultValue={ListeSoinsMedicauxHopital} />

            {showtreizeTextField && (
                <DatePickerP id="dateSoinsMedicauxHopital" label="Date et heure" onChange={setdateSoinsMedicauxHopital} defaultValue={dateSoinsMedicauxHopital} />
            )}

            {showtreizeTextField && (
                <TextFieldP id="SoinsMedicauxHopitalInami" label="Numéro d’identification de l’hôpital à l’INAMI" onChange={setSoinsMedicauxHopitalInami} defaultValue={SoinsMedicauxHopitalInami} />
            )}

            {showtreizeTextField && (
                <TextFieldP id="SoinsMedicauxHopitaldenomi" label="Dénomination de I*hôpital" onChange={setSoinsMedicauxHopitaldenomi} defaultValue={SoinsMedicauxHopitaldenomi} />
            )}

            {showtreizeTextField && (
                <TextFieldP id="SoinsMedicauxHopitalRue" label="Rue / n° / boite" onChange={setSoinsMedicauxHopitalRue} defaultValue={SoinsMedicauxHopitalRue} />
            )}

            {showtreizeTextField && (
                <TextFieldP id="SoinsMedicauxHopitalCodePostal" label="Code postal" onChange={setSoinsMedicauxHopitalCodePostal} defaultValue={SoinsMedicauxHopitalCodePostal} />
            )}

            {showtreizeTextField && (
                <TextFieldP id="SoinsMedicauxHopitalCommune" label="Commune" onChange={setSoinsMedicauxHopitalCommune} defaultValue={SoinsMedicauxHopitalCommune} />
            )}
            <AutoCompleteP id="ListeConseqAccident" option={listeDeclarationAss.ListeConseqAccident} label="Conséquences de l’accident" onChange={setListeConseqAccident} defaultValue={ListeConseqAccident} />
            <DatePickerP id="dateRepriseEffective" label="Date de reprise effective du travail habituel/au poste d’origine" onChange={setdateRepriseEffective} defaultValue={dateRepriseEffective} />

            <div style={frameStyle}>
                <h5>  S'il n'y a pas encore eu de reprise complète du travail habituel/au poste d’origine durée probable de l'incapacité temporaire
                    totale ou partielle de travail </h5>
            </div>
            <TextFieldP id="JourIncaCompl" label="Jours" onChange={setJourIncaCompl} defaultValue={JourIncaCompl} />

            <AutoCompleteP id="ListeMesureRepetition" option={listeDeclarationAss.ListeMesureRepetition} label="Mesures de prévention prises pour éviter la répétition d’un tel accident" onChange={setListeMesureRepetition} defaultValue={ListeMesureRepetition} />
            <TextFieldP id="CodeRisqueEntreprise" label="Codes risques propres à l’entreprise" onChange={setCodeRisqueEntreprise} defaultValue={CodeRisqueEntreprise} />
            <AutoCompleteP id="ListeVictimeOnss" option={listeDeclarationAss.ListeVictimeOnss} label="La victime est-elle affiliée à l’ONSS" onChange={(value) => { setListeVictimeOnss(value); setShowListeVictimeOnss(value === 'Non') }} defaultValue={ListeVictimeOnss} />

            {showquatorzeTextField && (
                <TextFieldP id="victimeOnssNon" label="Si non, donnée le motif" onChange={setvictimeOnssNon} defaultValue={victimeOnssNon} />
            )}
            <TextFieldP id="codeTravailleurSocial" label="Code du travailleur de l'assurance sociale" onChange={(value) => { setcodeTravailleurSocial(value); setShowcodeTravailleurSocial(value === '') }} defaultValue={codeTravailleurSocial} />
            {/*textFieldchangePerso("codeTravailleurSocial", "Code du travailleur de l'assurance sociale", handloutlinedmultilinecodeTravailleurSocial)*/}

            {showquinzeTextField && (

                <AutoCompleteP id="ListeCategoProfess" option={listeDeclarationAss.ListeCategoProfess} label="S'il n'est pas connu, mentionnez la catégorie professionnelle" onChange={(value) => { setListeCategoProfess(value); setShowListeCategoProfess(value === 'Autre (à préciser)') }} defaultValue={ListeCategoProfess} />

            )}

            {showvingtTextField && (
                <TextFieldP id="CategoProfessAutre" label="Si autre, preciser" onChange={setCategoProfessAutre} defaultValue={CategoProfessAutre} />
            )}

            <AutoCompleteP id="ListeNonOnss" option={listeDeclarationAss.ListeNonOnss} label="Si « apprenti/stagiaire non assujetti à l’ONSS », type de stage ou de formation" onChange={(value) => { setListeNonOnss(value); setShowListeNonOnss(value === 'F1') }} defaultValue={ListeNonOnss} />

            {showSeizeTextField && (
                <AutoCompleteP id="ListeApprentiFormat" option={listeDeclarationAss.ListeApprentiFormat} label="S’agit-il d’un apprenti en formation pour devenir chef d’entreprise" onChange={(value) => { setListeApprentiFormat(value); setShowListeApprentiFormat(value === 'Non') }} defaultValue={ListeApprentiFormat} />

            )}

            {/*{showSeizeTextField && showdixseptTextField && (

                <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <TextField
                        id="CommissionParitaire"
                        onChange={(e) => setValue('CommissionParitaire', e.target.value)}
                        label="Commission paritaire"
                        sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                        multiline
                    />
                </div>

            )}*/}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="CommissionParitaireDénomination" label="Commission paritaire Denomination" onChange={setCommissionParitaireDénomination} defaultValue={CommissionParitaireDénomination} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="CommissionParitaireNumn" label="Commission paritaire Numéro" onChange={setCommissionParitaireNumn} defaultValue={CommissionParitaireNumn} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <AutoCompleteP id="ListeTypeContrat" option={listeDeclarationAss.ListeTypeContrat} label="Type de contrat de travail" onChange={setListeTypeContrat} defaultValue={ListeTypeContrat} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="Nbrjoursregime" label="Nombre de jours par semaine du régime de travail" onChange={setNbrjoursregime} defaultValue={Nbrjoursregime} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="NbrHeureSemaine" label="Nombre moyen d’heures par semaine la victime" onChange={setNbrHeureSemaine} defaultValue={NbrHeureSemaine} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="NbrHeureSemaineReference" label="Nombre moyen d’heures par semaine la personne de sélection" onChange={setNbrHeureSemaineReference} defaultValue={NbrHeureSemaineReference} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <AutoCompleteP id="ListeVictiPension" option={listeDeclarationAss.ListeVictiPension} label="La victime est-elle une personne pensionnée exerçant encore une activité professionnelle" onChange={setListeVictiPension} defaultValue={ListeVictiPension} />
            )}

            {showSeizeTextField && showdixseptTextField && (

                <AutoCompleteP id="ListeModeRemuneration" option={listeDeclarationAss.ListeModeRemuneration} label="Mode de rémunération" onChange={(value) => { setListeModeRemuneration(value); setShowListeModeRemuneration(value === 'Rémunération fixe') }} defaultValue={ListeModeRemuneration} />

            )}

            {showSeizeTextField && showdixseptTextField && showdixhuitTextField && (
                <div>
                    <AutoCompleteP id="ListeMontantRemuneration" option={listeDeclarationAss.ListeMontantRemuneration} label="Unité de temps" onChange={setListeMontantRemuneration} defaultValue={ListeMontantRemuneration} />
                    <TextFieldP id="MontantRemunerationVariable" label="En cas de rémunération variable, cycle correspondant à l’unité de temps déclarée" onChange={setMontantRemunerationVariable} defaultValue={MontantRemunerationVariable} />

                    <div style={frameStyle}>
                        <h5>total des rémunérations et des avantages assujettis à l’ONSS, sans heures supplémentaires, pécule de vacances complémentaire et prime de find’année
                            (le montant déclaré doit correspondre à l’unité de temps ou à l’unité de temps et au cycle)</h5>
                    </div>
                    <TextFieldP id="remunerationTotalAssOnns" label="Rémunérations" onChange={setremunerationTotalAssOnns} defaultValue={remunerationTotalAssOnns} />
                    <AutoCompleteP id="ListePrimeFinAnnee" option={listeDeclarationAss.ListePrimeFinAnnee} label="Prime de fin d’'état" onChange={setListePrimeFinAnnee} defaultValue={ListePrimeFinAnnee} />
                    <TextFieldP id="PrimeFinAnneeRemuAnnuel" label="Si oui, % de la rémuneration annuelle" onChange={setPrimeFinAnneeRemuAnnuel} defaultValue={PrimeFinAnneeRemuAnnuel} />
                    <TextFieldP id="PrimeFinAnneeRemuAnnuelForfetaire" label="Si oui, montant forfaitaire de €" onChange={setPrimeFinAnneeRemuAnnuelForfetaire} defaultValue={PrimeFinAnneeRemuAnnuelForfetaire} />
                    <TextFieldP id="PrimeFinAnneeRemuAnnuelNbrHeure" label="Si oui, émuniration d’un nombre d’heures" onChange={setPrimeFinAnneeRemuAnnuelNbrHeure} defaultValue={PrimeFinAnneeRemuAnnuelNbrHeure} />

                </div>
            )}

            {showSeizeTextField && showdixseptTextField && (
                <h3>Questions 63</h3>
            )}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="AvantegeAssujOnns" label="Autres avantages assujettis ou non à l’ONSS (exprimés sur base annuelle)" onChange={setAvantegeAssujOnns} defaultValue={AvantegeAssujOnns} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <TextFieldP id="AvantegeAssujOnnsNature" label="Nature des avantages" onChange={setAvantegeAssujOnnsNature} defaultValue={AvantegeAssujOnnsNature} />
            )}

            {showSeizeTextField && showdixseptTextField && (
                <AutoCompleteP id="ListechangementFonction" option={listeDeclarationAss.ListechangementFonction} label="Durée du contrat de travail" onChange={(value) => { setListechangementFonction(value); setShowListechangementFonction(value === 'Oui') }} defaultValue={ListechangementFonction} />

            )}

            {showSeizeTextField && showdixseptTextField && showdixneufTextField && (
                <DatePickerP id="dateChangementFonction" label="Si oui, date du dernier changement de fonction" onChange={setdateChangementFonction} defaultValue={dateChangementFonction} />
            )}

            <h3>Questions 65</h3>
            <TextFieldP id="heureTravaillePerdu" label="Nombre d’heures de travail perdues le jour de l’accident" onChange={setheureTravaillePerdu} defaultValue={heureTravaillePerdu} />
            <TextFieldP id="salaireTravaillePerdu" label="Perte salariale pour les heures de travail perdues" onChange={setsalaireTravaillePerdu} defaultValue={salaireTravaillePerdu} />


        </div>
    );
}
