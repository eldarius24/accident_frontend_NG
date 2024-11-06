import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, LineChart, Line
} from 'recharts';
import {
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box
} from '@mui/material';
import { useAccidentStats } from './filters';
import chargerDonnees from './dataLoader';
import genererDonneesGraphiques, { MONTHS, DAYS } from './chartData';
import { renderOptimizedChart, getRenderConfig, COLORS } from './chartComponents';
import axios from 'axios';
import config from '../config.json';
import { saveFiltersToCookies, loadFiltersFromCookies } from './filterPersistence';
import { useTheme } from '../pageAdmin/user/ThemeContext';
/**
 * Affiche les graphiques des accidents de travail par type de travailleur, âge, jour de la semaine, mois, an, secteur et par entreprise.
 * 
 * @param {Object} props - Les propriétés reçues en entrée.
 * 
 * @returns {React.ReactElement} - Le composant react qui affiche les graphiques.
 */
const Statistiques = () => {
  const [data, setData] = useState([]);
  const [tfData, setTfData] = useState([]);
  const [graphs, setGraphs] = useState({
    accidentsBySex: { visible: true, label: "TOTAL Accidents par sexe" },
    accidentsByDayOfWeek: { visible: true, label: "TOTAL Accidents par jour de la semaine" }, // Nouvelle entrée
    accidentsByMonth: { visible: true, label: "TOTAL Accidents par mois" },
    accidentsByYear: { visible: true, label: "TOTAL Accidents par an" },
    accidentsByTypeTravailleur: { visible: true, label: "TOTAL Accidents par type de travailleur" },
    accidentsByAge: { visible: true, label: "TOTAL Accidents par age" },
    accidentsBySector: { visible: true, label: "TOTAL Accidents par secteur" },
    accidentsByYearAndCompany: { visible: true, label: "Accidents par an et par entreprise" },
    accidentsByMonthAndCompany: { visible: true, label: "Accidents par mois et par entreprise" },
    accidentsByCompanyAndSector: { visible: true, label: "Accidents par entreprise et secteur" },
    accidentsByDayOfWeekAndCompany: { visible: true, label: "Accidents par jour et par entreprise" },
    accidentsByAgeByCompany: { visible: true, label: "Accidents par age et par entreprise" },
    accidentsByTypeTravailleurByCompany: { visible: true, label: "Accidents par type de travailleur et par entreprise" },
    tfByYearAndCompany: { visible: true, label: "Taux de fréquence par an et par entreprise" },
    tfByCompany: { visible: true, label: "Taux de fréquence par entreprise" },
  });
  const { darkMode } = useTheme();
  const [selectedYears, setSelectedYears] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [workerTypes, setWorkerTypes] = useState([]);
  const [selectedWorkerTypes, setSelectedWorkerTypes] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [assureurStatus, setAssureurStatus] = useState([]);
  const [selectedAssureurStatus, setSelectedAssureurStatus] = useState([]);
  const [accidentTypes, setAccidentTypes] = useState([]);
  const [selectedAccidentTypes, setSelectedAccidentTypes] = useState([]);
  const [detailedTfData, setDetailedTfData] = useState([]);

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
  }, [allYears, workerTypes, sectors, assureurStatus, accidentTypes]);

  // useEffect pour la sauvegarde
  useEffect(() => {
    if (allYears.length > 0 && workerTypes.length > 0 && sectors.length > 0) {
      saveFiltersToCookies({
        selectedYears,
        selectedWorkerTypes,
        selectedSectors,
        selectedAssureurStatus,
        selectedAccidentTypes,
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
    accidentTypes
  ]);


  const loadDetailedTfData = async () => {
    try {
      const response = await axios.get(`http://${config.apiUrl}:3100/api/questionnaires`);
      const tfDataByCompany = {};

      response.data.forEach(questionnaire => {
        if (questionnaire.resultTf && questionnaire.entrepriseName && questionnaire.annees) {
          if (!tfDataByCompany[questionnaire.entrepriseName]) {
            tfDataByCompany[questionnaire.entrepriseName] = [];
          }

          questionnaire.annees.forEach(annee => {
            tfDataByCompany[questionnaire.entrepriseName].push({
              year: annee,
              tf: parseFloat(questionnaire.resultTf),
              heuresPreste: parseFloat(questionnaire.valueATf || 0),
              accidents: parseFloat(questionnaire.valueBTf || 0)
            });
          });
        }
      });

      // Transformer les données pour le format attendu par le composant
      const transformedData = Object.entries(tfDataByCompany).map(([company, data]) => ({
        company,
        data: data.sort((a, b) => a.year - b.year)
      }));

      setDetailedTfData(transformedData);
    } catch (error) {
      console.error('Erreur lors du chargement des données Tf:', error);
    }
  };

  // Ajoutez cette nouvelle fonction pour charger les données Tf
  const loadTfData = async () => {
    try {
      const response = await axios.get(`http://${config.apiUrl}:3100/api/questionnaires`);
      const tfDataByCompany = {};

      response.data.forEach(questionnaire => {
        if (questionnaire.resultTf && questionnaire.entrepriseName && questionnaire.annees) {
          questionnaire.annees.forEach(annee => {
            if (!tfDataByCompany[questionnaire.entrepriseName]) {
              tfDataByCompany[questionnaire.entrepriseName] = {};
            }
            tfDataByCompany[questionnaire.entrepriseName][annee] = parseFloat(questionnaire.resultTf);
          });
        }
      });

      // Transformation des données pour le graphique
      const transformedData = Object.entries(tfDataByCompany).map(([company, yearData]) => ({
        company,
        ...yearData
      }));

      setTfData(transformedData);
    } catch (error) {
      console.error('Erreur lors du chargement des données Tf:', error);
    }
  };

  useEffect(() => {
    loadTfData();
    loadDetailedTfData();
  }, []);

  const stats = useAccidentStats(
    data,
    selectedYears,
    selectedWorkerTypes,
    selectedSectors,
    selectedAssureurStatus,
    selectedAccidentTypes,
    accidentTypes
  );

  useEffect(() => {
    /**
     * Initialise les données nécessaires pour les statistiques d'accidents.
     * 
     * Cette fonction charge les données à l'aide de la fonction `chargerDonnees`
     * et met à jour les états avec les données reçues, notamment:
     * - `data`: les données des accidents
     * - `allYears`: toutes les années disponibles dans les données
     * - `selectedYears`: les années sélectionnées pour le filtrage
     * - `workerTypes`: les types de travailleurs
     * - `selectedWorkerTypes`: les types de travailleurs sélectionnés pour le filtrage
     * - `sectors`: les secteurs d'activité
     * - `selectedSectors`: les secteurs sélectionnés pour le filtrage
     * - `assureurStatus`: les statuts assureur
     * - `selectedAssureurStatus`: les statuts assureur sélectionnés pour le filtrage
     * - `accidentTypes`: les types d'accidents
     * - `selectedAccidentTypes`: les types d'accidents sélectionnés pour le filtrage
     * 
     * En cas d'erreur lors du chargement des données, elle est capturée et 
     * affichée dans la console.
     */
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
          setSelectedAccidentTypes
        });
      } catch (erreur) {
        console.error('Erreur lors de l\'initialisation:', erreur);
        // Gérer l'erreur ici si nécessaire
      }
    };

    initialiserDonnees();
  }, []);

  /**
   * Met à jour les années sélectionnées en fonction de la nouvelle valeur reçue via l'événement de changement.
   * Si la valeur inclut 'All', met à jour la sélection en fonction de la longueur de allYears.
   * Sinon, met à jour la sélection en fonction de la valeur reçue.
   * 
   * @param {Event} event - L'événement de changement contenant la nouvelle valeur
   */
  const handleChangeYearsFilter = (event) => {
    const value = event.target.value;
    if (value.includes('All')) {
      setSelectedYears(selectedYears.length === allYears.length ? [] : allYears.map(yearData => yearData.annee));
    } else {
      setSelectedYears(value);
    }
  };

  /**
   * Updates the visibility of graphs based on the selected values from a filter.
   * If 'All' is included in the selected values, toggles the visibility of all graphs.
   * Otherwise, sets the visibility of each graph according to whether it is included in the selected values.
   * 
   * @param {Event} event - The change event containing new filter values.
   */
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

  /**
   * Met à jour les types de travailleurs sélectionnés en fonction de la nouvelle valeur reçue via l'événement de changement.
   * Si la valeur inclut 'all', met à jour la sélection en fonction de la longueur de workerTypes.
   * Sinon, met à jour la sélection en fonction de la valeur reçue.
   * 
   * @param {Event} event - L'événement de changement contenant la nouvelle valeur
   */
  const handleChangeWorkerTypesFilter = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedWorkerTypes(selectedWorkerTypes.length === workerTypes.length ? [] : workerTypes);
    } else {
      setSelectedWorkerTypes(value);
    }
  };

  /**
   * Met à jour les secteurs sélectionnés en fonction de la nouvelle valeur reçue via l'événement de changement.
   * Si la valeur inclut 'all', met à jour la sélection en fonction de la longueur de sectors.
   * Sinon, met à jour la sélection en fonction de la valeur reçue.
   */
  const handleChangeSectorsFilter = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedSectors(selectedSectors.length === sectors.length ? [] : sectors);
    } else {
      setSelectedSectors(value);
    }
  };

  /**
   * Updates the selected AssureurStatus based on the new value received from the change event.
   * If the value includes 'all', it toggles the selection between all and none.
   * Otherwise, it updates the selection to the specified value.
   * 
   * @param {Event} event - The change event containing the new values for AssureurStatus.
   */
  const handleChangeAssureurStatus = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedAssureurStatus(selectedAssureurStatus.length === assureurStatus.length ? [] : assureurStatus);
    } else {
      setSelectedAssureurStatus(value);
    }
  };

  /**
   * Updates the selected AccidentTypes based on the new value received from the change event.
   * If the value includes 'all', it toggles the selection between all and none.
   * Otherwise, it updates the selection to the specified value.
   * 
   * @param {Event} event - The change event containing the new values for AccidentTypes.
   */
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
    width: 'calc(33.33% - 7px)',
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
      backgroundColor: darkMode ? '#424242' : '#ee742d59', // Même couleur que l'état normal
  },
  '&.Mui-selected:hover': {
      backgroundColor: darkMode ? '#505050' : '#ee742d80' // Même couleur que le hover normal
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
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
              <Checkbox checked={selectedAccidentTypes.length === accidentTypes.length} sx={checkboxStyles.all}/>
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {accidentTypes.map((type) => (
              <MenuItem key={type} value={type} sx={menuItemStyle}>
                <Checkbox checked={selectedAccidentTypes.includes(type)} sx={checkboxStyles.default}/>
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
            onChange={(event) => {
              const value = event.target.value;
              const lastSelected = value[value.length - 1];

              // Fonction pour obtenir les années avec accidents
              const getAccidentYears = () => allYears.filter(year =>
                data.some(accident => new Date(accident.DateHeureAccident).getFullYear() === year)
              );

              // Fonction pour obtenir les années avec TF
              const getTfYears = () => allYears.filter(year =>
                tfData.some(tf => Object.keys(tf).some(key => key !== 'company' && parseInt(key) === year))
              );

              if (lastSelected === 'All') {
                // Sélectionner/désélectionner toutes les années
                setSelectedYears(selectedYears.length === allYears.length ? [] : allYears);
              } else if (lastSelected === 'AllAccidents') {
                const accidentYears = getAccidentYears();
                setSelectedYears(accidentYears); // Remplacer la sélection actuelle par les années d'accidents
              } else if (lastSelected === 'AllTF') {
                const tfYears = getTfYears();
                setSelectedYears(tfYears); // Remplacer la sélection actuelle par les années TF
              } else {
                // Sélection normale d'années individuelles
                setSelectedYears(value.filter(v => v !== 'All' && v !== 'AllAccidents' && v !== 'AllTF'));
              }
            }}
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
      <div className="flex flex-col items-center justify-center h-full mb-8">
        <h2 className="text-center">Total des accidents</h2>
        <p className="text-3xl font-bold text-center">{stats.totalAccidents}</p>
      </div>

      {/* Partie graphiques */}
      {graphs.accidentsBySex.visible && renderOptimizedChart('pie',
        memoizedChartData.accidentsBySexData,
        getRenderConfig('pie', memoizedChartData.accidentsBySexData, {
          title: "Accidents par sexe"
        })
      )}

      {graphs.accidentsByTypeTravailleur.visible && renderOptimizedChart('bar',
        memoizedChartData.accidentsByTypeTravailleurData,
        getRenderConfig('bar', memoizedChartData.accidentsByTypeTravailleurData, {
          title: "Nombre d'accidents par type de travailleur",
          xAxis: "type",
          fill: "#82ca9d"
        })
      )}

      {graphs.accidentsByAge.visible && renderOptimizedChart('bar',
        memoizedChartData.accidentsByAgeData,
        getRenderConfig('bar', memoizedChartData.accidentsByAgeData, {
          title: "Nombre d'accidents par âge du travailleur",
          xAxis: "age",
          fill: "#8884d8"
        })
      )}

      {graphs.accidentsByDayOfWeek.visible && renderOptimizedChart('bar',
        memoizedChartData.accidentDayOfWeekData,
        getRenderConfig('bar', memoizedChartData.accidentDayOfWeekData, {
          title: "Accidents par jour de la semaine",
          xAxis: "day",
          fill: "#FFBB28"
        })
      )}

      {graphs.accidentsByMonth.visible && renderOptimizedChart('bar',
        memoizedChartData.accidentMonthData,
        getRenderConfig('bar', memoizedChartData.accidentMonthData, {
          title: "Nombre total d'accidents par mois",
          xAxis: "month",
          fill: "#82ca9d"
        })
      )}

      {graphs.accidentsByYear.visible && renderOptimizedChart('bar',
        memoizedChartData.accidentYearData,
        getRenderConfig('bar', memoizedChartData.accidentYearData, {
          title: "Nombre total d'accidents par an",
          xAxis: "year",
          fill: "#ffc658"
        })
      )}

      {graphs.accidentsBySector.visible && renderOptimizedChart('pie',
        memoizedChartData.accidentSectorData,
        getRenderConfig('pie', memoizedChartData.accidentSectorData, {
          title: "Accidents par secteur"
        })
      )}

      {graphs.accidentsByYearAndCompany.visible && renderOptimizedChart('line',
        memoizedChartData.accidentYearByCompanyData,
        getRenderConfig('line', memoizedChartData.accidentYearByCompanyData, {
          title: "Accidents par an et par entreprise",
          xAxis: "year",
          series: Object.keys(stats.accidentsByYearByCompany)
        })
      )}

      {graphs.accidentsByMonthAndCompany.visible && renderOptimizedChart('line',
        memoizedChartData.accidentMonthByCompanyData,
        getRenderConfig('line', memoizedChartData.accidentMonthByCompanyData, {
          title: "Accidents par mois et par entreprise",
          xAxis: "month",
          series: Object.keys(stats.accidentsByMonthByCompany)
        })
      )}

      {graphs.tfByYearAndCompany.visible && tfData.length > 0 && renderOptimizedChart(
        'tfYearCompany',
        null,
        getRenderConfig('tfYearCompany', null, {
          data: tfData,
          selectedYears: selectedYears
        })
      )}

      {graphs.accidentsByCompanyAndSector.visible && renderOptimizedChart(
        'accidentSectorCompany',
        null,
        getRenderConfig('accidentSectorCompany', null, {
          title: "Accidents par entreprise par secteur",
          companies: Object.keys(stats.accidentsByCompany).map(companyName => ({
            company: companyName,
            data: stats.accidentsByCompany[companyName]
          }))
        })
      )}

      {graphs.accidentsByDayOfWeekAndCompany.visible && renderOptimizedChart(
        'dayOfWeekCompany',
        null,
        getRenderConfig('dayOfWeekCompany', null, {
          data: memoizedChartData.accidentsByDayOfWeekByCompanyData
        })
      )}

      {graphs.accidentsByAgeByCompany.visible && renderOptimizedChart('ageByCompany',
        null,
        getRenderConfig('ageByCompany', null, {
          title: "Accidents par âge du travailleur et par entreprise",
          companies: memoizedChartData.accidentsByAgeByCompanyData
        })
      )}

      {graphs.accidentsByTypeTravailleurByCompany.visible && renderOptimizedChart('workerTypeByCompany',
        null,
        getRenderConfig('workerTypeByCompany', null, {
          title: "Accidents par type de travailleur et par entreprise",
          companies: Object.entries(stats.accidentsByTypeTravailleurByCompany).map(([company, typeTravailleurData]) => ({
            company,
            data: Object.entries(typeTravailleurData).map(([typeTravailleur, NombreAT]) => ({
              typeTravailleur,
              NombreAT
            }))
          }))
        })
      )}

      {graphs.tfByCompany.visible && renderOptimizedChart('tfByCompany',
        null,
        getRenderConfig('tfByCompany', null, {
          companies: detailedTfData,
          selectedYears: selectedYears
        })
      )}

      <div className="image-cortigroupe"></div>
      <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Statistiques;