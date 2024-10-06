import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLogged, isAdmin, isConseillerPrevention } from './userInfo';

const ProtectedRouteConseillerPrevention = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = isLogged();
  const userIsAdmin = isAdmin();
  const userIsConseillerPrevention = isConseillerPrevention();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!userIsAdmin && !userIsConseillerPrevention) {
      navigate('/');
    }
  }, [isAuthenticated, userIsAdmin, userIsConseillerPrevention, navigate]);

  if (!isAuthenticated || (!userIsAdmin && !userIsConseillerPrevention)) {
    return null;
  }

  return children;
};

export default ProtectedRouteConseillerPrevention;