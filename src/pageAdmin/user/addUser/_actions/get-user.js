// get-user.js
import axios from "axios";
import config from '../../../../config.json';

const getUser = async (id) => {
    const apiUrl = config.apiUrl;

    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/users/${id}`);
        const user = response.data;

        // Set defaults for new fields if they don't exist
        return {
            ...user,
            darkMode: user.darkMode ?? false,
            selectedYears: user.selectedYears ?? [new Date().getFullYear().toString()]
        };
    } catch (error) {
        console.error('Erreur lors de la récupération d\'un utilisateur:', error);
        throw error;
    }
};

export default getUser;
