/* IMPORT REACT */
import { useState } from 'react';
/* IMPORT MUI */
import { FormGroup, TextField } from '@mui/material';
import DatePickerP from '../composants/datePickerP';
/* IMPORT PERSO */
import listAssureur from '../liste/listAssureur.json';
import AutoCompleteP from '../composants/autoCompleteP';
import ControlLabelP from '../composants/controlLabelP';
import TextFieldP from '../composants/textFieldP';



export default function FormulaireAssureur({ setValue, accidentData}) {

  const [NumeroPoliceAssurance, setNumeroPoliceAssurance] = useState(accidentData ? accidentData.NumeroPoliceAssurance : "");
  setValue('NumeroPoliceAssurance', NumeroPoliceAssurance)

  const [referenceduSinistre, setreferenceduSinistre] = useState(accidentData ? accidentData.referenceduSinistre : "");
  setValue('referenceduSinistre', referenceduSinistre)

  const [DateEnvoieDeclarationAccident, setDateEnvoieDeclarationAccident] = useState(accidentData ? accidentData.DateEnvoieDeclarationAccident : "");
  setValue('DateEnvoieDeclarationAccident', DateEnvoieDeclarationAccident)

  const [commentaireetSuivit, setcommentaireetSuivit] = useState(accidentData ? accidentData.commentaireetSuivit : "");
  setValue('commentaireetSuivit', commentaireetSuivit)

  const [Getionnaiesinistre, setGetionnaiesinistre] = useState(accidentData ? accidentData.Getionnaiesinistre : "");
  setValue('Getionnaiesinistre', Getionnaiesinistre)

  const [assureurStatus, setAssureurStatus] = useState(accidentData ? accidentData.AssureurStatus : listAssureur.AssureurStatus[0]);
  setValue('AssureurStatus', assureurStatus)

  const [boolAsCloture, setboolAsCloture] = useState(accidentData ? accidentData.boolAsCloture : false);
  setValue('boolAsCloture', boolAsCloture)

  return (
    <div>
      <div className="infoAssureur">
        <h2>Infos Assureur</h2>
        <h3>Rentrez les informations relative a l'assurance.</h3>

        {/* *********************************** Numéro de police d'assurance **********************************/}
        <TextFieldP id="NumeroPoliceAssurance" label="Numéro de police d'assurance" onChange={(NumeroPoliceAssuranceSelect) => {
          setNumeroPoliceAssurance(NumeroPoliceAssuranceSelect);
          setValue('NumeroPoliceAssurance', NumeroPoliceAssuranceSelect);
        }} defaultValue={NumeroPoliceAssurance}></TextFieldP>

        {/* *********************************** Réference du sinistre **********************************/}
        <TextFieldP id="referenceduSinistre" label="Réference du sinistre" onChange={(referenceduSinistreText) => {
          setreferenceduSinistre(referenceduSinistreText);
          setValue('referenceduSinistre', referenceduSinistreText);
        }} defaultValue={referenceduSinistre}></TextFieldP>

        {/* *********************************** Date d'envoie de la déclaration d'accident **********************************/}
        <DatePickerP id="DateEnvoieDeclarationAccident" label="Date d'envoie de la déclaration d'accident" onChange={(DateEnvoieDeclarationAccidentChoose) => {
          console.log(DateEnvoieDeclarationAccidentChoose);
          setDateEnvoieDeclarationAccident(DateEnvoieDeclarationAccidentChoose);
          setValue('DateEnvoieDeclarationAccident', DateEnvoieDeclarationAccidentChoose);
        }} defaultValue={DateEnvoieDeclarationAccident}></DatePickerP>

        {/* *********************************** Commentaires et suivi (courier, mail) **********************************/}
        <TextFieldP id="commentaireetSuivit" label="Commentaires et suivi (courier, mail)" onChange={(commentaireetSuivitText) => {
          setcommentaireetSuivit(commentaireetSuivitText);
          setValue('commentaireetSuivit', commentaireetSuivitText);
        }} defaultValue={commentaireetSuivit}></TextFieldP>

        {/* *********************************** Gestionnaire du sinistre au sein de l'ASBL **********************************/}
        <TextFieldP id="Getionnaiesinistre" label="Gestionnaire du sinistre au sein de l'ASBL" onChange={(GetionnaiesinistreText) => {
          setGetionnaiesinistre(GetionnaiesinistreText);
          setValue('Getionnaiesinistre', GetionnaiesinistreText);
        }} defaultValue={Getionnaiesinistre}></TextFieldP>

        {/* *********************************** Autocomplete AssureurStatus **********************************/}
        <AutoCompleteP id='AssureurStatus' option={listAssureur.AssureurStatus} label='Status' onChange={(AssureurStatusSelect) => {
          setAssureurStatus(AssureurStatusSelect);
          setValue('AssureurStatus', AssureurStatusSelect);
        }} defaultValue={assureurStatus}> </AutoCompleteP>

        {/* *********************************** Checkbox Cloturé **********************************/}
        <div>
          <FormGroup>
            <ControlLabelP id="boolAsCloture" label="Cloturé" onChange={(boolAsClotureCoche) => {
              setboolAsCloture(boolAsClotureCoche);
              setValue('boolAsCloture', boolAsClotureCoche);
            }} defaultValue={boolAsCloture}></ControlLabelP>
          </FormGroup>
        </div>
      </div>
    </div>
  );
}

