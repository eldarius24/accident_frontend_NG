import { useEffect } from 'react';

// Crée une clé unique pour la session
const RELOAD_KEY = 'page_has_reloaded';

export const usePageReload = () => {
    useEffect(() => {
        // Vérifie si la page a déjà été rechargée pendant cette session
        const hasReloaded = sessionStorage.getItem(RELOAD_KEY);
        
        if (!hasReloaded) {
            // Marque la page comme rechargée
            sessionStorage.setItem(RELOAD_KEY, 'true');
            // Recharge la page
            window.location.reload();
        }

        // Nettoyage lors du démontage du composant
        return () => {
            sessionStorage.removeItem(RELOAD_KEY);
        };
    }, []);
};