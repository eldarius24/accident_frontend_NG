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
import { useTheme } from '../pageAdmin/user/ThemeContext';
import { FormGroup } from '@mui/material';
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
  const [entreprises, setEntreprises] = useState([]);
  const [entreprise, setEntreprise] = useState(watch('entrepriseName') || (accidentData && accidentData.entrepriseName) || '');
  const [secteurs, setSecteurs] = useState([]);
  const [secteur, setSecteur] = useState(watch('secteur') || (accidentData && accidentData.secteur) || '');
  const [typeTravailleur, setTypeTravailleur] = useState(watch('typeTravailleur') || (accidentData && accidentData.typeTravailleur) || '');
  const [loading, setLoading] = useState(true);
  const apiUrl = config.apiUrl;
  const { isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
  const [formData, setFormData] = useState(accidentData);
  const { darkMode } = useTheme();

  const [nomTravailleur, setNomTravailleur] = useState(watch('nomTravailleur') ? watch('nomTravailleur') : (accidentData && accidentData.nomTravailleur ? accidentData.nomTravailleur : null));
  const [prenomTravailleur, setPrenomTravailleur] = useState(watch('prenomTravailleur') ? watch('prenomTravailleur') : (accidentData && accidentData.prenomTravailleur ? accidentData.prenomTravailleur : null));
  const [dateNaissance, setDateNaissance] = useState(watch('dateNaissance') ? watch('dateNaissance') : (accidentData && accidentData.dateNaissance ? accidentData.dateNaissance : null));
  const [sexe, setsexe] = useState(watch('sexe') ? watch('sexe') : (accidentData && accidentData.sexe ? accidentData.sexe : null));
  const [typeAccident, setTypeAccident] = useState(watch('typeAccident') ? watch('typeAccident') : (accidentData && accidentData.typeAccident ? accidentData.typeAccident : null));
  const [DateHeureAccident, setDateHeureAccident] = useState(watch('DateHeureAccident') ? watch('DateHeureAccident') : (accidentData && accidentData.DateHeureAccident ? accidentData.DateHeureAccident : null));
  const [blessures, setBlessures] = useState(watch('blessures') ? watch('blessures') : (accidentData && accidentData.blessures ? accidentData.blessures : ''));
  const [assureurStatus, setAssureurStatus] = useState(watch('AssureurStatus') ? watch('AssureurStatus') : (accidentData && accidentData.AssureurStatus ? accidentData.AssureurStatus : ''));
  const [boolAsCloture, setboolAsCloture] = useState(() => { const watchValue = Boolean(watch('boolAsCloture')); const accidentDataValue = accidentData ? Boolean(accidentData.boolAsCloture) : false; return watchValue || accidentDataValue; });
  const [circonstanceAccident, setCirconstanceAccident] = useState(watch('circonstanceAccident') ? watch('circonstanceAccident') : (accidentData && accidentData.circonstanceAccident ? accidentData.circonstanceAccident : ""));


  useEffect(() => {
    const data = sessionStorage.getItem('accidentData');
    if (data) {
      const parsedData = JSON.parse(data);
      setFormData(parsedData);
    }
  }, []);

  useEffect(() => {
    console.info("fomulaireEntreprise => formData : ", formData);
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
        if (!isAdmin) {
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
  }, [apiUrl, isAdmin, isConseiller]);

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

  return (
    <div className="frameStyle-style" style={{
      backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
    }}>
      <div>
        <div>
          <div>
            <h2>Formulaire Pris en compte pour les statistiques</h2>

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
                  onChange={(boolAsClotureCoche) => {
                    // Assurez-vous que la valeur est bien un booléen
                    const value = Boolean(boolAsClotureCoche);
                    setboolAsCloture(value);
                    // Mettre à jour la valeur dans le formulaire parent
                    setValue('boolAsCloture', value);
                    // Mettre à jour formData également
                    setFormData(prev => ({
                      ...prev,
                      boolAsCloture: value
                    }));
                  }}
                  defaultValue={Boolean(boolAsCloture)}
                />
              </FormGroup>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}