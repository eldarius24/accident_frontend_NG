// src/utils/cookieUtils.js

/**
 * Récupère la valeur d'un cookie
 * @param {string} name - Nom du cookie
 * @returns {string|null} - Valeur du cookie ou null si non trouvé
 */
export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        if (cookieName === name) {
            try {
                return JSON.parse(decodeURIComponent(cookieValue));
            } catch {
                return decodeURIComponent(cookieValue);
            }
        }
    }
    return null;
};

/**
 * Définit un cookie avec une date d'expiration
 * @param {string} name - Nom du cookie
 * @param {any} value - Valeur à stocker
 * @param {number} days - Nombre de jours avant expiration
 */
export const setCookie = (name, value, days = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    document.cookie = `${name}=${encodeURIComponent(valueToStore)};${expires};path=/`;
};