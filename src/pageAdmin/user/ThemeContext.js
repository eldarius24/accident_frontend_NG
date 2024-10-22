import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Fonction pour récupérer le thème initial
  const getInitialTheme = useCallback(() => {
    try {
      // Essayer de récupérer le thème depuis le localStorage
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        return token?.data?.darkMode || false;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du thème:', error);
    }
    return false;
  }, []);

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Effet pour appliquer le thème
  useEffect(() => {
    const applyTheme = () => {
      // Appliquer les styles au body
      document.body.style.backgroundColor = darkMode ? '#6e6e6e' : '#ffffff';
      document.body.style.color = darkMode ? '#ffffff' : '#6e6e6e';

      // Sauvegarder le thème dans le localStorage
      try {
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
          const token = JSON.parse(tokenString);
          if (token && token.data) {
            token.data.darkMode = darkMode;
            localStorage.setItem('token', JSON.stringify(token));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du thème:', error);
      }
    };

    applyTheme();
  }, [darkMode]);

  // Fonction pour basculer le thème
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  // Effet pour écouter les changements dans le localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        try {
          const newToken = JSON.parse(e.newValue);
          if (newToken?.data?.darkMode !== undefined) {
            setDarkMode(newToken.data.darkMode);
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du thème:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};