import axios from "axios";
import config from '../../../../config.json';

/**
 * Récupère un utilisateur depuis l'API
 * 
 * @param {string} id - ID de l'utilisateur à récupérer
 * @returns {object} - L'utilisateur récupéré
 */
const getUser = async (id) => {
    const apiUrl = config.apiUrl;

    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération d un utilisateur :', error.message);
    }
}

export default getUser;