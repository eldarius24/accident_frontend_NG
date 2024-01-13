/* IMPORT REACT */
import * as React from 'react';
/* IMPORT MUI */
import { useState, useEffect } from 'react';
/* IMPORT PERSO */
import TextFieldP from '../composants/textFieldP';
import TextFieldMaskP from '../composants/textFieldMaskP';
import DatePickerP from '../composants/datePickerP';
import AutoCompleteP from '../composants/autoCompleteP';
import listeDeclarationAssBelfius from '../liste/listeDeclarationAssBelfius.json';
export default function FormulaireSalarie({ setValue, accidentData, watch }) {

  // Mise en forme des cadres texte
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



  /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
  const [nomTravailleur, setNomTravailleur] = useState(watch('nomTravailleur') ? watch('nomTravailleur') : (accidentData && accidentData.nomTravailleur ? accidentData.nomTravailleur : null));
  const [prenomTravailleur, setPrenomTravailleur] = useState(watch('prenomTravailleur') ? watch('prenomTravailleur') : (accidentData && accidentData.prenomTravailleur ? accidentData.prenomTravailleur : null));
  const [dateNaissance, setDateNaissance] = useState(watch('dateNaissance') ? watch('dateNaissance') : (accidentData && accidentData.dateNaissance ? accidentData.dateNaissance : null));
  const [lieuxnaissance, setLieuxnaissance] = useState(watch('lieuxnaissance') ? watch('lieuxnaissance') : (accidentData && accidentData.lieuxnaissance ? accidentData.lieuxnaissance : null));
  const [niss, setNiss] = useState(watch('niss') ? watch('niss') : (accidentData && accidentData.niss ? accidentData.niss : null));
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
  const [CodeMutuelle, setCodeMutuelle] = useState(watch('CodeMutuelle') ? watch('CodeMutuelle') : (accidentData && accidentData.CodeMutuelle ? accidentData.CodeMutuelle : null));
  const [nomMutuelle, setnomMutuelle] = useState(watch('nomMutuelle') ? watch('nomMutuelle') : (accidentData && accidentData.nomMutuelle ? accidentData.nomMutuelle : null));
  const [adresseRueMutuelle, setadresseRueMutuelle] = useState(watch('adresseRueMutuelle') ? watch('adresseRueMutuelle') : (accidentData && accidentData.adresseRueMutuelle ? accidentData.adresseRueMutuelle : null));
  const [adresseCodepostalMutuelle, setadresseCodepostalMutuelle] = useState(watch('adresseCodepostalMutuelle') ? watch('adresseCodepostalMutuelle') : (accidentData && accidentData.adresseCodepostalMutuelle ? accidentData.adresseCodepostalMutuelle : null));
  const [adresseCommuneMutuelle, setadresseCommuneMutuelle] = useState(watch('adresseCommuneMutuelle') ? watch('adresseCommuneMutuelle') : (accidentData && accidentData.adresseCommuneMutuelle ? accidentData.adresseCommuneMutuelle : null));
  const [numAffiliation, setnumAffiliation] = useState(watch('numAffiliation') ? watch('numAffiliation') : (accidentData && accidentData.numAffiliation ? accidentData.numAffiliation : null));
  const [numCompteBancaire, setnumCompteBancaire] = useState(watch('numCompteBancaire') ? watch('numCompteBancaire') : (accidentData && accidentData.numCompteBancaire ? accidentData.numCompteBancaire : null));
  const [etabliFinancier, setetabliFinancier] = useState(watch('etabliFinancier') ? watch('etabliFinancier') : (accidentData && accidentData.etabliFinancier ? accidentData.etabliFinancier : null));
  const [numDimona, setnumDimona] = useState(watch('numDimona') ? watch('numDimona') : (accidentData && accidentData.numDimona ? accidentData.numDimona : null));
  const [ListeDurContra, setListeDurContra] = useState(watch('ListeDurContra') ? watch('ListeDurContra') : (accidentData && accidentData.ListeDurContra ? accidentData.ListeDurContra : null));
  const [dateSortie, setdateSortie] = useState(watch('dateSortie') ? watch('dateSortie') : (accidentData && accidentData.dateSortie ? accidentData.dateSortie : null));
  const [profesEntreprise, setprofesEntreprise] = useState(watch('profesEntreprise') ? watch('profesEntreprise') : (accidentData && accidentData.profesEntreprise ? accidentData.profesEntreprise : null));
  const [citp, setcitp] = useState(watch('citp') ? watch('citp') : (accidentData && accidentData.citp ? accidentData.citp : null));
  const [ListeDureeDsEntreprise, setListeDureeDsEntreprise] = useState(watch('ListeDureeDsEntreprise') ? watch('ListeDureeDsEntreprise') : (accidentData && accidentData.ListeDureeDsEntreprise ? accidentData.ListeDureeDsEntreprise : null));
  const [ListeVicInterimaire, setListeVicInterimaire] = useState(watch('ListeVicInterimaire') ? watch('ListeVicInterimaire') : (accidentData && accidentData.ListeVicInterimaire ? accidentData.ListeVicInterimaire : null));
  const [VicInterimaireOui, setVicInterimaireOui] = useState(watch('VicInterimaireOui') ? watch('VicInterimaireOui') : (accidentData && accidentData.VicInterimaireOui ? accidentData.VicInterimaireOui : null));
  const [VicInterimaireOuiNom, setVicInterimaireOuiNom] = useState(watch('VicInterimaireOuiNom') ? watch('VicInterimaireOuiNom') : (accidentData && accidentData.VicInterimaireOuiNom ? accidentData.VicInterimaireOuiNom : null));
  const [VicInterimaireOuiAdresse, setVicInterimaireOuiAdresse] = useState(watch('VicInterimaireOuiAdresse') ? watch('VicInterimaireOuiAdresse') : (accidentData && accidentData.VicInterimaireOuiAdresse ? accidentData.VicInterimaireOuiAdresse : null));


  /**
   * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
   */
  useEffect(() => {
    setValue('nomTravailleur', nomTravailleur)
    setValue('prenomTravailleur', prenomTravailleur)
    setValue('dateNaissance', dateNaissance)
    setValue('lieuxnaissance', lieuxnaissance)
    setValue('niss', niss)
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
    setValue('CodeMutuelle', CodeMutuelle)
    setValue('nomMutuelle', nomMutuelle)
    setValue('adresseRueMutuelle', adresseRueMutuelle)
    setValue('adresseCodepostalMutuelle', adresseCodepostalMutuelle)
    setValue('adresseCommuneMutuelle', adresseCommuneMutuelle)
    setValue('numAffiliation', numAffiliation)
    setValue('numCompteBancaire', numCompteBancaire)
    setValue('etabliFinancier', etabliFinancier)
    setValue('numDimona', numDimona)
    setValue('ListeDurContra', ListeDurContra)
    setValue('dateSortie', dateSortie)
    setValue('profesEntreprise', profesEntreprise)
    setValue('citp', citp)
    setValue('ListeDureeDsEntreprise', ListeDureeDsEntreprise)
    setValue('ListeVicInterimaire', ListeVicInterimaire)
    setValue('VicInterimaireOui', VicInterimaireOui)
    setValue('VicInterimaireOuiNom', VicInterimaireOuiNom)
    setValue('VicInterimaireOuiAdresse', VicInterimaireOuiAdresse)
  }
    , [ListeDurContra, dateSortie, profesEntreprise, citp, ListeDureeDsEntreprise, ListeVicInterimaire, VicInterimaireOui, VicInterimaireOuiNom, VicInterimaireOuiAdresse, numDimona, CodeMutuelle, nomMutuelle, adresseRueMutuelle, adresseCodepostalMutuelle, adresseCommuneMutuelle, numAffiliation, numCompteBancaire, etabliFinancier, nomTravailleur, prenomTravailleur, dateNaissance, lieuxnaissance, niss, nbHeuresSemaine, dateDebutArret, dateFinArret, dateEntrEntreprise, sexe, nationalité, etatCivil, adresseRue, adresseCodepostal, adresseCommune, adressePays, adresseMail, telephone, adresseRuecorrespondance, adresseCodecorrespondance, adresseCommunecorrespondance, ListeadressePaysCorrespondance, telephoneCorrespondance, ListeLangueCorr, setValue]);

  /**
   * Etape 3 : retourner le formulaire (IHMs)
   */
  return (
    <div className="frameStyle-style">
      <div>
        <h2>Infos du travailleur</h2>
        <h3>Rentrez les informations sur la victime de l'accident de travail.</h3>

        <TextFieldP id='nomTravailleur' label='Nom du travailleur' onChange={setNomTravailleur} defaultValue={nomTravailleur} />
        <TextFieldP id='prenomTravailleur' label='Prénom du travailleur' onChange={setPrenomTravailleur} defaultValue={prenomTravailleur} />
        <DatePickerP id='dateNaissance' label='Date de naissance' onChange={setDateNaissance} defaultValue={dateNaissance} />
        <TextFieldP id='lieuxnaissance' label='Lieu de naissance' onChange={setLieuxnaissance} defaultValue={lieuxnaissance} />
        <TextFieldMaskP id='niss' label='NISS du travailleur' onChange={setNiss} defaultValue={niss} mask="000000-000-00"/>
        <TextFieldMaskP id="numCompteBancaire" label="Numéro de compte bancaire" onChange={setnumCompteBancaire} defaultValue={numCompteBancaire} mask="AA00-0000-0000-0000-0000-0000-0000-0000-00" />
        <TextFieldP id="etabliFinancier" label="Etablissement Financier BIC" onChange={setetabliFinancier} defaultValue={etabliFinancier} />
        <TextFieldP id="numDimona" label="Numéro de la Dimona" onChange={setnumDimona} defaultValue={numDimona} />
        <AutoCompleteP id='sexe' label='Sexe' onChange={setsexe} option={listeDeclarationAssBelfius.ListeSexe} defaultValue={sexe} />
        <AutoCompleteP id='nationalité' label='Nationalité' onChange={setnationalité} option={listeDeclarationAssBelfius.ListeNationalite} defaultValue={nationalité} />
        <AutoCompleteP id='etatCivil' label='Etat civil' onChange={setetatCivil} option={listeDeclarationAssBelfius.ListeEtatCivil} defaultValue={etatCivil} />
        <TextFieldP id='adresseRue' label='Adresse du travailleur' onChange={setadresseRue} defaultValue={adresseRue} />
        <TextFieldP id='adresseCodepostal' label='Code postal' onChange={setadresseCodepostal} defaultValue={adresseCodepostal} />
        <TextFieldP id='adresseCommune' label='Commune' onChange={setadresseCommune} defaultValue={adresseCommune} />
        <AutoCompleteP id='adressePays' label='Pays' onChange={setadressePays} defaultValue={adressePays} option={listeDeclarationAssBelfius.ListeadressePays} />
        <TextFieldP id='adresseMail' label='Adresse mail' onChange={setadresseMail} defaultValue={adresseMail} />
        <TextFieldP id='telephone' label='Téléphone' onChange={settelephone} defaultValue={telephone} />

        {        /*<div className="frameStyle-style">
          <h5> Adresse de correspondance (à mentionner si elle diffère de la résidence principale)</h5>
  </div>*/}
        <TextFieldP id="adresseRuecorrespondance" label="Adresse de correspondance du travailleur (à mentionner si elle diffère de la résidence principale)" onChange={(value) => { setadresseRuecorrespondance(value); }} defaultValue={adresseRuecorrespondance} />

        {adresseRuecorrespondance && (
          [<TextFieldP id="adresseCodecorrespondance" label="Code postal" onChange={setadresseCodecorrespondance} defaultValue={adresseCodecorrespondance} />,
          <TextFieldP id="adresseCommunecorrespondance" label="Commune" onChange={setadresseCommunecorrespondance} defaultValue={adresseCommunecorrespondance} />,
          <AutoCompleteP id='ListeadressePaysCorrespondance' label='Pays' onChange={setListeadressePaysCorrespondance} defaultValue={ListeadressePaysCorrespondance} option={listeDeclarationAssBelfius.ListeadressePaysCorrespondance} />,
          <TextFieldP id="telephoneCorrespondance" label="Téléphone" onChange={settelephoneCorrespondance} defaultValue={telephoneCorrespondance} />,
          <AutoCompleteP id="ListeLangueCorr" option={listeDeclarationAssBelfius.ListeLangueCorr} label="Langue de correspondance avec la victime" onChange={setListeLangueCorr} defaultValue={ListeLangueCorr} />]
        )}
        <TextFieldP id='nbHeuresSemaine' label="Nombre d'heures travaillées par semaine" onChange={setNbHeuresSemaine} defaultValue={nbHeuresSemaine} />
        <DatePickerP id='dateDebutArret' label="Date de début du dernier arrêt de travail(>15j)" onChange={setDateDebutArret} defaultValue={dateDebutArret} />
        <DatePickerP id='dateFinArret' label="Date de fin du denier arrêt de travail (>15j)" onChange={setDateFinArret} defaultValue={dateFinArret} />
        <DatePickerP id='dateEntrEntreprise' label="Date d'entrée dans l'entreprise" onChange={setDateEntrEntreprise} defaultValue={dateEntrEntreprise} />
        <AutoCompleteP id="ListeDurContra" option={listeDeclarationAssBelfius.ListeDurContra} label="Durée du contrat de travail" onChange={(value) => { setListeDurContra(value) }} defaultValue={ListeDurContra} />

        {(ListeDurContra === 'Déterminée') && (
          <DatePickerP id="dateSortie" label="Date de sortie si elle est connue" onChange={setdateSortie} defaultValue={dateSortie} />
        )}

        <TextFieldP id="profesEntreprise" label="Profession habituelle dans l’entreprise" onChange={setprofesEntreprise} defaultValue={profesEntreprise} />
        <TextFieldP id="citp" label="Code CITP" onChange={setcitp} defaultValue={citp} />
        <AutoCompleteP id="ListeDureeDsEntreprise" option={listeDeclarationAssBelfius.ListeDureeDsEntreprise} label="Durée d'exercice de cette profession par la victime dans l'entreprise" onChange={setListeDureeDsEntreprise} defaultValue={ListeDureeDsEntreprise} />
        <AutoCompleteP id="ListeVicInterimaire" option={listeDeclarationAssBelfius.ListeVicInterimaire} label="La victime est-elle un(e) intérimaire" onChange={(value) => { setListeVicInterimaire(value); }} defaultValue={ListeVicInterimaire} />

        {(ListeVicInterimaire === 'Oui') && (
          [<TextFieldP id="VicInterimaireOui" label="Numéro ONSS de l’entreprise utilisatrice" onChange={setVicInterimaireOui} defaultValue={VicInterimaireOui} />,
          <TextFieldP id="VicInterimaireOuiNom" label="Nom" onChange={setVicInterimaireOuiNom} defaultValue={VicInterimaireOuiNom} />,
          <TextFieldP id="VicInterimaireOuiAdresse" label="Adresse" onChange={setVicInterimaireOuiAdresse} defaultValue={VicInterimaireOuiAdresse} />]
        )}

        <div className="frameStyle-style">
          <h5> Informations sur la Mutuelle de la victime</h5>
        </div>
        <TextFieldP id="CodeMutuelle" label="Code mutuelle" onChange={setCodeMutuelle} defaultValue={CodeMutuelle} />
        <TextFieldP id="nomMutuelle" label="Nom mutuelle" onChange={setnomMutuelle} defaultValue={nomMutuelle} />
        <TextFieldP id="adresseRueMutuelle" label="Rue / numéro / boite" onChange={setadresseRueMutuelle} defaultValue={adresseRueMutuelle} />
        <TextFieldP id="adresseCodepostalMutuelle" label="Code postal" onChange={setadresseCodepostalMutuelle} defaultValue={adresseCodepostalMutuelle} />
        <TextFieldP id="adresseCommuneMutuelle" label="Commune" onChange={setadresseCommuneMutuelle} defaultValue={adresseCommuneMutuelle} />
        <TextFieldP id="numAffiliation" label="Numéro d'affiliation" onChange={setnumAffiliation} defaultValue={numAffiliation} />

      </div>
    </div>
  );
}
