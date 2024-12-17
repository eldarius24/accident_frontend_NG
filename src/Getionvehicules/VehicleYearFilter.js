import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useUserConnected } from '../Hook/userConnected';

const COOKIE_NAME = 'selectedVehicleYears';
const COOKIE_EXPIRY = 365;

const useVehicleYearFilter = (initialData = []) => {
    const { isDeveloppeur } = useUserConnected();
    if (isDeveloppeur) {
        console.log('useVehicleYearFilter initialized with data:', initialData);
    }


    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYears, setSelectedYears] = useState(() => {
        const savedYears = JSON.parse(Cookies.get(COOKIE_NAME) || '[]');
        if (isDeveloppeur) {
        console.log('Initial selectedYears from cookies:', savedYears);
        }
        return savedYears;
    });

    // Extraire et traiter les années disponibles à partir des données
    useEffect(() => {
        if (isDeveloppeur) {
            console.log('Processing initialData for available years...');
        }
        if (Array.isArray(initialData) && initialData.length > 0) {
            const years = new Set();

            initialData.forEach(vehicle => {
                if (isDeveloppeur) {                
                console.log('Processing vehicle:', vehicle.id || 'unknown id');
                }
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
            if (isDeveloppeur) {
                console.log('Available years after processing:', sortedYears);
            }
            setAvailableYears(sortedYears);

            if (selectedYears.length === 0 && sortedYears.length > 0) {
                if (isDeveloppeur) {
                    console.log('No years selected, defaulting to most recent year:', sortedYears[0]);
                }
                setSelectedYears([sortedYears[0]]);
            }
        }
    }, [initialData, selectedYears.length]);

    // Sauvegarder les sélections dans les cookies
    useEffect(() => {
        if (isDeveloppeur) {
            console.log('Saving selectedYears to cookies:', selectedYears);
        }
        Cookies.set(COOKIE_NAME, JSON.stringify(selectedYears), { expires: COOKIE_EXPIRY });
    }, [selectedYears]);

    // Gestionnaire de changement d'années
    const handleYearChange = (event, options = {}) => {
        const { value } = event.target;
        if (isDeveloppeur) {
            console.log('handleYearChange called with value:', value, 'and options:', options);
        }
        const { customHandlers } = options;

        // Gestion de "Toutes les années"
        if (value.includes('All')) {
            if (isDeveloppeur) {
                console.log('Handling "All Years" selection');                
            }
            setSelectedYears(
                selectedYears.length === availableYears.length ? [] : [...availableYears]
            );
            return;
        }

        // Gestion des années avec maintenance
        if (value.includes('AllMaintenance') && customHandlers?.getMaintenanceYears) {
            if (isDeveloppeur) {
            console.log('Handling maintenance years selection');
            }
            const maintenanceYears = customHandlers.getMaintenanceYears();
            if (isDeveloppeur) {
            console.log('Available maintenance years:', maintenanceYears);
            }
            const allMaintenanceSelected = maintenanceYears.every(year =>
                selectedYears.includes(year)
            );

            setSelectedYears(prevYears => {
                if (allMaintenanceSelected) {
                    return prevYears.filter(year => !maintenanceYears.includes(year));
                }
                if (isDeveloppeur) {
                console.log('Unselecting all maintenance years');
                }
                const newYears = new Set(prevYears);
                maintenanceYears.forEach(year => newYears.add(year));
                if (isDeveloppeur) {
                    console.log('Selecting all maintenance years:', Array.from(newYears));
                }
                return Array.from(newYears);
            });
            return;
        }

        // Gestion des années avec dépenses
        if (value.includes('AllExpenses') && customHandlers?.getExpenseYears) {
            if (isDeveloppeur) {
                console.log('Handling expense years selection');
            }
            const expenseYears = customHandlers.getExpenseYears();
            if (isDeveloppeur) {
                console.log('Available expense years:', expenseYears);
            }
            const allExpensesSelected = expenseYears.every(year =>
                selectedYears.includes(year)
            );

            setSelectedYears(prevYears => {
                if (allExpensesSelected) {
                    return prevYears.filter(year => !expenseYears.includes(year));
                }
                if (isDeveloppeur) {
                    console.log('Unselecting all expense years');
                }
                const newYears = new Set(prevYears);
                expenseYears.forEach(year => newYears.add(year));
                if (isDeveloppeur) {
                    console.log('Selecting all expense years:', Array.from(newYears));
                }
                return Array.from(newYears);
            });
            return;
        }

        // Sélections individuelles
        const newSelectedYears = typeof value === 'string' ? value.split(',') : value;
        if (isDeveloppeur) {
            console.log('Setting individual selected years:', newSelectedYears);
        }
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

    if (isDeveloppeur) {
        console.log('Available years:', availableYears);
        console.log('Selected years:', selectedYears);
    }

    const getExpenseStats = (year) => {
        return initialData.filter(vehicle => {
            // Logique pour les dépenses par année
            return vehicle.records?.some(record =>
                new Date(record.date).getFullYear() === year
            );
        });
    };

    if (isDeveloppeur) {
        console.log('Available years:', availableYears);
        console.log('Selected years:', selectedYears);
    }

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