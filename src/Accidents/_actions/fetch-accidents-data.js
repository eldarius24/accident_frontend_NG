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
        console.log("Début fetchData");
        console.log("User Info:", userInfo);
        console.log("Is Admin or Dev:", isAdminOrDev);

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                fields: JSON.stringify(REQUIRED_FIELDS)
            });
            // rend uniquement les donnée liée au conseiller en prevention visibles
            if (!isAdminOrDev && userInfo?.entreprisesUserPrevention) {
                console.log("Entreprises du conseiller:", userInfo.entreprisesUserPrevention);
                queryParams.append('entreprises', JSON.stringify(userInfo.entreprisesUserPrevention));
            }

            const url = `http://${apiUrl}:3100/api/accidents/filtered-fields?${queryParams}`;
            console.log("URL appelée:", url);

            const response = await axios.get(url);
            console.log("Réponse brute:", response.data);

            const { success, message, accidents } = response.data;

            if (!success) {
                console.error(message);
                setAccidents([]);
                setYearsFromData([]);
                showSnackbar(message, 'error');
                return;
            }

            if (!accidents || accidents.length === 0) {
                setAccidents([]);
                setYearsFromData([]);
                showSnackbar('Aucun accident trouvé', 'info');
                return;
            }

            // Traitement des données
            const processedAccidents = CountNumberAccidentGroupe(accidents).map(item => {
                DATE_PROPERTIES.forEach(property => {
                    if (item[property]) {
                        item[property] = dateConverter(item[property], true);
                    }
                });
                return item;
            });

            // Extraction des années
            const years = [...new Set(processedAccidents
                .filter(accident => accident.DateHeureAccident)
                .map(accident => {
                    const date = new Date(accident.DateHeureAccident);
                    return date.getFullYear();
                })
                .filter(year => !isNaN(year))
            )].sort((a, b) => b - a);

            setAccidents(processedAccidents);
            setYearsFromData(years);
            showSnackbar('Données récupérées avec succès', 'success');

        } catch (error) {
            console.error('Error fetching accidents data:', error);
            showSnackbar('Erreur lors de la récupération des données', 'error');
            setAccidents([]);
            setYearsFromData([]);
        } finally {
            setLoading(false);
        }
    };
};

export default createFetchData;