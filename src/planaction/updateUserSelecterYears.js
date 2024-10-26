
import axios from 'axios';
import { useCallback } from 'react';

const updateUserSelectedYears = useCallback(async (newSelectedYears) => {
    try {
        if (!userInfo?._id) return;

        const response = await axios.put(
            `http://${apiUrl}:3100/api/users/${userInfo._id}/updateSelectedYears`,
            {
                selectedYears: newSelectedYears
            }
        );

        if (response.data.success) {
            // Mettre à jour le localStorage
            const token = JSON.parse(localStorage.getItem('token'));
            token.data.selectedYears = newSelectedYears;
            localStorage.setItem('token', JSON.stringify(token));

            // Mettre à jour le state
            setSelectedYears(newSelectedYears);

            showSnackbar('Années sélectionnées mises à jour avec succès', 'success');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des années sélectionnées:', error);
        showSnackbar(
            `Erreur lors de la sauvegarde des années sélectionnées: ${error.response?.data?.message || error.message
            }`,
            'error'
        );
    }
}, [userInfo?._id, apiUrl, showSnackbar]);


export default updateUserSelectedYears;