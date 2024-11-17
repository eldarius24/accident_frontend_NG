import axios from "axios";
import CountNumberAccidentGroupe from "../../Model/CountNumberAccident";
import dateConverter from "../../Model/dateConverter";
import config from '../../config.json';

/**
 * Récupère les accidents depuis l'API
 * 
 * @returns {Array} - Le tableau des accidents.
 */
const getAccidents = async () => {
    const apiUrl = config.apiUrl;
    const result = await axios.get(`http://${apiUrl}:3100/api/accidents`);
    let accidents = result.data;
    accidents = CountNumberAccidentGroupe(accidents);

    if (accidents === undefined || accidents.length === 0 || !Array.isArray(accidents)) {
        console.error("La réponse de l'API est vide.");
        return [];
    }

    // Convertir les dates en objets Date
    accidents.forEach(item => {
        const dateProperties = [
            'DateHeureAccident',
            'DateEnvoieDeclarationAccident',
            'DateJourIncapDebut',
            'DateJourIncapFin',
            'dateNaissance',
            'dateDebutArret',
            'dateFinArret',
            'dateEntrEntreprise',
            'dateSortie',
            'dateNotifEmployeur',
            'dateProcesVerbalOuiRedigeQuand',
            'dateSoinsMedicauxDate',
            'dateSoinsMedicauxMedecin',
            'dateSoinsMedicauxHopital',
            'dateRepriseEffective',
            'dateChangementFonction',
            'dateDecede',
            'dateIncapaciteTemporaire',
            'dateTravailAddapte'
        ];

        dateProperties.forEach(property => {
            item[property] = dateConverter(item[property], dateProperties.includes('DateHeureAccident'));
        });
    });

    return accidents;
};

export default getAccidents;