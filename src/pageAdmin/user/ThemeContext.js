import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ThemeContext = createContext();
const THEME_COOKIE_NAME = 'darkMode';

// Fonction utilitaire pour gérer les cookies
const Cookies = {
  set: (name, value, days = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  },
  get: (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName)) {
        return cookie.substring(cookieName.length);
      }
    }
    return null;
  }
};

export const ThemeProvider = ({ children }) => {
  // Fonction pour récupérer le thème initial depuis les cookies
  const getInitialTheme = useCallback(() => {
    const savedTheme = Cookies.get(THEME_COOKIE_NAME);
    return savedTheme === 'true';
  }, []);

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Effet pour appliquer le thème
  useEffect(() => {
    // Appliquer les styles au body
    document.body.style.backgroundColor = darkMode ? '#6e6e6e' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#6e6e6e';

    // Sauvegarder le thème dans les cookies
    Cookies.set(THEME_COOKIE_NAME, darkMode.toString());
  }, [darkMode]);

  // Fonction pour basculer le thème
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
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