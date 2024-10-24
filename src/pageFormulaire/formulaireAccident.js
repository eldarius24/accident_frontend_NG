/*IMPORT REACT */
import { useState, useEffect } from 'react';
/* IMPORT MUI */
import { FormGroup, Grid, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');
/* IMPORT PERSO */
import listAccident from '../liste/listAccident.json';
import ControlLabelP from '../_composants/controlLabelP';
import TextFieldP from '../_composants/textFieldP';
import AutoCompleteP from '../_composants/autoCompleteP';
import DatePickerP from '../_composants/datePickerP';
import TextFieldMaskP from '../_composants/textFieldMaskP';
import { Link } from 'react-router-dom';
import { useTheme } from '../pageAdmin/user/ThemeContext';

/**
 * Formulaire des informations sur l'accident de travail
 * 
 * @param {Object} props Les props du formulaire : 
 * - setValue : la fonction pour mettre à jour les valeurs du formulaire
 * - accidentData : les données de l'accident s'il existe
 * - watch : la fonction pour surveiller les mises à jour des données du formulaire
 * 
 * @returns {JSX.Element} Le formulaire
 */
export default function FormulaireAccident({ setValue, accidentData, watch }) {
  const { darkMode } = useTheme();
  const [frameWidth, setFrameWidth] = useState(window.innerWidth * -0.5);

  useEffect(() => {
/**
 * Handle the resize event by adjusting the frame width based on the window width
 */
    const handleResize = () => {
      setFrameWidth(window.innerWidth * -0.5); // Adjust the coefficient as needed
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
  
  const [circonstanceAccident, setCirconstanceAccident] = useState(watch('circonstanceAccident') ? watch('circonstanceAccident') : (accidentData && accidentData.circonstanceAccident ? accidentData.circonstanceAccident : ""));
  const [DateJourIncapDebut, setDateJourIncapDebut] = useState(watch('DateJourIncapDebut') ? watch('DateJourIncapDebut') : (accidentData && accidentData.DateJourIncapDebut ? accidentData.DateJourIncapDebut : null));
  const [DateJourIncapFin, setDateJourIncapFin] = useState(watch('DateJourIncapFin') ? watch('DateJourIncapFin') : (accidentData && accidentData.DateJourIncapFin ? accidentData.DateJourIncapFin : null));
  const [indemnisationAccident, setIndemnisationAccident] = useState(watch('indemnisationAccident') ? watch('indemnisationAccident') : (accidentData && accidentData.indemnisationAccident ? accidentData.indemnisationAccident : ""));
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
  const [horaireJourAccident, sethoraireJourAccident] = useState(watch('horaireJourAccident') ? watch('horaireJourAccident') : (accidentData && accidentData.horaireJourAccident ? accidentData.horaireJourAccident : null));

  const [formData, setFormData] = useState(accidentData);

  useEffect(() => {
    const data = sessionStorage.getItem('accidentData');
    if (data) {
      const parsedData = JSON.parse(data);
      setFormData(parsedData);
    }
  }, []);

  useEffect(() => {
    console.info("fomulaireAccident => formData : ", formData);
    sessionStorage.setItem('accidentData', JSON.stringify(formData));
  }, [formData])

  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => {
    
    setValue('circonstanceAccident', circonstanceAccident)
    setValue('DateJourIncapDebut', DateJourIncapDebut)
    setValue('DateJourIncapFin', DateJourIncapFin)
    setValue('indemnisationAccident', indemnisationAccident)
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
    setValue('horaireJourAccident', horaireJourAccident)
  }, [horaireJourAccident, circonstanceAccident, DateJourIncapDebut, DateJourIncapFin, indemnisationAccident, boolAucun, boolChausure, boolLunette, boolGant, boolCasque, boolAuditive, boolMasque, boolEcran, boolTenue, boolFiltre, boolVeste, boolMaire, boolChute, boolAutre, codeDeviation, codeAgentMateriel, codeNatureLesion, codeSiegeLesion, setValue]);

  /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
  return (
    <div className="frameStyle-style" style={{
      backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
    }}>
      <div>
        <div className="infoAccident">
          <h2>Infos Accident</h2>
          <h3>Rentrez les informations sur l'accident de travail.</h3>

          
          <TextFieldP id="circonstanceAccident" label="Circonstance de l'accident" onChange={(circonstanceAccidentText) => {
            setCirconstanceAccident(circonstanceAccidentText);
            setValue('circonstanceAccident', circonstanceAccidentText);
          }} defaultValue={circonstanceAccident}></TextFieldP>

          

          <TextFieldMaskP id='horaireJourAccident' label='Horaire de la victime le jour de l accident' onChange={sethoraireJourAccident} defaultValue={horaireJourAccident} mask="de 00h00 à 00h00 et de 00h00 à 00h00" />

          <DatePickerP id="DateJourIncapDebut" label="Date 1er jours incapacité" onChange={(DateJourIncapDebutChoose) => {
            setDateJourIncapDebut(DateJourIncapDebutChoose);
            setValue('DateJourIncapDebut', DateJourIncapDebutChoose);
          }} defaultValue={DateJourIncapDebut}></DatePickerP>

          <DatePickerP id="DateJourIncapFin" label="Date retour au travail" onChange={(DateJourIncapFinChoose) => {
            setDateJourIncapFin(DateJourIncapFinChoose);
            setValue('DateJourIncapFin', DateJourIncapFinChoose);
          }} defaultValue={DateJourIncapFin}></DatePickerP>
          {/*TextFieldP("indemnisationAccident", "Indemnisation")*/}



          {/************** Lien vers les sites et autocomplete des codes***************************/}

          <Grid container direction="row" alignItems="center">
            <Grid item xs={11.99999} >
              <AutoCompleteP id='codeDeviation' option={listAccident.CodeDeviation} label='Code Déviation' onChange={setCodeDeviation} defaultValue={codeDeviation} />
            </Grid>
            <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
              <Link to="/deviation" style={{ textDecoration: 'none', color: 'black' }} target="_blank" rel="noopener noreferrer">
              <Tooltip title="Cliquez ici pour visualiser les Codes Déviations" arrow>
                <InfoIcon style={{ color: 'black' }} />
              </Tooltip>
              </Link>
            </Grid>
          </Grid>

          <Grid container direction="row" alignItems="center">
            <Grid item xs={11.99999} >
              <AutoCompleteP id='codeAgentMateriel' option={listAccident.CodeAgentMateriel} label='Code Agent matériel' onChange={setCodeAgentMateriel} defaultValue={codeAgentMateriel} />
            </Grid>
            <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
              <Link to="/agentmateriel" style={{ textDecoration: 'none', color: 'black' }} target="_blank" rel="noopener noreferrer">
              <Tooltip title="Cliquez ici pour visualiser les Agents Matériel" arrow>
                <InfoIcon style={{ color: 'black' }} />
                </Tooltip>
              </Link>
            </Grid>
          </Grid>

          <Grid container direction="row" alignItems="center">
            <Grid item xs={11.99999} >
              <AutoCompleteP id='codeNatureLesion' option={listAccident.CodeNatureLésion} label='Code Nature de la lésion' onChange={setCodeNatureLesion} defaultValue={codeNatureLesion} />
            </Grid>
            <Grid item xs={0.00001} style={{ margin: '-24.5%' }}>
              <Link to="/naturelesion" style={{ textDecoration: 'none', color: 'black' }} target="_blank" rel="noopener noreferrer">
              <Tooltip title="Cliquez ici pour visualiser les Natures de la lésion" arrow>
                <InfoIcon style={{ color: 'black' }} />
              </Tooltip>
              </Link>
            </Grid>
          </Grid>

          <Grid container direction="row" alignItems="center">
            <Grid item xs={11.99999} >
              <AutoCompleteP id='codeSiegeLesion' option={listAccident.CodeSiegeLésion} label='Code siège lésion' onChange={setCodeSiegeLesion} defaultValue={codeSiegeLesion} />
            </Grid>
            <Grid item xs={0.00001} style={{ margin: '-24.5%' }} >
              <Link to="/siegelesion" style={{ textDecoration: 'none', color: 'black' }} target="_blank" rel="noopener noreferrer">
              <Tooltip title="Cliquez ici pour visualiser les Sieges de la lésion" arrow>
                <InfoIcon style={{ color: 'black' }} />
              </Tooltip>
              </Link>
            </Grid>
          </Grid>



          <div className="frameStyle-style1">
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
          
        </div>
      </div>
    </div>
  );
}
