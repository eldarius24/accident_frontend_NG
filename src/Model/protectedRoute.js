import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

/**
 * ProtectedRoute is a higher-order component that ensures only authenticated users
 * can access the wrapped component. If the user is not authenticated, they will be
 * redirected to the login page.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The component(s) to render if the user is authenticated.
 * @returns {React.ReactNode|null} The children component if authenticated, otherwise null.
 */
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