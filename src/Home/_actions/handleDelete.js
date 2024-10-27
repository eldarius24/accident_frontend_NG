// src/Home/_actions/handleDelete.js
import { useCallback } from 'react';
import axios from 'axios';
import config from '../../config.json';

const apiUrl = config.apiUrl;

/**
 * Hook personnalisé pour gérer la suppression d'accidents
 * @param {Object} props Les propriétés nécessaires
 * @param {Function} props.setAccidents Fonction pour mettre à jour la liste des accidents
 * @param {Array} props.accidents Liste des accidents
 * @param {Function} props.logAction Fonction pour logger les actions
 * @param {Function} props.showSnackbar Fonction pour afficher les notifications
 * @returns {Function} Fonction de suppression
 */
const useHandleDelete = ({ setAccidents, accidents, logAction, showSnackbar }) => {
    return useCallback(async (accidentIdToDelete) => {
        try {
            const accidentToDelete = accidents.find(item => item._id === accidentIdToDelete);

            if (!accidentToDelete) {
                showSnackbar('Accident non trouvé', 'error');
                return;
            }

            const response = await axios.delete(`http://${apiUrl}:3100/api/accidents/${accidentIdToDelete}`);

            if ([200, 204].includes(response.status)) {
                await logAction({
                    actionType: 'suppression',
                    details: `Suppression de l'accident du travail - Entreprise: ${accidentToDelete.entrepriseName} (${accidentToDelete.secteur}) - Travailleur: ${accidentToDelete.nomTravailleur} ${accidentToDelete.prenomTravailleur} - Date: ${new Date(accidentToDelete.DateHeureAccident).toLocaleDateString()}`,
                    entity: 'Accident',
                    entityId: accidentIdToDelete,
                    entreprise: accidentToDelete.entrepriseName
                });

                // Mettre à jour la liste des accidents
                setAccidents(prevAccidents => 
                    prevAccidents.filter(item => item._id !== accidentIdToDelete)
                );

                showSnackbar('Accident supprimé avec succès', 'success');
            } else {
                showSnackbar(
                    `Erreur lors de la suppression de l'accident: ${response.status} ${response.statusText}`,
                    'error'
                );
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showSnackbar('Erreur lors de la suppression de l\'accident', 'error');
        }
    }, [accidents, setAccidents, logAction, showSnackbar]);
};

export default useHandleDelete;