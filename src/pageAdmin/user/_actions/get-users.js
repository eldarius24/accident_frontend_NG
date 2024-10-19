import axios from 'axios';
import config from '../../../config.json';

/**
 * Récupère la liste des utilisateurs depuis l'API
 * 
 * @returns {Promise<Array>} - La liste des utilisateurs
 * @throws {Error} - Si la requête échoue
 */
const getUsers = async () => {
    const apiUrl = config.apiUrl;

    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/users`);
        const users = response.data;
        
        if (response.status !== 200 || !users) 
            throw new Error('Erreur lors de la récupération des utilisateurs');

        return users;

    } catch (error) {
        console.error('Erreur de requête:', error.message);
    }
}

export default getUsers;