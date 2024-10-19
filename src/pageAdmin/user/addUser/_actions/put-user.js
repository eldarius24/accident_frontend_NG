import axios from "axios";
import config from '../../../../config.json';
const apiUrl = config.apiUrl;

/**
 * Modifie un utilisateur.
 * 
 * @param {string} idUser - L'ID de l'utilisateur à modifier.
 * @param {object} dataUser - Les données de l'utilisateur à modifier.
 * @returns {Promise<object | null>} - Les données de l'utilisateur modifiée, ou null si une erreur est survenue.
 */
const editUser = async (idUser, dataUser) => {
    console.log('editUser', idUser, dataUser);
    try {
        const response = await axios.put(`http://${apiUrl}:3100/api/users/${idUser}`, dataUser);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la modification d un utilisateur :', error.message);
    }
}

/**
 * Crée un utilisateur.
 * 
 * @param {object} dataUser - Les données de l'utilisateur à créer.
 * @returns {Promise<object | null>} - Les données de l'utilisateur créée, ou null si une erreur est survenue.
 */
const addUser = async (dataUser) => {
    console.log('addUser', dataUser);
    try {
        const response = await axios.put(`http://${apiUrl}:3100/api/users`, dataUser);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création d un utilisateur :', error.message);
    }
}


/**
 * Crée ou modifie un utilisateur.
 * 
 * @param {string} [idUser] - L'ID de l'utilisateur à modifier.
 * @param {object} dataUser - Les données de l'utilisateur à créer ou modifier.
 * @returns {Promise<object | null>} - Les données de l'utilisateur modifiée, ou null si une erreur est survenue.
 */
const putUser = async (idUser, dataUser) => {
    console.log('putUser', idUser, dataUser);
    try {
        let result = null;
        if (idUser) {
            result = await editUser(idUser, dataUser);
        } else {
            result = await addUser(dataUser);
        }

        if (!result) 
            throw new Error(`${result}`);
            
        console.log('putUser result', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la création/modification d un utilisateur :', error.message);
    }
}

export default putUser;