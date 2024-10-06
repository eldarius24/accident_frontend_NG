import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRouteConseillerPrevention = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdminOuConseiller } = useUserConnected();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdminOuConseiller) {
      navigate('/');
    }
  }, [isAuthenticated, isAdminOuConseiller, navigate]);

  if (!isAuthenticated || (isAdminOuConseiller)) {
    return null;
  }

  return children;
};

export default ProtectedRouteConseillerPrevention;