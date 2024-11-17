import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');
import listeDeclarationAss from '../liste/listeDeclarationAssBelfius.json';
import AutoCompleteP from '../_composants/autoCompleteP';
import TextFieldP from '../_composants/textFieldP';
import DatePickerP from '../_composants/datePickerP';
import DateHeurePickerP from '../_composants/dateHeurePickerP';
import TextFieldMaskP from '../_composants/textFieldMaskP';
import { useTheme } from '../pageAdmin/user/ThemeContext';

export default function FormulaireDeclarationASSBelfius({ setValue, accidentData, watch }) {
    const { darkMode } = useTheme();
    // Mise en forme des cadres texte
    const [frameWidth, setFrameWidth] = useState(window.innerWidth * -0.5);
    useEffect(() => {
        /**
         * Function that handles the resizing of the window
         */
        const handleResize = () => {
            setFrameWidth(window.innerWidth * -0.5); // Adjust the coefficient as needed
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    /**
    * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
    * 
    */
    const [ListeVicTravailExt, setListeVicTravailExt] = useState(watch('ListeVicTravailExt') ? watch('ListeVicTravailExt') : (accidentData && accidentData.ListeVicTravailExt ? accidentData.ListeVicTravailExt : null));
    const [VicTravailExtOui, setVicTravailExtOui] = useState(watch('VicTravailExtOui') ? watch('VicTravailExtOui') : (accidentData && accidentData.VicTravailExtOui ? accidentData.VicTravailExtOui : null));
    const [VicTravailExtOuiNom, setVicTravailExtOuiNom] = useState(watch('VicTravailExtOuiNom') ? watch('VicTravailExtOuiNom') : (accidentData && accidentData.VicTravailExtOuiNom ? accidentData.VicTravailExtOuiNom : null));
    const [VicTravailExtOuiAdresse, setVicTravailExtOuiAdresse] = useState(watch('VicTravailExtOuiAdresse') ? watch('VicTravailExtOuiAdresse') : (accidentData && accidentData.VicTravailExtOuiAdresse ? accidentData.VicTravailExtOuiAdresse : null));
    const [dateNotifEmployeur, setdateNotifEmployeur] = useState(watch('dateNotifEmployeur') ? watch('dateNotifEmployeur') : (accidentData && accidentData.dateNotifEmployeur ? accidentData.dateNotifEmployeur : null));
    const [ListeLieuxAt, setListeLieuxAt] = useState(watch('ListeLieuxAt') ? watch('ListeLieuxAt') : (accidentData && accidentData.ListeLieuxAt ? accidentData.ListeLieuxAt : null));
    const [ListeVoiePublic, setListeVoiePublic] = useState(watch('ListeVoiePublic') ? watch('ListeVoiePublic') : (accidentData && accidentData.ListeVoiePublic ? accidentData.ListeVoiePublic : null));
    const [LieuxAtAdresse, setLieuxAtAdresse] = useState(watch('LieuxAtAdresse') ? watch('LieuxAtAdresse') : (accidentData && accidentData.LieuxAtAdresse ? accidentData.LieuxAtAdresse : null));
    const [LieuxAtCodePostal, setLieuxAtCodePostal] = useState(watch('LieuxAtCodePostal') ? watch('LieuxAtCodePostal') : (accidentData && accidentData.LieuxAtCodePostal ? accidentData.LieuxAtCodePostal : null));
    const [LieuxAtCommune, setLieuxAtCommune] = useState(watch('LieuxAtCommune') ? watch('LieuxAtCommune') : (accidentData && accidentData.LieuxAtCommune ? accidentData.LieuxAtCommune : null));
    const [ListeLieuxAtPays, setListeLieuxAtPays] = useState(watch('ListeLieuxAtPays') ? watch('ListeLieuxAtPays') : (accidentData && accidentData.ListeLieuxAtPays ? accidentData.ListeLieuxAtPays : null));
    const [NumdeChantier, setNumdeChantier] = useState(watch('NumdeChantier') ? watch('NumdeChantier') : (accidentData && accidentData.NumdeChantier ? accidentData.NumdeChantier : null));
    const [environementLieux, setenvironementLieux] = useState(watch('environementLieux') ? watch('environementLieux') : (accidentData && accidentData.environementLieux ? accidentData.environementLieux : null));
    const [activiteSpecifique, setactiviteSpecifique] = useState(watch('activiteSpecifique') ? watch('activiteSpecifique') : (accidentData && accidentData.activiteSpecifique ? accidentData.activiteSpecifique : null));
    const [ListeTypedePost, setListeTypedePost] = useState(watch('ListeTypedePost') ? watch('ListeTypedePost') : (accidentData && accidentData.ListeTypedePost ? accidentData.ListeTypedePost : null));
    const [ListeProfHabituelle, setListeProfHabituelle] = useState(watch('ListeProfHabituelle') ? watch('ListeProfHabituelle') : (accidentData && accidentData.ListeProfHabituelle ? accidentData.ListeProfHabituelle : null));
    const [ListeProfHabituelleNon, setListeProfHabituelleNon] = useState(watch('ListeProfHabituelleNon') ? watch('ListeProfHabituelleNon') : (accidentData && accidentData.ListeProfHabituelleNon ? accidentData.ListeProfHabituelleNon : null));
    const [evenementDeviant, setevenementDeviant] = useState(watch('evenementDeviant') ? watch('evenementDeviant') : (accidentData && accidentData.evenementDeviant ? accidentData.evenementDeviant : null));
    const [ListeProcesVerbal, setListeProcesVerbal] = useState(watch('ListeProcesVerbal') ? watch('ListeProcesVerbal') : (accidentData && accidentData.ListeProcesVerbal ? accidentData.ListeProcesVerbal : null));
    const [ProcesVerbalOui, setProcesVerbalOui] = useState(watch('ProcesVerbalOui') ? watch('ProcesVerbalOui') : (accidentData && accidentData.ProcesVerbalOui ? accidentData.ProcesVerbalOui : null));
    const [ProcesVerbalOuiRedige, setProcesVerbalOuiRedige] = useState(watch('ProcesVerbalOuiRedige') ? watch('ProcesVerbalOuiRedige') : (accidentData && accidentData.ProcesVerbalOuiRedige ? accidentData.ProcesVerbalOuiRedige : null));
    const [dateProcesVerbalOuiRedigeQuand, setdateProcesVerbalOuiRedigeQuand] = useState(watch('dateProcesVerbalOuiRedigeQuand') ? watch('dateProcesVerbalOuiRedigeQuand') : (accidentData && accidentData.dateProcesVerbalOuiRedigeQuand ? accidentData.dateProcesVerbalOuiRedigeQuand : null));
    const [ProcesVerbalOuiPar, setProcesVerbalOuiPar] = useState(watch('ProcesVerbalOuiPar') ? watch('ProcesVerbalOuiPar') : (accidentData && accidentData.ProcesVerbalOuiPar ? accidentData.ProcesVerbalOuiPar : null));
    const [ListeTierResponsable, setListeTierResponsable] = useState(watch('ListeTierResponsable') ? watch('ListeTierResponsable') : (accidentData && accidentData.ListeTierResponsable ? accidentData.ListeTierResponsable : null));
    const [TierResponsableOui, setTierResponsableOui] = useState(watch('TierResponsableOui') ? watch('TierResponsableOui') : (accidentData && accidentData.TierResponsableOui ? accidentData.TierResponsableOui : null));
    const [TierResponsableOuiNomAdresse, setTierResponsableOuiNomAdresse] = useState(watch('TierResponsableOuiNomAdresse') ? watch('TierResponsableOuiNomAdresse') : (accidentData && accidentData.TierResponsableOuiNomAdresse ? accidentData.TierResponsableOuiNomAdresse : null));
    const [TierResponsableOuiNumPolice, setTierResponsableOuiNumPolice] = useState(watch('TierResponsableOuiNumPolice') ? watch('TierResponsableOuiNumPolice') : (accidentData && accidentData.TierResponsableOuiNumPolice ? accidentData.TierResponsableOuiNumPolice : null));
    const [ListeTemoins, setListeTemoins] = useState(watch('ListeTemoins') ? watch('ListeTemoins') : (accidentData && accidentData.ListeTemoins ? accidentData.ListeTemoins : null));
    const [TemoinsOui, setTemoinsOui] = useState(watch('TemoinsOui') ? watch('TemoinsOui') : (accidentData && accidentData.TemoinsOui ? accidentData.TemoinsOui : null));
    const [TemoinDirecte, setTemoinDirecte] = useState(watch('TemoinDirecte') ? watch('TemoinDirecte') : (accidentData && accidentData.TemoinDirecte ? accidentData.TemoinDirecte : null));
    const [blessureVictume, setblessureVictume] = useState(watch('blessureVictume') ? watch('blessureVictume') : (accidentData && accidentData.blessureVictume ? accidentData.blessureVictume : null));
    const [ListeSoinsMedicaux, setListeSoinsMedicaux] = useState(watch('ListeSoinsMedicaux') ? watch('ListeSoinsMedicaux') : (accidentData && accidentData.ListeSoinsMedicaux ? accidentData.ListeSoinsMedicaux : null));
    const [dateSoinsMedicauxDate, setdateSoinsMedicauxDate] = useState(watch('dateSoinsMedicauxDate') ? watch('dateSoinsMedicauxDate') : (accidentData && accidentData.dateSoinsMedicauxDate ? accidentData.dateSoinsMedicauxDate : null));
    const [SoinsMedicauxDispansateur, setSoinsMedicauxDispansateur] = useState(watch('SoinsMedicauxDispansateur') ? watch('SoinsMedicauxDispansateur') : (accidentData && accidentData.SoinsMedicauxDispansateur ? accidentData.SoinsMedicauxDispansateur : null));
    const [SoinsMedicauxDescriptions, setSoinsMedicauxDescriptions] = useState(watch('SoinsMedicauxDescriptions') ? watch('SoinsMedicauxDescriptions') : (accidentData && accidentData.SoinsMedicauxDescriptions ? accidentData.SoinsMedicauxDescriptions : null));
    const [ListeSoinsMedicauxMedecin, setListeSoinsMedicauxMedecin] = useState(watch('ListeSoinsMedicauxMedecin') ? watch('ListeSoinsMedicauxMedecin') : (accidentData && accidentData.ListeSoinsMedicauxMedecin ? accidentData.ListeSoinsMedicauxMedecin : null));
    const [dateSoinsMedicauxMedecin, setdateSoinsMedicauxMedecin] = useState(watch('dateSoinsMedicauxMedecin') ? watch('dateSoinsMedicauxMedecin') : (accidentData && accidentData.dateSoinsMedicauxMedecin ? accidentData.dateSoinsMedicauxMedecin : null));
    const [SoinsMedicauxMedecinInami, setSoinsMedicauxMedecinInami] = useState(watch('SoinsMedicauxMedecinInami') ? watch('SoinsMedicauxMedecinInami') : (accidentData && accidentData.SoinsMedicauxMedecinInami ? accidentData.SoinsMedicauxMedecinInami : null));
    const [SoinsMedicauxMedecinNom, setSoinsMedicauxMedecinNom] = useState(watch('SoinsMedicauxMedecinNom') ? watch('SoinsMedicauxMedecinNom') : (accidentData && accidentData.SoinsMedicauxMedecinNom ? accidentData.SoinsMedicauxMedecinNom : null));
    const [SoinsMedicauxMedecinRue, setSoinsMedicauxMedecinRue] = useState(watch('SoinsMedicauxMedecinRue') ? watch('SoinsMedicauxMedecinRue') : (accidentData && accidentData.SoinsMedicauxMedecinRue ? accidentData.SoinsMedicauxMedecinRue : null));
    const [SoinsMedicauxMedecinCodePostal, setSoinsMedicauxMedecinCodePostal] = useState(watch('SoinsMedicauxMedecinCodePostal') ? watch('SoinsMedicauxMedecinCodePostal') : (accidentData && accidentData.SoinsMedicauxMedecinCodePostal ? accidentData.SoinsMedicauxMedecinCodePostal : null));
    const [SoinsMedicauxMedecinCommune, setSoinsMedicauxMedecinCommune] = useState(watch('SoinsMedicauxMedecinCommune') ? watch('SoinsMedicauxMedecinCommune') : (accidentData && accidentData.SoinsMedicauxMedecinCommune ? accidentData.SoinsMedicauxMedecinCommune : null));
    const [ListeSoinsMedicauxHopital, setListeSoinsMedicauxHopital] = useState(watch('ListeSoinsMedicauxHopital') ? watch('ListeSoinsMedicauxHopital') : (accidentData && accidentData.ListeSoinsMedicauxHopital ? accidentData.ListeSoinsMedicauxHopital : null));
    const [dateSoinsMedicauxHopital, setdateSoinsMedicauxHopital] = useState(watch('dateSoinsMedicauxHopital') ? watch('dateSoinsMedicauxHopital') : (accidentData && accidentData.dateSoinsMedicauxHopital ? accidentData.dateSoinsMedicauxHopital : null));
    const [SoinsMedicauxHopitalInami, setSoinsMedicauxHopitalInami] = useState(watch('SoinsMedicauxHopitalInami') ? watch('SoinsMedicauxHopitalInami') : (accidentData && accidentData.SoinsMedicauxHopitalInami ? accidentData.SoinsMedicauxHopitalInami : null));
    const [SoinsMedicauxHopitaldenomi, setSoinsMedicauxHopitaldenomi] = useState(watch('SoinsMedicauxHopitaldenomi') ? watch('SoinsMedicauxHopitaldenomi') : (accidentData && accidentData.SoinsMedicauxHopitaldenomi ? accidentData.SoinsMedicauxHopitaldenomi : null));
    const [SoinsMedicauxHopitalRue, setSoinsMedicauxHopitalRue] = useState(watch('SoinsMedicauxHopitalRue') ? watch('SoinsMedicauxHopitalRue') : (accidentData && accidentData.SoinsMedicauxHopitalRue ? accidentData.SoinsMedicauxHopitalRue : null));
    const [SoinsMedicauxHopitalCodePostal, setSoinsMedicauxHopitalCodePostal] = useState(watch('SoinsMedicauxHopitalCodePostal') ? watch('SoinsMedicauxHopitalCodePostal') : (accidentData && accidentData.SoinsMedicauxHopitalCodePostal ? accidentData.SoinsMedicauxHopitalCodePostal : null));
    const [SoinsMedicauxHopitalCommune, setSoinsMedicauxHopitalCommune] = useState(watch('SoinsMedicauxHopitalCommune') ? watch('SoinsMedicauxHopitalCommune') : (accidentData && accidentData.SoinsMedicauxHopitalCommune ? accidentData.SoinsMedicauxHopitalCommune : null));
    const [ListeConseqAccident, setListeConseqAccident] = useState(watch('ListeConseqAccident') ? watch('ListeConseqAccident') : (accidentData && accidentData.ListeConseqAccident ? accidentData.ListeConseqAccident : null));
    const [dateRepriseEffective, setdateRepriseEffective] = useState(watch('dateRepriseEffective') ? watch('dateRepriseEffective') : (accidentData && accidentData.dateRepriseEffective ? accidentData.dateRepriseEffective : null));
    const [JourIncaCompl, setJourIncaCompl] = useState(watch('JourIncaCompl') ? watch('JourIncaCompl') : (accidentData && accidentData.JourIncaCompl ? accidentData.JourIncaCompl : null));
    const [ListeMesureRepetition, setListeMesureRepetition] = useState(watch('ListeMesureRepetition') ? watch('ListeMesureRepetition') : (accidentData && accidentData.ListeMesureRepetition ? accidentData.ListeMesureRepetition : null));
    const [ListeMesureRepetition2, setListeMesureRepetition2] = useState(watch('ListeMesureRepetition2') ? watch('ListeMesureRepetition2') : (accidentData && accidentData.ListeMesureRepetition2 ? accidentData.ListeMesureRepetition2 : null));
    const [CodeRisqueEntreprise, setCodeRisqueEntreprise] = useState(watch('CodeRisqueEntreprise') ? watch('CodeRisqueEntreprise') : (accidentData && accidentData.CodeRisqueEntreprise ? accidentData.CodeRisqueEntreprise : null));
    const [ListeVictimeOnss, setListeVictimeOnss] = useState(watch('ListeVictimeOnss') ? watch('ListeVictimeOnss') : (accidentData && accidentData.ListeVictimeOnss ? accidentData.ListeVictimeOnss : null));
    const [victimeOnssNon, setvictimeOnssNon] = useState(watch('victimeOnssNon') ? watch('victimeOnssNon') : (accidentData && accidentData.victimeOnssNon ? accidentData.victimeOnssNon : null));
    const [codeTravailleurSocial, setcodeTravailleurSocial] = useState(watch('codeTravailleurSocial') ? watch('codeTravailleurSocial') : (accidentData && accidentData.codeTravailleurSocial ? accidentData.codeTravailleurSocial : null));
    const [ListeCategoProfess, setListeCategoProfess] = useState(watch('ListeCategoProfess') ? watch('ListeCategoProfess') : (accidentData && accidentData.ListeCategoProfess ? accidentData.ListeCategoProfess : null));
    const [CategoProfessAutre, setCategoProfessAutre] = useState(watch('CategoProfessAutre') ? watch('CategoProfessAutre') : (accidentData && accidentData.CategoProfessAutre ? accidentData.CategoProfessAutre : null));
    const [ListeNonOnss, setListeNonOnss] = useState(watch('ListeNonOnss') ? watch('ListeNonOnss') : (accidentData && accidentData.ListeNonOnss ? accidentData.ListeNonOnss : null));
    const [ListeApprentiFormat, setListeApprentiFormat] = useState(watch('ListeApprentiFormat') ? watch('ListeApprentiFormat') : (accidentData && accidentData.ListeApprentiFormat ? accidentData.ListeApprentiFormat : null));
    const [CommissionParitaireDénomination, setCommissionParitaireDénomination] = useState(watch('CommissionParitaireDénomination') ? watch('CommissionParitaireDénomination') : (accidentData && accidentData.CommissionParitaireDénomination ? accidentData.CommissionParitaireDénomination : null));
    const [CommissionParitaireNumn, setCommissionParitaireNumn] = useState(watch('CommissionParitaireNumn') ? watch('CommissionParitaireNumn') : (accidentData && accidentData.CommissionParitaireNumn ? accidentData.CommissionParitaireNumn : null));
    const [ListeTypeContrat, setListeTypeContrat] = useState(watch('ListeTypeContrat') ? watch('ListeTypeContrat') : (accidentData && accidentData.ListeTypeContrat ? accidentData.ListeTypeContrat : null));
    const [Nbrjoursregime, setNbrjoursregime] = useState(watch('Nbrjoursregime') ? watch('Nbrjoursregime') : (accidentData && accidentData.Nbrjoursregime ? accidentData.Nbrjoursregime : null));
    const [NbrHeureSemaine, setNbrHeureSemaine] = useState(watch('NbrHeureSemaine') ? watch('NbrHeureSemaine') : (accidentData && accidentData.NbrHeureSemaine ? accidentData.NbrHeureSemaine : null));
    const [NbrHeureSemaineReference, setNbrHeureSemaineReference] = useState(watch('NbrHeureSemaineReference') ? watch('NbrHeureSemaineReference') : (accidentData && accidentData.NbrHeureSemaineReference ? accidentData.NbrHeureSemaineReference : null));
    const [ListeVictiPension, setListeVictiPension] = useState(watch('ListeVictiPension') ? watch('ListeVictiPension') : (accidentData && accidentData.ListeVictiPension ? accidentData.ListeVictiPension : null));
    const [ListeModeRemuneration, setListeModeRemuneration] = useState(watch('ListeModeRemuneration') ? watch('ListeModeRemuneration') : (accidentData && accidentData.ListeModeRemuneration ? accidentData.ListeModeRemuneration : null));
    const [ListeMontantRemuneration, setListeMontantRemuneration] = useState(watch('ListeMontantRemuneration') ? watch('ListeMontantRemuneration') : (accidentData && accidentData.ListeMontantRemuneration ? accidentData.ListeMontantRemuneration : null));
    const [MontantRemunerationVariable, setMontantRemunerationVariable] = useState(watch('MontantRemunerationVariable') ? watch('MontantRemunerationVariable') : (accidentData && accidentData.MontantRemunerationVariable ? accidentData.MontantRemunerationVariable : null));
    const [remunerationTotalAssOnns, setremunerationTotalAssOnns] = useState(watch('remunerationTotalAssOnns') ? watch('remunerationTotalAssOnns') : (accidentData && accidentData.remunerationTotalAssOnns ? accidentData.remunerationTotalAssOnns : null));
    const [ListePrimeFinAnnee, setListePrimeFinAnnee] = useState(watch('ListePrimeFinAnnee') ? watch('ListePrimeFinAnnee') : (accidentData && accidentData.ListePrimeFinAnnee ? accidentData.ListePrimeFinAnnee : null));
    const [PrimeFinAnneeRemuAnnuel, setPrimeFinAnneeRemuAnnuel] = useState(watch('PrimeFinAnneeRemuAnnuel') ? watch('PrimeFinAnneeRemuAnnuel') : (accidentData && accidentData.PrimeFinAnneeRemuAnnuel ? accidentData.PrimeFinAnneeRemuAnnuel : null));
    const [PrimeFinAnneeRemuAnnuelForfetaire, setPrimeFinAnneeRemuAnnuelForfetaire] = useState(watch('PrimeFinAnneeRemuAnnuelForfetaire') ? watch('PrimeFinAnneeRemuAnnuelForfetaire') : (accidentData && accidentData.PrimeFinAnneeRemuAnnuelForfetaire ? accidentData.PrimeFinAnneeRemuAnnuelForfetaire : null));
    const [PrimeFinAnneeRemuAnnuelNbrHeure, setPrimeFinAnneeRemuAnnuelNbrHeure] = useState(watch('PrimeFinAnneeRemuAnnuelNbrHeure') ? watch('PrimeFinAnneeRemuAnnuelNbrHeure') : (accidentData && accidentData.PrimeFinAnneeRemuAnnuelNbrHeure ? accidentData.PrimeFinAnneeRemuAnnuelNbrHeure : null));
    const [AvantegeAssujOnns, setAvantegeAssujOnns] = useState(watch('AvantegeAssujOnns') ? watch('AvantegeAssujOnns') : (accidentData && accidentData.AvantegeAssujOnns ? accidentData.AvantegeAssujOnns : null));
    const [AvantegeAssujOnnsNature, setAvantegeAssujOnnsNature] = useState(watch('AvantegeAssujOnnsNature') ? watch('AvantegeAssujOnnsNature') : (accidentData && accidentData.AvantegeAssujOnnsNature ? accidentData.AvantegeAssujOnnsNature : null));
    const [ListechangementFonction, setListechangementFonction] = useState(watch('ListechangementFonction') ? watch('ListechangementFonction') : (accidentData && accidentData.ListechangementFonction ? accidentData.ListechangementFonction : null));
    const [dateChangementFonction, setdateChangementFonction] = useState(watch('dateChangementFonction') ? watch('dateChangementFonction') : (accidentData && accidentData.dateChangementFonction ? accidentData.dateChangementFonction : null));
    const [heureTravaillePerdu, setheureTravaillePerdu] = useState(watch('heureTravaillePerdu') ? watch('heureTravaillePerdu') : (accidentData && accidentData.heureTravaillePerdu ? accidentData.heureTravaillePerdu : null));
    const [salaireTravaillePerdu, setsalaireTravaillePerdu] = useState(watch('salaireTravaillePerdu') ? watch('salaireTravaillePerdu') : (accidentData && accidentData.salaireTravaillePerdu ? accidentData.salaireTravaillePerdu : null));
    const [activiteGenerale, setactiviteGenerale] = useState(watch('activiteGenerale') ? watch('activiteGenerale') : (accidentData && accidentData.activiteGenerale ? accidentData.activiteGenerale : null));
    const [dateTravailAddapte, setdateTravailAddapte] = useState(watch('dateTravailAddapte') ? watch('dateTravailAddapte') : (accidentData && accidentData.dateTravailAddapte ? accidentData.dateTravailAddapte : null));
    const [dateIncapaciteTemporaire, setdateIncapaciteTemporaire] = useState(watch('dateIncapaciteTemporaire') ? watch('dateIncapaciteTemporaire') : (accidentData && accidentData.dateIncapaciteTemporaire ? accidentData.dateIncapaciteTemporaire : null));
    const [dateDece, setdateDece] = useState(watch('dateDece') ? watch('dateDece') : (accidentData && accidentData.dateDece ? accidentData.dateDece : null));
    /**
     * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
     */
    useEffect(() => {
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
        setValue('TemoinDirecte', TemoinDirecte)
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
        setValue('ListeMesureRepetition2', ListeMesureRepetition2)
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
        setValue('dateTravailAddapte', dateTravailAddapte)
        setValue('dateIncapaciteTemporaire', dateIncapaciteTemporaire)
        setValue('dateDece', dateDece)
    }, [dateDece, dateIncapaciteTemporaire, dateTravailAddapte, ListeVicTravailExt, VicTravailExtOui, VicTravailExtOuiNom, VicTravailExtOuiAdresse, dateNotifEmployeur, ListeLieuxAt, ListeVoiePublic, LieuxAtAdresse, LieuxAtCodePostal, LieuxAtCommune, ListeLieuxAtPays, NumdeChantier, environementLieux, activiteSpecifique, ListeTypedePost, ListeProfHabituelle, ListeProfHabituelleNon, evenementDeviant, ListeProcesVerbal, ProcesVerbalOui, ProcesVerbalOuiRedige, dateProcesVerbalOuiRedigeQuand, ProcesVerbalOuiPar, ListeTierResponsable, TierResponsableOui, TierResponsableOuiNomAdresse, TierResponsableOuiNumPolice, ListeTemoins, TemoinsOui, TemoinDirecte, blessureVictume, ListeSoinsMedicaux, dateSoinsMedicauxDate, SoinsMedicauxDispansateur, SoinsMedicauxDescriptions, ListeSoinsMedicauxMedecin, dateSoinsMedicauxMedecin, SoinsMedicauxMedecinInami, SoinsMedicauxMedecinNom, SoinsMedicauxMedecinRue, SoinsMedicauxMedecinCodePostal, SoinsMedicauxMedecinCommune, ListeSoinsMedicauxHopital, dateSoinsMedicauxHopital, SoinsMedicauxHopitalInami, SoinsMedicauxHopitaldenomi, SoinsMedicauxHopitalRue, SoinsMedicauxHopitalCodePostal, SoinsMedicauxHopitalCommune, ListeConseqAccident, dateRepriseEffective, JourIncaCompl, ListeMesureRepetition, ListeMesureRepetition2, CodeRisqueEntreprise, ListeVictimeOnss, victimeOnssNon, codeTravailleurSocial, ListeCategoProfess, CategoProfessAutre, ListeNonOnss, ListeApprentiFormat, CommissionParitaireDénomination, CommissionParitaireNumn, ListeTypeContrat, Nbrjoursregime, NbrHeureSemaine, NbrHeureSemaineReference, ListeVictiPension, ListeModeRemuneration, ListeMontantRemuneration, MontantRemunerationVariable, remunerationTotalAssOnns, ListePrimeFinAnnee, PrimeFinAnneeRemuAnnuel, PrimeFinAnneeRemuAnnuelForfetaire, PrimeFinAnneeRemuAnnuelNbrHeure, AvantegeAssujOnns, AvantegeAssujOnnsNature, ListechangementFonction, dateChangementFonction, heureTravaillePerdu, salaireTravaillePerdu, activiteGenerale, setValue]);

    /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
    return (

        <div className="infoDeclarationAss">
            <h2>Infos Déclaration</h2>
            <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Rentrez les informations relative a la déclaration.</h3>

            <AutoCompleteP id="ListeVicTravailExt" option={listeDeclarationAss.ListeVicTravailExt} label="Au moment de l'accident, la victime travaillait-elle dans l'établissement d'un autre employeur dans le cadre de travaux effectuées par une entreprise extérieure" onChange={(value) => { setListeVicTravailExt(value); }} defaultValue={ListeVicTravailExt} />

            {(ListeVicTravailExt === 'Oui') && (
                [<TextFieldP id="VicTravailExtOui" label="Numéro ONSS de l’entreprise de cet autre employeur" onChange={setVicTravailExtOui} defaultValue={VicTravailExtOui} />,
                <TextFieldP id="VicTravailExtOuiNom" label="Nom" onChange={setVicTravailExtOuiNom} defaultValue={VicTravailExtOuiNom} />,
                <TextFieldP id="VicTravailExtOuiAdresse" label="Adresse" onChange={setVicTravailExtOuiAdresse} defaultValue={VicTravailExtOuiAdresse} />]
            )}

            <DateHeurePickerP id="dateNotifEmployeur" label="Date de notification à l’employeur" onChange={setdateNotifEmployeur} defaultValue={dateNotifEmployeur} />
            <AutoCompleteP id="ListeLieuxAt" option={listeDeclarationAss.ListeLieuxAt} label="Lieu de l’accident" onChange={(value) => { setListeLieuxAt(value); }} defaultValue={ListeLieuxAt} />

            {(ListeLieuxAt === 'Sur la voie publique') && (
                <AutoCompleteP id="ListeVoiePublic" option={listeDeclarationAss.ListeVoiePublic} label="Est-ce un accident de la circulation" onChange={(value) => { setListeVoiePublic(value); }} defaultValue={ListeVoiePublic} />
            )}

            {(ListeVoiePublic === 'Oui' || ListeLieuxAt === 'A un autre endroit') && (
                [<TextFieldP id="LieuxAtAdresse" label="Rue/numero/boite" onChange={setLieuxAtAdresse} defaultValue={LieuxAtAdresse} />,
                <TextFieldP id="LieuxAtCodePostal" label="Code postal" onChange={setLieuxAtCodePostal} defaultValue={LieuxAtCodePostal} />,
                <TextFieldP id="LieuxAtCommune" label="Commune" onChange={setLieuxAtCommune} defaultValue={LieuxAtCommune} />,
                <AutoCompleteP id="ListeLieuxAtPays" option={listeDeclarationAss.ListeLieuxAtPays} label="Pays" onChange={setListeLieuxAtPays} defaultValue={ListeLieuxAtPays} />]
            )}

            <TextFieldMaskP id="NumdeChantier" label="Numéro du chantier" onChange={setNumdeChantier} defaultValue={NumdeChantier} mask="00000-00000-00000-00000" />
            <div className="frameStyle-style1">
                <h5> Dans quel environnement ou dans quel type de lieu la victime se trouvait-elle lorsque l’accident s’est produit ? (p.ex. , aire de maintenance, chantier de
                    construction d’un tunnel, lieu d’élevage de bétail, bureau, école, magasin, hôpital, parking, salle de sports, toit d’un hôtel, maison privée, égout, jardin,
                    autoroute, navire à quai, sous l’eau, etc.). </h5>
            </div>
            <TextFieldP id="environementLieux" label="Expliquez" onChange={setenvironementLieux} defaultValue={environementLieux} />
            <div className="frameStyle-style1">
                <h5> Précisez l’activité général (le type de travail) qu’effectuait la victime ou la tâche (au sens large) qu’elle accomplissait lorsque l’accident s’est produit.
                    (p.ex., transformation de produits, stockage, terrassement, construction ou démolition d’un bâtiment, tâches de type agricole on forestier, tâches avec
                    des animaux, soins, assistance d’une personne ou de plusieurs, formation, travil de bureau, achat, vente, activité artistique, etc. ou les tâches auxiliaires
                    de ces différents travaux comme l’installation, le désassemblage, la maintenance, la réparation, le nettoyage, etc.)  </h5>
            </div>
            <TextFieldP id="activiteGenerale" label="Expliquez" onChange={setactiviteGenerale} defaultValue={activiteGenerale} />
            <div className="frameStyle-style1">
                <h5> Précisez l’activité spécifique de la victime lorsque l’accident s’est produit : (p.ex. , remplissage de la machine, utilisation d’ outillage à main, conduite d’un
                    moyen de transport, saisie, levage, roulage, portage d’un objet, fermeture d’une boite, montée d’une échelle, marche, prise de position assise, etc.) ET les
                    objets impliqués (p.ex. , outillage, machine, équipement, matériaux, objets, instruments, substances, etc.)</h5>
            </div>
            <TextFieldP id="activiteSpecifique" label="Expliquez" onChange={setactiviteSpecifique} defaultValue={activiteSpecifique} />
            <AutoCompleteP id="ListeTypedePost" option={listeDeclarationAss.ListeTypedePost} label="A quel type de poste de travail la victime se trouvait-elle" onChange={setListeTypedePost} defaultValue={ListeTypedePost} />
            <AutoCompleteP id="ListeProfHabituelle" option={listeDeclarationAss.ListeProfHabituelle} label="Lors de l'accident, la victime exerçait-elle une activité dans le cadre de sa profession habituelle" onChange={(value) => { setListeProfHabituelle(value); }} defaultValue={ListeProfHabituelle} />

            {(ListeProfHabituelle === 'Non') && (
                <TextFieldP id="ListeProfHabituelleNon" label="Si non, quelle activité exerçait-elle" onChange={setListeProfHabituelleNon} defaultValue={ListeProfHabituelleNon} />
            )}

            <div className="frameStyle-style1">
                <h5> Quels événements déviant par rapport au processus normal du travail ont provoqué l’accident ? (p.ex. , problème électrique, explosion, feu, déborde-
                    ment, renversement, écoulement, émission de gaz, rupture, chute ou effondrement d’objet, démarrage ou fonctionnement anormal d’une machine, perte
                    de contrôle d’un moyen de transport ou d’un objet, glissade ou chute de personne, action inopportune, faux mouvement, surprise, frayeur, violence,
                    agression, etc.). Précisez tous ces faits ET les objets impliqués s’ils ont joué un rôle dans leur survenue (p.ex. , outillage, machine, équipement, matéri-
                    aux, objets, instruments, substances, etc.) </h5>
            </div>
            <TextFieldP id="evenementDeviant" label="Expliquez" onChange={setevenementDeviant} defaultValue={evenementDeviant} />
            <AutoCompleteP id="ListeProcesVerbal" option={listeDeclarationAss.ListeProcesVerbal} label="Un procès-verbal a-t-il été dressé" onChange={(value) => { setListeProcesVerbal(value); }} defaultValue={ListeProcesVerbal} />

            {(ListeProcesVerbal === 'Oui') && (
                [<TextFieldP id="ProcesVerbalOui" label="Le procès-verbal porte le numéro d’identification" onChange={setProcesVerbalOui} defaultValue={ProcesVerbalOui} />,
                <TextFieldP id="ProcesVerbalOuiRedige" label="Il a été rédigé à" onChange={setProcesVerbalOuiRedige} defaultValue={ProcesVerbalOuiRedige} />,
                <DatePickerP id="dateProcesVerbalOuiRedigeQuand" label="Date de rédaction du PV" onChange={setdateProcesVerbalOuiRedigeQuand} defaultValue={dateProcesVerbalOuiRedigeQuand} />,
                <TextFieldP id="ProcesVerbalOuiPar" label="Il a été rédigé par" onChange={setProcesVerbalOuiPar} defaultValue={ProcesVerbalOuiPar} />]
            )}

            <AutoCompleteP id="ListeTierResponsable" option={listeDeclarationAss.ListeTierResponsable} label="Un tiers peut-il être rendu responsable de l’accident" onChange={(value) => { setListeTierResponsable(value); }} defaultValue={ListeTierResponsable} />

            {(ListeTierResponsable === 'Oui') && (
                [<TextFieldP id="TierResponsableOui" label="Nom et adresse" onChange={setTierResponsableOui} defaultValue={TierResponsableOui} />,
                <TextFieldP id="TierResponsableOuiNomAdresse" label="Nom et adresse de l’assureur" onChange={setTierResponsableOuiNomAdresse} defaultValue={TierResponsableOuiNomAdresse} />,
                <TextFieldP id="TierResponsableOuiNumPolice" label="Numéro de police" onChange={setTierResponsableOuiNumPolice} defaultValue={TierResponsableOuiNumPolice} />]
            )}

            <AutoCompleteP id="ListeTemoins" option={listeDeclarationAss.ListeTemoins} label="Y a-t-il eu des témoins" onChange={(value) => { setListeTemoins(value); }} defaultValue={ListeTemoins} />

            {(ListeTemoins === 'Oui') && (
                [<TextFieldP id="TemoinsOui" label="Nom - rue/n°/boite - Code postal - Commune" onChange={setTemoinsOui} defaultValue={TemoinsOui} />,
                <AutoCompleteP id="TemoinDirecte" option={listeDeclarationAss.TemoinDirecte} label="Est-ce un témoin directe (D) ou indirecte (I)" onChange={setTemoinDirecte} defaultValue={TemoinDirecte} />]
            )}

            <div className="frameStyle-style1">
                <h5> Comment la victime a-t-elle été blessée (lésion physique au psychique) ? Précisez chaque fois par ordre d’importance tous les différents contacts qui ont
                    provoqué la (les) blessure(s) (p. ex. , contact avec un courant électrique, avec une source de chaleur ou des substances dangereuses, noyade, ensevelis-
                    sement, enveloppement par quelque chose (gaz, liquide, solide), écrasement contre un objet ou heurt par un objet, collision, contact avec un objet coupant
                    ou pointu, coincement ou écrasement par un objet, problèmes d’appareil locomoteur, choc mental, blessure causée par un animal ou par une personne,
                    etc.) ET les objets impliqués (p. ex. , outillage, machine, équipement, matériaux, objets, instruments, substances, etc.). </h5>
            </div>
            <TextFieldP id="blessureVictume" label="Expliquez" onChange={setblessureVictume} defaultValue={blessureVictume} />
            <AutoCompleteP id="ListeSoinsMedicaux" option={listeDeclarationAss.ListeSoinsMedicaux} label="Des soins médicaux ont-ils été dispensés chez l’employeur" onChange={(value) => { setListeSoinsMedicaux(value); }} defaultValue={ListeSoinsMedicaux} />

            {(ListeSoinsMedicaux === 'Oui') && (
                [<DateHeurePickerP id="dateSoinsMedicauxDate" label="Date et heure" onChange={setdateSoinsMedicauxDate} defaultValue={dateSoinsMedicauxDate} />,
                <TextFieldP id="SoinsMedicauxDispansateur" label="Qualité du dispensateur" onChange={setSoinsMedicauxDispansateur} defaultValue={SoinsMedicauxDispansateur} />,
                <TextFieldP id="SoinsMedicauxDescriptions" label="Description des soins dispensés" onChange={setSoinsMedicauxDescriptions} defaultValue={SoinsMedicauxDescriptions} />]
            )}

            <AutoCompleteP id="ListeSoinsMedicauxMedecin" option={listeDeclarationAss.ListeSoinsMedicauxMedecin} label="Des soins médicaux ont-ils été dispensés par un médecin externe" onChange={(value) => { setListeSoinsMedicauxMedecin(value); }} defaultValue={ListeSoinsMedicauxMedecin} />

            {(ListeSoinsMedicauxMedecin === 'Oui') && (
                [<DateHeurePickerP id="dateSoinsMedicauxMedecin" label="Date et heure" onChange={setdateSoinsMedicauxMedecin} defaultValue={dateSoinsMedicauxMedecin} />,
                <TextFieldMaskP id="SoinsMedicauxMedecinInami" label="Numéro d’identification du médecin externe à l’INAMI" onChange={setSoinsMedicauxMedecinInami} defaultValue={SoinsMedicauxMedecinInami} mask="00000000-000" />,
                <TextFieldP id="SoinsMedicauxMedecinNom" label="Nom et prénom du médecin externe" onChange={setSoinsMedicauxMedecinNom} defaultValue={SoinsMedicauxMedecinNom} />,
                <TextFieldP id="SoinsMedicauxMedecinRue" label="Rue / n° / boite" onChange={setSoinsMedicauxMedecinRue} defaultValue={SoinsMedicauxMedecinRue} />,
                <TextFieldP id="SoinsMedicauxMedecinCodePostal" label="Code postal" onChange={setSoinsMedicauxMedecinCodePostal} defaultValue={SoinsMedicauxMedecinCodePostal} />,
                <TextFieldP id="SoinsMedicauxMedecinCommune" label="Commune" onChange={setSoinsMedicauxMedecinCommune} defaultValue={SoinsMedicauxMedecinCommune} />]
            )}

            <AutoCompleteP id="ListeSoinsMedicauxHopital" option={listeDeclarationAss.ListeSoinsMedicauxHopital} label="Des soins médicaux ont-ils été dispensés à l’hôpital" onChange={(value) => { setListeSoinsMedicauxHopital(value); }} defaultValue={ListeSoinsMedicauxHopital} />

            {(ListeSoinsMedicauxHopital === 'Oui') && (
                [<DateHeurePickerP id="dateSoinsMedicauxHopital" label="Date et heure" onChange={setdateSoinsMedicauxHopital} defaultValue={dateSoinsMedicauxHopital} />,
                <TextFieldMaskP id="SoinsMedicauxHopitalInami" label="Numéro d’identification de l’hôpital à l’INAMI" onChange={setSoinsMedicauxHopitalInami} defaultValue={SoinsMedicauxHopitalInami} mask="00000000-000" />,
                <TextFieldP id="SoinsMedicauxHopitaldenomi" label="Dénomination de I*hôpital" onChange={setSoinsMedicauxHopitaldenomi} defaultValue={SoinsMedicauxHopitaldenomi} />,
                <TextFieldP id="SoinsMedicauxHopitalRue" label="Rue / n° / boite" onChange={setSoinsMedicauxHopitalRue} defaultValue={SoinsMedicauxHopitalRue} />,
                <TextFieldP id="SoinsMedicauxHopitalCodePostal" label="Code postal" onChange={setSoinsMedicauxHopitalCodePostal} defaultValue={SoinsMedicauxHopitalCodePostal} />,
                <TextFieldP id="SoinsMedicauxHopitalCommune" label="Commune" onChange={setSoinsMedicauxHopitalCommune} defaultValue={SoinsMedicauxHopitalCommune} />]
            )}

            <AutoCompleteP id="ListeConseqAccident" option={listeDeclarationAss.ListeConseqAccident} label="Conséquences de l’accident" onChange={(value) => { setListeConseqAccident(value); }} defaultValue={ListeConseqAccident} />

            {(ListeConseqAccident === 'Occupation temporaire avec travail adapté (prestations réduites ou autre fonction, sans perte de salaire)') && (
                <DatePickerP id="dateTravailAddapte" label="a partir du" onChange={setdateTravailAddapte} defaultValue={dateTravailAddapte} />
            )}

            {(ListeConseqAccident === 'Incapacité temporaire totale de travail') && (
                <DateHeurePickerP id="dateIncapaciteTemporaire" label="a partir du" onChange={setdateIncapaciteTemporaire} defaultValue={dateIncapaciteTemporaire} />
            )}

            {(ListeConseqAccident === 'Décès') && (
                <DatePickerP id="dateDece" label="Date du Décès" onChange={setdateDece} defaultValue={dateDece} />
            )}

            <DatePickerP id="dateRepriseEffective" label="Date de reprise effective du travail habituel/au poste d’origine" onChange={setdateRepriseEffective} defaultValue={dateRepriseEffective} />
            <div className="frameStyle-style1">
                <h5>  S'il n'y a pas encore eu de reprise complète du travail habituel/au poste d’origine durée probable de l'incapacité temporaire
                    totale ou partielle de travail </h5>
            </div>
            <TextFieldP id="JourIncaCompl" label="Jours" onChange={setJourIncaCompl} defaultValue={JourIncaCompl} />
            <AutoCompleteP id="ListeMesureRepetition" option={listeDeclarationAss.ListeMesureRepetition} label="1 Mesures de prévention prises pour éviter la répétition d’un tel accident" onChange={setListeMesureRepetition} defaultValue={ListeMesureRepetition} />
            <AutoCompleteP id="ListeMesureRepetition2" option={listeDeclarationAss.ListeMesureRepetition} label="2 Mesures de prévention prises pour éviter la répétition d’un tel accident" onChange={setListeMesureRepetition2} defaultValue={ListeMesureRepetition2} />
            <TextFieldMaskP id="CodeRisqueEntreprise" label="Codes risques propres à l’entreprise" onChange={setCodeRisqueEntreprise} defaultValue={CodeRisqueEntreprise} mask="#########-#########-#########-#########-#########" />
            <AutoCompleteP id="ListeVictimeOnss" option={listeDeclarationAss.ListeVictimeOnss} label="La victime est-elle affiliée à l’ONSS" onChange={(value) => { setListeVictimeOnss(value); }} defaultValue={ListeVictimeOnss} />

            {(ListeVictimeOnss === 'Non') && (
                <TextFieldP id="victimeOnssNon" label="Si non, donnée le motif" onChange={setvictimeOnssNon} defaultValue={victimeOnssNon} />
            )}

            <TextFieldP id="codeTravailleurSocial" label="Code du travailleur de l'assurance sociale" onChange={(value) => { setcodeTravailleurSocial(value); }} defaultValue={codeTravailleurSocial} />

            {codeTravailleurSocial === '' && (
                <AutoCompleteP id="ListeCategoProfess" option={listeDeclarationAss.ListeCategoProfess} label="S'il n'est pas connu, mentionnez la catégorie professionnelle" onChange={(value) => { setListeCategoProfess(value); }} defaultValue={ListeCategoProfess} />
            )}

            {(ListeCategoProfess === 'Autre (à préciser)') && (
                <TextFieldP id="CategoProfessAutre" label="Si autre, preciser" onChange={setCategoProfessAutre} defaultValue={CategoProfessAutre} />
            )}

            <AutoCompleteP id="ListeNonOnss" option={listeDeclarationAss.ListeNonOnss} label="Si « apprenti/stagiaire non assujetti à l’ONSS », type de stage ou de formation" onChange={(value) => { setListeNonOnss(value); }} defaultValue={ListeNonOnss} />

            {(ListeNonOnss === 'F1') && (
                <AutoCompleteP id="ListeApprentiFormat" option={listeDeclarationAss.ListeApprentiFormat} label="S’agit-il d’un apprenti en formation pour devenir chef d’entreprise" onChange={(value) => { setListeApprentiFormat(value); }} defaultValue={ListeApprentiFormat} />
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

            {(ListeNonOnss === 'F1' && ListeApprentiFormat === 'Non') && (
                [<TextFieldP id="CommissionParitaireDénomination" label="Commission paritaire Denomination" onChange={setCommissionParitaireDénomination} defaultValue={CommissionParitaireDénomination} />,
                <TextFieldP id="CommissionParitaireNumn" label="Commission paritaire Numéro" onChange={setCommissionParitaireNumn} defaultValue={CommissionParitaireNumn} />,
                <AutoCompleteP id="ListeTypeContrat" option={listeDeclarationAss.ListeTypeContrat} label="Type de contrat de travail" onChange={setListeTypeContrat} defaultValue={ListeTypeContrat} />,
                <TextFieldP id="Nbrjoursregime" label="Nombre de jours par semaine du régime de travail" onChange={setNbrjoursregime} defaultValue={Nbrjoursregime} />,
                <TextFieldP id="NbrHeureSemaine" label="Nombre moyen d’heures par semaine la victime" onChange={setNbrHeureSemaine} defaultValue={NbrHeureSemaine} />,
                <TextFieldP id="NbrHeureSemaineReference" label="Nombre moyen d’heures par semaine la personne de sélection" onChange={setNbrHeureSemaineReference} defaultValue={NbrHeureSemaineReference} />,
                <AutoCompleteP id="ListeVictiPension" option={listeDeclarationAss.ListeVictiPension} label="La victime est-elle une personne pensionnée exerçant encore une activité professionnelle" onChange={setListeVictiPension} defaultValue={ListeVictiPension} />,
                <AutoCompleteP id="ListeModeRemuneration" option={listeDeclarationAss.ListeModeRemuneration} label="Mode de rémunération" onChange={(value) => { setListeModeRemuneration(value); }} defaultValue={ListeModeRemuneration} />]
            )}

            {(ListeNonOnss === 'F1' && ListeApprentiFormat === 'Non' && ListeModeRemuneration === 'Rémunération fixe') && (
                <div>
                    <AutoCompleteP id="ListeMontantRemuneration" option={listeDeclarationAss.ListeMontantRemuneration} label="Unité de temps" onChange={setListeMontantRemuneration} defaultValue={ListeMontantRemuneration} />
                    <TextFieldP id="MontantRemunerationVariable" label="En cas de rémunération variable, cycle correspondant à l’unité de temps déclarée" onChange={setMontantRemunerationVariable} defaultValue={MontantRemunerationVariable} />
                    <div className="frameStyle-style1">
                        <h5>total des rémunérations et des avantages assujettis à l’ONSS, sans heures supplémentaires, pécule de vacances complémentaire et prime de find’année
                            (le montant déclaré doit correspondre à l’unité de temps ou à l’unité de temps et au cycle)</h5>
                    </div>
                    <TextFieldP id="remunerationTotalAssOnns" label="Rémunérations" onChange={setremunerationTotalAssOnns} defaultValue={remunerationTotalAssOnns} />
                    <AutoCompleteP id="ListePrimeFinAnnee" option={listeDeclarationAss.ListePrimeFinAnnee} label="Prime de fin d'année" onChange={setListePrimeFinAnnee} defaultValue={ListePrimeFinAnnee} />
                    <TextFieldP id="PrimeFinAnneeRemuAnnuel" label="Si oui, % de la rémuneration annuelle" onChange={setPrimeFinAnneeRemuAnnuel} defaultValue={PrimeFinAnneeRemuAnnuel} />
                    <TextFieldP id="PrimeFinAnneeRemuAnnuelForfetaire" label="Si oui, montant forfaitaire de €" onChange={setPrimeFinAnneeRemuAnnuelForfetaire} defaultValue={PrimeFinAnneeRemuAnnuelForfetaire} />
                    <TextFieldP id="PrimeFinAnneeRemuAnnuelNbrHeure" label="Si oui, émuniration d’un nombre d’heures" onChange={setPrimeFinAnneeRemuAnnuelNbrHeure} defaultValue={PrimeFinAnneeRemuAnnuelNbrHeure} />

                </div>
            )}

            {(ListeNonOnss === 'F1' && ListeApprentiFormat === 'Non') && (
                [<h3>Questions 63</h3>,
                <TextFieldP id="AvantegeAssujOnns" label="Autres avantages assujettis ou non à l’ONSS (exprimés sur base annuelle)" onChange={setAvantegeAssujOnns} defaultValue={AvantegeAssujOnns} />,
                <TextFieldP id="AvantegeAssujOnnsNature" label="Nature des avantages" onChange={setAvantegeAssujOnnsNature} defaultValue={AvantegeAssujOnnsNature} />,
                <AutoCompleteP id="ListechangementFonction" option={listeDeclarationAss.ListechangementFonction} label="Durée du contrat de travail" onChange={(value) => { setListechangementFonction(value); }} defaultValue={ListechangementFonction} />]
            )}

            {(ListechangementFonction === 'Oui') && (
                <DatePickerP id="dateChangementFonction" label="Si oui, date du dernier changement de fonction" onChange={setdateChangementFonction} defaultValue={dateChangementFonction} />
            )}

            <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Questions 65</h3>
            <TextFieldP id="heureTravaillePerdu" label="Nombre d’heures de travail perdues le jour de l’accident" onChange={setheureTravaillePerdu} defaultValue={heureTravaillePerdu} />
            <TextFieldP id="salaireTravaillePerdu" label="Perte salariale pour les heures de travail perdues" onChange={setsalaireTravaillePerdu} defaultValue={salaireTravaillePerdu} />
        </div>

    );
}
