/**
 * @fileoverview This file contains the functions to generate a pdf file.
 * @packageDocumentation
 * @module pdfGenerator
 * @requires pdf-lib
 * fonction qui permet de modifier un pdf
 */
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Edit } = require('@mui/icons-material');

/**
 * fonction qui permet d'editer un textfield dans un pdf
 * @param {*} form formulaire du pdf
 * @param {*} textFielName nom du textfield
 * @param {*} data donnée à mettre dans le textfield
 */
function EditPdfTextField(form, textFielName, data) {
    const textField = form.getTextField(textFielName); //'18 naam getroffene'
    if (data !== undefined) {
        textField.setText(data.toString()); //'LEFEVRE REMY'
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
        const response = await fetch('./LeCortilDeclarationBELFIUS.pdf');
        const buffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        console.log(pdfDoc);
        const form = pdfDoc.getForm();

        EditPdfTextField(form, '17 iban 12', data.niss);
        EditPdfTextField(form, '18 naam getroffene', data.nomTravailleur);
        EditPdfTextField(form, '19 voornaam getroffene', data.prenomTravailleur);
        EditPdfTextField(form, '20 geboorteplaats', data.lieuxnaissance);
        //date naissance '21 geboortedatum' '21 geboortedatum 1' '21 geboortedatum 2'
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
        //BIC etabliFinancier
        EditPdfTextField(form, '55 nummer tewerkstelling', data.numDimona);
        //date d entrée en service
        //durée du contra
        //date de sortie
        //si oui date
        EditPdfTextField(form, '62 onderneming', data.profesEntreprise);
        EditPdfTextField(form, '63 code', data.citp);
        //EditPdfTextField(form, '63bis', data.ListeDureeDsEntreprise); chekbox
        EditPdfTextField(form, '64', data.numCompteBancaire);
        //interimaire
        //si interimaire num onss de l'entreprise
        EditPdfTextField(form, '71', data.VicInterimaireOuiNom);
        EditPdfTextField(form, '72', data.VicInterimaireOuiAdresse);
        //travaille extérieur
        EditPdfTextField(form, '77', data.VicTravailExtOuiNom);
        EditPdfTextField(form, '78', data.VicTravailExtOuiAdresse);
        //jour de l'accident
        //date de l'accident
        //Heure de l'accident
        //date et heure de notification a l'employeur
        //Nature de l'accident
        //Horaire de la victime je jours de l'AT
        //Lieux de l'at
        //+++++++++++++++++++++++++++++++CONTINUER A LA QUESTION 27++++++++++++++++++++++++++
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
        //code p2_33-2
        EditPdfTextField(form, 'p2_34', data.codeAgentMateriel);
        //code p2_35 p2_36
        //proces verbal
        EditPdfTextField(form, 'p2_37', data.ProcesVerbalOui);
        EditPdfTextField(form, 'p2_38', data.ProcesVerbalOuiRedige);
        //date
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
        //code p3_39 2
        EditPdfTextField(form, 'p3_40', data.codeSiegeLesion);
        //code p3_40 2
        //soin médic chez employeur oui  non
        //si oui date et heure
        EditPdfTextField(form, 'p3_13', data.SoinsMedicauxDispansateur);
        EditPdfTextField(form, 'p3_14', data.SoinsMedicauxDescriptions);
        //soin medic medecin externe oui non
        //date et heure
        //num inami
        EditPdfTextField(form, 'p3_26', data.SoinsMedicauxMedecinNom);
        EditPdfTextField(form, 'p3_27', data.SoinsMedicauxMedecinRue);
        EditPdfTextField(form, 'p3_28', data.SoinsMedicauxMedecinCodePostal);
        EditPdfTextField(form, 'p3_29', data.SoinsMedicauxMedecinCommune);
        //soin hopital oui non
        //si oui date et heure
        //inami
        EditPdfTextField(form, 'p3_41', data.SoinsMedicauxHopitaldenomi);
        EditPdfTextField(form, 'p3_42', data.SoinsMedicauxHopitalRue);
        EditPdfTextField(form, 'p3_43', data.SoinsMedicauxHopitalCodePostal);
        EditPdfTextField(form, 'p3_44', data.SoinsMedicauxHopitalCommune);
        //conséquences et date
        //date reprise
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
        //code
        EditPdfTextField(form, 'p3_48 3', data.ListeMesureRepetition2);
        //code
        EditPdfTextField(form, 'p3_49 1', data.CodeRisqueEntreprise);
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
        //date
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

        const fileName = 'output.pdf';
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
