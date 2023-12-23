/* IMPORT REACT */
import * as React from 'react';
import { useState, useEffect } from 'react';
/* IMPORT MUI */
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');
import { InputAdornment, Autocomplete, TextField } from '@mui/material';
/* IMPORT PERSO */
import listeDeclarationAss from '../liste/listeDeclarationAssBelfius.json';
import AutoCompleteP from '../composants/autoCompleteP';
import TextFieldP from '../composants/textFieldP';
import DatePickerP from '../composants/datePickerP';




dayjs.locale('fr');

export default function FormulaireDeclarationASSBelfius({ setValue, accidentData, watch }) {

    /**
   * Etape 1 : stocker les données dans des variables locales et les initialiser avec les données de l'accident si elles existent
   * 
   */
    const [CodeMutuelle, setCodeMutuelle] = useState(watch('CodeMutuelle') ? watch('CodeMutuelle') : (accidentData && accidentData.CodeMutuelle ? accidentData.CodeMutuelle : ''));
    const [adresseRueMutuelle, setadresseRueMutuelle] = useState(watch('adresseRueMutuelle') ? watch('adresseRueMutuelle') : (accidentData && accidentData.adresseRueMutuelle ? accidentData.adresseRueMutuelle : ''));
    const [adresseCodepostalMutuelle, setadresseCodepostalMutuelle] = useState(watch('adresseCodepostalMutuelle') ? watch('adresseCodepostalMutuelle') : (accidentData && accidentData.adresseCodepostalMutuelle ? accidentData.adresseCodepostalMutuelle : ''));
    const [adresseCommuneMutuelle, setadresseCommuneMutuelle] = useState(watch('adresseCommuneMutuelle') ? watch('adresseCommuneMutuelle') : (accidentData && accidentData.adresseCommuneMutuelle ? accidentData.adresseCommuneMutuelle : ''));
    const [numAffiliation, setnumAffiliation] = useState(watch('numAffiliation') ? watch('numAffiliation') : (accidentData && accidentData.numAffiliation ? accidentData.numAffiliation : ''));
    const [numCompteBancaire, setnumCompteBancaire] = useState(watch('numCompteBancaire') ? watch('numCompteBancaire') : (accidentData && accidentData.numCompteBancaire ? accidentData.numCompteBancaire : ''));
    const [etabliFinancier, setetabliFinancier] = useState(watch('etabliFinancier') ? watch('etabliFinancier') : (accidentData && accidentData.etabliFinancier ? accidentData.etabliFinancier : ''));
    const [numDimona, setnumDimona] = useState(watch('numDimona') ? watch('numDimona') : (accidentData && accidentData.numDimona ? accidentData.numDimona : ''));
    const [dureeContrat, setdureeContrat] = useState(watch('dureeContrat') ? watch('dureeContrat') : (accidentData && accidentData.dureeContrat ? accidentData.dureeContrat : ''));
    const [professionHabituelle, setprofessionHabituelle] = useState(watch('professionHabituelle') ? watch('professionHabituelle') : (accidentData && accidentData.professionHabituelle ? accidentData.professionHabituelle : ''));
    const [boolVictimeInterimaire, setboolVictimeInterimaire] = useState(watch('boolVictimeInterimaire') ? watch('boolVictimeInterimaire') : (accidentData && accidentData.boolVictimeInterimaire ? accidentData.boolVictimeInterimaire : ''));
    const [boolVictimeTravailDansEtablissement, setboolVictimeTravailDansEtablissement] = useState(watch('boolVictimeTravailDansEtablissement') ? watch('boolVictimeTravailDansEtablissement') : (accidentData && accidentData.boolVictimeTravailDansEtablissement ? accidentData.boolVictimeTravailDansEtablissement : ''));
    const [dateNotifAEmployeur, setdateNotifAEmployeur] = useState(watch('dateNotifAEmployeur') ? watch('dateNotifAEmployeur') : (accidentData && accidentData.dateNotifAEmployeur ? accidentData.dateNotifAEmployeur : ''));
    const [lieuxAccident, setlieuxAccident] = useState(watch('lieuxAccident') ? watch('lieuxAccident') : (accidentData && accidentData.lieuxAccident ? accidentData.lieuxAccident : ''));
    const [numDuChantier, setnumDuChantier] = useState(watch('numDuChantier') ? watch('numDuChantier') : (accidentData && accidentData.numDuChantier ? accidentData.numDuChantier : ''));
    const [environementLieux, setenvironementLieux] = useState(watch('environementLieux') ? watch('environementLieux') : (accidentData && accidentData.environementLieux ? accidentData.environementLieux : ''));
    const [activiteGeneral, setactiviteGeneral] = useState(watch('activiteGeneral') ? watch('activiteGeneral') : (accidentData && accidentData.activiteGeneral ? accidentData.activiteGeneral : ''));
    const [activiteSpecifique, setactiviteSpecifique] = useState(watch('activiteSpecifique') ? watch('activiteSpecifique') : (accidentData && accidentData.activiteSpecifique ? accidentData.activiteSpecifique : ''));
    const [typePosteTravail, settypePosteTravail] = useState(watch('typePosteTravail') ? watch('typePosteTravail') : (accidentData && accidentData.typePosteTravail ? accidentData.typePosteTravail : ''));
    const [boolProfessionHabituelle, setboolProfessionHabituelle] = useState(watch('boolProfessionHabituelle') ? watch('boolProfessionHabituelle') : (accidentData && accidentData.boolProfessionHabituelle ? accidentData.boolProfessionHabituelle : ''));
    const [activitéExercée, setactivitéExercée] = useState(watch('activitéExercée') ? watch('activitéExercée') : (accidentData && accidentData.activitéExercée ? accidentData.activitéExercée : ''));
    const [evenementDeviant, setevenementDeviant] = useState(watch('evenementDeviant') ? watch('evenementDeviant') : (accidentData && accidentData.evenementDeviant ? accidentData.evenementDeviant : ''));
    const [boolProcesVerbal, setboolProcesVerbal] = useState(watch('boolProcesVerbal') ? watch('boolProcesVerbal') : (accidentData && accidentData.boolProcesVerbal ? accidentData.boolProcesVerbal : ''));
    const [numeroIdentificationProcesVerbal, setnumeroIdentificationProcesVerbal] = useState(watch('numeroIdentificationProcesVerbal') ? watch('numeroIdentificationProcesVerbal') : (accidentData && accidentData.numeroIdentificationProcesVerbal ? accidentData.numeroIdentificationProcesVerbal : ''));
    const [dateRedactionProcesVerbal, setdateRedactionProcesVerbal] = useState(watch('dateRedactionProcesVerbal') ? watch('dateRedactionProcesVerbal') : (accidentData && accidentData.dateRedactionProcesVerbal ? accidentData.dateRedactionProcesVerbal : ''));

    /**
     * Etape 2 : mettre à jour les données du formulaire à chaque modification d'un des champs
     */
    useEffect(() => {
        setValue('CodeMutuelle', CodeMutuelle)  
        setValue('adresseRueMutuelle', adresseRueMutuelle)
        setValue('adresseCodepostalMutuelle', adresseCodepostalMutuelle)
        setValue('adresseCommuneMutuelle', adresseCommuneMutuelle)
        setValue('numAffiliation', numAffiliation)
        setValue('numCompteBancaire', numCompteBancaire)
        setValue('etabliFinancier', etabliFinancier)
        setValue('numDimona', numDimona)
        setValue('dureeContrat', dureeContrat)
        setValue('professionHabituelle', professionHabituelle)
    }, [CodeMutuelle, adresseRueMutuelle, adresseCodepostalMutuelle, adresseCommuneMutuelle, numAffiliation, numCompteBancaire, etabliFinancier, numDimona, dureeContrat, professionHabituelle, setValue]);



    return (
        <div className="infoDeclarationAss">

            <div>
                <h5> Informations sur la Mutuelle</h5>
            </div>

            <TextFieldP id="CodeMutuelle" label="Code  mutuelle" onChange={setCodeMutuelle} defaultValue={CodeMutuelle} />

            <TextFieldP id="adresseRueMutuelle" label="Rue / numéro / boite" onChange={setadresseRueMutuelle} defaultValue={adresseRueMutuelle} />

            <TextFieldP id="adresseCodepostalMutuelle" label="Code postal" onChange={setadresseCodepostalMutuelle} defaultValue={adresseCodepostalMutuelle} />

            <TextFieldP id="adresseCommuneMutuelle" label="Commune" onChange={setadresseCommuneMutuelle} defaultValue={adresseCommuneMutuelle} />

            <TextFieldP id="numAffiliation" label="Numéro d'affiliation" onChange={setnumAffiliation} defaultValue={numAffiliation} />

            <TextFieldP id="numCompteBancaire" label="Numéro de compte bancaire IBAN de la victime" onChange={setnumCompteBancaire} defaultValue={numCompteBancaire} />

            <TextFieldP id="etabliFinancier" label="Etablissement financer BIC de la victime" onChange={setetabliFinancier} defaultValue={etabliFinancier} />

            <TextFieldP id="numDimona" label="Numero Dimona" onChange={setnumDimona} defaultValue={numDimona} />

            <AutoCompleteP id="dureeContrat" option={listeDeclarationAss.ListeDurContra} label="Durée du contrat de travail" onChange={setdureeContrat} defaultValue={dureeContrat} />

            {showvingtdeuxTextField && (
                <AutoCompleteP id="dateSortieConnue" option={listeDeclarationAss.ListeDateSortie} label="La date de sortie est-elle connue ?" onChange={setdateSortie} defaultValue={dateSortie} />
            )}

            {showvingtetunTextField && (
                <DatePickerP id="dateSortie" label="Date de sortie" onChange={setdateSortie} defaultValue={dateSortie} />
            )}

            <TextFieldP id="professionHabituelle" label="Profession habituelle dans l’entreprise" onChange={setprofessionHabituelle} defaultValue={professionHabituelle} />

            <AutoCompleteP id="activitéExercée" option={listeDeclarationAss.ListeDureeDsEntreprise} label="Durée d'exercice de cette profession par la victime dans l'entreprise" onChange={setactivitéExercée} defaultValue={activitéExercée} />
            <div>
                <autoCompletePerso id="BoolVictimeInterimaire" option={listeDeclarationAss.ListeBoolVictimeInterimaire} label="La victime est-elle un(e) intérimaire" />

                {isInterimaire && (
                    <>
                        <TextFieldP id="VicInterimaireOuiNumONSS" label="Numéro ONSS de l’entreprise utilisatrice" />

                        <TextFieldP id="VicInterimaireOuiNom" label="Nom" />

                        <TextFieldP id="VicInterimaireOuiAdresse" label="Adresse" />
                    </>
                )}
            </div>

            <autoCompletePerso id="BoolVictimeTravailHorsEtablissement" option={listeDeclarationAss.ListeVicInterimaire} label="La victime travaille-t-elle dans un établissement de l’employeur ?" />

            {isTravailHorsEtablissement && (
                <>
                    <TextFieldP id="VicTravailHorsEtablissementNumONSS" label="Numéro ONSS de l’entreprise utilisatrice" />

                    <TextFieldP id="VicTravailHorsEtablissementNom" label="Nom" />

                    <TextFieldP id="VicTravailHorsEtablissementAdresse" label="Adresse" />

                </>
            )}
            

            <DatePickerP id="dateNotifAEmployeur" label="Date de notification à l’employeur" onChange={setdateNotifAEmployeur} defaultValue={dateNotifAEmployeur} />

            <AutoCompleteP id="lieuxAccident" option={listeDeclarationAss.ListeLieuxAt} label="Lieu de l’accident" onChange={setlieuxAccident} defaultValue={lieuxAccident} />



            </div>
    );
}

/*
            {date1Perso("dateNotifEmployeur", "Date de notification à l’employeur")}

            {autoCompletechangePerso("ListeLieuxAt", listeDeclarationAss.ListeLieuxAt, "Lieu de l’acciden", handlecomboboxListeLieuxAt)}

            {showsixTextField && (

                autoCompletechangePerso("ListeVoiePublic", listeDeclarationAss.ListeVoiePublic, "Est-ce un accident de la circulation", handlecomboboxListeVoiePublict)

            )}

            {showcinqTextField && (

                textFieldPerso("LieuxAtAdresse", "Rue/numero/boite")
            )}

            {showcinqTextField && (

                textFieldPerso("LieuxAtCodePostal", "Code postal")
            )}

            {showcinqTextField && (

                textFieldPerso("LieuxAtCommune", "Commune")
            )}

            {showcinqTextField && (

                autoCompletePerso("ListeLieuxAtPays", listeDeclarationAss.ListeLieuxAtPays, "Pays")
            )}

            {textFieldPerso("NumdeChantier", "Numéro du chantier")}

            <div style={frameStyle}>
                <h5> Dans quel environnement ou dans quel type de lieu la victime se trouvait-elle lorsque l’accident s’est produit ? (p.ex. , aire de maintenance, chantier de
                    construction d’un tunnel, lieu d’élevage de bétail, bureau, école, magasin, hôpital, parking, salle de sports, toit d’un hôtel, maison privée, égout, jardin,
                    autoroute, navire à quai, sous l’eau, etc.). </h5>
            </div>

            {textFieldPerso("environementLieux", "Expliquez")}

            <div style={frameStyle}>
                <h5> Précisez l’activité général (le type de travail) qu’effectuait la victime ou la tâche (au sens large) qu’elle accomplissait lorsque l’accident s’est produit.
                    (p.ex., transformation de produits, stockage, terrassement, construction ou démolition d’un bâtiment, tâches de type agricole on forestier, tâches avec
                    des animaux, soins, assistance d’une personne ou de plusieurs, formation, travil de bureau, achat, vente, activité artistique, etc. ou les tâches auxiliaires
                    de ces différents travaux comme l’installation, le désassemblage, la maintenance, la réparation, le nettoyage, etc.)  </h5>
            </div>

            {textFieldPerso("activiteGeneral", "Expliquez")}

            <div style={frameStyle}>
                <h5> Précisez l’activité spécifique de la victime lorsque l’accident s’est produit : (p.ex. , remplissage de la machine, utilisation d’ outillage à main, conduite d’un
                    moyen de transport, saisie, levage, roulage, portage d’un objet, fermeture d’une boite, montée d’une échelle, marche, prise de position assise, etc.) ET les
                    objets impliqués (p.ex. , outillage, machine, équipement, matériaux, objets, instruments, substances, etc.)</h5>
            </div>

            {textFieldPerso("activiteSpecifique", "Expliquez")}

            {autoCompletePerso("ListeTypedePost", listeDeclarationAss.ListeTypedePost, "A quel type de poste de travail la victime se trouvait-elle")}

            {autoCompletechangePerso("ListeProfHabituelle", listeDeclarationAss.ListeProfHabituelle, "Lors de l'accident, la victime exerçait-elle une activité dans le cadre de sa profession habituelle", handcomboboxListeProfHabituelle)}

            {showseptTextField && (

                textFieldPerso("ListeProfHabituelleNon", "Si non, quelle activité exerçait-elle")
            )}
            <div style={frameStyle}>
                <h5> Quels événements déviant par rapport au processus normal du travail ont provoqué l’accident ? (p.ex. , problème électrique, explosion, feu, déborde-
                    ment, renversement, écoulement, émission de gaz, rupture, chute ou effondrement d’objet, démarrage ou fonctionnement anormal d’une machine, perte
                    de contrôle d’un moyen de transport ou d’un objet, glissade ou chute de personne, action inopportune, faux mouvement, surprise, frayeur, violence,
                    agression, etc.). Précisez tous ces faits ET les objets impliqués s’ils ont joué un rôle dans leur survenue (p.ex. , outillage, machine, équipement, matéri-
                    aux, objets, instruments, substances, etc.) </h5>
            </div>

            {textFieldPerso("evenementDeviant", "Expliquez")}

            {autoCompletechangePerso("ListeProcesVerbal", listeDeclarationAss.ListeProcesVerbal, "Un procès-verbal a-t-il été dressé", handcomboboxListeProcesVerbale)}

            {showhuitTextField && (

                textFieldPerso("ProcesVerbalOui", "Le procès-verbal porte le numéro d’identification")
            )}

            {showhuitTextField && (

                textFieldPerso("ProcesVerbalOuiRedige", "Il a été rédigé à")
            )}

            {showhuitTextField && (

                date2Perso("dateProcesVerbalOuiRedigeQuand", "Date de rédaction du PVt")
            )}

            {showhuitTextField && (

                textFieldPerso("ProcesVerbalOuiPar", "Il a été rédigé par")
            )}

            {autoCompletechangePerso("ListeTierResponsable", listeDeclarationAss.ListeTierResponsable, "Un tiers peut-il être rendu responsable de l’accident", handcomboboxListeTierResponsable)}

            {showneufTextField && (

                textFieldPerso("TierResponsableOui", "Nom et adresse")
            )}

            {showneufTextField && (

                textFieldPerso("TierResponsableOuiNomAdresse", "Nom et adresse de l’assureur")
            )}

            {showneufTextField && (

                textFieldPerso("TierResponsableOuiNumPolice", "Numéro de police")
            )}

            {autoCompletechangePerso("ListeTemoins", listeDeclarationAss.ListeTemoins, "Y a-t-il eu des témoins", handlecomboboxListeTemoins)}

            {showdixTextField && (

                textFieldPerso("TemoinsOui", "Nom - rue/n°/boite - Code postal - Commune")
            )}
            <div style={frameStyle}>
                <h5> Comment la victime a-t-elle été blessée (lésion physique au psychique) ? Précisez chaque fois par ordre d’importance tous les différents contacts qui ont
                    provoqué la (les) blessure(s) (p. ex. , contact avec un courant électrique, avec une source de chaleur ou des substances dangereuses, noyade, ensevelis-
                    sement, enveloppement par quelque chose (gaz, liquide, solide), écrasement contre un objet ou heurt par un objet, collision, contact avec un objet coupant
                    ou pointu, coincement ou écrasement par un objet, problèmes d’appareil locomoteur, choc mental, blessure causée par un animal ou par une personne,
                    etc.) ET les objets impliqués (p. ex. , outillage, machine, équipement, matériaux, objets, instruments, substances, etc.). </h5>
            </div>

            {textFieldPerso("blessureVictume", "Expliquez")}

            {autoCompletechangePerso("ListeSoinsMedicaux", listeDeclarationAss.ListeSoinsMedicaux, "Des soins médicaux ont-ils été dispensés chez l’employeur", handlecomboboxListeSoinsMedicaux)}

            {showonzeTextField && (

                date1Perso("dateSoinsMedicauxDate", "Date et Heure")
            )}

            {showonzeTextField && (

                textFieldPerso("SoinsMedicauxDispansateur", "Qualité du dispensateur")
            )}

            {showonzeTextField && (

                textFieldPerso("SoinsMedicauxDescriptions", "Description des soins dispensés")
            )}

            {autoCompletechangePerso("ListeSoinsMedicauxMedecin", listeDeclarationAss.ListeSoinsMedicauxMedecin, "Des soins médicaux ont-ils été dispensés par un médecin externe", handlecomboboxListeSoinsMedicauxMedecin)}

            {showdouzeTextField && (

                date1Perso("dateSoinsMedicauxMedecin", "Date et Heure")
            )}

            {showdouzeTextField && (

                textFieldPerso("SoinsMedicauxMedecinInami", "Numéro d’identification du médecin externe à l’INAMI")
            )}

            {showdouzeTextField && (

                textFieldPerso("SoinsMedicauxMedecinNom", "Nom et prénom du médecin externe")
            )}

            {showdouzeTextField && (

                textFieldPerso("SoinsMedicauxMedecinRue", "Rue / n° / boite")
            )}

            {showdouzeTextField && (

                textFieldPerso("SoinsMedicauxMedecinCodePostal", "Code postal")
            )}

            {showdouzeTextField && (

                textFieldPerso("SoinsMedicauxMedecinCommune", "Commune")
            )}

            {autoCompletechangePerso("ListeSoinsMedicauxHopital", listeDeclarationAss.ListeSoinsMedicauxHopital, "Des soins médicaux ont-ils été dispensés à l’hôpital", handlecomboboxListeSoinsMedicauxHopital)}

            {showtreizeTextField && (

                date1Perso("dateSoinsMedicauxHopital", "Date et Heure")
            )}

            {showtreizeTextField && (

                textFieldPerso("SoinsMedicauxHopitalInami", "Numéro d’identification de l’hôpital à l’INAMI")
            )}

            {showtreizeTextField && (

                textFieldPerso("SoinsMedicauxHopitaldenomi", "Dénomination de I*hôpital")
            )}

            {showtreizeTextField && (

                textFieldPerso("SoinsMedicauxHopitalRue", "Rue / n° / boite")
            )}

            {showtreizeTextField && (

                textFieldPerso("SoinsMedicauxHopitalCodePostal", "Code postal")
            )}

            {showtreizeTextField && (

                textFieldPerso("SoinsMedicauxHopitalCommune", "Commune")
            )}

            {autoCompletePerso("ListeConseqAccident", listeDeclarationAss.ListeConseqAccident, "Conséquences de l’accident")}

            {date1Perso("dateRepriseEffective", "Date de reprise effective du travail habituel/au poste d’origine")}

            <div style={frameStyle}>
                <h5>  S'il n'y a pas encore eu de reprise complète du travail habituel/au poste d’origine durée probable de l'incapacité temporaire
                    totale ou partielle de travail </h5>
            </div>

            {textFieldPerso("JourIncaCompl", "Jours")}

            {autoCompletePerso("ListeMesureRepetition", listeDeclarationAss.ListeMesureRepetition, "Mesures de prévention prises pour éviter la répétition d’un tel accident")}

            {textFieldPerso("CodeRisqueEntreprise", "Codes risques propres à l’entreprise")}

            {autoCompletechangePerso("ListeVictimeOnss", listeDeclarationAss.ListeVictimeOnss, "La victime est-elle affiliée à l’ONSS", handlecomboboxListeVictimeOnss)}

            {showquatorzeTextField && (

                textFieldPerso("victimeOnssNon", "Si non, donnez-en le motif")
            )}

            {textFieldchangePerso("codeTravailleurSocial", "Code du travailleur de l'assurance sociale", handloutlinedmultilinecodeTravailleurSocial)}

            {showquinzeTextField && (

                autoCompletechangePerso("ListeCategoProfess", listeDeclarationAss.ListeCategoProfess, "S'il n'est pas connu, mentionnez la catégorie professionnelle", handcomboboxListeCategoProfess)

            )}

            {showvingtTextField && (

                textFieldPerso("CategoProfessAutre", "Si autre, préciser")
            )}

            {autoCompletechangePerso("ListeNonOnss", listeDeclarationAss.ListeNonOnss, "Si « apprenti/stagiaire non assujetti à l’ONSS », type de stage ou de formation", handlecomboboxListeNonOnss)}

            {showSeizeTextField && (

                autoCompletechangePerso("ListeApprentiFormat", listeDeclarationAss.ListeApprentiFormat, "S’agit-il d’un apprenti en formation pour devenir chef d’entreprise", handlecomboboxListeApprentiFormats)

            )}

            {/*{showSeizeTextField && showdixseptTextField && (

                <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <TextField
                        id="CommissionParitaire"
                        onChange={(e) => setValue('CommissionParitaire', e.target.value)}
                        label="Commission paritaire"
                        sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                        multiline
                    />
                </div>

            )}}

            {showSeizeTextField && showdixseptTextField && (

                textFieldPerso("CommissionParitaireDénomination", "Commission paritaire Denomination")
            )}

            {showSeizeTextField && showdixseptTextField && (

                textFieldPerso("CommissionParitaireNumn", "Commission paritaire Numéro")
            )}

            {showSeizeTextField && showdixseptTextField && (

                autoCompletePerso("ListeTypeContrat", listeDeclarationAss.ListeTypeContrat, "Type de contrat de travail")
            )}

            {showSeizeTextField && showdixseptTextField && (

                textFieldPerso("Nbrjoursregime", "Nombre de jours par semaine du régime de travail")
            )}

            {showSeizeTextField && showdixseptTextField && (

                textFieldPerso("NbrHeureSemaine", "Nombre moyen d’heures par semaine la victime")
            )}

            {showSeizeTextField && showdixseptTextField && (

                textFieldPerso("NbrHeureSemaineReference", "Nombre moyen d’heures par semaine la personne de référence")
            )}

            {showSeizeTextField && showdixseptTextField && (

                autoCompletePerso("ListeVictiPension", listeDeclarationAss.ListeVictiPension, "La victime est-elle une personne pensionnée exerçant encore une activité professionnelle")
            )}

            {showSeizeTextField && showdixseptTextField && (

                autoCompletechangePerso("ListeModeRemuneration", listeDeclarationAss.ListeModeRemuneration, "Mode de rémunération", handlecomboboxListeModeRemuneration)

            )}

            {showSeizeTextField && showdixseptTextField && showdixhuitTextField && (
                <div>

                    {autoCompletePerso("ListeMontantRemuneration", listeDeclarationAss.ListeMontantRemuneration, "Unité de temps")}

                    {textFieldPerso("MontantRemunerationVariable", "En cas de rémunération variable, cycle correspondant à l’unité de temps déclarée")}

                    <div style={frameStyle}>
                        <h5>total des rémunérations et des avantages assujettis à l’ONSS, sans heures supplémentaires, pécule de vacances complémentaire et prime de find’année
                            (le montant déclaré doit correspondre à l’unité de temps ou à l’unité de temps et au cycle)</h5>
                    </div>

                    {textFieldinputPerso("remunerationTotalAssOnns", "Rémunérations", "€")}

                    {autoCompletePerso("ListePrimeFinAnnee", listeDeclarationAss.ListePrimeFinAnnee, "Prime de fin d’année")}

                    {textFieldinputPerso("PrimeFinAnneeRemuAnnuel", "Si oui, % de la rémunération annuelle", "%")}

                    {textFieldinputPerso("PrimeFinAnneeRemuAnnuelForfetaire", "Si oui, montant forfaitaire de €", "€")}

                    {textFieldinputPerso("PrimeFinAnneeRemuAnnuelNbrHeure", "Si oui, émunération d’un nombre d’heures", "Heures")}

                </div>
            )}

            {showSeizeTextField && showdixseptTextField && (
                <h3>Questions 63</h3>
            )}

            {showSeizeTextField && showdixseptTextField && (

                textFieldinputPerso("AvantegeAssujOnns", "Autres avantages assujettis ou non à l’ONSS (exprimés sur base annuelle)", "€")

            )}

            {showSeizeTextField && showdixseptTextField && (

                textFieldPerso("AvantegeAssujOnnsNature", "Nature des avantages")
            )}

            {showSeizeTextField && showdixseptTextField && (

                autoCompletechangePerso("ListechangementFonction", listeDeclarationAss.ListechangementFonction, "La victime a-t-elle changé de fonction durant l’année précédant l’accident du travail", handlecomboboxListechangementFonction)

            )}

            {showSeizeTextField && showdixseptTextField && showdixneufTextField && (

                date2Perso("dateChangementFonction", "Si oui, date du dernier changement de fonction")
            )}

            <h3>Questions 65</h3>

            {textFieldinputPerso("heureTravaillePerdu", "Nombre d’heures de travail perdues le jour de l’accident", "Heures")}

            {textFieldinputPerso("salaireTravaillePerdu", "Perte salariale pour les heures de travail perdues", "€")}

        */