import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const {isAuthenticated} = useUserConnected()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;