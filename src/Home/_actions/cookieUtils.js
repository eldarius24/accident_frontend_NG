const COOKIE_EXPIRY_DAYS = 365;

/**
 * Préfixes pour distinguer les cookies de chaque composant
 */
export const COOKIE_PREFIXES = {
    HOME: 'home',
    PLAN_ACTION: 'plan_action'
};

/**
 * Noms des cookies avec préfixes
 */
export const COOKIE_NAMES = {
    SELECTED_YEARS: {
        [COOKIE_PREFIXES.HOME]: 'home_selected_years',
        [COOKIE_PREFIXES.PLAN_ACTION]: 'plan_action_selected_years'
    },
    SELECT_ALL: {
        [COOKIE_PREFIXES.HOME]: 'home_select_all_years',
        [COOKIE_PREFIXES.PLAN_ACTION]: 'plan_action_select_all_years'
    },
    SELECTED_ENTERPRISES: {  
        [COOKIE_PREFIXES.PLAN_ACTION]: 'plan_action_selected_enterprises'  
    }
};

/**
 * Récupère la valeur d'un cookie
 * @param {string} name - Nom du cookie
 * @returns {any} - Valeur du cookie parsée ou null si non trouvé
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
export const setCookie = (name, value, days = COOKIE_EXPIRY_DAYS) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    document.cookie = `${name}=${encodeURIComponent(valueToStore)};${expires};path=/`;
};

/**
 * Garantit qu'une valeur est un tableau
 * @param {any} value - Valeur à convertir
 * @returns {Array} - Tableau résultant
 */
export const ensureArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

/**
 * Obtient les années sélectionnées pour un composant spécifique
 * @param {string} prefix - Préfixe du composant
 * @returns {Array} - Tableau des années sélectionnées
 */
export const getSelectedYearsFromCookie = (prefix) => {
    const cookieName = COOKIE_NAMES.SELECTED_YEARS[prefix];
    return ensureArray(getCookie(cookieName));
};

/**
 * Obtient l'entreprise sélectionnée pour un composant spécifique
 * @param {string} prefix - Préfixe du composant
 * @returns {string} - Entreprise sélectionnée ou chaîne vide si non trouvée
 */
export const getSelectedEnterpriseFromCookie = (prefix) => {
    const cookieName = COOKIE_NAMES.SELECTED_ENTERPRISES[prefix];
    return ensureArray(getCookie(cookieName));
};

/**
 * Obtient l'état "tout sélectionner" pour un composant spécifique
 * @param {string} prefix - Préfixe du composant
 * @returns {boolean} - État de la sélection totale
 */
export const getSelectAllFromCookie = (prefix) => {
    const cookieName = COOKIE_NAMES.SELECT_ALL[prefix];
    return getCookie(cookieName) === true;
};

/**
 * Sauvegarde les années sélectionnées et l'état "tout sélectionner" pour un composant
 * @param {string} prefix - Préfixe du composant
 * @param {Array} selectedYears - Années sélectionnées
 * @param {boolean} selectAll - État de la sélection totale
 */
export const saveYearSelections = (prefix, selectedYears, selectAll) => {
    setCookie(COOKIE_NAMES.SELECTED_YEARS[prefix], selectedYears);
    setCookie(COOKIE_NAMES.SELECT_ALL[prefix], selectAll);
};

/**
 * Sauvegarde les entreprises sélectionnées pour un composant
 * @param {string} prefix - Préfixe du composant
 * @param {Array} enterprises - Tableau des entreprises sélectionnées
 */
export const saveEnterpriseSelection = (prefix, enterprises) => {
    if (!Array.isArray(enterprises)) {
        enterprises = [];
    }
    setCookie(COOKIE_NAMES.SELECTED_ENTERPRISES[prefix], enterprises);
};