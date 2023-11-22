import AutoCompleteP from '../composants/autoCompleteP';
import listEntreprises from '../liste/listEntreprise.json';
import React, { useState, useEffect } from 'react';

export default function FormulaireEntreprise({ setValue, accidentData }) {

  console.log("accidentData",accidentData);

  const [entreprise, setEntreprise] = useState(accidentData ? accidentData.entrepriseName : listEntreprises.entreprise[0].label);
  setValue('entrepriseName', entreprise);

  const [listSecteur, setListSecteur] = useState(accidentData ? listEntreprises.entreprise.find((entreprise) => entreprise.label === accidentData.entrepriseName).secteur : listEntreprises.entreprise[0].secteur);

  const [secteur, setSecteur] = useState(accidentData ? accidentData.secteur : listSecteur[0]);
  setValue('secteur', secteur)

  const [typeTravailleur, setTypeTravailleur] = useState(accidentData ? accidentData.typeTravailleur : null);




  return (
    <div>
      <div>
        <div>
          <h1 className="sub-header">Formulaire Accident du travail</h1>
          <h2>Infos Entreprise</h2>
          <h3>Choisissez l'entreprise et le secteur dans lequel le travailleur appartient.</h3>
        </div>
        <div className="autocomplete">

          {/* *********************************** Autocomplete entreprise **********************************/}
          <AutoCompleteP id='entreprise' option={listEntreprises.entreprise.map((entreprise) => entreprise.label)} label='Entreprise' onChange={(entrepriseSelect) => {
            if (entrepriseSelect) {
              listEntreprises.entreprise.map((entreprise) => {
                if (entreprise.label === entrepriseSelect) {
                  setListSecteur(entreprise.secteur);
                  setSecteur(entreprise.secteur[0]);
                  setEntreprise(entreprise.label);
                }
              });
              console.log("entrepriseSelect");
              console.log(entrepriseSelect);
              setValue('entrepriseName', entrepriseSelect);
            }
          }} defaultValue={entreprise}> </AutoCompleteP>

          {/* *********************************** Autocomplete secteur **********************************/}
          <AutoCompleteP id='secteur'
            option={listSecteur}
            label='Secteur'
            onChange={(value) => {
              setSecteur(value);
              setValue('secteur', value)
            }}
            defaultValue={secteur} >
          </AutoCompleteP>

          {/* *********************************** Autocomplete typeTravailleur **********************************/}
          <AutoCompleteP id='typeTravailleur'
            option={listEntreprises.typeTravailleur}
            label="Type de travailleur"
            onChange={(value) => {
              setTypeTravailleur(value);
              setValue('typeTravailleur', value)
            }}
            defaultValue={typeTravailleur}>
          </AutoCompleteP>
        </div>
      </div >
    </div >
  );
}
