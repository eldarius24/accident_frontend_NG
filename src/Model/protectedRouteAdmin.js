import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

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
