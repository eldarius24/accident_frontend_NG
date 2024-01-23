/**
 * importation des librairies pour la génération du pdf
 */
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
import dataEntreprises from '../liste/dataEnreprises.json'


/**
 * fonction qui permet d'editer un textfield dans un pdf
 * @param {*} form formulaire du pdf
 * @param {*} textFielName nom du textfield
 * @param {*} data donnée à mettre dans le textfield
 */
function EditPdfTextField(form, textFielName, data) {
    const textField = form.getTextField(textFielName);
    if (data !== null) {
        textField.setText(data || "");
    }
}
/**
 * fonction qui permet d'editer un checkbox dans un pdf
 * @param {*} form formulaire du pdf
 * @param {*} checBkoxName nom du checkbox
 * @param {*} data donnée à mettre dans le checkbox
 */
function EditPdfCheckBox(form, checBkoxName, data) {
    const checkBox = form.getCheckBox(checBkoxName);
    if (data) checkBox.check();
}



export default async function editPDF(data) {
    try {
        const response = await fetch('./LeCortilDeclarationBELFIUS.pdf');
        const buffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const form = pdfDoc.getForm();

        const dataEntreprise = dataEntreprises.entreprises.find((entreprise) => entreprise.name === data.entrepriseName).data;
        console.log(" dataEntreprise => ", dataEntreprise);

        //donnée selon entreprise
        EditPdfTextField(form, '11 straat', dataEntreprise.rue);
        EditPdfTextField(form, '1 verzekeringspolis', dataEntreprise.Police);
        EditPdfTextField(form, '8 bedrijfsnummer', dataEntreprise.numEntreprise);
        EditPdfTextField(form, '12 postcode', dataEntreprise.codePostal);
        EditPdfTextField(form, '13 gemeente', dataEntreprise.localite);
        EditPdfTextField(form, '16 emailadres', dataEntreprise.email);
        EditPdfTextField(form, '15 telefoon', dataEntreprise.tel);
        EditPdfTextField(form, '17 iban', dataEntreprise.IBAN1);
        EditPdfTextField(form, '17 iban 1', dataEntreprise.IBAN2);
        EditPdfTextField(form, '17 iban 2', dataEntreprise.IBAN3);
        EditPdfTextField(form, '17 iban 3', dataEntreprise.IBAN4);
        EditPdfTextField(form, '17 iban 9', dataEntreprise.BIC1);
        EditPdfTextField(form, '17 iban 10', dataEntreprise.BIC2);
        EditPdfTextField(form, '17 iban 11', dataEntreprise.BIC3);
        EditPdfTextField(form, '10 naam of handelsnaam', dataEntreprise.nom);
        EditPdfTextField(form, '9 RSZ 3', dataEntreprise.unitetablissement1);
        EditPdfTextField(form, '9 RSZ 4', dataEntreprise.unitetablissement2);
        EditPdfTextField(form, '9 RSZ 5', dataEntreprise.unitetablissement3);
        EditPdfTextField(form, '9 RSZ 6', dataEntreprise.unitetablissement4);
        EditPdfTextField(form, '9 RSZ', dataEntreprise.ONSS1);
        EditPdfTextField(form, '9 RSZ 1', dataEntreprise.ONSS2);
        EditPdfTextField(form, '9 RSZ 2', dataEntreprise.ONSS3);
        EditPdfTextField(form, '14 activiteit', dataEntreprise.activEntreprise);
        EditPdfTextField(form, '60', dataEntreprise.numAffi);
        EditPdfTextField(form, '59', dataEntreprise.secretariasociale);
        EditPdfTextField(form, '61', dataEntreprise.scAdresse);
        EditPdfTextField(form, '62', dataEntreprise.scCodePostal);
        EditPdfTextField(form, '63', dataEntreprise.scLocalite);
        if (data.DateHeureAccident !== undefined && data.DateHeureAccident !== null) {
            EditPdfTextField(form, '2 jaar', (data.DateHeureAccident.substring(0, 4)));
            EditPdfTextField(form, '3 nummer', (data.DateHeureAccident.substring(0, 4) + data.DateHeureAccident.substring(5, 7) + data.DateHeureAccident.substring(8, 10) + data.DateHeureAccident.substring(13, 15) + data.DateHeureAccident.substring(16, 18)));
        };

        //-------------------------

        if (data.niss !== undefined && data.niss !== null) {
            EditPdfTextField(form, '17 iban 12', (data.niss.substring(0, 6)));
            EditPdfTextField(form, '17 iban 13', (data.niss.substring(7, 10)));
            EditPdfTextField(form, '17 iban 14', (data.niss.substring(11, 13)));
        };


        EditPdfTextField(form, '18 naam getroffene', data.nomTravailleur);
        EditPdfTextField(form, '19 voornaam getroffene', data.prenomTravailleur);
        EditPdfTextField(form, '20 geboorteplaats', data.lieuxnaissance);
        if (data.dateNaissance !== undefined && data.dateNaissance !== null) {
            EditPdfTextField(form, '21 geboortedatum 2', (data.dateNaissance.substring(0, 4)));
            EditPdfTextField(form, '21 geboortedatum 1', (data.dateNaissance.substring(5, 7)));
            EditPdfTextField(form, '21 geboortedatum', (data.dateNaissance.substring(8, 10)));
        };
        //si le sexe est masculin on coche la case homme sinon on coche la case femme
        if (data.sexe == "Masculin") {
            EditPdfCheckBox(form, '22 checkbox man', true);
        } else {
            EditPdfCheckBox(form, '23 checkbox vrouw', true);
        }

        // EXEMPLE DE CODE POUR COCHER UNE CASE
        switch (data.etatCivil) {
            case "Célibataire":
                EditPdfCheckBox(form, '25 checkbox ', true);
                break;
            case "Marié(e)":
                EditPdfCheckBox(form, '26 checkbox  1', true);
                break;
            case "Divorcé(e)":
                EditPdfCheckBox(form, '27 checkbox  2', true);
                break;
            case "Veuf(Veuve)":
                EditPdfCheckBox(form, '28 checkbox  3', true);
                break;
        }

        switch (data.ListeLangueCorr) {
            case "Français":
                EditPdfCheckBox(form, '41 checkbox  1', true);
                break;
            case "Néerlandais":
                EditPdfCheckBox(form, '42 checkbox  2', true);
                break;
            case "Allemand":
                EditPdfCheckBox(form, '43 checkbox  3', true);
                break;
        }

        switch (data.parentEmployeur) {
            case "pas parent(e)":
                EditPdfCheckBox(form, '44 checkbox  5', true);
                break;
            case "au premier degré (parents et enfants)":
                EditPdfCheckBox(form, '45 checkbox  4', true);
                break;
            case "autre (p. ex., oncle ou grands-parents)":
                EditPdfCheckBox(form, '46 checkbox  6', true);
                break;
        }

        switch (data.ListeDurContra) {
            case "Indéterminée":
                EditPdfCheckBox(form, '57 checkbox  7', true);
                break;
            case "Déterminée":
                EditPdfCheckBox(form, '58 checkbox  10', true);
                break;
        }

        //date de sortie connue ?

        switch (data.ListeDureeDsEntreprise) {
            case "Moins d'une semaine":
                EditPdfCheckBox(form, '64 checkbox  13', true);
                break;
            case "D'une semaine à un mois":
                EditPdfCheckBox(form, '65 checkbox  12', true);
                break;
            case "D'un mois à un an":
                EditPdfCheckBox(form, '66 checkbox  11', true);
                break;
            case "Plus d'un an":
                EditPdfCheckBox(form, '67 checkbox  12', true);
                break;
        }

        switch (data.typeTravailleur) {
            case "Employer":
                EditPdfCheckBox(form, '69 checkbox  15', true);
                break;
            case "Article 60":
                EditPdfCheckBox(form, '69 checkbox  15', true);
                break;
            case "Stagiaire":
                EditPdfCheckBox(form, '69 checkbox  15', true);
                break;
            case "Intérimaire":
                EditPdfCheckBox(form, '68 checkbox  14', true);
                break;
            case "Bénévole":
                EditPdfCheckBox(form, '69 checkbox  15', true);
                break;
        }

        switch (data.ListeVicTravailExt) {
            case "Oui":
                EditPdfCheckBox(form, '69 checkbox  16', true);
                break;
            case "Non":
                EditPdfCheckBox(form, '69 checkbox  17', true);
                break;
        }

        switch (data.typeAccident) {
            case "AT":
                EditPdfCheckBox(form, 'p2 - checkbox 12', true);
                break;
            case "AT CHT":
                EditPdfCheckBox(form, 'p2 - checkbox 13', true);
                break;
            case "AT Grave":
                EditPdfCheckBox(form, 'p2 - checkbox 12', true);
                break;
        }

        switch (data.ListeLieuxAt) {
            case "Dans l'entreprise à l'adresse mentionnée ci haut":
                EditPdfCheckBox(form, 'p2 - checkbox 14', true);
                break;
            case "Sur la voie publique":
                EditPdfCheckBox(form, 'p2 - checkbox 15', true);
                break;
            case "A un autre endroit":
                EditPdfCheckBox(form, 'p2 - checkbox 18', true);
                break;
        }

        switch (data.ListeVoiePublic) {
            case "Oui":
                EditPdfCheckBox(form, 'p2 - checkbox 16', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p2 - checkbox 17', true);
                break;
        }

        switch (data.ListeTypedePost) {
            case "Poste de travail habituel ou unité locale habituelle":
                EditPdfCheckBox(form, 'p2 - checkbox 31 1', true);
                break;
            case "Poste de travail occasionnel ou mobile ou en route pour le compte de l'employeur":
                EditPdfCheckBox(form, 'p2 - checkbox 31 2', true);
                break;
            case "Autre poste de travail":
                EditPdfCheckBox(form, 'p2 - checkbox 31 3', true);
                break;
        }

        switch (data.ListeProfHabituelle) {
            case "Oui":
                EditPdfCheckBox(form, 'p2 - checkbox 31 4', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p2 - checkbox 31 5', true);
                break;
        }

        switch (data.ListeProcesVerbal) {
            case "Oui":
                EditPdfCheckBox(form, 'p2 - checkbox 35 1', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p2 - checkbox 35 2', true);
                break;
            case "Réponce inconnue":
                EditPdfCheckBox(form, 'p2 - checkbox 35 3', true);
                break;
        }

        switch (data.ListeTierResponsable) {
            case "Oui":
                EditPdfCheckBox(form, 'p2 - checkbox 36 1', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p2 - checkbox 36 2', true);
                break;
            case "Réponce inconnue":
                EditPdfCheckBox(form, 'p2 - checkbox 36 3', true);
                break;
        }

        switch (data.ListeTemoins) {
            case "Oui":
                EditPdfCheckBox(form, 'p2 - checkbox 37 1', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p2 - checkbox 37 2', true);
                break;
            case "Réponce inconnue":
                EditPdfCheckBox(form, 'p2 - checkbox 37 3', true);
                break;
        }

        switch (data.ListeSoinsMedicaux) {
            case "Oui":
                EditPdfCheckBox(form, 'p3_41 1', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p3_41 2', true);
                break;
        }

        switch (data.ListeSoinsMedicauxMedecin) {
            case "Oui":
                EditPdfCheckBox(form, 'p3_15', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p3_16', true);
                break;
            case "Réponce inconnue":
                EditPdfCheckBox(form, 'p3_17', true);
                break;
        }

        switch (data.ListeSoinsMedicauxHopital) {
            case "Oui":
                EditPdfCheckBox(form, 'p3_30', true);
                break;
            case "Non":
                EditPdfCheckBox(form, 'p3_31', true);
                break;
            case "Réponce inconnue":
                EditPdfCheckBox(form, 'p3_32', true);
                break;
        }

        switch (data.ListeConseqAccident) {
            case "Pas d'incapacité temporaire de travail, pas de prothèses à prévoir":
                EditPdfCheckBox(form, 'p3_45', true);
                break;
            case "Pas d'incapacité temporaire de travail, mais des prothèses à prévoir":
                EditPdfCheckBox(form, 'p3_46', true);
                break;
            case "Occupation temporaire avec travail adapté (prestations réduites ou autre fonction, sans perte de salaire)":
                EditPdfCheckBox(form, 'p3_47', true);
                break;
            case "Incapacité temporaire totale de travail":
                EditPdfCheckBox(form, 'p3_48', true);
                break;
            case "Incapacité permanente de travail à prévoir":
                EditPdfCheckBox(form, 'p3_54', true);
                break;
            case "Décès":
                EditPdfCheckBox(form, 'p3_55', true);
                break;
        }

        switch (data.ListeVictimeOnss) {
            case "Oui":
                EditPdfCheckBox(form, '1 checkbox', true);
                break;
            case "Non":
                EditPdfCheckBox(form, '2 checkbox 1', true);
                break;
        }

        switch (data.ListeCategoProfess) {
            case "Ouvrier":
                EditPdfCheckBox(form, '5 checkbox 2', true);
                break;
            case "Employé":
                EditPdfCheckBox(form, '6 checkbox 3', true);
                break;
            case "Apprenti/stagiaire assujetti à L’ONSS":
                EditPdfCheckBox(form, '7 checkbox 4', true);
                break;
            case "Apprenti/stagiaire non assujetti à l’ONSS":
                EditPdfCheckBox(form, '8 checkbox 5', true);
                break;
            case "Employé de maison":
                EditPdfCheckBox(form, '9 checkbox 5', true);
                break;
            case "Autre (à préciser)":
                EditPdfCheckBox(form, '10 checkbox 6', true);
                break;
        }

        switch (data.ListeNonOnss) {
            case "F1":
                EditPdfCheckBox(form, '12 F1', true);
                break;
            case "F2 passez à la question 65":
                EditPdfCheckBox(form, '13 F2', true);
                break;
        }

        switch (data.ListeApprentiFormat) {
            case "Oui (passez à la question 65)":
                EditPdfCheckBox(form, '14 checkbox 9', true);
                break;
            case "Non":
                EditPdfCheckBox(form, '15 checkbox 10', true);
                break;
        }

        switch (data.ListeTypeContrat) {
            case "A temps plein":
                EditPdfCheckBox(form, '20 checkbox 11', true);
                break;
            case "A temps partiel":
                EditPdfCheckBox(form, '21 checkbox 12', true);
                break;
        }

        switch (data.ListeVictiPension) {
            case "Oui":
                EditPdfCheckBox(form, '28 checkbox 14', true);
                break;
            case "Non":
                EditPdfCheckBox(form, '29 checkbox 15', true);
                break;
        }

        switch (data.ListeModeRemuneration) {
            case "Rémunération fixe":
                EditPdfCheckBox(form, '30 checkbox 13', true);
                break;
            case "A la pièce ou à la tâche ou à façon":
                EditPdfCheckBox(form, '31 checkbox 14', true);
                break;
            case "A la commission (totalement ou partiellement)":
                EditPdfCheckBox(form, '32 checkbox 15', true);
                break;
        }

        switch (data.ListeMontantRemuneration) {
            case "Heure":
                EditPdfCheckBox(form, '33 checkbox 16', true);
                break;
            case "Jour":
                EditPdfCheckBox(form, '34 checkbox 17', true);
                break;
            case "Semaine":
                EditPdfCheckBox(form, '35', true);
                break;
            case "Mois":
                EditPdfCheckBox(form, '37', true);
                break;
            case "Trimestre":
                EditPdfCheckBox(form, '37 1', true);
                break;
            case "Année":
                EditPdfCheckBox(form, '38', true);
                break;
        }

        switch (data.ListePrimeFinAnnee) {
            case "Oui":
                EditPdfCheckBox(form, '41', true);
                break;
            case "Non":
                EditPdfCheckBox(form, '42', true);
                break;
        }

        switch (data.ListechangementFonction) {
            case "Oui":
                EditPdfCheckBox(form, '52', true);
                break;
            case "Non":
                EditPdfCheckBox(form, '53', true);
                break;
        }

        EditPdfTextField(form, '24 nationaliteit', data.nationalité);
        EditPdfTextField(form, '29 mailadres', data.adresseMail);
        EditPdfTextField(form, '30 straat', data.adresseRue);
        EditPdfTextField(form, '31 telefoon', data.telephone);
        EditPdfTextField(form, '32 postcode', data.adresseCodepostal);
        EditPdfTextField(form, '33 gemeente', data.adresseCommune);
        EditPdfTextField(form, '34 land', data.adressePays);
        EditPdfTextField(form, '35 correspondentieadres', data.adresseRuecorrespondance);
        EditPdfTextField(form, '36', data.adresseRuecorrespondance);
        EditPdfTextField(form, '37 telefoon', data.telephoneCorrespondance);
        EditPdfTextField(form, '38 postcode 1', data.adresseCodecorrespondance);
        EditPdfTextField(form, '39 gemeente', data.adresseCommunecorrespondance);
        EditPdfTextField(form, '40 land 4', data.ListeadressePaysCorrespondance);
        EditPdfTextField(form, '47 code', data.CodeMutuelle);
        EditPdfTextField(form, '48 naam', data.nomMutuelle);
        EditPdfTextField(form, '49 straat', data.adresseRueMutuelle);
        EditPdfTextField(form, '50 postcode', data.adresseCodepostalMutuelle);
        EditPdfTextField(form, '51 gemeente', data.adresseCommuneMutuelle);
        EditPdfTextField(form, '52 aansluitingsnummer', data.numAffiliation);
        //num de compte bancaire numCompteBancaire
        if (data.numCompteBancaire !== undefined && data.numCompteBancaire !== null) {
            EditPdfTextField(form, '53 iban', (data.numCompteBancaire.substring(0, 4)));
            EditPdfTextField(form, '53 iban 1', (data.numCompteBancaire.substring(5, 9)));
            EditPdfTextField(form, '53 iban 2', (data.numCompteBancaire.substring(10, 14)));
            EditPdfTextField(form, '53 iban 3', (data.numCompteBancaire.substring(15, 19)));
            EditPdfTextField(form, '53 iban 4', (data.numCompteBancaire.substring(20, 24)));
            EditPdfTextField(form, '53 iban 5', (data.numCompteBancaire.substring(25, 29)));
            EditPdfTextField(form, '53 iban 6', (data.numCompteBancaire.substring(30, 34)));
            EditPdfTextField(form, '53 iban 7', (data.numCompteBancaire.substring(35, 39)));
            EditPdfTextField(form, '53 iban 8', (data.numCompteBancaire.substring(40, 42)));
        };
        //BIC etabliFinancier


        if (data.etabliFinancier !== undefined && data.etabliFinancier !== null) {
            EditPdfTextField(form, '54 BIC', (data.etabliFinancier.substring(0, 4)));
            EditPdfTextField(form, '54 BIC 1', (data.etabliFinancier.substring(5, 7)));
            EditPdfTextField(form, '54 BIC 2', (data.etabliFinancier.substring(8, 13)));
        };

        EditPdfTextField(form, '55 nummer tewerkstelling', data.numDimona);
        if (data.dateEntrEntreprise !== undefined && data.dateEntrEntreprise !== null) {
            EditPdfTextField(form, '56 datum 2', (data.dateEntrEntreprise.substring(0, 4)));
            EditPdfTextField(form, '56 datum 1', (data.dateEntrEntreprise.substring(5, 7)));
            EditPdfTextField(form, '56 datum', (data.dateEntrEntreprise.substring(8, 10)));
        };
        if (data.dateSortie !== undefined && data.dateSortie !== null) {
            EditPdfTextField(form, '61 datum 5', (data.dateSortie.substring(0, 4)));
            EditPdfTextField(form, '61 datum 4', (data.dateSortie.substring(5, 7)));
            EditPdfTextField(form, '61 datum 3', (data.dateSortie.substring(8, 10)));
        };
        EditPdfTextField(form, '62 onderneming', data.profesEntreprise);
        EditPdfTextField(form, '63 code', data.citp);
        //EditPdfTextField(form, '63bis', data.ListeDureeDsEntreprise); chekbox
        //interimaire
        //si interimaire num onss de l'entreprise
        EditPdfTextField(form, '71', data.VicInterimaireOuiNom);
        EditPdfTextField(form, '72', data.VicInterimaireOuiAdresse);
        //travaille extérieur
        EditPdfTextField(form, '77', data.VicTravailExtOuiNom);
        EditPdfTextField(form, '78', data.VicTravailExtOuiAdresse);
        //jour de l'accident
        //date de l'accident
        if (data.DateHeureAccident !== undefined && data.DateHeureAccident !== null) {
            EditPdfTextField(form, 'p2_4', (data.DateHeureAccident.substring(0, 4)));
            EditPdfTextField(form, 'p2_3', (data.DateHeureAccident.substring(5, 7)));
            EditPdfTextField(form, 'p2_2', (data.DateHeureAccident.substring(8, 10)));
            EditPdfTextField(form, 'p2_5', (data.DateHeureAccident.substring(13, 15)));
            EditPdfTextField(form, 'p2_6', (data.DateHeureAccident.substring(16, 18)));
        };
        //date et heure de notification a l'employeur
        if (data.dateNotifEmployeur !== undefined && data.dateNotifEmployeur !== null) {
            EditPdfTextField(form, 'p2_9', (data.dateNotifEmployeur.substring(0, 4)));
            EditPdfTextField(form, 'p2_8', (data.dateNotifEmployeur.substring(5, 7)));
            EditPdfTextField(form, 'p2_7', (data.dateNotifEmployeur.substring(8, 10)));
            EditPdfTextField(form, 'p2_10', (data.dateNotifEmployeur.substring(13, 15)));
            EditPdfTextField(form, 'p2_11', (data.dateNotifEmployeur.substring(16, 18)));
        };
        //Nature de l'accident
        //Horaire de la victime le jours de l'AT
        if (data.horaireJourAccident !== undefined && data.horaireJourAccident !== null) {
            EditPdfTextField(form, 'p2_12', (data.horaireJourAccident.substring(3, 5)));
            EditPdfTextField(form, 'p2_13', (data.horaireJourAccident.substring(6, 8)));
            EditPdfTextField(form, 'p2_14', (data.horaireJourAccident.substring(11, 13)));
            EditPdfTextField(form, 'p2_15', (data.horaireJourAccident.substring(14, 16)));
            EditPdfTextField(form, 'p2_16', (data.horaireJourAccident.substring(23, 25)));
            EditPdfTextField(form, 'p2_17', (data.horaireJourAccident.substring(26, 28)));
            EditPdfTextField(form, 'p2_18', (data.horaireJourAccident.substring(31, 33)));
            EditPdfTextField(form, 'p2_19', (data.horaireJourAccident.substring(34, 36)));
        };
        //Lieux de l'at
        EditPdfTextField(form, 'p2_20', data.LieuxAtAdresse);
        EditPdfTextField(form, 'p2_21', data.LieuxAtCodePostal);
        EditPdfTextField(form, 'p2_22', data.LieuxAtCommune);
        EditPdfTextField(form, 'p2_23', data.ListeLieuxAtPays);
        //EditPdfTextField(form, 'p2_24', data.NumdeChantier);
        EditPdfTextField(form, 'p2_28-2', data.environementLieux);
        EditPdfTextField(form, 'p2_290', data.activiteGenerale);
        EditPdfTextField(form, 'p2_300', data.activiteSpecifique);
        //type de poste
        EditPdfTextField(form, 'p2_31 6', data.ListeProfHabituelleNon);
        EditPdfTextField(form, 'p2_51', data.evenementDeviant);
        EditPdfTextField(form, 'p2_33', data.codeDeviation);
        if (data.codeDeviation !== undefined && data.codeDeviation !== null) {
            EditPdfTextField(form, 'p2_33-2', (data.codeDeviation.substring(0, 2)));
        };
        //code p2_33-2
        EditPdfTextField(form, 'p2_34', data.codeAgentMateriel);
        if (data.codeAgentMateriel !== undefined && data.codeAgentMateriel !== null) {
            EditPdfTextField(form, 'p2_35', (data.codeAgentMateriel.substring(0, 2)));
            EditPdfTextField(form, 'p2_36', (data.codeAgentMateriel.substring(3, 5)));
        };
        //code p2_35 p2_36
        //proces verbal
        EditPdfTextField(form, 'p2_37', data.ProcesVerbalOui);
        EditPdfTextField(form, 'p2_38', data.ProcesVerbalOuiRedige);
        //date du proces verbal
        if (data.dateProcesVerbalOuiRedigeQuand !== undefined && data.dateProcesVerbalOuiRedigeQuand !== null) {
            EditPdfTextField(form, 'p2_41', (data.dateProcesVerbalOuiRedigeQuand.substring(0, 4)));
            EditPdfTextField(form, 'p2_40', (data.dateProcesVerbalOuiRedigeQuand.substring(5, 7)));
            EditPdfTextField(form, 'p2_39', (data.dateProcesVerbalOuiRedigeQuand.substring(8, 10)));
        };
        EditPdfTextField(form, 'p2_42', data.ProcesVerbalOuiPar);
        //thier responsable
        EditPdfTextField(form, 'p2_43', data.TierResponsableOui);
        EditPdfTextField(form, 'p2_44', data.TierResponsableOuiNomAdresse);
        EditPdfTextField(form, 'p2_45', data.TierResponsableOuiNumPolice);
        //Témoins
        EditPdfTextField(form, 'p2_49', data.TemoinsOui);
        //+++++++++++EditPdfTextField(form, 'p2_47', data.TemoinDirecte);+++++++++++ probleme fait un bug
        EditPdfTextField(form, 'p3_38-1', data.blessureVictume);
        EditPdfTextField(form, 'p3_39', data.codeNatureLesion);
        if (data.codeNatureLesion !== undefined && data.codeNatureLesion !== null) {
            EditPdfTextField(form, 'p3_39 2', (data.codeNatureLesion.substring(0, 3)));
        };
        //code p3_39 2
        EditPdfTextField(form, 'p3_40', data.codeSiegeLesion);
        if (data.codeSiegeLesion !== undefined && data.codeSiegeLesion !== null) {
            EditPdfTextField(form, 'p3_40 2', (data.codeSiegeLesion.substring(0, 2)));
        };
        //code p3_40 2
        //soin médic chez employeur oui  non
        //si oui date et heure soin médic chez employeur
        if (data.dateSoinsMedicauxDate !== undefined && data.dateSoinsMedicauxDate !== null) {
            EditPdfTextField(form, 'p3_41 5', (data.dateSoinsMedicauxDate.substring(0, 4)));
            EditPdfTextField(form, 'p3_41 4', (data.dateSoinsMedicauxDate.substring(5, 7)));
            EditPdfTextField(form, 'p3_41 3', (data.dateSoinsMedicauxDate.substring(8, 10)));
            EditPdfTextField(form, 'p3_11', (data.dateSoinsMedicauxDate.substring(13, 15)));
            EditPdfTextField(form, 'p3_12', (data.dateSoinsMedicauxDate.substring(16, 18)));
        };
        EditPdfTextField(form, 'p3_13', data.SoinsMedicauxDispansateur);
        EditPdfTextField(form, 'p3_14', data.SoinsMedicauxDescriptions);
        //soin medic medecin externe oui non
        //date et heure soin medic medecin externe
        if (data.dateSoinsMedicauxMedecin !== undefined && data.dateSoinsMedicauxMedecin !== null) {
            EditPdfTextField(form, 'p3_20', (data.dateSoinsMedicauxMedecin.substring(0, 4)));
            EditPdfTextField(form, 'p3_19', (data.dateSoinsMedicauxMedecin.substring(5, 7)));
            EditPdfTextField(form, 'p3_18', (data.dateSoinsMedicauxMedecin.substring(8, 10)));
            EditPdfTextField(form, 'p3_21', (data.dateSoinsMedicauxMedecin.substring(13, 15)));
            EditPdfTextField(form, 'p3_22', (data.dateSoinsMedicauxMedecin.substring(16, 18)));
        };
        //num inami
        if (data.SoinsMedicauxMedecinInami !== undefined && data.SoinsMedicauxMedecinInami !== null) {
            EditPdfTextField(form, 'p3_23', (data.SoinsMedicauxMedecinInami.substring(0, 8)));
            EditPdfTextField(form, 'p3_24', (data.SoinsMedicauxMedecinInami.substring(9, 12)));
        };
        EditPdfTextField(form, 'p3_26', data.SoinsMedicauxMedecinNom);
        EditPdfTextField(form, 'p3_27', data.SoinsMedicauxMedecinRue);
        EditPdfTextField(form, 'p3_28', data.SoinsMedicauxMedecinCodePostal);
        EditPdfTextField(form, 'p3_29', data.SoinsMedicauxMedecinCommune);
        //soin hopital oui non
        //si oui date et heure soin hopital
        if (data.dateSoinsMedicauxHopital !== undefined && data.dateSoinsMedicauxHopital !== null) {
            EditPdfTextField(form, 'p3_35', (data.dateSoinsMedicauxHopital.substring(0, 4)));
            EditPdfTextField(form, 'p3_34', (data.dateSoinsMedicauxHopital.substring(5, 7)));
            EditPdfTextField(form, 'p3_33', (data.dateSoinsMedicauxHopital.substring(8, 10)));
            EditPdfTextField(form, 'p3_36', (data.dateSoinsMedicauxHopital.substring(13, 15)));
            EditPdfTextField(form, 'p3_37', (data.dateSoinsMedicauxHopital.substring(16, 18)));
        };
        //inami
        if (data.SoinsMedicauxHopitalInami !== undefined && data.SoinsMedicauxHopitalInami !== null) {
            EditPdfTextField(form, 'p3_38', (data.SoinsMedicauxHopitalInami.substring(0, 8)));
            EditPdfTextField(form, 'p3_39_1', (data.SoinsMedicauxHopitalInami.substring(9, 12)));
        };

        EditPdfTextField(form, 'p3_41', data.SoinsMedicauxHopitaldenomi);
        EditPdfTextField(form, 'p3_42', data.SoinsMedicauxHopitalRue);
        EditPdfTextField(form, 'p3_43', data.SoinsMedicauxHopitalCodePostal);
        EditPdfTextField(form, 'p3_44', data.SoinsMedicauxHopitalCommune);
        //conséquences 
        //date occupation temporaire addapté
        if (data.dateTravailAddapte !== undefined && data.dateTravailAddapte !== null) {
            EditPdfTextField(form, 'p3_65', (data.dateTravailAddapte.substring(0, 4)));
            EditPdfTextField(form, 'p3_64', (data.dateTravailAddapte.substring(5, 7)));
            EditPdfTextField(form, 'p3_63', (data.dateTravailAddapte.substring(8, 10)));
        };
        //date et heure incapacité temporaire
        if (data.dateIncapaciteTemporaire !== undefined && data.dateIncapaciteTemporaire !== null) {
            EditPdfTextField(form, 'p3_51', (data.dateIncapaciteTemporaire.substring(0, 4)));
            EditPdfTextField(form, 'p3_50', (data.dateIncapaciteTemporaire.substring(5, 7)));
            EditPdfTextField(form, 'p3_49', (data.dateIncapaciteTemporaire.substring(8, 10)));
            EditPdfTextField(form, 'p3_52', (data.dateIncapaciteTemporaire.substring(13, 15)));
            EditPdfTextField(form, 'p3_53', (data.dateIncapaciteTemporaire.substring(16, 18)));
        };
        //date reprise du travail
        //date déces
        if (data.dateDece !== undefined && data.dateDece !== null) {
            EditPdfTextField(form, 'p3_58', (data.dateDece.substring(0, 4)));
            EditPdfTextField(form, 'p3_57', (data.dateDece.substring(5, 7)));
            EditPdfTextField(form, 'p3_56', (data.dateDece.substring(8, 10)));
        };
        //date reprise effective
        if (data.dateRepriseEffective !== undefined && data.dateRepriseEffective !== null) {
            EditPdfTextField(form, 'p3_61', (data.dateRepriseEffective.substring(0, 4)));
            EditPdfTextField(form, 'p3_60', (data.dateRepriseEffective.substring(5, 7)));
            EditPdfTextField(form, 'p3_59', (data.dateRepriseEffective.substring(8, 10)));
        };
        //nbr jours
        EditPdfCheckBox(form, 'p3_47 1', data.boolAucun);
        EditPdfCheckBox(form, 'p3_47 2', data.boolCasque);
        EditPdfCheckBox(form, 'p3_47 3', data.boolVeste);
        EditPdfCheckBox(form, 'p3_47 4', data.boolMaire);
        EditPdfCheckBox(form, 'p3_47 5', data.boolChute);
        EditPdfCheckBox(form, 'p3_47 6', data.boolGant);
        EditPdfCheckBox(form, 'p3_47 7', data.boolTenue);
        EditPdfCheckBox(form, 'p3_47 8', data.boolFiltre);
        EditPdfCheckBox(form, 'p3_47 9', data.boolAutre);
        EditPdfCheckBox(form, 'p3_47 10', data.boolLunette);
        EditPdfCheckBox(form, 'p3_47 11', data.boolAuditive);
        EditPdfCheckBox(form, 'p3_47 12', data.boolMasque);
        EditPdfCheckBox(form, 'p3_47 13', data.boolEcran);
        EditPdfCheckBox(form, 'p3_47 14', data.boolChausure);
        EditPdfTextField(form, 'p3_48 1', data.ListeMesureRepetition);
        if (data.ListeMesureRepetition !== undefined && data.ListeMesureRepetition !== null) {
            EditPdfTextField(form, 'p3_48 2', (data.ListeMesureRepetition.substring(0, 2)));
        };
        //code
        EditPdfTextField(form, 'p3_48 3', data.ListeMesureRepetition2);
        if (data.ListeMesureRepetition2 !== undefined && data.ListeMesureRepetition2 !== null) {
            EditPdfTextField(form, 'p3_48 4', (data.ListeMesureRepetition2.substring(0, 2)));
        };
        //code
        if (data.CodeRisqueEntreprise !== undefined && data.CodeRisqueEntreprise !== null) {
            EditPdfTextField(form, 'p3_49 1', (data.CodeRisqueEntreprise.substring(0, 9)));
            EditPdfTextField(form, 'p3_49 2', (data.CodeRisqueEntreprise.substring(10, 19)));
            EditPdfTextField(form, 'p3_49 3', (data.CodeRisqueEntreprise.substring(20, 29)));
            EditPdfTextField(form, 'p3_49 4', (data.CodeRisqueEntreprise.substring(30, 39)));
            EditPdfTextField(form, 'p3_49 5', (data.CodeRisqueEntreprise.substring(40, 49)));
        };

        //affiliée onss
        EditPdfTextField(form, '3 reden', data.victimeOnssNon);
        EditPdfTextField(form, '4', data.codeTravailleurSocial);
        //cat professionnel
        EditPdfTextField(form, '11 andere', data.CategoProfessAutre);
        //F1 ou F2
        //apprenti en formation chef d'entreprise
        EditPdfTextField(form, '16', data.CommissionParitaireDénomination);
        //com par num
        //type de contra
        //nbr jours/semaine centieme
        //nbr heures/semaine centieme
        //nbr heures/semaine reference
        //type de rémuneation
        //unité de temps
        EditPdfTextField(form, '39', data.MontantRemunerationVariable);
        EditPdfTextField(form, '40', data.remunerationTotalAssOnns);
        //prime fin d'annee
        EditPdfTextField(form, '45', data.PrimeFinAnneeRemuAnnuel);
        EditPdfTextField(form, '47', data.PrimeFinAnneeRemuAnnuelForfetaire);
        EditPdfTextField(form, '49', data.PrimeFinAnneeRemuAnnuelNbrHeure);
        EditPdfTextField(form, '50', data.AvantegeAssujOnns);
        EditPdfTextField(form, '51', data.AvantegeAssujOnnsNature);
        //change fonction
        //date chang de fonction
        if (data.dateChangementFonction !== undefined && data.dateChangementFonction !== null) {
            EditPdfTextField(form, '56', (data.dateChangementFonction.substring(0, 4)));
            EditPdfTextField(form, '55', (data.dateChangementFonction.substring(5, 7)));
            EditPdfTextField(form, '54', (data.dateChangementFonction.substring(8, 10)));
        };
        EditPdfTextField(form, '57', data.heureTravaillePerdu);
        EditPdfTextField(form, '58', data.salaireTravaillePerdu);
        //secrétaria social nom
        //numéro affiliation
        //rue
        //code postal
        //commune

        // Save the PDF document
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const fileName = `${data.DateHeureAccident.substring(0, 10)}_${data.entrepriseName}_${data.nomTravailleur}_${data.prenomTravailleur}.pdf`;


        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // For Internet Explorer
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            // For other browsers
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url); // Release the URL
        }
    } catch (error) {
        console.error('Error editing PDF:', error);
    }
}
