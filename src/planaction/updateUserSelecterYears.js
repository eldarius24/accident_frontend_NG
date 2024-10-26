// src/planaction/utils/updateUserSelectedYears.js
import axios from 'axios';
import config from '../config.json';
const apiUrl = config.apiUrl;


const createUpdateUserSelectedYears = (apiUrl, showSnackbar) => (userInfo, setSelectedYears) => {
    return async (newSelectedYears) => {
        try {
            if (!userInfo?._id) return;
            
            const response = await axios.put(
                `http://${apiUrl}:3100/api/users/${userInfo._id}/updateSelectedYears`,
                {
                    selectedYears: newSelectedYears
                }
            );
            
            if (response.data.success) {
                // Update localStorage
                const token = JSON.parse(localStorage.getItem('token'));
                token.data.selectedYears = newSelectedYears;
                localStorage.setItem('token', JSON.stringify(token));
                
                // Update state
                setSelectedYears(newSelectedYears);
                showSnackbar('Années sélectionnées mises à jour avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des années sélectionnées:', error);
            showSnackbar(
                `Erreur lors de la sauvegarde des années sélectionnées: ${error.response?.data?.message || error.message}`,
                'error'
            );
        }
    };
};

export default createUpdateUserSelectedYears;