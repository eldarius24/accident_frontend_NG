import axios from "axios";
import config from '../../config.json';

/**
 * Récupère les accidents depuis l'API
 * 
 * @returns {Array} - Le tableau des accidents.
 */
const getEntreprises = async () => {
    const apiUrl = config.apiUrl;

    const result = await axios.get(`http://${apiUrl}:3100/api/entreprises`);

    let entreprises = result.data;
    
    
    

    if (entreprises === undefined || entreprises.length === 0 || !Array.isArray(entreprises)) {
        console.error("La réponse de l'API est vide.");
        return [];
    }

    console.log("getEntreprises, entreprises : ", entreprises);

    return entreprises;
};

export default getEntreprises;