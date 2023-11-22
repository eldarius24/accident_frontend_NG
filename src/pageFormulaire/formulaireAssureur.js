/* IMPORT REACT */
import { useState} from 'react';
/* IMPORT MUI */
import { TextField, FormGroup} from '@mui/material';
import datePickerP from '../composants/datePickerP';
/* IMPORT PERSO */
import listAssureur from '../liste/listAssureur.json';
import AutoCompleteP from '../composants/autoCompleteP';
import controlLabelP from '../composants/controlLabelP';



export default function FormulaireAssureur({setValue, accidentData}) {

  const [ NumeroPoliceAssurance, setNumeroPoliceAssurance] = useState(accidentData ? accidentData.NumeroPoliceAssurance : "");
  setValue('NumeroPoliceAssurance', NumeroPoliceAssurance)

  const [ assureurStatus, setAssureurStatus] = useState(accidentData ? accidentData.AssureurStatus : listAssureur.AssureurStatus[0]);
  setValue('AssureurStatus', assureurStatus)



  //nouveau textfield personnalisé
  function textFieldPerso(id, label) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
        <TextField
          id={id}
          onChange={(e) => setValue({ id }, e.target.value)}
          label={label}
          sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
          multiline
        />
      </div>
    );
  };  

 


  return (
    <div>
      <div className="infoAssureur">
        <h2>Infos Assureur</h2>
        <h3>Rentrez les informations relative a l'assurance.</h3>

        {textFieldPerso("NumeroPoliceAssurance", "Numéro de police d'assurance")}
        {textFieldPerso("referenceduSinistre", "Réference du sinistre")}
        { datePickerP("DateEnvoieDeclarationAccident", "Date d'envoie de la déclaration d'accident") }
        {textFieldPerso("commentaireetSuivit", "Commentaires et suivi (courier, mail)")}
        {textFieldPerso("Getionnaiesinistre", "Getionnaire du sinistre au sein de l'ASBL")}

        {/* *********************************** Autocomplete AssureurStatus **********************************/}
        <AutoCompleteP id='AssureurStatus' option={listAssureur.AssureurStatus} label='Status' onChange={(AssureurStatusSelect) => {
              setAssureurStatus(AssureurStatusSelect);
              setValue('AssureurStatus', AssureurStatusSelect);
          }} defaultValue={assureurStatus}> </AutoCompleteP>

        <div>
          <FormGroup>
            {controlLabelP("boolAssColture", "Cloturé")}
          </FormGroup>
        </div>
      </div>
    </div>
  );
}

