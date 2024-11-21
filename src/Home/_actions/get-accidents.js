import axios from "axios";
import CountNumberAccidentGroupe from "../../Model/CountNumberAccident";
import dateConverter from "../../Model/dateConverter";
import config from '../../config.json';

const DATE_PROPERTIES = [
   'DateHeureAccident', 'DateEnvoieDeclarationAccident',
   'DateJourIncapDebut', 'DateJourIncapFin', 
   'dateNaissance', 'dateDebutArret', 'dateFinArret',
   'dateEntrEntreprise', 'dateSortie', 'dateNotifEmployeur',
   'dateProcesVerbalOuiRedigeQuand', 'dateSoinsMedicauxDate', 
   'dateSoinsMedicauxMedecin', 'dateSoinsMedicauxHopital',
   'dateRepriseEffective', 'dateChangementFonction',
   'dateDecede', 'dateIncapaciteTemporaire', 'dateTravailAddapte'
];

const cache = new Map();
const CACHE_KEY = 'accidents';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getAccidents = async () => {
   try {
       const now = Date.now();
       const cachedData = cache.get(CACHE_KEY);
       
       if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
           return cachedData.data;
       }

       const { data: accidents } = await axios.get(`http://${config.apiUrl}:3100/api/accidents`);

       if (!Array.isArray(accidents) || accidents.length === 0) {
           console.error("La réponse de l'API est vide.");
           return [];
       }

       const processedData = CountNumberAccidentGroupe(accidents).map(item => {
           DATE_PROPERTIES.forEach(property => {
               item[property] = dateConverter(item[property], property === 'DateHeureAccident');
           });
           return item;
       });

       cache.set(CACHE_KEY, {
           data: processedData,
           timestamp: now
       });

       return processedData;

   } catch (error) {
       console.error("Erreur lors de la récupération des accidents:", error);
       return [];
   }
};

export default getAccidents;