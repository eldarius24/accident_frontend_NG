import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

/**
 * ProtectedRouteAdmin est un composant React qui prot ge ses enfants en redirigeant vers la page de connexion
 * si l'utilisateur n'est pas administrateur.
 * 
 * @param {object} children - Les enfants du composant
 * @returns {null|object} - Les enfants si l'utilisateur est administrateur, null sinon
 */
const ProtectedRouteAdmin = ({ children }) => {
  const navigate = useNavigate();
  const { isAdmin } = useUserConnected();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas admin
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : null; // Retourne les enfants si l'utilisateur est admin
};

export default ProtectedRouteAdmin;
