// put-user.js
import axios from "axios";
import config from '../../../../config.json';

const putUser = async (idUser, dataUser) => {
    const apiUrl = config.apiUrl;
    console.log('putUser', idUser, dataUser);

    try {
        let result;
        const userData = {
            ...dataUser,
            adresseMail: dataUser.userLogin,
            darkMode: dataUser.darkMode ?? false,
            selectedYears: dataUser.selectedYears ?? [new Date().getFullYear().toString()]
        };

        if (idUser) {
            // Update existing user
            result = await axios.put(`http://${apiUrl}:3100/api/users/${idUser}`, userData);
        } else {
            // Create new user
            result = await axios.post(`http://${apiUrl}:3100/api/users`, userData);
        }

        if (!result.data) {
            throw new Error('No data received from server');
        }

        return result.data;
    } catch (error) {
        console.error('Erreur lors de la création/modification d\'un utilisateur:', error);
        throw error;
    }
};

export default putUser;
