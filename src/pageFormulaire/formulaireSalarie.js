/* IMPORT REACT */
import * as React from 'react';
/* IMPORT MUI */
import { useState, useEffect } from 'react';
/* IMPORT PERSO */
import TextFieldP from '../composants/textFieldP';
import DatePickerP from '../composants/datePickerP';


export default function FormulaireSalarie({ setValue, accidentData, watch }) {

  /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
  const [nomTravailleur, setNomTravailleur] = useState(watch('nomTravailleur') ? watch('nomTravailleur') : (accidentData && accidentData.nomTravailleur ? accidentData.nomTravailleur : ''));
  const [prenomTravailleur, setPrenomTravailleur] = useState(watch('prenomTravailleur') ? watch('prenomTravailleur') : (accidentData && accidentData.prenomTravailleur ? accidentData.prenomTravailleur : ''));
  const [dateNaissance, setDateNaissance] = useState(watch('dateNaissance') ? watch('dateNaissance') : (accidentData && accidentData.dateNaissance ? accidentData.dateNaissance : null));
  const [lieuxnaissance, setLieuxnaissance] = useState(watch('lieuxnaissance') ? watch('lieuxnaissance') : (accidentData && accidentData.lieuxnaissance ? accidentData.lieuxnaissance : ''));
  const [nbHeuresSemaine, setNbHeuresSemaine] = useState(watch('nbHeuresSemaine') ? watch('nbHeuresSemaine') : (accidentData && accidentData.nbHeuresSemaine ? accidentData.nbHeuresSemaine : ''));
  const [dateDebutArret, setDateDebutArret] = useState(watch('dateDebutArret') ? watch('dateDebutArret') : (accidentData && accidentData.dateDebutArret ? accidentData.dateDebutArret : null));
  const [dateFinArret, setDateFinArret] = useState(watch('dateFinArret') ? watch('dateFinArret') : (accidentData && accidentData.dateFinArret ? accidentData.dateFinArret : null));
  const [dateEntrEntreprise, setDateEntrEntreprise] = useState(watch('dateEntrEntreprise') ? watch('dateEntrEntreprise') : (accidentData && accidentData.dateEntrEntreprise ? accidentData.dateEntrEntreprise : null));

  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => {
    setValue('nomTravailleur', nomTravailleur);
    setValue('prenomTravailleur', prenomTravailleur);
    setValue('dateNaissance', dateNaissance);
    setValue('lieuxnaissance', lieuxnaissance);
    setValue('nbHeuresSemaine', nbHeuresSemaine);
    setValue('dateDebutArret', dateDebutArret);
    setValue('dateFinArret', dateFinArret);
    setValue('dateEntrEntreprise', dateEntrEntreprise);
  }
    , [nomTravailleur, prenomTravailleur, dateNaissance, lieuxnaissance, nbHeuresSemaine, dateDebutArret, dateFinArret, dateEntrEntreprise, setValue]);

  /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
  return (
    <div>
        <h2>Infos du travailleur</h2>
        <h3>Rentrez les informations sur la personne victime de l'accident de travail.</h3>

        <TextFieldP
          id='nomTravailleur'
          label='Nom du travailleur'
          onChange={setNomTravailleur}
          defaultValue={nomTravailleur}
        />

        <TextFieldP
          id='prenomTravailleur'
          label='Prénom du travailleur'
          onChange={setPrenomTravailleur}
          defaultValue={prenomTravailleur}
        />

        <DatePickerP
          id='dateNaissance'
          label='Date de naissance'
          onChange={setDateNaissance}
          defaultValue={dateNaissance}
        />

        <TextFieldP
          id='lieuxnaissance'
          label='Lieu de naissance'
          onChange={setLieuxnaissance}
          defaultValue={lieuxnaissance}
        />

        <TextFieldP
          id='nbHeuresSemaine'
          label="Nombre d\'heures travaillées par semaine"
          onChange={setNbHeuresSemaine}
          defaultValue={nbHeuresSemaine}
        />

        <DatePickerP
          id='dateDebutArret'
          label="Date de début du dernier arrêt de travail(>15j)"
          onChange={setDateDebutArret}
          defaultValue={dateDebutArret}
        />

        <DatePickerP
          id='dateFinArret'
          label="Date de fin du denier arrêt de travail (>15j)"
          onChange={setDateFinArret}
          defaultValue={dateFinArret}
        />

        <DatePickerP
          id='dateEntrEntreprise'
          label="Date d\'entrée dans l\'entreprise"
          onChange={setDateEntrEntreprise}
          defaultValue={dateEntrEntreprise}
        />
    </div>
  );
}
