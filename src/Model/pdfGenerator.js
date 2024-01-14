/**
 * @fileoverview This file contains the functions to generate a pdf file.
 * @packageDocumentation
 * @module pdfGenerator
 * @requires pdf-lib
 * fonction qui permet de modifier un pdf
 */
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');


/**
 * fonction qui permet d'editer un textfield dans un pdf
 * @param {*} form formulaire du pdf
 * @param {*} textFielName nom du textfield
 * @param {*} data donnée à mettre dans le textfield
 */
function EditPdfTextField(form, textFielName, data) {
    const textField = form.getTextField(textFielName); //'18 naam getroffene'
    if (data !== null) {
        textField.setText(data || ""); //'LEFEVRE REMY'
    }
}
/**
 * fonction qui permet d'editer un checkbox dans un pdf
 * @param {*} form formulaire du pdf
 * @param {*} checBkoxName nom du checkbox
 * @param {*} data donnée à mettre dans le checkbox
 */
function EditPdfCheckBox(form, checBkoxName, data) {
    const checkBox = form.getCheckBox(checBkoxName); //'22 checkbox man'
    checkBox.check(data); //true
}



export default async function editPDF(data) {
    try {
        console.log("pdfGenerator.js => parametre data => ",data.DateHeureAccident.substring(13, 18));
        const response = await fetch('./LeCortilDeclarationBELFIUS.pdf');
        const buffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        console.log(pdfDoc);
        const form = pdfDoc.getForm();


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
        //EditPdfCheckBox(form, '22 checkbox man', true); sexe de autocomplete a chekbox '23 checkbox vrouw' sexe
        EditPdfTextField(form, '24 nationaliteit', data.nationalité);
        //EditPdfCheckBox(form, '25 checkbox ', true); etat civil de autocomplete a chekbox '26 checkbox  1' '27 checkbox  2' '28 checkbox  3' etatCivil
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
        //langue de correspondance
        //Parenté avec l'employeur
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
        //durée du contra
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
