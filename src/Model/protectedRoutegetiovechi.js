import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRouteAdminOrGesionaireVehicule = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isVehicleAdminManager, isFleetManager } = useUserConnected();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!(isVehicleAdminManager || isFleetManager) && location.pathname !== '/') {
      navigate('/Accident');
    }
  }, [isAuthenticated, isVehicleAdminManager, isFleetManager, navigate, location]);

  if (!isAuthenticated || (!(isVehicleAdminManager || isFleetManager) && location.pathname !== '/')) {
    return null;
  }

  return children;
};

export default ProtectedRouteAdminOrGesionaireVehicule;