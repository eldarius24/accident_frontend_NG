import Cookies from 'js-cookie';

// Constantes pour les noms des cookies
const COOKIE_NAMES = {
    SELECTED_YEARS: 'selectedYears',
    SELECTED_WORKER_TYPES: 'selectedWorkerTypes',
    SELECTED_SECTORS: 'selectedSectors',
    SELECTED_ASSUREUR_STATUS: 'selectedAssureurStatus',
    SELECTED_ACCIDENT_TYPES: 'selectedAccidentTypes',
    VISIBLE_GRAPHS: 'visibleGraphs',
    SELECTED_COMPANIES: 'selectedCompanies',
};

// Durée de vie des cookies (365 jours)
const COOKIE_EXPIRY = 365;

export const saveFiltersToCookies = ({
    selectedYears,
    selectedWorkerTypes,
    selectedSectors,
    selectedAssureurStatus,
    selectedAccidentTypes,
    selectedCompanies,
    graphs,
}) => {
    try {
        // Sauvegarde des filtres sélectionnés
        Cookies.set(COOKIE_NAMES.SELECTED_YEARS, JSON.stringify(selectedYears), { expires: COOKIE_EXPIRY });
        Cookies.set(COOKIE_NAMES.SELECTED_WORKER_TYPES, JSON.stringify(selectedWorkerTypes), { expires: COOKIE_EXPIRY });
        Cookies.set(COOKIE_NAMES.SELECTED_SECTORS, JSON.stringify(selectedSectors), { expires: COOKIE_EXPIRY });
        Cookies.set(COOKIE_NAMES.SELECTED_ASSUREUR_STATUS, JSON.stringify(selectedAssureurStatus), { expires: COOKIE_EXPIRY });
        Cookies.set(COOKIE_NAMES.SELECTED_ACCIDENT_TYPES, JSON.stringify(selectedAccidentTypes), { expires: COOKIE_EXPIRY });
        Cookies.set(COOKIE_NAMES.SELECTED_COMPANIES, JSON.stringify(selectedCompanies), { expires: COOKIE_EXPIRY });

        // Sauvegarde des graphiques visibles
        const visibleGraphs = Object.fromEntries(
            Object.entries(graphs).map(([key, { visible }]) => [key, visible])
        );
        Cookies.set(COOKIE_NAMES.VISIBLE_GRAPHS, JSON.stringify(visibleGraphs), { expires: COOKIE_EXPIRY });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des filtres:', error);
    }
};

export const loadFiltersFromCookies = () => {
    try {
        const filters = {
            selectedYears: JSON.parse(Cookies.get(COOKIE_NAMES.SELECTED_YEARS) || '[]'),
            selectedWorkerTypes: JSON.parse(Cookies.get(COOKIE_NAMES.SELECTED_WORKER_TYPES) || '[]'),
            selectedSectors: JSON.parse(Cookies.get(COOKIE_NAMES.SELECTED_SECTORS) || '[]'),
            selectedAssureurStatus: JSON.parse(Cookies.get(COOKIE_NAMES.SELECTED_ASSUREUR_STATUS) || '[]'),
            selectedAccidentTypes: JSON.parse(Cookies.get(COOKIE_NAMES.SELECTED_ACCIDENT_TYPES) || '[]'),
            visibleGraphs: JSON.parse(Cookies.get(COOKIE_NAMES.VISIBLE_GRAPHS) || '{}'),
            selectedCompanies: JSON.parse(Cookies.get(COOKIE_NAMES.SELECTED_COMPANIES) || '[]'),
        };
        return filters;
    } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
        return null;
    }
};