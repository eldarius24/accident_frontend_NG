import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRouteAdminOrConseiller = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isConseiller } = useUserConnected();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin && !isConseiller) {
      navigate('/'); // Rediriger vers la page d'accueil si l'utilisateur n'est ni admin ni conseiller
    }
  }, [isAuthenticated, isAdmin, isConseiller, navigate]);

  if (!isAuthenticated || (!isAdmin && !isConseiller)) {
    return null; // Ne pas afficher les enfants si l'utilisateur n'est pas autorisé
  }

  return children;
};

export default ProtectedRouteAdminOrConseiller;
