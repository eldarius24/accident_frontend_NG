import * as ExcelJS from 'exceljs';
import axios from 'axios';
import config from '../config.json';

const apiUrl = config.apiUrl;

// Générer le fichier Excel et le télécharger
function generateExcelFileAccidents(workbook) {
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = 'Accidents.xlsx';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        }
    });
}


/**
     * Fonction pour exporter les données vers Excel
     * @returns {void}
     * @param {void} filteredData Données filtrées à exporter
     */
async function handleExportData(userInfo, isAdminOrDev, filteredData) {
    try {
        const filteredIds = filteredData.map(item => item._id);
        // Définir les entreprises autorisées
        let entreprises = [];
        if (!isAdminOrDev && userInfo.entreprisesConseillerPrevention) {
            entreprises = userInfo.entreprisesConseillerPrevention;
        }
        const fields = [
            '_id',
            'AssureurStatus', 'entrepriseName', 'secteur', 'typeTravailleur',
            'DateHeureAccident', 'DateJourIncapDebut', 'nomTravailleur',
            'prenomTravailleur', 'dateNaissance', 'circonstanceAccident',
            'codeSiegeLesion', 'codeNatureLesion', 'codeDeviation',
            'codeAgentMateriel', 'boolChausure', 'dateDebutArret',
            'dateFinArret', 'blessures', 'DateJourIncapFin',
            'indemnisationAccident', 'typeAccident', 'nbHeuresSemaine'
        ];

        const response = await axios.get(`http://${apiUrl}:3100/api/accidents/filtered-fields`, {
            params: {
                fields: JSON.stringify(fields),
                entreprises: JSON.stringify(entreprises)
            }
        });

        const dataToExport = response.data.accidents.filter(item =>
            filteredIds.includes(item._id)
        );

        if (!dataToExport || dataToExport.length === 0) {
            console.warn("Aucune donnée à exporter.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Accidents');

        worksheet.addRow([
            'Statut',
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


        if (dataToExport.length > 0 && typeof dataToExport[0] === 'object') {
            dataToExport.forEach(item => {
                worksheet.addRow([
                    item.AssureurStatus,
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
        } else {
            console.warn("Les données ne sont pas correctement formatées pour l'exportation.");
        }
        // Styliser l'en-tête
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Appliquer des bordures et un alignement à toutes les cellules
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', wrapText: true };
            });
        });
        generateExcelFileAccidents(workbook);
    } catch (error) {
        console.error("Erreur lors de l'export des données:", error);
        throw error;
    }
}

/**
 * Génère un fichier Excel pour les données d'assurances et le télécharge.
 * 
 * @param {ExcelJS.Workbook} workbook - Le classeur Excel à partir duquel le fichier sera généré.
 * 
 * Le fichier est enregistré sous le nom 'Assurances.xlsx' et téléchargé sur l'appareil de l'utilisateur.
 * Pour les navigateurs Internet Explorer, utilise msSaveOrOpenBlob pour le téléchargement.
 * Pour les autres navigateurs, utilise un lien de téléchargement temporaire.
 */
function generateExcelFileAssurances(workbook) {
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = 'Assurances.xlsx';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        }
    });
}

/**
 * Fonction pour exporter les données filtrées
 * @returns {void} null
 * @param {void} filteredData Données filtrées à exporter
 */
async function handleExportDataAss(userInfo, isAdminOrDev, filteredData) {
    try {
        const filteredIds = filteredData.map(item => item._id);
        // Définir les entreprises autorisées
        let entreprises = [];
        if (!isAdminOrDev && userInfo.entreprisesConseillerPrevention) {
            entreprises = userInfo.entreprisesConseillerPrevention;
        }
        const fields = [
            '_id',
            'AssureurStatus', 'entrepriseName', 'secteur', 'typeTravailleur',
            'DateHeureAccident', 'horaireJourAccident', 'DateEnvoieDeclarationAccident',
            'Getionnaiesinistre', 'NumeroPoliceAssurance', 'boolAsCloture',
            'commentaireetSuivit', 'referenceduSinistre', 'typeAccident',
            'circonstanceAccident', 'DateJourIncapDebut', 'DateJourIncapFin',
            'indemnisationAccident', 'blessures', 'boolAucun', 'boolChausure',
            'boolLunette', 'boolGant', 'boolCasque', 'boolAuditive', 'boolMasque',
            'boolEcran', 'boolTenue', 'boolFiltre', 'boolVeste', 'boolMaire',
            'boolChute', 'boolAutre', 'codeDeviation', 'codeAgentMateriel',
            'codeNatureLesion', 'codeSiegeLesion', 'nomTravailleur', 'prenomTravailleur',
            'dateNaissance', 'lieuxnaissance', 'niss', 'nbHeuresSemaine', 'dateDebutArret',
            'dateFinArret', 'dateEntrEntreprise', 'sexe', 'nationalité', 'etatCivil',
            'adresseRue', 'adresseCodepostal', 'adresseCommune', 'adressePays',
            'adresseMail', 'telephone', 'adresseRuecorrespondance', 'adresseCodecorrespondance',
            'adresseCommunecorrespondance', 'ListeadressePaysCorrespondance',
            'telephoneCorrespondance', 'ListeLangueCorr', 'parentEmployeur', 'CodeMutuelle',
            'nomMutuelle', 'adresseRueMutuelle', 'adresseCodepostalMutuelle',
            'adresseCommuneMutuelle', 'numAffiliation', 'numCompteBancaire',
            'etabliFinancier', 'numDimona', 'ListeDurContra', 'dateSortie',
            'profesEntreprise', 'citp', 'ListeDureeDsEntreprise', 'ListeVicInterimaire',
            'VicInterimaireOui', 'VicInterimaireOuiNom', 'VicInterimaireOuiAdresse',
            'ListeVicTravailExt', 'VicTravailExtOui', 'VicTravailExtOuiNom',
            'VicTravailExtOuiAdresse', 'dateNotifEmployeur', 'ListeLieuxAt',
            'ListeVoiePublic', 'LieuxAtAdresse', 'LieuxAtCodePostal', 'LieuxAtCommune',
            'ListeLieuxAtPays', 'NumdeChantier', 'environementLieux', 'activiteSpecifique',
            'ListeTypedePost', 'ListeProfHabituelle', 'ListeProfHabituelleNon',
            'evenementDeviant', 'ListeProcesVerbal', 'ProcesVerbalOui',
            'ProcesVerbalOuiRedige', 'dateProcesVerbalOuiRedigeQuand',
            'ProcesVerbalOuiPar', 'ListeTierResponsable', 'TierResponsableOui',
            'TierResponsableOuiNomAdresse', 'TierResponsableOuiNumPolice',
            'ListeTemoins', 'TemoinsOui', 'TemoinDirecte', 'blessureVictume',
            'ListeSoinsMedicaux', 'dateSoinsMedicauxDate', 'SoinsMedicauxDispansateur',
            'SoinsMedicauxDescriptions', 'ListeSoinsMedicauxMedecin',
            'dateSoinsMedicauxMedecin', 'SoinsMedicauxMedecinInami',
            'SoinsMedicauxMedecinNom', 'SoinsMedicauxMedecinRue',
            'SoinsMedicauxMedecinCodePostal', 'SoinsMedicauxMedecinCommune',
            'ListeSoinsMedicauxHopital', 'dateSoinsMedicauxHopital',
            'SoinsMedicauxHopitalInami', 'SoinsMedicauxHopitaldenomi',
            'SoinsMedicauxHopitalRue', 'SoinsMedicauxHopitalCodePostal',
            'SoinsMedicauxHopitalCommune', 'ListeConseqAccident', 'dateDece',
            'dateIncapaciteTemporaire', 'dateTravailAddapte', 'dateRepriseEffective',
            'JourIncaCompl', 'ListeMesureRepetition', 'ListeMesureRepetition2',
            'CodeRisqueEntreprise', 'ListeVictimeOnss', 'victimeOnssNon',
            'codeTravailleurSocial', 'ListeCategoProfess', 'CategoProfessAutre',
            'ListeNonOnss', 'ListeApprentiFormat', 'CommissionParitaireDénomination',
            'CommissionParitaireNumn', 'ListeTypeContrat', 'Nbrjoursregime',
            'NbrHeureSemaine', 'NbrHeureSemaineReference', 'ListeVictiPension',
            'ListeModeRemuneration', 'ListeMontantRemuneration',
            'MontantRemunerationVariable', 'remunerationTotalAssOnns',
            'ListePrimeFinAnnee', 'PrimeFinAnneeRemuAnnuel',
            'PrimeFinAnneeRemuAnnuelForfetaire', 'PrimeFinAnneeRemuAnnuelNbrHeure',
            'AvantegeAssujOnns', 'AvantegeAssujOnnsNature', 'ListechangementFonction',
            'dateChangementFonction', 'heureTravaillePerdu', 'salaireTravaillePerdu',
            'activiteGenerale'
        ];

        // Récupérer les données via l'API
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents/filtered-fields`, {
            params: {
                fields: JSON.stringify(fields),
                entreprises: JSON.stringify(entreprises)
            }
        });

        const dataToExport = response.data.accidents.filter(item =>
            filteredIds.includes(item._id)
        );

        if (!dataToExport || dataToExport.length === 0) {
            console.warn("Aucune donnée à exporter.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Assurances');

        // Ajouter l'en-tête
        worksheet.addRow([
            'Statut',
            'entrepriseName',
            'secteur',
            'typeTravailleur',
            'AssureurStatus',
            'DateHeureAccident',
            'horaireJourAccident',
            'DateEnvoieDeclarationAccident',
            'Getionnaiesinistre',
            'NumeroPoliceAssurance',
            'boolAsCloture',
            'commentaireetSuivit',
            'referenceduSinistre',
            'typeAccident',
            'circonstanceAccident',
            'DateJourIncapDebut',
            'DateJourIncapFin',
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
            'dateNaissance',
            'lieuxnaissance',
            'niss',
            'nbHeuresSemaine',
            'dateDebutArret',
            'dateFinArret',
            'dateEntrEntreprise',
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
            'parentEmployeur',
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
            'dateSortie',
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
            'dateNotifEmployeur',
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
            'dateProcesVerbalOuiRedigeQuand',
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
            'dateSoinsMedicauxDate',
            'SoinsMedicauxDispansateur',
            'SoinsMedicauxDescriptions',
            'ListeSoinsMedicauxMedecin',
            'dateSoinsMedicauxMedecin',
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
            'dateDece',
            'dateIncapaciteTemporaire',
            'dateTravailAddapte',
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
        if (dataToExport.length > 0 && typeof dataToExport[0] === 'object') {
            dataToExport.forEach(item => {
                worksheet.addRow([
                    //infos entreprise
                    item.AssureurStatus,
                    item.entrepriseName,
                    item.secteur,
                    item.typeTravailleur,
                    item.AssureurStatus,
                    item.DateHeureAccident,
                    item.horaireJourAccident,
                    item.DateEnvoieDeclarationAccident,
                    item.Getionnaiesinistre,
                    item.NumeroPoliceAssurance,
                    item.boolAsCloture,
                    item.commentaireetSuivit,
                    item.referenceduSinistre,
                    item.typeAccident,
                    item.circonstanceAccident,
                    item.DateJourIncapDebut,
                    item.DateJourIncapFin,
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
                    item.dateNaissance,
                    item.lieuxnaissance,
                    item.niss,
                    item.nbHeuresSemaine,
                    item.dateDebutArret,
                    item.dateFinArret,
                    item.dateEntrEntreprise,
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
                    item.parentEmployeur,
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
                    item.dateSortie,
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
                    item.dateNotifEmployeur,
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
                    item.dateProcesVerbalOuiRedigeQuand,
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
                    item.dateSoinsMedicauxDate,
                    item.SoinsMedicauxDispansateur,
                    item.SoinsMedicauxDescriptions,
                    item.ListeSoinsMedicauxMedecin,
                    item.dateSoinsMedicauxMedecin,
                    item.SoinsMedicauxMedecinInami,
                    item.SoinsMedicauxMedecinNom,
                    item.SoinsMedicauxMedecinRue,
                    item.SoinsMedicauxMedecinCodePostal,
                    item.SoinsMedicauxMedecinCommune,
                    item.ListeSoinsMedicauxHopital,
                    item.dateSoinsMedicauxHopital,
                    item.SoinsMedicauxHopitalInami,
                    item.SoinsMedicauxHopitaldenomi,
                    item.SoinsMedicauxHopitalRue,
                    item.SoinsMedicauxHopitalCodePostal,
                    item.SoinsMedicauxHopitalCommune,
                    item.ListeConseqAccident,
                    item.dateDece,
                    item.dateIncapaciteTemporaire,
                    item.dateTravailAddapte,
                    item.dateRepriseEffective,
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
                    item.dateChangementFonction,
                    item.heureTravaillePerdu,
                    item.salaireTravaillePerdu,
                    item.activiteGenerale,
                ]);
            });
        } else {
            console.warn("Les données ne sont pas correctement formatées pour l'exportation.");
        }
        // Styliser l'en-tête
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Appliquer des bordures et un alignement à toutes les cellules
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', wrapText: true };
            });
        });
        generateExcelFileAssurances(workbook);
    } catch (error) {
        console.error("Erreur lors de l'export des données assurance:", error);
        throw error;
    }
}

function generateExcelFileActions(workbook) {
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = 'Actions.xlsx';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        }
    });
}

function handleExportDataAction(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("Aucune donnée à exporter.");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actions');

    // Définir les colonnes avec leur largeur
    worksheet.columns = [
        { header: 'Priorité', key: 'priority', width: 15 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Année', key: 'year', width: 10 },
        { header: 'Mois', key: 'month', width: 15 },
        { header: 'Entreprise', key: 'enterprise', width: 20 },
        { header: 'Secteur', key: 'sector', width: 20 },
        { header: 'Action', key: 'action', width: 40 },
        { header: 'Catégorie du risque', key: 'risk', width: 30 },
        { header: 'Date d\'ajout', key: 'date', width: 15 },
        { header: 'Responsable', key: 'responsible', width: 20 }
    ];

    // Ajouter les données
    data.forEach(item => {
        worksheet.addRow({
            priority: item.priority || '',
            status: item.AddboolStatus ? 'Terminé' : 'En cours',
            year: item.AddActionanne || '',
            month: item.AddActoinmoi || '',
            enterprise: item.AddActionEntreprise || '',
            sector: item.AddActionSecteur || '',
            action: item.AddAction || '',
            risk: Array.isArray(item.AddActionDange)
                ? item.AddActionDange.join(', ')
                : (item.AddActionDange || ''),
            date: item.AddActionDate
                ? new Date(item.AddActionDate).toLocaleDateString()
                : '',
            responsible: item.AddActionQui || ''
        });
    });

    // Styliser l'en-tête
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Appliquer des bordures et un alignement à toutes les cellules
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
        });
    });

    // Générer le fichier Excel
    generateExcelFileActions(workbook);
}

export { handleExportDataAction, handleExportData, handleExportDataAss };