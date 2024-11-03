
import { useState, useEffect } from "react";

// Fonction utilitaire pour calculer l'âge
const calculateAge = (birthDate, accidentDate) => {
  let age = accidentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = accidentDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && accidentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Fonction pour initialiser les statistiques
const initializeStats = () => ({
  totalAccidents: 0,
  accidentsByType: {},
  accidentsByMonth: {},
  accidentsByYear: {},
  accidentsByYearByCompany: {},
  accidentsByMonthByCompany: {},
  accidentsBySex: { Masculin: 0, Féminin: 0 },
  accidentsBySector: {},
  accidentsByCompany: {},
  accidentsByDayOfWeek: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  accidentsByDayOfWeekByCompany: {},
  accidentsByAge: {},
  accidentsByAgeByCompany: {},
  accidentsByTypeTravailleur: {},
  accidentsByTypeTravailleurByCompany: {},
  tfByYearAndCompany: {},
  tfByCompany: {},
});

// Fonction principale de filtrage et calcul des statistiques
export default function filter({
  data,
  selectedYears,
  selectedWorkerTypes,
  selectedSectors,
  selectedAssureurStatus,
  selectedAccidentTypes,
  accidentTypes // Ajout du paramètre manquant
}) {
  if (!data || data.length === 0) {
    return initializeStats();
  }

  // Filtrage des données
  const filteredData = data.filter(accident => {
    const accidentYear = new Date(accident.DateHeureAccident).getFullYear();
    const accidentType = accident.typeAccident || 'Non spécifié';

    return selectedYears.includes(accidentYear) &&
      selectedWorkerTypes.includes(accident.typeTravailleur) &&
      selectedSectors.includes(accident.secteur) &&
      selectedAssureurStatus.includes(accident.AssureurStatus) &&
      (selectedAccidentTypes.length === accidentTypes.length || selectedAccidentTypes.includes(accidentType));
  });

  // Initialisation des statistiques
  const stats = initializeStats();
  stats.totalAccidents = filteredData.length;

  // Calcul des statistiques
  filteredData.forEach((accident) => {
    const {
      DateHeureAccident,
      entrepriseName,
      sexe,
      secteur,
      dateNaissance,
      typeTravailleur = 'Non spécifié',
      typeAccident = 'Non spécifié'
    } = accident;

    const date = new Date(DateHeureAccident);
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();
    const companyName = entrepriseName || 'Inconnue';
    const sector = secteur || 'Non spécifié';

    // Calcul de l'âge si les dates sont disponibles
    if (dateNaissance && DateHeureAccident) {
      const birthDate = new Date(dateNaissance);
      const accidentDate = new Date(DateHeureAccident);
      const age = calculateAge(birthDate, accidentDate);

      // Mise à jour des statistiques par âge
      stats.accidentsByAge[age] = (stats.accidentsByAge[age] || 0) + 1;
      stats.accidentsByAgeByCompany[companyName] = stats.accidentsByAgeByCompany[companyName] || {};
      stats.accidentsByAgeByCompany[companyName][age] = (stats.accidentsByAgeByCompany[companyName][age] || 0) + 1;
    }

    // Mise à jour des statistiques par type de travailleur
    stats.accidentsByTypeTravailleur[typeTravailleur] = (stats.accidentsByTypeTravailleur[typeTravailleur] || 0) + 1;
    stats.accidentsByTypeTravailleurByCompany[companyName] = stats.accidentsByTypeTravailleurByCompany[companyName] || {};
    stats.accidentsByTypeTravailleurByCompany[companyName][typeTravailleur] =
      (stats.accidentsByTypeTravailleurByCompany[companyName][typeTravailleur] || 0) + 1;

    // Mise à jour des autres statistiques
    stats.accidentsByType[typeAccident] = (stats.accidentsByType[typeAccident] || 0) + 1;
    stats.accidentsByMonth[month] = (stats.accidentsByMonth[month] || 0) + 1;
    stats.accidentsByYear[year] = (stats.accidentsByYear[year] || 0) + 1;
    stats.accidentsByDayOfWeek[dayOfWeek] = (stats.accidentsByDayOfWeek[dayOfWeek] || 0) + 1;

    // Statistiques par entreprise
    stats.accidentsByYearByCompany[companyName] = stats.accidentsByYearByCompany[companyName] || {};
    stats.accidentsByYearByCompany[companyName][year] = (stats.accidentsByYearByCompany[companyName][year] || 0) + 1;

    stats.accidentsByMonthByCompany[companyName] = stats.accidentsByMonthByCompany[companyName] || {};
    stats.accidentsByMonthByCompany[companyName][month] = (stats.accidentsByMonthByCompany[companyName][month] || 0) + 1;

    stats.accidentsByDayOfWeekByCompany[companyName] = stats.accidentsByDayOfWeekByCompany[companyName] ||
      { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    stats.accidentsByDayOfWeekByCompany[companyName][dayOfWeek] += 1;

    // Statistiques par sexe
    if (sexe === 'Masculin' || sexe === 'Féminin') {
      stats.accidentsBySex[sexe] += 1;
    }

    // Statistiques par secteur
    stats.accidentsBySector[sector] = (stats.accidentsBySector[sector] || 0) + 1;
    stats.accidentsByCompany[companyName] = stats.accidentsByCompany[companyName] || {};
    stats.accidentsByCompany[companyName][sector] = (stats.accidentsByCompany[companyName][sector] || 0) + 1;
  });

  return stats;
}

// Exemple d'utilisation dans un composant React
export const useAccidentStats = (
  data,
  selectedYears,
  selectedWorkerTypes,
  selectedSectors,
  selectedAssureurStatus,
  selectedAccidentTypes,
  accidentTypes
) => {
  const [stats, setStats] = useState(initializeStats());

  useEffect(() => {
    const newStats = filter({
      data,
      selectedYears,
      selectedWorkerTypes,
      selectedSectors,
      selectedAssureurStatus,
      selectedAccidentTypes,
      accidentTypes
    });
    setStats(newStats);
  }, [data, selectedYears, selectedWorkerTypes, selectedSectors, selectedAssureurStatus, selectedAccidentTypes, accidentTypes]);

  return stats;
};