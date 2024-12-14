import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AutoCompleteQ from '../_composants/autoCompleteQ';
import config from '../config.json';
import listEntreprises from '../liste/listEntreprise.json';
import { useUserConnected } from '../Hook/userConnected';
import TextFieldQ from '../_composants/textFieldQ';
import DatePickerQ from '../_composants/datePickerQ';
import listeDeclarationAssBelfius from '../liste/listeDeclarationAssBelfius.json';
import DateHeurePickerQ from '../_composants/dateHeurePickerQ';
import listAccident from '../liste/listAccident.json';
import listAssureur from '../liste/listAssureur.json';
import { useTheme } from '../Hook/ThemeContext';
import { FormGroup, Box, Typography } from '@mui/material';
import ControlLabelP from '../_composants/controlLabelP';


/**
 * FormulaireEntreprise component.
 * 
 * - Manages the state of form fields related to an enterprise involved in an accident.
 * - Fetches and filters enterprise and sector data based on user role.
 * - Initializes form fields with existing accident data if available.
 * - Updates form values in response to user interactions.
 * 
 * @param {Object} props The props for the component:
 * - setValue: Function to update form values.
 * - accidentData: Existing accident data, if available.
 * - watch: Function to monitor form field values.
 * 
 * @returns {JSX.Element} The enterprise form component.
 */
export default function FormulaireEntreprise({ setValue, accidentData, watch }) {
  const { darkMode } = useTheme();
  const [entreprises, setEntreprises] = useState([]);
  const [entreprise, setEntreprise] = useState(watch('entrepriseName') || (accidentData && accidentData.entrepriseName) || '');
  const [secteurs, setSecteurs] = useState([]);
  const [secteur, setSecteur] = useState(watch('secteur') || (accidentData && accidentData.secteur) || '');
  const [typeTravailleur, setTypeTravailleur] = useState(watch('typeTravailleur') || (accidentData && accidentData.typeTravailleur) || '');
  const [loading, setLoading] = useState(true);
  const apiUrl = config.apiUrl;
  const { isAdmin, isAdminOuConseiller, userInfo, isConseiller, isAdminOrDev } = useUserConnected();
  const [formData, setFormData] = useState(accidentData);
  const convertToBoolean = (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  };



  const [nomTravailleur, setNomTravailleur] = useState(watch('nomTravailleur') ? watch('nomTravailleur') : (accidentData && accidentData.nomTravailleur ? accidentData.nomTravailleur : null));
  const [prenomTravailleur, setPrenomTravailleur] = useState(watch('prenomTravailleur') ? watch('prenomTravailleur') : (accidentData && accidentData.prenomTravailleur ? accidentData.prenomTravailleur : null));
  const [dateNaissance, setDateNaissance] = useState(watch('dateNaissance') ? watch('dateNaissance') : (accidentData && accidentData.dateNaissance ? accidentData.dateNaissance : null));
  const [sexe, setsexe] = useState(watch('sexe') ? watch('sexe') : (accidentData && accidentData.sexe ? accidentData.sexe : null));
  const [typeAccident, setTypeAccident] = useState(watch('typeAccident') ? watch('typeAccident') : (accidentData && accidentData.typeAccident ? accidentData.typeAccident : null));
  const [DateHeureAccident, setDateHeureAccident] = useState(watch('DateHeureAccident') ? watch('DateHeureAccident') : (accidentData && accidentData.DateHeureAccident ? accidentData.DateHeureAccident : null));
  const [blessures, setBlessures] = useState(watch('blessures') ? watch('blessures') : (accidentData && accidentData.blessures ? accidentData.blessures : ''));
  const [assureurStatus, setAssureurStatus] = useState(watch('AssureurStatus') ? watch('AssureurStatus') : (accidentData && accidentData.AssureurStatus ? accidentData.AssureurStatus : ''));

  const [boolAsCloture, setboolAsCloture] = useState(() => convertToBoolean(watch('boolAsCloture') || accidentData?.boolAsCloture || false));

  const [circonstanceAccident, setCirconstanceAccident] = useState(watch('circonstanceAccident') ? watch('circonstanceAccident') : (accidentData && accidentData.circonstanceAccident ? accidentData.circonstanceAccident : ""));




  useEffect(() => {
    const data = sessionStorage.getItem('accidentData');
    if (data) {
      const parsedData = JSON.parse(data);
      setFormData(parsedData);
    }
  }, []);

  useEffect(() => {

    sessionStorage.setItem('accidentData', JSON.stringify(formData));
  }, [formData])

  useEffect(() => {
    /**
     * Fetches entreprises and secteurs data from API
     * - entreprises data is filtered based on user role (only show entreprises that the user is conseiller for)
     * - sets entreprises and secteurs in component state
     * - sets loading to false when done
     * @async
     */
    const fetchData = async () => {
      try {
        const [entreprisesResponse, secteursResponse] = await Promise.all([
          axios.get(`http://${apiUrl}:3100/api/entreprises`),
          axios.get(`http://${apiUrl}:3100/api/secteurs`)
        ]);
        let entreprisesData = entreprisesResponse.data.map(e => ({
          label: e.AddEntreName,
          id: e._id
        }));

        // Filter entreprises based on user role
        if (!isAdminOrDev) {
          entreprisesData = entreprisesData.filter(e =>
            userInfo.entreprisesConseillerPrevention?.includes(e.label)
          );
        }

        setEntreprises(entreprisesData);
        const secteursData = secteursResponse.data;
        setSecteurs(secteursData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, isAdminOrDev, isConseiller]);

  useEffect(() => {
    setValue('entrepriseName', entreprise);
    setValue('secteur', secteur);
    setValue('typeTravailleur', typeTravailleur);
    setValue('nomTravailleur', nomTravailleur)
    setValue('prenomTravailleur', prenomTravailleur)
    setValue('dateNaissance', dateNaissance)
    setValue('sexe', sexe)
    setValue('typeAccident', typeAccident)
    setValue('DateHeureAccident', DateHeureAccident)
    setValue('blessures', blessures)
    setValue('AssureurStatus', assureurStatus)
    setValue('boolAsCloture', Boolean(boolAsCloture));
    setValue('circonstanceAccident', circonstanceAccident)
  }, [circonstanceAccident, boolAsCloture, assureurStatus, blessures, DateHeureAccident, typeAccident, sexe, entreprise, secteur, typeTravailleur, nomTravailleur, prenomTravailleur, dateNaissance, setValue]);

  /**
   * Handles the selection of an entreprise in the form.
   * @param {string} entrepriseSelect - The label of the selected entreprise.
   * @description
   * This function is called when the user selects an entreprise in the form.
   * It updates the state of the component by setting the selected entreprise,
   * resetting the selected secteur, and updating the list of available secteurs
   * based on the selected entreprise.
   */
  const handleEntrepriseSelect = (entrepriseSelect) => {
    const selectedEntreprise = entreprises.find(e => e.label === entrepriseSelect);
    if (selectedEntreprise) {
      setEntreprise(selectedEntreprise.label);
      setSecteur(''); // Reset secteur when entreprise changes
    }
  };

  /**
   * Retrieves the list of sector names linked to the currently selected enterprise.
   *
   * @returns {Array<string>} An array of sector names associated with the selected enterprise.
   *                          Returns an empty array if no enterprise is selected or if there are no linked sectors.
   */
  const getLinkedSecteurs = () => {
    const selectedEntreprise = entreprises.find(e => e.label === entreprise);
    if (selectedEntreprise) {
      return secteurs
        .filter(s => s.entrepriseId === selectedEntreprise.id)
        .map(s => s.secteurName);
    }
    return [];
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  const handleBooleanChange = (setter, fieldName) => (value) => {
    const boolValue = convertToBoolean(value);
    setter(boolValue);
    setValue(fieldName, boolValue);
  };


  return (

    <div>
      <div>
        <div>
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
              Formulaire Pris en compte pour les statistiques
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
        </div>
        <div className="autocomplete">
          {/* *********************************** Autocomplete AssureurStatus **********************************/}
          <AutoCompleteQ
            id='AssureurStatus'
            option={listAssureur.AssureurStatus}
            label='Status'
            onChange={(AssureurStatusSelect) => {
              setAssureurStatus(AssureurStatusSelect);
              setValue('AssureurStatus', AssureurStatusSelect);
            }}
            defaultValue={assureurStatus}
            required={true}
          />

          {/* Entreprise */}
          <AutoCompleteQ
            id='entreprise'
            option={entreprises.map(e => e.label)}
            label='Entreprise'
            onChange={handleEntrepriseSelect}
            defaultValue={entreprise}
            required={true}
          />

          {/* Secteur */}
          <AutoCompleteQ
            id='secteur'
            option={getLinkedSecteurs()}
            label='Secteur'
            onChange={setSecteur}
            defaultValue={secteur}
            required={true}
          />

          {/* Type Travailleur */}
          <AutoCompleteQ
            id='typeTravailleur'
            option={listEntreprises.typeTravailleur}
            label="Type de travailleur"
            onChange={setTypeTravailleur}
            defaultValue={typeTravailleur}
            required={true}
          />

          {/* Nom Travailleur */}
          <TextFieldQ
            id='nomTravailleur'
            label='Nom du travailleur'
            onChange={setNomTravailleur}
            defaultValue={nomTravailleur}
            required={true}
          />

          {/* Prénom Travailleur */}
          <TextFieldQ
            id='prenomTravailleur'
            label='Prénom du travailleur'
            onChange={setPrenomTravailleur}
            defaultValue={prenomTravailleur}
            required={true}
          />

          {/* Date Naissance */}
          <DatePickerQ
            id='dateNaissance'
            label='Date de naissance'
            onChange={setDateNaissance}
            defaultValue={dateNaissance}
            required={true}
          />

          {/* Sexe */}
          <AutoCompleteQ
            id='sexe'
            label='Sexe'
            onChange={setsexe}
            option={listeDeclarationAssBelfius.ListeSexe}
            defaultValue={sexe}
            required={true}
          />

          {/* Type Accident */}
          <AutoCompleteQ
            id='typeAccident'
            option={listAccident.typeAccident}
            label='Type d accident'
            required={true}
            onChange={setTypeAccident}
            defaultValue={typeAccident}
          />

          {/* Date et Heure Accident */}
          <DateHeurePickerQ
            id="DateHeureAccident"
            label="Date et heure de l'accident"
            required={true}
            onChange={(DateHeureAccidentChoose) => {
              setDateHeureAccident(DateHeureAccidentChoose);
              setValue('DateHeureAccident', DateHeureAccidentChoose);
            }}
            defaultValue={DateHeureAccident}
          />
          <TextFieldQ
            id="circonstanceAccident"
            label="Circonstance de l'accident"
            required={true}
            onChange={(circonstanceAccidentText) => {
              setCirconstanceAccident(circonstanceAccidentText);
              setValue('circonstanceAccident', circonstanceAccidentText);
            }}
            defaultValue={circonstanceAccident}
          />
          {/* Blessures */}
          <TextFieldQ
            id="blessures"
            label="Blessures"
            required={true}
            onChange={(blessuresText) => {
              setBlessures(blessuresText);
              setValue('blessures', blessuresText);
            }}
            defaultValue={blessures}
          />

          {/* Case à cocher Clôturé */}
          <div>
            <FormGroup>
              <ControlLabelP
                id="boolAsCloture"
                label="Clôturé"
                onChange={handleBooleanChange(setboolAsCloture, 'boolAsCloture')}
                defaultValue={boolAsCloture}></ControlLabelP>
            </FormGroup>
          </div>
        </div>
      </div>
    </div>

  );
}