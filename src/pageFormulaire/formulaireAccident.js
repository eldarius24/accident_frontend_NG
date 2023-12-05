/*IMPORT REACT */
import { useState, useEffect } from 'react';
/* IMPORT MUI */
import { FormGroup, Grid, Autocomplete, TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');
/* IMPORT PERSO */
import listAccident from '../liste/listAccident.json';
import ControlLabelP from '../composants/controlLabelP';
import TextFieldP from '../composants/textFieldP';
import AutoCompleteP from '../composants/autoCompleteP';
import DatePickerP from '../composants/datePickerP';
import DateHeurePickerP from '../composants/dateHeurePickerP';




export default function FormulaireAccident({ setValue, accidentData, watch }) {

  /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
  const [typeAccident, setTypeAccident] = useState(watch('typeAccident') ? watch('typeAccident') : (accidentData && accidentData.typeAccident ? accidentData.typeAccident : ""));
  const [circonstanceAccident, setCirconstanceAccident] = useState(watch('circonstanceAccident') ? watch('circonstanceAccident') : (accidentData && accidentData.circonstanceAccident ? accidentData.circonstanceAccident : ""));
  const [DateHeureAccident, setDateHeureAccident] = useState(watch('DateHeureAccident') ? watch('DateHeureAccident') : (accidentData && accidentData.DateHeureAccident ? accidentData.DateHeureAccident : null));
  const [DateJourIncapDebut, setDateJourIncapDebut] = useState(watch('DateJourIncapDebut') ? watch('DateJourIncapDebut') : (accidentData && accidentData.DateJourIncapDebut ? accidentData.DateJourIncapDebut : null));
  const [DateJourIncapFin, setDateJourIncapFin] = useState(watch('DateJourIncapFin') ? watch('DateJourIncapFin') : (accidentData && accidentData.DateJourIncapFin ? accidentData.DateJourIncapFin : null));
  const [indemnisationAccident, setIndemnisationAccident] = useState(watch('indemnisationAccident') ? watch('indemnisationAccident') : (accidentData && accidentData.indemnisationAccident ? accidentData.indemnisationAccident : ""));
  const [blessures, setBlessures] = useState(watch('blessures') ? watch('blessures') : (accidentData && accidentData.blessures ? accidentData.blessures : ""));
  const [boolAucun, setBoolAucun] = useState(watch('boolAucun') ? watch('boolAucun') : (accidentData && accidentData.boolAucun ? accidentData.boolAucun : false));
  const [boolChausure, setBoolChausure] = useState(watch('boolChausure') ? watch('boolChausure') : (accidentData && accidentData.boolChausure ? accidentData.boolChausure : false));
  const [boolLunette, setBoolLunette] = useState(watch('boolLunette') ? watch('boolLunette') : (accidentData && accidentData.boolLunette ? accidentData.boolLunette : false));
  const [boolGant, setBoolGant] = useState(watch('boolGant') ? watch('boolGant') : (accidentData && accidentData.boolGant ? accidentData.boolGant : false));
  const [boolCasque, setBoolCasque] = useState(watch('boolCasque') ? watch('boolCasque') : (accidentData && accidentData.boolCasque ? accidentData.boolCasque : false));
  const [boolAuditive, setBoolAuditive] = useState(watch('boolAuditive') ? watch('boolAuditive') : (accidentData && accidentData.boolAuditive ? accidentData.boolAuditive : false));
  const [boolMasque, setBoolMasque] = useState(watch('boolMasque') ? watch('boolMasque') : (accidentData && accidentData.boolMasque ? accidentData.boolMasque : false));
  const [boolEcran, setBoolEcran] = useState(watch('boolEcran') ? watch('boolEcran') : (accidentData && accidentData.boolEcran ? accidentData.boolEcran : false));
  const [boolTenue, setBoolTenue] = useState(watch('boolTenue') ? watch('boolTenue') : (accidentData && accidentData.boolTenue ? accidentData.boolTenue : false));
  const [boolFiltre, setBoolFiltre] = useState(watch('boolFiltre') ? watch('boolFiltre') : (accidentData && accidentData.boolFiltre ? accidentData.boolFiltre : false));
  const [boolVeste, setBoolVeste] = useState(watch('boolVeste') ? watch('boolVeste') : (accidentData && accidentData.boolVeste ? accidentData.boolVeste : false));
  const [boolMaire, setBoolMaire] = useState(watch('boolMaire') ? watch('boolMaire') : (accidentData && accidentData.boolMaire ? accidentData.boolMaire : false));
  const [boolChute, setBoolChute] = useState(watch('boolChute') ? watch('boolChute') : (accidentData && accidentData.boolChute ? accidentData.boolChute : false));
  const [boolAutre, setBoolAutre] = useState(watch('boolAutre') ? watch('boolAutre') : (accidentData && accidentData.boolAutre ? accidentData.boolAutre : false));
  const [codeDeviation, setCodeDeviation] = useState(watch('codeDeviation') ? watch('codeDeviation') : (accidentData && accidentData.codeDeviation ? accidentData.codeDeviation : null));
  const [codeAgentMateriel, setCodeAgentMateriel] = useState(watch('codeAgentMateriel') ? watch('codeAgentMateriel') : (accidentData && accidentData.codeAgentMateriel ? accidentData.codeAgentMateriel : null));
  const [codeNatureLesion, setCodeNatureLesion] = useState(watch('codeNatureLesion') ? watch('codeNatureLesion') : (accidentData && accidentData.codeNatureLesion ? accidentData.codeNatureLesion : null));
  const [codeSiegeLesion, setCodeSiegeLesion] = useState(watch('codeSiegeLesion') ? watch('codeSiegeLesion') : (accidentData && accidentData.codeSiegeLesion ? accidentData.codeSiegeLesion : null));

  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => () => {
    setValue('typeAccident', typeAccident)
    setValue('circonstanceAccident', circonstanceAccident)
    setValue('DateHeureAccident', DateHeureAccident)
    setValue('DateJourIncapDebut', DateJourIncapDebut)
    setValue('DateJourIncapFin', DateJourIncapFin)
    setValue('indemnisationAccident', indemnisationAccident)
    setValue('blessures', blessures)
    setValue('boolAucun', boolAucun)
    setValue('boolChausure', boolChausure)
    setValue('boolLunette', boolLunette)
    setValue('boolGant', boolGant)
    setValue('boolCasque', boolCasque)
    setValue('boolAuditive', boolAuditive)
    setValue('boolMasque', boolMasque)
    setValue('boolEcran', boolEcran)
    setValue('boolTenue', boolTenue)
    setValue('boolFiltre', boolFiltre)
    setValue('boolVeste', boolVeste)
    setValue('boolMaire', boolMaire)
    setValue('boolChute', boolChute)
    setValue('boolAutre', boolAutre)
    setValue('codeDeviation', codeDeviation)
    setValue('codeAgentMateriel', codeAgentMateriel)
    setValue('codeNatureLesion', codeNatureLesion)
    setValue('codeSiegeLesion', codeSiegeLesion)
  }, [typeAccident, circonstanceAccident, DateHeureAccident, DateJourIncapDebut, DateJourIncapFin, indemnisationAccident, blessures, boolAucun, boolChausure, boolLunette, boolGant, boolCasque, boolAuditive, boolMasque, boolEcran, boolTenue, boolFiltre, boolVeste, boolMaire, boolChute, boolAutre, codeDeviation, codeAgentMateriel, codeNatureLesion, codeSiegeLesion, setValue]);

  /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
  return (
    <div>
      <div className="infoAccident">
        <h2>Infos Accident</h2>
        <h3>Rentrez les informations sur l'accident de travail.</h3>

        <AutoCompleteP id='typeAccident' option={listAccident.typeAccident} label='Type d accident' onChange={setTypeAccident} defaultValue={typeAccident} />
        <TextFieldP id="circonstanceAccident" label="Circonstance de l'accident" onChange={(circonstanceAccidentText) => {
          setCirconstanceAccident(circonstanceAccidentText);
          setValue('circonstanceAccident', circonstanceAccidentText);
        }} defaultValue={circonstanceAccident}></TextFieldP>

        <DateHeurePickerP id="DateHeureAccident" label="Date et heure de l'accident" onChange={(DateHeureAccidentChoose) => {
          setDateHeureAccident(DateHeureAccidentChoose);
          setValue('DateHeureAccident', DateHeureAccidentChoose);
        }} defaultValue={DateHeureAccident}></DateHeurePickerP>

        <DatePickerP id="DateJourIncapDebut" label="Date 1er jours incapacité" onChange={(DateJourIncapDebutChoose) => {
          setDateJourIncapDebut(DateJourIncapDebutChoose);
          setValue('DateJourIncapDebut', DateJourIncapDebutChoose);
        }} defaultValue={DateJourIncapDebut}></DatePickerP>

        <DatePickerP id="DateJourIncapFin" label="Date retour au travail" onChange={(DateJourIncapFinChoose) => {
          setDateJourIncapFin(DateJourIncapFinChoose);
          setValue('DateJourIncapFin', DateJourIncapFinChoose);
        }} defaultValue={DateJourIncapFin}></DatePickerP>
        {/*TextFieldP("indemnisationAccident", "Indemnisation")*/}

        {/************* Lien vers les sites**************************
        {
          [
            {
              label: 'Code Déviation',
              name: 'codeDeviation',
              options: listAccident.CodeDeviation,
              infoLink: 'https://www.fedris.be/sites/default/files/assets/FR/Statistiques/SEAT/deviation.pdf',
              defaultValue: codeDeviation,
              onchangeTest: (info, value) => {
                setValue(info, value);
                setCodeDeviation(value);
              }
            },
            {
              label: 'Code Agent matériel',
              name: 'codeAgentMateriel',
              options: listAccident.CodeAgentMateriel,
              infoLink: 'https://www.fedris.be/sites/default/files/assets/FR/Statistiques/SEAT/agentmateriel4.pdf',
              defaultValue: codeAgentMateriel,
              onchangeTest: (info, value) => {
                setValue(info, value);
                setCodeAgentMateriel(value);
              }
            },
            {
              label: 'Code Nature de la lésion',
              name: 'codeNatureLesion',
              options: listAccident.CodeNatureLésion,
              infoLink: 'https://www.fedris.be/sites/default/files/assets/FR/Statistiques/SEAT/natureblessure.pdf',
              defaultValue: codeNatureLesion,
              onchangeTest: (info, value) => {
                setValue(info, value);
                setCodeNatureLesion(value);
              }
            },
            {
              label: 'Code siège lésion',
              name: 'codeSiegeLesion',
              options: listAccident.CodeSiegeLésion,
              infoLink: 'https://www.fedris.be/sites/default/files/assets/FR/Statistiques/SEAT/localisationblessure.pdf',
              defaultValue: codeSiegeLesion,
              onchangeTest: (info, value) => {
                console.log("value", value);
                console.log("info", info);
                setValue(info, value);
                setCodeSiegeLesion(value);
              }
            },
          ].map((fieldInfo, index) => (
            <div key={index} style={{ width: '50%', display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={11.99999}>
                  {console.log("field info name",fieldInfo.name)}
                  <div>
                    <AutoCompleteP
                      id={fieldInfo.name}
                      option={fieldInfo.options}
                      label={fieldInfo.label}
                      onChange={fieldInfo.onchangeTest}
                      defaultValue={fieldInfo.defaultValue}
                      sx={{ backgroundColor: '#84a784', boxShadow: 3 }}
                    />
                  </div>
                </Grid>
                <Grid item xs={0.00001}>
                  <InfoIcon onClick={() => window.open(fieldInfo.infoLink, '_blank')}>
                    <a
                      href={fieldInfo.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        margin: 0,
                        color: 'black',
                        padding: '10px 20px',
                        width: '100%',
                        height: '100%',
                        fontSize: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#84a784',
                        '&:hover': { backgroundColor: 'green' },
                      }}
                    >
                      Infos sur les codes {fieldInfo.label}
                    </a>
                  </InfoIcon>
                </Grid>
              </Grid>
            </div>
          ))
        }*/}
        <AutoCompleteP id='codeDeviation' option={listAccident.CodeDeviation} label='Code Déviation' onChange={setCodeDeviation} defaultValue={codeDeviation} />
        <AutoCompleteP id='codeAgentMateriel' option={listAccident.CodeAgentMateriel} label='Code Agent matériel' onChange={setCodeAgentMateriel} defaultValue={codeAgentMateriel} />
        <AutoCompleteP id='codeNatureLesion' option={listAccident.CodeNatureLésion} label='Code Nature de la lésion' onChange={setCodeNatureLesion} defaultValue={codeNatureLesion} />
        <AutoCompleteP id='codeSiegeLesion' option={listAccident.CodeSiegeLésion} label='Code siège lésion' onChange={setCodeSiegeLesion} defaultValue={codeSiegeLesion} />




        <div>
          <h5>De quels moyens de protection la victime était-elle équipée lors de l'accident ?</h5>
        </div>
        <div>
          <FormGroup>
            <ControlLabelP id="boolAucun" label="Aucun" onChange={(boolAucunCoche) => {
              setBoolAucun(boolAucunCoche);
              setValue('boolAucun', boolAucunCoche);
            }} defaultValue={boolAucun}></ControlLabelP>
            <ControlLabelP id="boolChausure" label="Chaussure de sécurité" onChange={(boolChausureCoche) => {
              setBoolChausure(boolChausureCoche);
              setValue('boolChausure', boolChausureCoche);
            }} defaultValue={boolChausure}></ControlLabelP>
            <ControlLabelP id="boolLunette" label="Lunettes de sécurité" onChange={(boolLunetteCoche) => {
              setBoolLunette(boolLunetteCoche);
              setValue('boolLunette', boolLunetteCoche);
            }} defaultValue={boolLunette}></ControlLabelP>
            <ControlLabelP id="boolGant" label="Gants" onChange={(boolGantCoche) => {
              setBoolGant(boolGantCoche);
              setValue('boolGant', boolGantCoche);
            }} defaultValue={boolGant}></ControlLabelP>
            <ControlLabelP id="boolCasque" label="Casque" onChange={(boolCasqueCoche) => {
              setBoolCasque(boolCasqueCoche);
              setValue('boolCasque', boolCasqueCoche);
            }} defaultValue={boolCasque}></ControlLabelP>
            <ControlLabelP id="boolAuditive" label="Protection de l'ouie" onChange={(boolAuditiveCoche) => {
              setBoolAuditive(boolAuditiveCoche);
              setValue('boolAuditive', boolAuditiveCoche);
            }} defaultValue={boolAuditive}></ControlLabelP>
            <ControlLabelP id="boolMasque" label="Masque antiseptique" onChange={(boolMasqueCoche) => {
              setBoolMasque(boolMasqueCoche);
              setValue('boolMasque', boolMasqueCoche);
            }} defaultValue={boolMasque}></ControlLabelP>
            <ControlLabelP id="boolEcran" label="Ecran facial" onChange={(boolEcranCoche) => {
              setBoolEcran(boolEcranCoche);
              setValue('boolEcran', boolEcranCoche);
            }} defaultValue={boolEcran}></ControlLabelP>
            <ControlLabelP id="boolTenue" label="Tenue de signalisation" onChange={(boolTenueCoche) => {
              setBoolTenue(boolTenueCoche);
              setValue('boolTenue', boolTenueCoche);
            }} defaultValue={boolTenue}></ControlLabelP>
            <ControlLabelP id="boolFiltre" label="Masque respiratoire à filtre" onChange={(boolFiltreCoche) => {
              setBoolFiltre(boolFiltreCoche);
              setValue('boolFiltre', boolFiltreCoche);
            }} defaultValue={boolFiltre}></ControlLabelP>
            <ControlLabelP id="boolVeste" label="Veste de protection" onChange={(boolVesteCoche) => {
              setBoolVeste(boolVesteCoche);
              setValue('boolVeste', boolVesteCoche);
            }} defaultValue={boolVeste}></ControlLabelP>
            <ControlLabelP id="boolMaire" label="Masque respiratoire avec apport d'air frais" onChange={(boolMaireCoche) => {
              setBoolMaire(boolMaireCoche);
              setValue('boolMaire', boolMaireCoche);
            }} defaultValue={boolMaire}></ControlLabelP>
            <ControlLabelP id="boolChute" label="Protection contre les chutes" onChange={(boolChuteCoche) => {
              setBoolChute(boolChuteCoche);
              setValue('boolChute', boolChuteCoche);
            }} defaultValue={boolChute}></ControlLabelP>
            <ControlLabelP id="boolAutre" label="Autre" onChange={(boolAutreCoche) => {
              setBoolAutre(boolAutreCoche);
              setValue('boolAutre', boolAutreCoche);
            }} defaultValue={boolAutre}></ControlLabelP>
          </FormGroup>
        </div>
        <TextFieldP id="blessures" label="Blessures" onChange={(blessuresText) => {
          setBlessures(blessuresText);
          setValue('blessures', blessuresText);
        }} defaultValue={blessures}></TextFieldP>
      </div>
    </div>
  );
}
