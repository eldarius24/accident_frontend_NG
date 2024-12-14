// fetch-accidents-data.js
import axios from 'axios';
import CountNumberAccidentGroupe from "../../Model/CountNumberAccident";
import dateConverter from "../../Model/dateConverter";

const REQUIRED_FIELDS = [
    'boolAsCloture',
    'numeroGroupe',
    'numeroEntreprise',
    'AssureurStatus',
    'DateHeureAccident',
    'entrepriseName',
    'secteur',
    'nomTravailleur',
    'prenomTravailleur',
    'typeAccident',
    '_id'
];

const DATE_PROPERTIES = ['DateHeureAccident'];

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
            // Vérification des permissions et de l'utilisateur
            if (!userInfo) {
                setAccidents([]);
                setYearsFromData([]);
                showSnackbar('Utilisateur non authentifié', 'error');
                return;
            }

            // Préparation des paramètres de la requête
            const queryParams = new URLSearchParams({
                fields: JSON.stringify(REQUIRED_FIELDS)
            });

            // Filtrage basé sur les permissions
            if (!isAdminOrDev) {
                if (!userInfo.entreprisesConseillerPrevention?.length) {
                    setAccidents([]);
                    setYearsFromData([]);
                    showSnackbar('Aucune entreprise associée', 'warning');
                    return;
                }
                queryParams.append('entreprises', JSON.stringify(userInfo.entreprisesConseillerPrevention));
            }

            // Requête API
            const url = `http://${apiUrl}:3100/api/accidents/filtered-fields?${queryParams}`;
            const response = await axios.get(url);
            const { success, message, accidents } = response.data;

            if (!success) {
                setAccidents([]);
                setYearsFromData([]);
                showSnackbar(message || 'Erreur lors de la récupération des données', 'error');
                return;
            }

            if (!accidents?.length) {
                setAccidents([]);
                setYearsFromData([]);
                showSnackbar('Aucun accident trouvé', 'info');
                return;
            }

            // Traitement des données
            const processedAccidents = CountNumberAccidentGroupe(accidents)
                .map(item => {
                    // Conversion des dates
                    DATE_PROPERTIES.forEach(property => {
                        if (item[property]) {
                            item[property] = dateConverter(item[property], true);
                        }
                    });
                    
                    // Normalisation de boolAsCloture
                    if (item.boolAsCloture !== undefined) {
                        item.boolAsCloture = String(item.boolAsCloture).toLowerCase() === 'true';
                    }

                    return item;
                })
                .filter(item => item.entrepriseName); // Filtrer les entrées sans entreprise

            // Extraction et tri des années
            const years = [...new Set(processedAccidents
                .filter(accident => accident.DateHeureAccident)
                .map(accident => new Date(accident.DateHeureAccident).getFullYear())
                .filter(year => !isNaN(year))
            )].sort((a, b) => b - a);

            setAccidents(processedAccidents);
            setYearsFromData(years);
            showSnackbar('Données récupérées avec succès', 'success');

        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setAccidents([]);
            setYearsFromData([]);
            showSnackbar('Erreur lors de la récupération des données', 'error');
        } finally {
            setLoading(false);
        }
    };
};

export default createFetchData;