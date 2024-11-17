import axios from "axios";
import config from '../../config.json';

/**
 * Récupère les entreprises depuis l'API
 * @async
 * @returns {Array} - Le tableau des entreprises.
 * @throws {Error} - Si la réponse de l'API n'est pas ok.
 */
const getEntreprises = async () => {
    // URL de l'API
    const apiUrl = config.apiUrl;

    // Récupération des entreprises
    const result = await axios.get(`http://${apiUrl}:3100/api/entreprises`);

    // Stockage des entreprises dans une variable
    let entreprises = result.data;

    // Vérification que la réponse n'est pas vide et qu'elle est un tableau
    if (entreprises === undefined || entreprises.length === 0 || !Array.isArray(entreprises)) {
        console.error("La réponse de l'API est vide.");
        return [];
    }

    // Retour des entreprises
    return entreprises;
};

export default getEntreprises;