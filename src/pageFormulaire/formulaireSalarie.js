/* IMPORT REACT */
import * as React from 'react';
/* IMPORT MUI */
import { useState, useEffect } from 'react';
/* IMPORT PERSO */
import TextFieldP from '../composants/textFieldP';
import DatePickerP from '../composants/datePickerP';
import AutoCompleteP from '../composants/autoCompleteP';
import listeDeclarationAssBelfius from '../liste/listeDeclarationAssBelfius.json';
import listeDeclarationAss from '../liste/listeDeclarationAssBelfius.json';

export default function FormulaireSalarie({ setValue, accidentData, watch }) {

  /*    const handleadresseCodecorrespondance = (event) => {
          const leadresseCodecorrespondance = event.target.value;
          setShowSecondTextField(leadresseCodecorrespondance !== '');
      };*/

  const [frameWidth, setFrameWidth] = useState(window.innerWidth * -0.5);

  useEffect(() => {
    const handleResize = () => {
      setFrameWidth(window.innerWidth * -0.5); // Adjust the coefficient as needed
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const frameStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${frameWidth * 1.3}px`, // Adjust the coefficient as needed
    border: '2px solid #84a784',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '20px 1rem',
    backgroundColor: '#d2e2d2',
  };

  const [showSecondTextField, setShowadresseRuecorrespondance] = useState(true);



  /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
  const [nomTravailleur, setNomTravailleur] = useState(watch('nomTravailleur') ? watch('nomTravailleur') : (accidentData && accidentData.nomTravailleur ? accidentData.nomTravailleur : null));
  const [prenomTravailleur, setPrenomTravailleur] = useState(watch('prenomTravailleur') ? watch('prenomTravailleur') : (accidentData && accidentData.prenomTravailleur ? accidentData.prenomTravailleur : null));
  const [dateNaissance, setDateNaissance] = useState(watch('dateNaissance') ? watch('dateNaissance') : (accidentData && accidentData.dateNaissance ? accidentData.dateNaissance : null));
  const [lieuxnaissance, setLieuxnaissance] = useState(watch('lieuxnaissance') ? watch('lieuxnaissance') : (accidentData && accidentData.lieuxnaissance ? accidentData.lieuxnaissance : null));
  const [nbHeuresSemaine, setNbHeuresSemaine] = useState(watch('nbHeuresSemaine') ? watch('nbHeuresSemaine') : (accidentData && accidentData.nbHeuresSemaine ? accidentData.nbHeuresSemaine : null));
  const [dateDebutArret, setDateDebutArret] = useState(watch('dateDebutArret') ? watch('dateDebutArret') : (accidentData && accidentData.dateDebutArret ? accidentData.dateDebutArret : null));
  const [dateFinArret, setDateFinArret] = useState(watch('dateFinArret') ? watch('dateFinArret') : (accidentData && accidentData.dateFinArret ? accidentData.dateFinArret : null));
  const [dateEntrEntreprise, setDateEntrEntreprise] = useState(watch('dateEntrEntreprise') ? watch('dateEntrEntreprise') : (accidentData && accidentData.dateEntrEntreprise ? accidentData.dateEntrEntreprise : null));

  const [sexe, setsexe] = useState(watch('sexe') ? watch('sexe') : (accidentData && accidentData.sexe ? accidentData.sexe : null));
  const [nationalité, setnationalité] = useState(watch('nationalité') ? watch('nationalité') : (accidentData && accidentData.nationalité ? accidentData.nationalité : null));
  const [etatCivil, setetatCivil] = useState(watch('etatCivil') ? watch('etatCivil') : (accidentData && accidentData.etatCivil ? accidentData.etatCivil : null));
  const [adresseRue, setadresseRue] = useState(watch('adresseRue') ? watch('adresseRue') : (accidentData && accidentData.adresseRue ? accidentData.adresseRue : null));
  const [adresseCodepostal, setadresseCodepostal] = useState(watch('adresseCodepostal') ? watch('adresseCodepostal') : (accidentData && accidentData.adresseCodepostal ? accidentData.adresseCodepostal : null));
  const [adresseCommune, setadresseCommune] = useState(watch('adresseCommune') ? watch('adresseCommune') : (accidentData && accidentData.adresseCommune ? accidentData.adresseCommune : null));
  const [adressePays, setadressePays] = useState(watch('adressePays') ? watch('adressePays') : (accidentData && accidentData.adressePays ? accidentData.adressePays : null));
  const [adresseMail, setadresseMail] = useState(watch('adresseMail') ? watch('adresseMail') : (accidentData && accidentData.adresseMail ? accidentData.adresseMail : null));
  const [telephone, settelephone] = useState(watch('telephone') ? watch('telephone') : (accidentData && accidentData.telephone ? accidentData.telephone : null));

  const [adresseRuecorrespondance, setadresseRuecorrespondance] = useState(watch('adresseRuecorrespondance') ? watch('adresseRuecorrespondance') : (accidentData && accidentData.adresseRuecorrespondance ? accidentData.adresseRuecorrespondance : null));
  const [adresseCodecorrespondance, setadresseCodecorrespondance] = useState(watch('adresseCodecorrespondance') ? watch('adresseCodecorrespondance') : (accidentData && accidentData.adresseCodecorrespondance ? accidentData.adresseCodecorrespondance : null));
  const [adresseCommunecorrespondance, setadresseCommunecorrespondance] = useState(watch('adresseCommunecorrespondance') ? watch('adresseCommunecorrespondance') : (accidentData && accidentData.adresseCommunecorrespondance ? accidentData.adresseCommunecorrespondance : null));
  const [ListeadressePaysCorrespondance, setListeadressePaysCorrespondance] = useState(watch('ListeadressePaysCorrespondance') ? watch('ListeadressePaysCorrespondance') : (accidentData && accidentData.ListeadressePaysCorrespondance ? accidentData.ListeadressePaysCorrespondance : null));
  const [telephoneCorrespondance, settelephoneCorrespondance] = useState(watch('telephoneCorrespondance') ? watch('telephoneCorrespondance') : (accidentData && accidentData.telephoneCorrespondance ? accidentData.telephoneCorrespondance : null));
  const [ListeLangueCorr, setListeLangueCorr] = useState(watch('ListeLangueCorr') ? watch('ListeLangueCorr') : (accidentData && accidentData.ListeLangueCorr ? accidentData.ListeLangueCorr : null));


  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => {
    setValue('nomTravailleur', nomTravailleur)
    setValue('prenomTravailleur', prenomTravailleur)
    setValue('dateNaissance', dateNaissance)
    setValue('lieuxnaissance', lieuxnaissance)
    setValue('nbHeuresSemaine', nbHeuresSemaine)
    setValue('dateDebutArret', dateDebutArret)
    setValue('dateFinArret', dateFinArret)
    setValue('dateEntrEntreprise', dateEntrEntreprise)
    setValue('sexe', sexe)
    setValue('nationalité', nationalité)
    setValue('etatCivil', etatCivil)
    setValue('adresseRue', adresseRue)
    setValue('adresseCodepostal', adresseCodepostal)
    setValue('adresseCommune', adresseCommune)
    setValue('adressePays', adressePays)
    setValue('adresseMail', adresseMail)
    setValue('telephone', telephone)
    setValue('adresseRuecorrespondance', adresseRuecorrespondance)
    setValue('adresseCodecorrespondance', adresseCodecorrespondance)
    setValue('adresseCommunecorrespondance', adresseCommunecorrespondance)
    setValue('ListeadressePaysCorrespondance', ListeadressePaysCorrespondance)
    setValue('telephoneCorrespondance', telephoneCorrespondance)
    setValue('ListeLangueCorr', ListeLangueCorr)
  }
    , [nomTravailleur, prenomTravailleur, dateNaissance, lieuxnaissance, nbHeuresSemaine, dateDebutArret, dateFinArret, dateEntrEntreprise, sexe, nationalité, etatCivil, adresseRue, adresseCodepostal, adresseCommune, adressePays, adresseMail, telephone, adresseRuecorrespondance, adresseCodecorrespondance, adresseCommunecorrespondance, ListeadressePaysCorrespondance, telephoneCorrespondance, ListeLangueCorr, setValue]);

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
        label="Nombre d'heures travaillées par semaine"
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
        label="Date d'entrée dans l'entreprise"
        onChange={setDateEntrEntreprise}
        defaultValue={dateEntrEntreprise}
      />

      <AutoCompleteP id='sexe' label='Sexe' onChange={setsexe} option={listeDeclarationAssBelfius.ListeSexe} defaultValue={sexe} />

      <AutoCompleteP id='nationalité' label='Nationalité' onChange={setnationalité} option={listeDeclarationAssBelfius.ListeNationalite} defaultValue={nationalité} />

      <AutoCompleteP id='etatCivil' label='Etat civil' onChange={setetatCivil} option={listeDeclarationAssBelfius.ListeEtatCivil} defaultValue={etatCivil} />

      <TextFieldP
        id='adresseRue'
        label='Adresse du travailleur'
        onChange={setadresseRue}
        defaultValue={adresseRue}
      />

      <TextFieldP
        id='adresseCodepostal'
        label='Code postal'
        onChange={setadresseCodepostal}
        defaultValue={adresseCodepostal}
      />

      <TextFieldP
        id='adresseCommune'
        label='Commune'
        onChange={setadresseCommune}
        defaultValue={adresseCommune}
      />

      <AutoCompleteP id='adressePays' label='Pays' onChange={setadressePays} defaultValue={adressePays} option={listeDeclarationAssBelfius.ListeNationalite} />

      <TextFieldP
        id='adresseMail'
        label='Adresse mail'
        onChange={setadresseMail}
        defaultValue={adresseMail}
      />

      <TextFieldP
        id='telephone'
        label='Téléphone'
        onChange={settelephone}
        defaultValue={telephone}
      />

      <div style={frameStyle}>
        <h5> Adresse de correspondance (à mentionner si elle diffère de la résidence principale)</h5>
      </div>
      <TextFieldP id="adresseRuecorrespondance" label="Rue / numéro / boite" onChange={(value) => { setadresseRuecorrespondance(value); setShowadresseRuecorrespondance(value === '') }} defaultValue={adresseRuecorrespondance} />
      {!showSecondTextField && (
        <TextFieldP id="adresseCodecorrespondance" label="Code postal" onChange={setadresseCodecorrespondance} defaultValue={adresseCodecorrespondance} />
      )}
      {!showSecondTextField && (
        <TextFieldP id="adresseCommunecorrespondance" label="Commune" onChange={setadresseCommunecorrespondance} defaultValue={adresseCommunecorrespondance} />

      )}
      {!showSecondTextField && (
        <TextFieldP id="ListeadressePaysCorrespondance" label="Pays" onChange={setListeadressePaysCorrespondance} defaultValue={ListeadressePaysCorrespondance} />

      )}
      {!showSecondTextField && (
        <TextFieldP id="telephoneCorrespondance" label="Téléphone" onChange={settelephoneCorrespondance} defaultValue={telephoneCorrespondance} />
      )}
      {!showSecondTextField && (
        <AutoCompleteP id="ListeLangueCorr" option={listeDeclarationAss.ListeLangueCorr} label="Langue de correspondance avec la victime" onChange={setListeLangueCorr} defaultValue={ListeLangueCorr} />
      )}
    </div>
  );
}
