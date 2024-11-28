import axios from 'axios';
import CountNumberAccidentGroupe from "../../Model/CountNumberAccident";
import dateConverter from "../../Model/dateConverter";

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

const createFetchData = (apiUrl) => (
    setAccidents,
    setYearsFromData,
    setLoading,
    showSnackbar,
    isAdminOrDev,
    userInfo
) => {
    return async () => {
        setLoading(true);
        try {
            // Appel direct à l'API
            const { data: accidents } = await axios.get(`http://${apiUrl}:3100/api/accidents`);

            if (!Array.isArray(accidents) || accidents.length === 0) {
                console.error("La réponse de l'API est vide.");
                setAccidents([]);
                setYearsFromData([]);
                return;
            }

            // Traitement des données comme dans getAccidents
            const processedAccidents = CountNumberAccidentGroupe(accidents).map(item => {
                // Conversion des dates
                DATE_PROPERTIES.forEach(property => {
                    item[property] = dateConverter(item[property], property === 'DateHeureAccident');
                });
                return item;
            });

            // Filtrer les accidents selon les permissions si nécessaire
            let filteredAccidents = processedAccidents;
            if (!isAdminOrDev && userInfo?.entreprisesConseillerPrevention) {
                filteredAccidents = processedAccidents.filter(accident =>
                    userInfo.entreprisesConseillerPrevention.includes(accident.entrepriseName)
                );
            }

            // Extraire les années uniques des accidents
            const years = [...new Set(filteredAccidents
                .filter(accident => accident.DateHeureAccident) // Vérifier que la date existe
                .map(accident => new Date(accident.DateHeureAccident).getFullYear())
            )].sort((a, b) => b - a);

            // Mettre à jour les états
            setAccidents(filteredAccidents);
            setYearsFromData(years);

        } catch (error) {
            console.error('Error fetching accidents data:', error);
            showSnackbar('Erreur lors de la récupération des données', 'error');
            
            // Réinitialiser les états en cas d'erreur
            setAccidents([]);
            setYearsFromData([]);
        } finally {
            setLoading(false);
        }
    };
};

export default createFetchData;