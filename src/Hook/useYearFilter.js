import { useState, useEffect } from 'react';
import { 
    getSelectedYearsFromCookie,
    saveYearSelections
} from '../Accidents/_actions/cookieUtils.js';

const useYearFilter = (prefix, availableYears = []) => {
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

  return {
    selectedYears,
    setSelectedYears,
    handleYearChange: (event) => {
      const { target: { value } } = event;
      if (value.includes('all')) {
        setSelectedYears(
          selectedYears.length === availableYears.length ? [] : [...availableYears]
        );
        return;
      }
      const newSelectedYears = typeof value === 'string' ? value.split(',') : value;
      setSelectedYears(newSelectedYears);
    }
  };
};

export default useYearFilter;