import { useState, useEffect } from 'react';
import DatePickerP from '../_composants/datePickerP';
import listAssureur from '../liste/listAssureur.json';
import AutoCompleteP from '../_composants/autoCompleteP';
import TextFieldP from '../_composants/textFieldP';
import { useTheme } from '../Hook/ThemeContext';
import { Box, Typography } from '@mui/material';

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            margin: '1.5rem 0',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '45px',
              background: darkMode
                ? 'rgba(122,142,28,0.1)'
                : 'rgba(238,117,45,0.1)',
              filter: 'blur(10px)',
              borderRadius: '10px',
              zIndex: 0
            }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              fontWeight: 600,
              background: darkMode
                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                : 'linear-gradient(45deg, #ee752d, #f4a261)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              position: 'relative',
              padding: '0.5rem 1.5rem',
              zIndex: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                  : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
              }
            }}
          >
            Infos Assureur
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.5,
              pointerEvents: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
              }
            }}
          />
        </Box>
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

