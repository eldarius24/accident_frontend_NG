import { useState, useEffect } from 'react';
import { 
    COOKIE_PREFIXES,
    getSelectedYearsFromCookie,
    saveYearSelections
} from '../Home/_actions/cookieUtils.js';

const useYearFilter = (prefix, availableYears = []) => {
  const [selectedYears, setSelectedYears] = useState(() => {
    console.log('DEBUG - prefix:', prefix);
    console.log('DEBUG - availableYears:', availableYears);

    // Récupérer les années sauvegardées avec le préfixe
    const savedYears = getSelectedYearsFromCookie(prefix);
    console.log('DEBUG - savedYears:', savedYears);

    // Filtrer les années sauvegardées qui sont dans les années disponibles
    const validYears = savedYears.filter(year => availableYears.includes(year));
    console.log('DEBUG - validYears:', validYears);

    // Priorités de sélection :
    // 1. Années sauvegardées valides
    if (validYears.length > 0) {
      console.log('DEBUG - Returning saved valid years');
      return validYears;
    }

    // 2. Dernière année disponible si aucune année sauvegardée valide
    if (availableYears.length > 0) {
      const lastYear = availableYears[availableYears.length - 1];
      console.log('DEBUG - Returning last available year:', lastYear);
      return [lastYear];
    }

    // 3. Tableau vide si aucune année
    console.log('DEBUG - Returning empty array');
    return [];
  });

  // Sauvegarde des années dans les cookies à chaque changement
  useEffect(() => {
    console.log('DEBUG - Saving years:', selectedYears);
    saveYearSelections(prefix, selectedYears, selectedYears.length === availableYears.length);
  }, [selectedYears, prefix, availableYears]);

  const handleYearChange = (event) => {
    const { target: { value } } = event;
   
    console.log('DEBUG - handleYearChange value:', value);

    // Gestion du "tout sélectionner"
    if (value.includes('all')) {
      setSelectedYears(
        selectedYears.length === availableYears.length ? [] : [...availableYears]
      );
      return;
    }
    
    // Sélection normale des années
    const newSelectedYears = typeof value === 'string' ? value.split(',') : value;
    
    console.log('DEBUG - New selected years:', newSelectedYears);
    setSelectedYears(newSelectedYears);
  };

  return {
    selectedYears,
    setSelectedYears,
    handleYearChange
  };
};

export default useYearFilter;