// src/hooks/useSession.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSession = () => {
  const navigate = useNavigate();
  const SESSION_KEY = 'browser_session_active';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const hasSession = sessionStorage.getItem(SESSION_KEY);

    // Uniquement pour une nouvelle session de navigateur
    if (!hasSession) {
      console.log('Nouvelle session de navigateur détectée');
      sessionStorage.setItem(SESSION_KEY, 'true');
      
      if (token) {
        // Si on trouve un token d'une ancienne session, on le supprime
        localStorage.removeItem('token');
        navigate('/login');
      }
    }

    // Dans tous les autres cas, on vérifie juste si on a un token valide
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem(SESSION_KEY);
    navigate('/login');
  };

  return { logout };
};