import AutoCompleteP from './composants/autoCompleteP';
import AutoCompleteDisableP from './composants/autoCompleteDisableP';
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
  const [listSecteur, setListSecteur] = useState([]);


  return (
    <div>
      <div>
        <div>
          <h1 className="sub-header">Formulaire Accident du travail</h1>
          <h2>Infos Entreprise</h2>
          <h3>Choisissez l'entreprise et le secteur dans lequel le travailleur appartient.</h3>
        </div>
        <div className="autocomplete">

          {/* ***********************************        Autocomplete entreprise **********************************/}
          <AutoCompleteP id='entreprise' option={listEntreprises.entreprise.map((entreprise) => entreprise.label)} label='Entreprise' onChange={(entrepriseSelect) => {
            if (entrepriseSelect) {
              listEntreprises.entreprise.map((entreprise) => {
                if (entreprise.label === entrepriseSelect) {
                  setListSecteur(entreprise.secteur);
                }
              });
              setValue('entrepriseName', entrepriseSelect);
            }
          }} defaultValue={accidentData ? accidentData.entrepriseName : null}> </AutoCompleteP>

          {listSecteur.length >0 || accidentData ? (
            <AutoCompleteP id='secteur' option={listSecteur} label='Secteur' onChange={(value) => 
              setValue('secteur', value)} defaultValue={accidentData ? accidentData.secteur : null} > </AutoCompleteP>
          ) : (
            <AutoCompleteDisableP id='secteur' label='Secteur' > </AutoCompleteDisableP>
          )}

          <AutoCompleteP id='typeTravailleur' option={listEntreprises.typeTravailleur} label="Type de travailleur" onChange={(value) => setValue('typeTravailleur', value)} defaultValue={accidentData ? accidentData.typeTravailleur : null}> </AutoCompleteP>
        </div>
      </div >
    </div >
  );
}
