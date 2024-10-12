import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AutoCompleteQ from '../_composants/autoCompleteQ';
import config from '../config.json';
import listEntreprises from '../liste/listEntreprise.json';
import { useUserConnected } from '../Hook/userConnected';

export default function FormulaireEntreprise({ setValue, accidentData, watch }) {
  const [entreprises, setEntreprises] = useState([]);
  const [entreprise, setEntreprise] = useState(watch('entrepriseName') || (accidentData && accidentData.entrepriseName) || '');
  const [secteurs, setSecteurs] = useState([]);
  const [secteur, setSecteur] = useState(watch('secteur') || (accidentData && accidentData.secteur) || '');
  const [typeTravailleur, setTypeTravailleur] = useState(watch('typeTravailleur') || (accidentData && accidentData.typeTravailleur) || '');
  const [loading, setLoading] = useState(true);
  const apiUrl = config.apiUrl;
  const { isAdmin, isAdminOuConseiller, userInfo, isConseiller  } = useUserConnected();

  useEffect(() => {
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
  }, [entreprise, secteur, typeTravailleur, setValue]);

  const handleEntrepriseSelect = (entrepriseSelect) => {
    const selectedEntreprise = entreprises.find(e => e.label === entrepriseSelect);
    if (selectedEntreprise) {
      setEntreprise(selectedEntreprise.label);
      setSecteur(''); // Reset secteur when entreprise changes
    }
  };

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
    <div className="frameStyle-style">
      <div>
        <div>
          <div>
            <h1 className="sub-header">Formulaire Accident du travail</h1>
            <h2>Infos Entreprise</h2>
            <h3>Choisissez l'entreprise et le secteur dans lequel le travailleur appartient.</h3>
          </div>
          <div className="autocomplete">
            <AutoCompleteQ
              id='entreprise'
              option={entreprises.map(e => e.label)}
              label='Entreprise'
              onChange={handleEntrepriseSelect}
              defaultValue={entreprise}
              required={true}
            />
            <AutoCompleteQ
              id='secteur'
              option={getLinkedSecteurs()}
              label='Secteur'
              onChange={setSecteur}
              defaultValue={secteur}
              required={true}
            />
            <AutoCompleteQ
              id='typeTravailleur'
              option={listEntreprises.typeTravailleur}
              label="Type de travailleur"
              onChange={setTypeTravailleur}
              defaultValue={typeTravailleur}
              required={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}