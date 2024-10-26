import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
   PieChart, Pie, Cell, Tooltip
} from 'recharts';
import {
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box
} from '@mui/material';
import { useAccidentStats } from './filters';
import chargerDonnees from './dataLoader';
import genererDonneesGraphiques, { MONTHS, DAYS } from './chartData';
import { renderOptimizedChart, getRenderConfig, COLORS } from './chartComponents';

/**
 * Affiche les graphiques des accidents de travail par type de travailleur, âge, jour de la semaine, mois, an, secteur et par entreprise.
 * 
 * @param {Object} props - Les propriétés reçues en entrée.
 * 
 * @returns {React.ReactElement} - Le composant react qui affiche les graphiques.
 */
const Statistiques = () => {
  const [data, setData] = useState([]);

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
  });

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
      setSelectedYears(value.length === allYears.length + 1 ? [] : allYears);
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

  const isAllSelected = selectedWorkerTypes.length === workerTypes.length;
  const isAllSectorsSelected = selectedSectors.length === sectors.length;
  return (
    <div className="col-span-full" style={{ margin: '20px' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <FormControl sx={{ width: 'calc(33.33% - 7px)', minWidth: '200px' }}>
          <InputLabel id="accident-types-label">Type d'accident</InputLabel>
          <Select
            sx={{ backgroundColor: '#ee742d59' }}
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
            <MenuItem value="all" style={{ backgroundColor: '#ee742d59' }}>
              <Checkbox checked={selectedAccidentTypes.length === accidentTypes.length} style={{ color: 'red' }} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {accidentTypes.map((type) => (
              <MenuItem key={type} value={type} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={selectedAccidentTypes.includes(type)} style={{ color: '#257525' }} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 'calc(33.33% - 7px)', minWidth: '200px' }}>
          <InputLabel id="assureur-status-label">Statut Assureur</InputLabel>
          <Select
            sx={{ backgroundColor: '#ee742d59' }}
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
            <MenuItem value="all" style={{ backgroundColor: '#ee742d59' }}>
              <Checkbox checked={selectedAssureurStatus.length === assureurStatus.length} style={{ color: 'red' }} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {assureurStatus.map((status) => (
              <MenuItem key={status} value={status} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={selectedAssureurStatus.includes(status)} style={{ color: '#257525' }} />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 'calc(33.33% - 7px)', minWidth: '200px' }}>
          <InputLabel id="years-label">Année</InputLabel>
          <Select
            sx={{ backgroundColor: '#ee742d59' }}
            labelId="years-label"
            id="years-select"
            multiple
            value={selectedYears}
            onChange={handleChangeYearsFilter}
            renderValue={(selected) => `${selected.length} année(s)`}
            MenuProps={{
              PaperProps: { style: { maxHeight: 300, overflow: 'auto' } },
            }}
          >
            <MenuItem key="All" value="All" style={{ backgroundColor: '#ee742d59' }}>
              <Checkbox checked={selectedYears.length === allYears.length} style={{ color: 'red' }} />
              <ListItemText primary="All" />
            </MenuItem>
            {allYears.filter(Boolean).sort((a, b) => a - b).map((year) => (
              <MenuItem key={year} value={year} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={selectedYears.includes(year)} style={{ color: '#257525' }} />
                <ListItemText primary={year} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 'calc(33.33% - 7px)', minWidth: '200px' }}>
          <InputLabel id="graphs-label">Graphiques</InputLabel>
          <Select
            sx={{ backgroundColor: '#ee742d59' }}
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
            <MenuItem key="All" value="All" style={{ backgroundColor: '#ee742d59' }}>
              <Checkbox checked={Object.values(graphs).every(({ visible }) => visible)} style={{ color: 'red' }} />
              <ListItemText primary="All" />
            </MenuItem>
            {Object.entries(graphs).map(([key, { label, visible }]) => (
              <MenuItem key={key} value={key} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={visible} style={{ color: '#257525' }} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 'calc(33.33% - 7px)', minWidth: '200px' }}>
          <InputLabel id="worker-types-label">Type de travailleur</InputLabel>
          <Select
            sx={{ backgroundColor: '#ee742d59' }}
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
            <MenuItem value="all" style={{ backgroundColor: '#ee742d59' }}>
              <Checkbox checked={isAllSelected} style={{ color: 'red' }} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {workerTypes.map((type, index) => (
              <MenuItem key={index} value={type} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={selectedWorkerTypes.includes(type)} style={{ color: '#257525' }} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 'calc(33.33% - 7px)', minWidth: '200px' }}>
          <InputLabel id="sectors-label">Secteurs</InputLabel>
          <Select
            sx={{ backgroundColor: '#ee742d59' }}
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
            <MenuItem value="all" style={{ backgroundColor: '#ee742d59' }}>
              <Checkbox checked={isAllSectorsSelected} style={{ color: 'red' }} />
              <ListItemText primary="Sélectionner tout" />
            </MenuItem>
            {sectors.map((sector) => (
              <MenuItem key={sector} value={sector} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={selectedSectors.includes(sector)} style={{ color: '#257525' }} />
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

      {graphs.accidentsByCompanyAndSector.visible && renderOptimizedChart('company',
        null,
        getRenderConfig('company', null, {
          title: "Accidents par entreprise par secteur",
          component: PieChart,
          companies: Object.keys(stats.accidentsByCompany).map(companyName => ({
            company: companyName,
            data: stats.accidentsByCompany[companyName]
          })),
          renderData: (data) => ({
            component: PieChart,
            chartContent: (
              <Pie
                data={Object.entries(data).map(([sector, NombreAT]) => ({
                  name: sector,
                  value: NombreAT
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {Object.entries(data).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            )
          })
        })
      )}

      {graphs.accidentsByDayOfWeekAndCompany.visible && (
        <div className="text-center">
          <h2>Accidents par jour de la semaine par entreprise</h2>
          <div className="flex flex-wrap justify-center">
            {memoizedChartData.accidentsByDayOfWeekByCompanyData.map(({ company, data }) => (
              <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-xl font-bold text-center">{company}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="NombreAT" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {graphs.accidentsByAgeByCompany.visible && (
        <div className="text-center">
          <h2>Accidents par âge du travailleur et par entreprise</h2>
          <div className="flex flex-wrap justify-center">
            {memoizedChartData.accidentsByAgeByCompanyData.map(({ company, data }) => (
              <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-xl font-bold text-center">{company}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="NombreAT" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {graphs.accidentsByTypeTravailleurByCompany.visible && (
        <div className="text-center">
          <h2>Accidents par type de travailleur et par entreprise</h2>
          <div className="flex flex-wrap justify-center">
            {Object.entries(stats.accidentsByTypeTravailleurByCompany).map(([companyName, typeTravailleurData]) => (
              <div key={companyName} className="my-4 w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-xl font-bold text-center">{companyName}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(typeTravailleurData).map(([typeTravailleur, NombreAT]) => ({
                      typeTravailleur,
                      NombreAT
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="typeTravailleur" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="NombreAT" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="image-cortigroupe"></div>
      <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Statistiques;