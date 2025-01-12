import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserConnected } from '../Hook/userConnected';

const ProtectedRouteAdminOrsignataires = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isAdminOrDevOrAdmVechiOrAdmSignataireOrUsersignataire } = useUserConnected();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (!(isAdminOrDevOrAdmVechiOrAdmSignataireOrUsersignataire) && location.pathname !== '/') {
            navigate('/signatures');
        }
    }, [isAuthenticated, isAdminOrDevOrAdmVechiOrAdmSignataireOrUsersignataire, navigate, location]);

    if (!isAuthenticated || (!(isAdminOrDevOrAdmVechiOrAdmSignataireOrUsersignataire) && location.pathname !== '/')) {
        return null;
    }

    return children;
};

export default ProtectedRouteAdminOrsignataires;