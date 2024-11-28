import React, { useState, useEffect, useMemo } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box, Paper, Typography
} from '@mui/material';
import { useAccidentStats } from './filters';
import chargerDonnees from './dataLoader';
import genererDonneesGraphiques from './chartData';
import { renderOptimizedChart, getRenderConfig } from './chartComponents';
import axios from 'axios';
import config from '../config.json';
import { saveFiltersToCookies, loadFiltersFromCookies } from './filterPersistence';
import { useTheme } from '../Hook/ThemeContext';
import StyledChart from '../_composants/styledTitle';
import UseYearFilterStat from './useYearFilterstat';

/**
 * Affiche les graphiques des accidents de travail par type de travailleur, âge, jour de la semaine, mois, an, secteur et par entreprise.
 * 
 * @param {Object} props - Les propriétés reçues en entrée.
 * 
 * @returns {React.ReactElement} - Le composant react qui affiche les graphiques.
 */
const Statistiques = () => {
  const [allYears, setAllYears] = useState([]);
  const { selectedYears, setSelectedYears, handleYearChange } = UseYearFilterStat('statistics');
  const [data, setData] = useState([]);
  const [tfData, setTfData] = useState([]);
  const [graphs, setGraphs] = useState({
    accidentsBySex: { visible: true, label: "TOTAL Accidents par sexe" },
    accidentsByDayOfWeek: { visible: true, label: "TOTAL Accidents par jour de la semaine" },
    accidentsByMonth: { visible: true, label: "TOTAL Accidents par mois" },
    accidentsByYear: { visible: true, label: "TOTAL Accidents par an" },
    accidentsByTypeTravailleur: { visible: true, label: "TOTAL Accidents par type de travailleur" },
    accidentsByAge: { visible: true, label: "TOTAL Accidents par age" },
    accidentsBySector: { visible: true, label: "TOTAL Accidents par secteur" },
    tfByYearAndCompany: { visible: true, label: "TOTAL des taux de fréquence par an et par entreprise" },
    accidentsBySexByCompany: { visible: true, label: "Accidents par genre et par entreprise" },
    accidentsByYearAndCompany: { visible: true, label: "Accidents par an et par entreprise" },
    accidentsByMonthAndCompany: { visible: true, label: "Accidents par mois et par entreprise" },
    accidentsByCompanyAndSector: { visible: true, label: "Accidents par entreprise et secteur" },
    accidentsByDayOfWeekAndCompany: { visible: true, label: "Accidents par jour et par entreprise" },
    accidentsByAgeByCompany: { visible: true, label: "Accidents par age et par entreprise" },
    accidentsByTypeTravailleurByCompany: { visible: true, label: "Accidents par type de travailleur et par entreprise" },
    tfByCompany: { visible: true, label: "Taux de fréquence par entreprise" },

  });
  const { darkMode } = useTheme();
  const [workerTypes, setWorkerTypes] = useState([]);
  const [selectedWorkerTypes, setSelectedWorkerTypes] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [assureurStatus, setAssureurStatus] = useState([]);
  const [selectedAssureurStatus, setSelectedAssureurStatus] = useState([]);
  const [accidentTypes, setAccidentTypes] = useState([]);
  const [selectedAccidentTypes, setSelectedAccidentTypes] = useState([]);
  const [detailedTfData, setDetailedTfData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Dans le composant Statistiques
  // Dans le composant Statistiques
  useEffect(() => {
    const savedFilters = loadFiltersFromCookies();
    if (savedFilters) {
      // Restaurer les filtres sauvegardés seulement si les données sont disponibles
      if (savedFilters.selectedYears.length > 0) {
        const validYears = savedFilters.selectedYears.filter(year => allYears.includes(year));
        if (validYears.length > 0) setSelectedYears(validYears);
      }

      if (savedFilters.selectedWorkerTypes.length > 0) {
        const validWorkerTypes = savedFilters.selectedWorkerTypes.filter(type => workerTypes.includes(type));
        if (validWorkerTypes.length > 0) setSelectedWorkerTypes(validWorkerTypes);
      }

      if (savedFilters.selectedSectors.length > 0) {
        const validSectors = savedFilters.selectedSectors.filter(sector => sectors.includes(sector));
        if (validSectors.length > 0) setSelectedSectors(validSectors);
      }

      if (savedFilters.selectedAssureurStatus.length > 0) {
        const validAssureurStatus = savedFilters.selectedAssureurStatus.filter(status => assureurStatus.includes(status));
        if (validAssureurStatus.length > 0) setSelectedAssureurStatus(validAssureurStatus);
      }

      if (savedFilters.selectedAccidentTypes.length > 0) {
        const validAccidentTypes = savedFilters.selectedAccidentTypes.filter(type => accidentTypes.includes(type));
        if (validAccidentTypes.length > 0) setSelectedAccidentTypes(validAccidentTypes);
      }

      if (savedFilters.selectedCompanies.length > 0) {
        const validCompanies = savedFilters.selectedCompanies.filter(company => companies.includes(company));
        if (validCompanies.length > 0) setSelectedCompanies(validCompanies);
      }

      // Restaurer la visibilité des graphiques
      if (Object.keys(savedFilters.visibleGraphs).length > 0) {
        setGraphs(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(prev).map(([key, graphData]) => [
              key,
              {
                ...graphData,
                visible: savedFilters.visibleGraphs[key] ?? graphData.visible
              }
            ])
          )
        }));
      }
    }
  }, [allYears, workerTypes, sectors, assureurStatus, accidentTypes, companies]);

  // useEffect pour la sauvegarde
  useEffect(() => {
    if (allYears.length > 0 && workerTypes.length > 0 && sectors.length > 0) {
      saveFiltersToCookies({
        selectedYears,
        selectedWorkerTypes,
        selectedSectors,
        selectedAssureurStatus,
        selectedAccidentTypes,
        selectedCompanies,
        graphs,
      });
    }
  }, [
    selectedYears,
    selectedWorkerTypes,
    selectedSectors,
    selectedAssureurStatus,
    selectedAccidentTypes,
    graphs,
    allYears,
    workerTypes,
    sectors,
    assureurStatus,
    accidentTypes,
    selectedCompanies,
  ]);

  const loadTfDataSets = async () => {
    try {
      const response = await axios.get(`http://${config.apiUrl}:3100/api/questionnaires`);
      const tfDataByCompany = {};
      const detailedTfDataByCompany = {};

      response.data.forEach(questionnaire => {
        const { resultTf, entrepriseName, annees, valueATf, valueBTf } = questionnaire;

        if (resultTf && entrepriseName && annees) {
          // Initialize if needed
          if (!tfDataByCompany[entrepriseName]) {
            tfDataByCompany[entrepriseName] = {};
            detailedTfDataByCompany[entrepriseName] = [];
          }

          annees.forEach(annee => {
            // Simple TF data
            tfDataByCompany[entrepriseName][annee] = parseFloat(resultTf);

            // Detailed TF data
            detailedTfDataByCompany[entrepriseName].push({
              year: annee,
              tf: parseFloat(resultTf),
              heuresPreste: parseFloat(valueATf || 0),
              accidents: parseFloat(valueBTf || 0)
            });
          });
        }
      });

      // Transform simple TF data
      const transformedTfData = Object.entries(tfDataByCompany).map(([company, yearData]) => ({
        company,
        ...yearData
      }));

      // Transform detailed TF data
      const transformedDetailedData = Object.entries(detailedTfDataByCompany).map(([company, data]) => ({
        company,
        data: data.sort((a, b) => a.year - b.year)
      }));

      // Update both states
      setTfData(transformedTfData);
      setDetailedTfData(transformedDetailedData);
    } catch (error) {
      console.error('Erreur lors du chargement des données Tf:', error);
    }
  };

  useEffect(() => {
    loadTfDataSets();
  }, []);

  const stats = useAccidentStats(
    data,
    selectedYears,
    selectedWorkerTypes,
    selectedSectors,
    selectedAssureurStatus,
    selectedAccidentTypes,
    selectedCompanies,
    accidentTypes
  );

  useEffect(() => {
    const initialiserDonnees = async () => {
      try {
        await chargerDonnees({
          setData,
          setAllYears,
          setSelectedYears,
          setWorkerTypes,
          setSelectedWorkerTypes,
          setSectors,
          setSelectedSectors,
          setAssureurStatus,
          setSelectedAssureurStatus,
          setAccidentTypes,
          setSelectedAccidentTypes,
          setCompanies,
          setSelectedCompanies
        });
      } catch (erreur) {
        console.error('Erreur lors de l\'initialisation:', erreur);
      }
    };

    initialiserDonnees();
  }, []);

  const handleChangeCompaniesFilter = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedCompanies(selectedCompanies.length === companies.length ? [] : companies);
    } else {
      setSelectedCompanies(value);
    }
  };

  const handleChangeGraphsFilter = (event) => {
    const value = event.target.value;
    if (value.includes('All')) {
      const allGraphsSelected = value.length === Object.keys(graphs).length + 1;
      setGraphs(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key, graphData]) => [key, { ...graphData, visible: !allGraphsSelected }])
        )
      );
    } else {
      setGraphs(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key, graphData]) => [key, { ...graphData, visible: value.includes(key) }])
        )
      );
    }
  };

  const handleChangeWorkerTypesFilter = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedWorkerTypes(selectedWorkerTypes.length === workerTypes.length ? [] : workerTypes);
    } else {
      setSelectedWorkerTypes(value);
    }
  };

  const handleChangeSectorsFilter = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedSectors(selectedSectors.length === sectors.length ? [] : sectors);
    } else {
      setSelectedSectors(value);
    }
  };

  const handleChangeAssureurStatus = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedAssureurStatus(selectedAssureurStatus.length === assureurStatus.length ? [] : assureurStatus);
    } else {
      setSelectedAssureurStatus(value);
    }
  };

  const handleChangeAccidentTypesFilter = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedAccidentTypes(selectedAccidentTypes.length === accidentTypes.length ? [] : accidentTypes);
    } else {
      setSelectedAccidentTypes(value);
    }
  };

  const memoizedChartData = useMemo(() =>
    genererDonneesGraphiques(stats),
    [stats]
  );

  // Style commun pour tous les FormControl
  const formControlStyle = {
    width: 'calc(14% - 7px)',
    minWidth: '200px',
    '& .MuiInputLabel-root': {
      color: darkMode ? '#fff' : 'inherit'
    },
    '& .MuiOutlinedInput-root': {
      color: darkMode ? '#fff' : 'inherit',
      '& fieldset': {
        borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
      },
      '&:hover fieldset': {
        borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
      }
    }
  };

  // Style commun pour les Select
  const selectStyle = {
    backgroundColor: darkMode ? '#424242' : '#ee742d59',
    '& .MuiSelect-icon': {
      color: darkMode ? '#fff' : 'inherit'
    }
  };

  // Style commun pour les MenuItems
  const menuItemStyle = {
    backgroundColor: darkMode ? '#424242' : '#ee742d59',
    color: darkMode ? '#fff' : 'inherit',
    '&:hover': {
      backgroundColor: darkMode ? '#505050' : '#ee742d80'
    },
    '&.Mui-selected': {
      backgroundColor: darkMode ? '#424242' : '#ee742d59',
    },
    '&.Mui-selected:hover': {
      backgroundColor: darkMode ? '#505050' : '#ee742d80'
    },
    '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
      color: darkMode ? '#fff' : 'inherit'
    }
  };

  // Style pour les Checkbox selon leur type
  const checkboxStyles = {
    all: {
      color: darkMode ? '#ff6b6b' : 'red',
      '&.Mui-checked': {
        color: darkMode ? '#ff8080' : 'red'
      }
    },
    accidents: {
      color: darkMode ? '#FF9E71' : '#FF8042',
      '&.Mui-checked': {
        color: darkMode ? '#FFB08E' : '#FF8042'
      }
    },
    tf: {
      color: darkMode ? '#00E5B7' : '#00C49F',
      '&.Mui-checked': {
        color: darkMode ? '#33EAC4' : '#00C49F'
      }
    },
    default: {
      color: darkMode ? '#4CAF50' : '#257525',
      '&.Mui-checked': {
        color: darkMode ? '#81C784' : '#257525'
      }
    }
  };

  const isAllSelected = selectedWorkerTypes.length === workerTypes.length;
  const isAllSectorsSelected = selectedSectors.length === sectors.length;
  return (
    <div className="col-span-full" style={{ margin: '20px' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2rem 0',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          height: '4px',
          background: darkMode
            ? 'linear-gradient(90deg, rgba(122,142,28,0.2) 0%, rgba(122,142,28,1) 50%, rgba(122,142,28,0.2) 100%)'
            : 'linear-gradient(90deg, rgba(238,117,45,0.2) 0%, rgba(238,117,45,1) 50%, rgba(238,117,45,0.2) 100%)',
          borderRadius: '2px'
        }
      }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            color: darkMode ? '#ffffff' : '#2D3748',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textAlign: 'center',
            textShadow: darkMode
              ? '2px 2px 4px rgba(0,0,0,0.3)'
              : '2px 2px 4px rgba(0,0,0,0.1)',
            '&::first-letter': {
              color: darkMode ? '#7a8e1c' : '#ee752d',
              fontSize: '120%'
            },
            position: 'relative',
            padding: '0 20px'
          }}
        >
          Statistiques
        </Typography>
      </Box>
      <Box sx={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <FormControl sx={formControlStyle}>
          <InputLabel id="companies-label">Entreprises</InputLabel>
          <Select
            sx={selectStyle}
            labelId="companies-label"
            id="companies-select"
            multiple
            value={selectedCompanies}
            onChange={handleChangeCompaniesFilter}
            renderValue={(selected) => `${selected.length} entreprise(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem value="all" sx={menuItemStyle}>
              <Checkbox checked={selectedCompanies.length === companies.length} sx={checkboxStyles.all} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {companies.map((company) => (
              <MenuItem key={company} value={company} sx={menuItemStyle}>
                <Checkbox checked={selectedCompanies.includes(company)} sx={checkboxStyles.default} />
                <ListItemText primary={company} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlStyle}>
          <InputLabel id="accident-types-label">Type d'accident</InputLabel>
          <Select
            sx={selectStyle}
            labelId="accident-types-label"
            id="accident-types-select"
            multiple
            value={selectedAccidentTypes}
            onChange={handleChangeAccidentTypesFilter}
            renderValue={(selected) => `${selected.length} type(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem value="all" sx={menuItemStyle}>
              <Checkbox checked={selectedAccidentTypes.length === accidentTypes.length} sx={checkboxStyles.all} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {accidentTypes.map((type) => (
              <MenuItem key={type} value={type} sx={menuItemStyle}>
                <Checkbox checked={selectedAccidentTypes.includes(type)} sx={checkboxStyles.default} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlStyle}>
          <InputLabel id="assureur-status-label">Statut Assureur</InputLabel>
          <Select
            sx={selectStyle}
            labelId="assureur-status-label"
            id="assureur-status-select"
            multiple
            value={selectedAssureurStatus}
            onChange={handleChangeAssureurStatus}
            renderValue={(selected) => `${selected.length} statut(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem value="all" sx={menuItemStyle}>
              <Checkbox checked={selectedAssureurStatus.length === assureurStatus.length} sx={checkboxStyles.all} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {assureurStatus.map((status) => (
              <MenuItem key={status} value={status} sx={menuItemStyle}>
                <Checkbox checked={selectedAssureurStatus.includes(status)} sx={checkboxStyles.default} />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={formControlStyle}>
          <InputLabel id="years-label">Année</InputLabel>
          <Select
            sx={selectStyle}
            labelId="years-label"
            id="years-select"
            multiple
            value={selectedYears}
            onChange={(event) => handleYearChange(event, {
              allYears,
              customHandlers: {
                getAccidentYears: () => allYears.filter(year =>
                  data.some(accident => new Date(accident.DateHeureAccident).getFullYear() === year)
                ),
                getTfYears: () => allYears.filter(year =>
                  tfData.some(tf => Object.keys(tf).some(key => key !== 'company' && parseInt(key) === year))
                )
              }
            })}
            renderValue={(selected) => `${selected.length} année(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem key="All" value="All" sx={menuItemStyle}>
              <Checkbox
                checked={selectedYears.length === allYears.length}
                indeterminate={selectedYears.length > 0 && selectedYears.length < allYears.length}
                sx={checkboxStyles.all}
              />
              <ListItemText primary="Tout sélectionner" />
            </MenuItem>

            <MenuItem key="AllAccidents" value="AllAccidents" sx={menuItemStyle}>
              <Checkbox
                checked={allYears.filter(year =>
                  data.some(accident => new Date(accident.DateHeureAccident).getFullYear() === year)
                ).every(year => selectedYears.includes(year))}
                sx={checkboxStyles.accidents}
              />
              <ListItemText primary="Sélectionner tous les Accidents" />
            </MenuItem>

            <MenuItem key="AllTF" value="AllTF" sx={menuItemStyle}>
              <Checkbox
                checked={allYears.filter(year =>
                  tfData.some(tf => Object.keys(tf).some(key => key !== 'company' && parseInt(key) === year))
                ).every(year => selectedYears.includes(year))}
                sx={checkboxStyles.tf}
              />
              <ListItemText primary="Sélectionner tous les TF" />
            </MenuItem>
            {allYears.map((year) => {
              // Vérifier si l'année existe dans les données d'accidents
              const hasAccidents = data.some(accident =>
                new Date(accident.DateHeureAccident).getFullYear() === year
              );

              // Vérifier si l'année existe dans les données TF
              const hasTf = tfData.some(tf =>
                Object.keys(tf).some(key => key !== 'company' && parseInt(key) === year)
              );

              // Créer le texte des sources
              const sources = [];
              if (hasAccidents) sources.push('Accidents');
              if (hasTf) sources.push('TF');
              const sourcesText = sources.length > 0 ? ` (${sources.join(' + ')})` : '';

              return (
                <MenuItem
                  key={year}
                  value={year}
                  sx={menuItemStyle}
                >
                  <Checkbox
                    checked={selectedYears.includes(year)}
                    sx={checkboxStyles.default}
                  />
                  <ListItemText
                    primary={`${year}${sourcesText}`}
                    secondary={sources.length > 1 ? 'Données complètes' : sources.length === 1 ? `${sources[0]} seulement` : ''}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={formControlStyle}>
          <InputLabel id="graphs-label">Graphiques</InputLabel>
          <Select
            sx={selectStyle}
            labelId="graphs-label"
            id="graphs-select"
            multiple
            value={Object.entries(graphs).filter(([_, { visible }]) => visible).map(([key]) => key)}
            onChange={handleChangeGraphsFilter}
            renderValue={(selected) => `${selected.length} graphique(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem key="All" value="All" sx={menuItemStyle}>
              <Checkbox checked={Object.values(graphs).every(({ visible }) => visible)} sx={checkboxStyles.all} />
              <ListItemText primary="All" />
            </MenuItem>
            {Object.entries(graphs).map(([key, { label, visible }]) => (
              <MenuItem key={key} value={key} sx={menuItemStyle}>
                <Checkbox checked={visible} sx={checkboxStyles.default} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlStyle}>
          <InputLabel id="worker-types-label">Type de travailleur</InputLabel>
          <Select
            sx={selectStyle}
            labelId="worker-types-label"
            id="worker-types-select"
            multiple
            value={selectedWorkerTypes}
            onChange={handleChangeWorkerTypesFilter}
            renderValue={(selected) => `${selected.length} type(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem value="all" sx={menuItemStyle}>
              <Checkbox checked={isAllSelected} sx={checkboxStyles.all} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {workerTypes.map((type, index) => (
              <MenuItem key={index} value={type} sx={menuItemStyle}>
                <Checkbox checked={selectedWorkerTypes.includes(type)} sx={checkboxStyles.default} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={formControlStyle}>
          <InputLabel id="sectors-label">Secteurs</InputLabel>
          <Select
            sx={selectStyle}
            labelId="sectors-label"
            id="sectors-select"
            multiple
            value={selectedSectors}
            onChange={handleChangeSectorsFilter}
            renderValue={(selected) => `${selected.length} secteur(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem value="all" sx={menuItemStyle}>
              <Checkbox checked={isAllSectorsSelected} sx={checkboxStyles.all} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {sectors.map((sector) => (
              <MenuItem key={sector} value={sector} sx={menuItemStyle}>
                <Checkbox checked={selectedSectors.includes(sector)} sx={checkboxStyles.default} />
                <ListItemText primary={sector} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Paper
        elevation={3}
        sx={{
          border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          color: darkMode ? '#e0e0e0' : '#333333',
          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
          '&:hover': {
            boxShadow: darkMode
              ? '0 8px 16px rgba(255, 255, 255, 0.1)'
              : '0 8px 16px rgba(238, 116, 45, 0.2)'
          }
        }}
      >
        <div className="flex flex-col items-center justify-center h-full mb-8">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              margin: '1.5rem 0',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '45px',
                background: darkMode
                  ? 'rgba(122,142,28,0.1)'
                  : 'rgba(238,117,45,0.1)',
                filter: 'blur(10px)',
                borderRadius: '10px',
                zIndex: 0
              }
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                fontWeight: 600,
                background: darkMode
                  ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                  : 'linear-gradient(45deg, #ee752d, #f4a261)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                position: 'relative',
                padding: '0.5rem 1.5rem',
                zIndex: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)'
                }
              }}
            >
              Tolat des accidents
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.5,
                pointerEvents: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)'
                }
              }}
            />
          </Box>
          <p className="text-3xl font-bold text-center">{stats.totalAccidents}</p>
        </div>
      </Paper>

      {/* Partie graphiques */}
      {graphs.accidentsBySex.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="pie"
            data={memoizedChartData.accidentsBySexData}
            title="Accidents par sexe"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByTypeTravailleur.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="bar"
            data={memoizedChartData.accidentsByTypeTravailleurData}
            title="Nombre d'accidents par type de travailleur"
            xAxis="type"
            fill="#82ca9d"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByAge.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="bar"
            data={memoizedChartData.accidentsByAgeData}
            title="Nombre d'accidents par âge du travailleur"
            xAxis="age"
            fill="#8884d8"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByDayOfWeek.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="bar"
            data={memoizedChartData.accidentDayOfWeekData}
            title="Accidents par jour de la semaine"
            xAxis="day"
            fill="#FFBB28"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByMonth.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="bar"
            data={memoizedChartData.accidentMonthData}
            title="Nombre total d'accidents par mois"
            xAxis="month"
            fill="#82ca9d"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByYear.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="bar"
            data={memoizedChartData.accidentYearData}
            title="Nombre total d'accidents par an"
            xAxis="year"
            fill="#ffc658"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsBySector.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >

          <StyledChart
            chartType="pie"
            data={memoizedChartData.accidentSectorData}
            title="Accidents par secteur"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={getRenderConfig}
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByYearAndCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="line"
            data={memoizedChartData.accidentYearByCompanyData}
            title="Accidents par an et par entreprise"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={(chartType, data) =>
              getRenderConfig(chartType, data, {
                xAxis: "year",
                darkMode: darkMode,
                series: Object.keys(stats.accidentsByYearByCompany),
              })
            }
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.accidentsByMonthAndCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >

          <StyledChart
            chartType="line"
            data={memoizedChartData.accidentMonthByCompanyData}
            title="Accidents par mois et par entreprise"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={(chartType, data) =>
              getRenderConfig(chartType, data, {
                xAxis: "year",
                darkMode: darkMode,
                series: Object.keys(stats.accidentsByYearByCompany),
              })
            }
            showStyledTitle={true}
            showChartTitle={false}
          />
        </Paper>
      )}

      {graphs.tfByYearAndCompany.visible && tfData.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >


          {renderOptimizedChart(
            'tfYearCompany',
            null,
            getRenderConfig('tfYearCompany', null, {
              data: tfData.filter(item => selectedCompanies.includes(item.company)),
              selectedYears: selectedYears,
              darkMode: darkMode
            })
          )}
        </Paper>
      )}

      {graphs.accidentsBySexByCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          {renderOptimizedChart(
            'genderByCompany',
            null,
            getRenderConfig('genderByCompany', null, {
              companies: memoizedChartData.accidentsBySexByCompanyData,
              darkMode: darkMode
            })
          )}
        </Paper>
      )}

      {graphs.accidentsByCompanyAndSector.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          <StyledChart
            chartType="accidentSectorCompany" // Type spécifique pour ce graphique
            data={null} // Pas de données directement passées ici
            title="Accidents par entreprise par secteur"
            darkMode={darkMode}
            renderOptimizedChart={renderOptimizedChart}
            getRenderConfig={(chartType, data) =>
              getRenderConfig(chartType, data, {
                darkMode: darkMode,
                companies: Object.keys(stats.accidentsByCompany).map(companyName => ({
                  company: companyName,
                  data: stats.accidentsByCompany[companyName],
                })),
              })
            }
            showStyledTitle={true} // Activer l'affichage du titre stylisé
            showChartTitle={false} // Désactiver l'affichage du titre dans le graphique
          />

        </Paper>
      )}

      {graphs.accidentsByDayOfWeekAndCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          {renderOptimizedChart(
            'dayOfWeekCompany',
            null,
            getRenderConfig('dayOfWeekCompany', null, {
              data: memoizedChartData.accidentsByDayOfWeekByCompanyData,
              darkMode: darkMode
            })
          )}
        </Paper>
      )}

      {graphs.accidentsByAgeByCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          {renderOptimizedChart('ageByCompany',
            null,
            getRenderConfig('ageByCompany', null, {
              title: "Accidents par âge du travailleur et par entreprise",
              companies: memoizedChartData.accidentsByAgeByCompanyData,
              darkMode: darkMode
            })
          )}
        </Paper>
      )}

      {graphs.accidentsByTypeTravailleurByCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          {renderOptimizedChart('workerTypeByCompany',
            null,
            getRenderConfig('workerTypeByCompany', null, {
              title: "Accidents par type de travailleur et par entreprise",
              darkMode: darkMode,
              companies: Object.entries(stats.accidentsByTypeTravailleurByCompany).map(([company, typeTravailleurData]) => ({
                company,
                data: Object.entries(typeTravailleurData).map(([typeTravailleur, NombreAT]) => ({
                  typeTravailleur,
                  NombreAT
                }))
              }))
            })
          )}
        </Paper>
      )}

      {graphs.tfByCompany.visible && (
        <Paper
          elevation={3}
          sx={{
            border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                : '0 8px 16px rgba(238, 116, 45, 0.2)'
            }
          }}
        >
          {renderOptimizedChart('tfByCompany',
            null,
            getRenderConfig('tfByCompany', null, {
              companies: detailedTfData.filter(item => selectedCompanies.includes(item.company)),
              selectedYears: selectedYears,
              darkMode: darkMode
            })
          )}
        </Paper>
      )}
    </div>
  );
};

export default Statistiques;