// src/Hook/useLogger.js
import { useCallback } from 'react';
import axios from 'axios';
import { useUserConnected } from './userConnected';
import config from '../config.json';

const apiUrl = config.apiUrl;

export const useLogger = () => {
  const { userInfo } = useUserConnected();

  const logAction = useCallback(async ({
    actionType,
    details,
    entity,
    entityId = null,
    entreprise = null
  }) => {
    if (!userInfo || !userInfo._id) {
      console.warn('Tentative de log sans utilisateur connecté');
      return;
    }

    try {
      await axios.post(`http://${apiUrl}:3100/api/logs`, {
        userId: userInfo._id,
        userName: userInfo.userName,
        actionType,
        details,
        entity,
        entityId,
        entreprise: entreprise || 
           userInfo.entreprisesConseillerPrevention?.[0] ||
           userInfo.entreprisesUserPrevention?.[0] ||
           userInfo.userGetionaireVehicule?.[0]
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  }, [userInfo]);

  return { logAction };
};