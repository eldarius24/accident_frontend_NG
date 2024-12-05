import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

/**
 * ProtectedRouteAdminOrConseiller est un composant qui protège une route
 * et ne permet l'accès que si l'utilisateur est connecté, est un administrateur
 * ou un conseiller.
 *
 * @param {Object} props Les propriétés du composant
 * @param {JSX.Element} props.children Les enfants du composant
 * @returns {JSX.Element} Les enfants du composant si l'utilisateur est autorisé
 */
const ProtectedRouteAdminOrConseiller = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isUserPreventionOrAdminOrConseiller  } = useUserConnected();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isUserPreventionOrAdminOrConseiller ) {
      navigate('/Accident'); // Rediriger vers la page d'accueil si l'utilisateur n'est ni admin ni conseiller
    }
  }, [isAuthenticated, isUserPreventionOrAdminOrConseiller, navigate]);

  if (!isAuthenticated || !isUserPreventionOrAdminOrConseiller ) {
    return null; // Ne pas afficher les enfants si l'utilisateur n'est pas autorisé
  }

  return children;
};

export default ProtectedRouteAdminOrConseiller;
