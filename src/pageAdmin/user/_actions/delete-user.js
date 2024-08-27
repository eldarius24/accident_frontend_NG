import axios from 'axios';
import config from '../../../config.json';

/**
 * Fonction qui permet de supprimer un utilisateur
 * 
 * @param {*} userIdToDelete id de l'utilisateur à supprimer
 * @returns 
 */
const deleteUser = async (userIdToDelete) => {
    const apiUrl = config.apiUrl;
    

    try {
        const response = await axios.delete(`http://${apiUrl}:3100/api/users/${userIdToDelete}`)
        const isDelete = response.data;        

        if (response.status !== 200 || !isDelete)
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
        
        return isDelete;
    } catch (error) {
        console.error('Erreur lors de la supression d un utilisateur :', error.message);
    }
}

export default deleteUser;