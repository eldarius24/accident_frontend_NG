import axios from 'axios';
import config from '../../../config.json';

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