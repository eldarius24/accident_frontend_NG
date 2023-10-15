import AutoCompleteP from './composants/autoCompleteP';
import listEntreprises from './listEntreprise.json';
import React, { useState, useEffect } from 'react';

// Styles
const frameStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid #84a784',
  borderRadius: '10px',
  cursor: 'pointer',
  margin: '20px 1rem',
  backgroundColor: '#d2e2d2',
};

export default function FormulaireEntreprise({ setValue, accidentData }) {

  const [entreprise, setEntreprise] = useState(accidentData ? accidentData.entrepriseName : listEntreprises.entreprise[0].label);
  setValue('entrepriseName', entreprise);

  const [listSecteur, setListSecteur] = useState(listEntreprises.entreprise[0].secteur);

  const [secteur, setSecteur] = useState(accidentData ? accidentData.secteur : listSecteur[0]);
  setValue('secteur', secteur)



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
          <AutoCompleteP id='secteur' option={listSecteur} label='Secteur' onChange={(value) => 
          {setSecteur(value);
              setValue('secteur', value)}} defaultValue={secteur} > </AutoCompleteP>

          {/* *********************************** Autocomplete typeTravailleur **********************************/}
          <AutoCompleteP id='typeTravailleur' option={listEntreprises.typeTravailleur} label="Type de travailleur" onChange={(value) => setValue('typeTravailleur', value)} defaultValue={accidentData ? accidentData.typeTravailleur : null}> </AutoCompleteP>
        </div>
      </div >
    </div >
  );
}
