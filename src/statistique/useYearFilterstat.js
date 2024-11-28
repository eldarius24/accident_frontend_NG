import { useState, useEffect } from 'react';
import { 
    getSelectedYearsFromCookie,
    saveYearSelections
} from '../Accidents/_actions/cookieUtils.js';

const useYearFilterStat = (prefix, availableYears = []) => {
  const [selectedYears, setSelectedYears] = useState(() => {
      const savedYears = getSelectedYearsFromCookie(prefix) || [];
      
      if (availableYears.length === 0) {
          return savedYears;
      }

      const validYears = savedYears.filter(year => 
          availableYears.includes(parseInt(year))
      );

      if (validYears.length > 0) {
          return validYears;
      }

      return availableYears.length > 0 ? [availableYears[availableYears.length - 1]] : [];
  });

  useEffect(() => {
      if (selectedYears.length > 0 && availableYears.length > 0) {
          saveYearSelections(prefix, selectedYears, 
              selectedYears.length === availableYears.length
          );
      }
  }, [selectedYears, prefix, availableYears]);

  const handleYearChange = (event, options = {}) => {
    const { target: { value } } = event;
    const { allYears, customHandlers } = options;
    
    // Gestion de la sélection/désélection de toutes les années
    if (value.includes('All')) {
      setSelectedYears(
        selectedYears.length === allYears.length ? [] : [...allYears]
      );
      return;
    }

    // Gestion de la sélection de tous les accidents
    if (value.includes('AllAccidents') && customHandlers?.getAccidentYears) {
      const accidentYears = customHandlers.getAccidentYears();
      const allAccidentsSelected = accidentYears.every(year => 
        selectedYears.includes(year)
      );

      if (allAccidentsSelected) {
        // Désélectionner uniquement les années d'accidents
        setSelectedYears(prevYears => 
          prevYears.filter(year => !accidentYears.includes(year))
        );
      } else {
        // Ajouter toutes les années d'accidents
        setSelectedYears(prevYears => {
          const newYears = new Set(prevYears);
          accidentYears.forEach(year => newYears.add(year));
          return Array.from(newYears);
        });
      }
      return;
    }

    // Gestion de la sélection de tous les TF
    if (value.includes('AllTF') && customHandlers?.getTfYears) {
      const tfYears = customHandlers.getTfYears();
      const allTfSelected = tfYears.every(year => 
        selectedYears.includes(year)
      );

      if (allTfSelected) {
        // Désélectionner uniquement les années TF
        setSelectedYears(prevYears => 
          prevYears.filter(year => !tfYears.includes(year))
        );
      } else {
        // Ajouter toutes les années TF
        setSelectedYears(prevYears => {
          const newYears = new Set(prevYears);
          tfYears.forEach(year => newYears.add(year));
          return Array.from(newYears);
        });
      }
      return;
    }

    // Gestion des sélections individuelles
    const newSelectedYears = typeof value === 'string' ? value.split(',') : value;
    setSelectedYears(newSelectedYears.map(year => parseInt(year)));
  };

  return {
    selectedYears,
    setSelectedYears,
    handleYearChange
  };
};

export default useYearFilterStat;