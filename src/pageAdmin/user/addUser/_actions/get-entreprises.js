import axios from "axios";
import config from '../../../../config.json';

/**
 * Récupère les entreprises depuis l'API
 * 
 * @async
 * @returns {Array} - Le tableau des entreprises.
 * @throws {Error} - Si la réponse de l'API n'est pas ok.
 */
const getEntreprises = async () => {
    const apiUrl = config.apiUrl;

    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/entreprises`);
        const entreprises = response.data;
        
        if (response.status !== 200 || !entreprises) 
            throw new Error('Erreur lors de la récupération des entreprises');
        
        return entreprises;

    } catch (error) {
        console.error('Erreur de requête lors de la récupération des entreprises:', error.message);
    }
}

export default getEntreprises;