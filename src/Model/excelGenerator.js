import * as ExcelJS from 'exceljs';

// Générer le fichier Excel et le télécharger
function generateExcelFileAccidents(workbook) {
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const fileName = 'Accidents.xlsx';

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
}


/**
     * Fonction pour exporter les données vers Excel
     * @returns {void}
     * @param {void} filteredData Données filtrées à exporter
     */
export function handleExportData(data) {
    const dataToExport = Array.isArray(data) ? data : [];
    console.log("Données à exporter : ", dataToExport);
    if (dataToExport.length === 0) {
        console.warn("Aucune donnée à exporter.");
    }
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
    if (dataToExport.length > 0 && typeof dataToExport[0] === 'object') {
        dataToExport.forEach(item => {
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
    } else {
        console.warn("Les données ne sont pas correctement formatées pour l'exportation.");
    }
    generateExcelFileAccidents(workbook);
};


function generateExcelFileAssurances(workbook) {
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const fileName = 'Assurances.xlsx';

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
}


/**
 * Fonction pour exporter les données filtrées
 * @returns {void} null
 * @param {void} filteredData Données filtrées à exporter
 */
export function handleExportDataAss(data) {
    const dataToExport = Array.isArray(data) ? data : []; // Utilisez 'data' au lieu de 'filteredData'
    console.log("Données à exporter : ", dataToExport);
    if (dataToExport.length === 0) {
        console.warn("Aucune donnée à exporter.");
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assurances');

    // Ajouter l'en-tête
    worksheet.addRow([
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
    generateExcelFileAssurances(workbook);
};



function generateExcelFileActions(workbook) {
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const fileName = 'Actions.xlsx';

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
}


/**
 * Exporte les données d'action vers un fichier Excel.
 * @param {object[]} data Données à exporter
 */
export function handleExportDataAction(data) {
    const dataToExport = Array.isArray(data) ? data : []; // Utilisez 'data' au lieu de 'filteredData'
    console.log("Données à exporter : ", dataToExport);
    if (dataToExport.length === 0) {
        console.warn("Aucune donnée à exporter.");
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actions');

    // Ajouter l'en-tête
    worksheet.addRow([
        'AddActionanne',
        'AddActoinmoi',
        'AddActionEntreprise',
        'AddActionSecteur',
        'AddAction',
        'AddActionDate',
        'AddActionQui',
    ]);

    // Ajouter les données filtrées
    if (dataToExport.length > 0 && typeof dataToExport[0] === 'object') {
        dataToExport.forEach(item => {
            worksheet.addRow([
                //infos entreprise
                item.entrepriseName,
                item.AddActionanne,
                item.AddActoinmoi,
                item.AddActionEntreprise,
                item.AddActionSecteur,
                item.AddAction,
                item.AddActionDate,
                item.AddActionQui,
            ]);
        });
    } else {
        console.warn("Les données ne sont pas correctement formatées pour l'exportation.");
    }
    generateExcelFileActions(workbook);
};
