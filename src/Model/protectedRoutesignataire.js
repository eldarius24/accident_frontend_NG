import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRouteAdminOrsignataires = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isAdminOrDev, isUserSignataire } = useUserConnected();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (!(isAdminOrDev || isUserSignataire) && location.pathname !== '/') {
            navigate('/signatures');
        }
    }, [isAuthenticated, isAdminOrDev, isUserSignataire, navigate, location]);

    if (!isAuthenticated || (!(isAdminOrDev || isUserSignataire) && location.pathname !== '/')) {
        return null;
    }

    return children;
};

export default ProtectedRouteAdminOrsignataires;