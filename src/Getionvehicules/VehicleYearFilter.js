import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'selectedVehicleYears';
const COOKIE_EXPIRY = 365;

const useVehicleYearFilter = (initialData = []) => {
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYears, setSelectedYears] = useState(() => {
        const savedYears = JSON.parse(Cookies.get(COOKIE_NAME) || '[]');
        return savedYears;
    });

    // Extraire et traiter les années disponibles à partir des données
    useEffect(() => {
        if (Array.isArray(initialData) && initialData.length > 0) {
            const years = new Set();
            
            initialData.forEach(vehicle => {
                if (vehicle.dateAchat) {
                    years.add(new Date(vehicle.dateAchat).getFullYear());
                }
                
                if (vehicle.dateDerniereRevision) {
                    years.add(new Date(vehicle.dateDerniereRevision).getFullYear());
                }
                
                if (vehicle.dateDernierCT) {
                    years.add(new Date(vehicle.dateDernierCT).getFullYear());
                }

                if (vehicle.dateCreated) {
                    years.add(new Date(vehicle.dateCreated).getFullYear());
                }
            });

            const sortedYears = [...years].sort((a, b) => b - a);
            setAvailableYears(sortedYears);

            if (selectedYears.length === 0 && sortedYears.length > 0) {
                setSelectedYears([sortedYears[0]]);
            }
        }
    }, [initialData, selectedYears.length]);

    // Sauvegarder les sélections dans les cookies
    useEffect(() => {
        Cookies.set(COOKIE_NAME, JSON.stringify(selectedYears), { expires: COOKIE_EXPIRY });
    }, [selectedYears]);

    // Gestionnaire de changement d'années
    const handleYearChange = (event, options = {}) => {
        const { value } = event.target;
        const { customHandlers } = options;

        // Gestion de "Toutes les années"
        if (value.includes('All')) {
            setSelectedYears(
                selectedYears.length === availableYears.length ? [] : [...availableYears]
            );
            return;
        }

        // Gestion des années avec maintenance
        if (value.includes('AllMaintenance') && customHandlers?.getMaintenanceYears) {
            const maintenanceYears = customHandlers.getMaintenanceYears();
            const allMaintenanceSelected = maintenanceYears.every(year => 
                selectedYears.includes(year)
            );

            setSelectedYears(prevYears => {
                if (allMaintenanceSelected) {
                    return prevYears.filter(year => !maintenanceYears.includes(year));
                }
                const newYears = new Set(prevYears);
                maintenanceYears.forEach(year => newYears.add(year));
                return Array.from(newYears);
            });
            return;
        }

        // Gestion des années avec dépenses
        if (value.includes('AllExpenses') && customHandlers?.getExpenseYears) {
            const expenseYears = customHandlers.getExpenseYears();
            const allExpensesSelected = expenseYears.every(year => 
                selectedYears.includes(year)
            );

            setSelectedYears(prevYears => {
                if (allExpensesSelected) {
                    return prevYears.filter(year => !expenseYears.includes(year));
                }
                const newYears = new Set(prevYears);
                expenseYears.forEach(year => newYears.add(year));
                return Array.from(newYears);
            });
            return;
        }

        // Sélections individuelles
        const newSelectedYears = typeof value === 'string' ? value.split(',') : value;
        setSelectedYears(newSelectedYears.map(year => parseInt(year)));
    };

    // Fonctions utilitaires pour les statistiques
    const getYearStats = (year) => {
        return initialData.filter(vehicle => {
            const vehicleYear = new Date(vehicle.dateAchat).getFullYear();
            return vehicleYear === year;
        });
    };

    const getMaintenanceStats = (year) => {
        return initialData.filter(vehicle => {
            const maintenanceYear = vehicle.dateDerniereRevision ? 
                new Date(vehicle.dateDerniereRevision).getFullYear() : null;
            return maintenanceYear === year;
        });
    };

    const getExpenseStats = (year) => {
        return initialData.filter(vehicle => {
            // Logique pour les dépenses par année
            return vehicle.records?.some(record => 
                new Date(record.date).getFullYear() === year
            );
        });
    };

    return {
        availableYears,
        selectedYears,
        setSelectedYears,
        handleYearChange,
        getYearStats,
        getMaintenanceStats,
        getExpenseStats
    };
};

export default useVehicleYearFilter;