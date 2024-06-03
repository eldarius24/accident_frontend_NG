import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('token'));
  const isAuthenticated = !!token; // Vérifie si le token est présent
  const isAdmin = token?.data?.boolAdministrateur;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return children;
};

export default ProtectedRouteAdmin;