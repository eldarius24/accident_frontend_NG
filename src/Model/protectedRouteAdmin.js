import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRouteAdmin = ({ children }) => {
  const navigate = useNavigate();
  
  const {isAuthenticated, isAdmin} = useUserConnected();

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