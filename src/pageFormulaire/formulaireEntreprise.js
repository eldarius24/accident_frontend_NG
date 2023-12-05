import AutoCompleteP from '../composants/autoCompleteP';
import listEntreprises from '../liste/listEntreprise.json';
import React, { useState, useEffect } from 'react';

export default function FormulaireEntreprise({ setValue, accidentData, watch }) {
  
  /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
  const [entreprise, setEntreprise] = useState(watch('entrepriseName') ? watch('entrepriseName') : (accidentData && accidentData.entrepriseName ? accidentData.entrepriseName : listEntreprises.entreprise[0].label));
  const [listSecteur, setListSecteur] = useState([]);
  const [secteur, setSecteur] = useState(watch('secteur') ? watch('secteur') : (accidentData && accidentData.secteur ? accidentData.secteur : listEntreprises.entreprise[0].secteur[0]));
  const [typeTravailleur, setTypeTravailleur] = useState(watch('typeTravailleur') ? watch('typeTravailleur') : (accidentData && accidentData.typeTravailleur ? accidentData.typeTravailleur : null));

  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => {
    setValue('entrepriseName', entreprise);
    setValue('secteur', secteur);
    setValue('typeTravailleur', typeTravailleur);
    console.log("FormulaireEntreprise -> setValue('entrepriseName', entreprise);", entreprise);
    console.log("FormulaireEntreprise -> setValue('secteur', secteur);", secteur);
    console.log("FormulaireEntreprise -> setValue('typeTravailleur', typeTravailleur);", typeTravailleur);
  }, [entreprise, secteur, typeTravailleur, setValue]);

  //fonction qui permet de mettre à jour les secteurs en fonction de l'entreprise choisie
  const handleEntrepriseSelect = (entrepriseSelect) => {
    const entrepriseData = listEntreprises.entreprise.find((e) => e.label === entrepriseSelect);
    if (entrepriseData) {
      setListSecteur(entrepriseData.secteur);
      setSecteur(entrepriseData.secteur[0]);
      setEntreprise(entrepriseData.label);
    }
  };

  /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
  return (
    <div>
      <div>
        <div>
          <h1 className="sub-header">Formulaire Accident du travail</h1>
          <h2>Infos Entreprise</h2>
          <h3>Choisissez l'entreprise et le secteur dans lequel le travailleur appartient.</h3>
        </div>
        <div className="autocomplete">
          <AutoCompleteP
            id='entreprise'
            option={listEntreprises.entreprise.map((e) => e.label)}
            label='Entreprise'
            onChange={handleEntrepriseSelect}
            defaultValue={entreprise}
          />
          <AutoCompleteP
            id='secteur'
            option={listSecteur}
            label='Secteur'
            onChange={setSecteur}
            defaultValue={secteur}
          />
          <AutoCompleteP
            id='typeTravailleur'
            option={listEntreprises.typeTravailleur}
            label="Type de travailleur"
            onChange={setTypeTravailleur}
            defaultValue={typeTravailleur}
          />
        </div>
      </div>
    </div>
  );
}

