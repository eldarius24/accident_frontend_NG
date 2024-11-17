import { useState, useEffect } from 'react';
import DatePickerP from '../_composants/datePickerP';
import listAssureur from '../liste/listAssureur.json';
import AutoCompleteP from '../_composants/autoCompleteP';
import TextFieldP from '../_composants/textFieldP';
import { useTheme } from '../pageAdmin/user/ThemeContext';

/**
 * Formulaire Assureur
 * 
 * - Stocke les données dans des variables locales et les initialisent avec les données de l'accident si elles existent
 * - Met à jour les données du formulaire à chaque modification d'un des champs
 * - Retourne le formulaire (IHMs) :
 *   - Numéro de police d'assurance
 *   - Réference du sinistre
 *   - Date d'envoie de la déclaration d'accident
 *   - Commentaires et suivi (courier, mail)
 *   - Gestionnaire du sinistre au sein de l'ASBL
 *   - Autocomplete AssureurStatus
 *   - Checkbox Cloturé
 * 
 * @param {{ setValue: (string, any) => void; accidentData: any; watch: (string) => any }} props
 * @returns {JSX.Element}
 */
export default function FormulaireAssureur({ setValue, accidentData, watch }) {
  const { darkMode } = useTheme();
  /**
 * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
 * 
 */
  const [NumeroPoliceAssurance, setNumeroPoliceAssurance] = useState(watch('NumeroPoliceAssurance') ? watch('NumeroPoliceAssurance') : (accidentData && accidentData.NumeroPoliceAssurance ? accidentData.NumeroPoliceAssurance : ""));
  const [referenceduSinistre, setreferenceduSinistre] = useState(watch('referenceduSinistre') ? watch('referenceduSinistre') : (accidentData && accidentData.referenceduSinistre ? accidentData.referenceduSinistre : ""));
  const [DateEnvoieDeclarationAccident, setDateEnvoieDeclarationAccident] = useState(watch('DateEnvoieDeclarationAccident') ? watch('DateEnvoieDeclarationAccident') : (accidentData && accidentData.DateEnvoieDeclarationAccident ? accidentData.DateEnvoieDeclarationAccident : ""));
  const [commentaireetSuivit, setcommentaireetSuivit] = useState(watch('commentaireetSuivit') ? watch('commentaireetSuivit') : (accidentData && accidentData.commentaireetSuivit ? accidentData.commentaireetSuivit : ""));
  const [Getionnaiesinistre, setGetionnaiesinistre] = useState(watch('Getionnaiesinistre') ? watch('Getionnaiesinistre') : (accidentData && accidentData.Getionnaiesinistre ? accidentData.Getionnaiesinistre : ""));
  const [assureurStatus, setAssureurStatus] = useState(watch('AssureurStatus') ? watch('AssureurStatus') : (accidentData && accidentData.AssureurStatus ? accidentData.AssureurStatus : null));

  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => {
    setValue('NumeroPoliceAssurance', NumeroPoliceAssurance)
    setValue('referenceduSinistre', referenceduSinistre)
    setValue('DateEnvoieDeclarationAccident', DateEnvoieDeclarationAccident)
    setValue('commentaireetSuivit', commentaireetSuivit)
    setValue('Getionnaiesinistre', Getionnaiesinistre)
    setValue('AssureurStatus', assureurStatus)
  }, [NumeroPoliceAssurance, referenceduSinistre, DateEnvoieDeclarationAccident, commentaireetSuivit, Getionnaiesinistre, assureurStatus, setValue]);

  /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
  return (
    <div>
      <div className="infoAssureur">
        <h2>Infos Assureur</h2>
        <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Rentrez les informations relative a l'assurance.</h3>

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
          setDateEnvoieDeclarationAccident(DateEnvoieDeclarationAccidentChoose);
          setValue('DateEnvoieDeclarationAccident', DateEnvoieDeclarationAccidentChoose);
        }} defaultValue={DateEnvoieDeclarationAccident}></DatePickerP>

        {/* *********************************** Commentaires et suivi (courier, mail) **********************************/}
        <TextFieldP id="commentaireetSuivit" label="Commentaires et suivi (courier, mail)" onChange={(commentaireetSuivitText) => {
          setcommentaireetSuivit(commentaireetSuivitText);
          setValue('commentaireetSuivit', commentaireetSuivitText);
        }} defaultValue={commentaireetSuivit}></TextFieldP>

        {/* *********************************** Gestionnaire du sinistre au sein de l'ASBL **********************************/}
        <TextFieldP id="Getionnaiesinistre" label="Gestionnaire du sinistre au sein de l'entreprise" onChange={(GetionnaiesinistreText) => {
          setGetionnaiesinistre(GetionnaiesinistreText);
          setValue('Getionnaiesinistre', GetionnaiesinistreText);
        }} defaultValue={Getionnaiesinistre}></TextFieldP>

        {/* *********************************** Autocomplete AssureurStatus **********************************/}
        <AutoCompleteP id='AssureurStatus' option={listAssureur.AssureurStatus} label='Status' onChange={(AssureurStatusSelect) => {
          setAssureurStatus(AssureurStatusSelect);
          setValue('AssureurStatus', AssureurStatusSelect);
        }} defaultValue={assureurStatus}> </AutoCompleteP>
      </div>
    </div>
  );
}

