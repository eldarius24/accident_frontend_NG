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
    textField.setText(data); //'LEFEVRE REMY'
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
    fetch('./LeCortilDeclarationBELFIUS.pdf') 
        .then(response => response.arrayBuffer())
        .then(async buffer => {
            const pdfDoc = await PDFDocument.load(buffer);
            console.log(pdfDoc);
            const form = pdfDoc.getForm();


            EditPdfTextField(form, '18 naam getroffene', 'LEFEVRE REMY');
            EditPdfTextField(form, '19 voornaam getroffene', 'REMY');
            EditPdfCheckBox(form, '22 checkbox man', true);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });

            const fileName = 'output.pdf';
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
