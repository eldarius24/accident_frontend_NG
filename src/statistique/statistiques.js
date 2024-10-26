import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import {
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box
} from '@mui/material';
import { filter, useAccidentStats } from './filters';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];



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
   * Fetches accident data from API and initializes filters with the fetched data.
   * The function sets the `data` state with the fetched data and initializes the
   * following filters with the fetched data:
   * - `allYears` and `selectedYears` with the years of the accidents
   * - `workerTypes` and `selectedWorkerTypes` with the types of workers
   * - `sectors` and `selectedSectors` with the sectors of the accidents
   * - `assureurStatus` and `selectedAssureurStatus` with the statuses of the accidents
   * - `accidentTypes` and `selectedAccidentTypes` with the types of accidents
   * @async
   */
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'localhost';
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents`);
        const rawData = response.data;
        setData(rawData);

        // Initialisation des filtres
        const years = [...new Set(rawData.map(accident =>
          new Date(accident.DateHeureAccident).getFullYear()
        ))];
        setAllYears(years);
        const currentYear = new Date().getFullYear();
        setSelectedYears(years.includes(currentYear) ? [currentYear] : [years[years.length - 1]]);

        const types = [...new Set(rawData.map(accident => accident.typeTravailleur))];
        setWorkerTypes(types);
        setSelectedWorkerTypes(types);

        const extractedSectors = [...new Set(rawData.map(accident => accident.secteur))];
        setSectors(extractedSectors);
        setSelectedSectors(extractedSectors);

        const uniqueAssureurStatus = [...new Set(rawData.map(accident =>
          accident.AssureurStatus
        ))].filter(Boolean);
        setAssureurStatus(uniqueAssureurStatus);
        setSelectedAssureurStatus(uniqueAssureurStatus);

        const uniqueTypes = [...new Set(rawData.map(accident =>
          accident.typeAccident || 'Non spécifié'
        ))];
        setAccidentTypes(uniqueTypes);
        setSelectedAccidentTypes(uniqueTypes);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
      }
    };

    fetchData();
  }, []);

  const [allChecked, setAllChecked] = useState(true);
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

  const memoizedChartData = useMemo(() => ({
    accidentsBySexData: Object.entries(stats.accidentsBySex).map(([sexe, NombreAT]) => ({ name: sexe, value: NombreAT })),
    accidentMonthData: Object.entries(stats.accidentsByMonth).map(([month, NombreAT]) => ({ month: MONTHS[parseInt(month)], NombreAT })),
    accidentYearData: Object.entries(stats.accidentsByYear).map(([year, NombreAT]) => ({ year: year.toString(), NombreAT })),
    accidentMonthByCompanyData: MONTHS.map((month, index) => ({
      month,
      ...Object.fromEntries(Object.entries(stats.accidentsByMonthByCompany).map(([company, data]) => [company, data[index] || 0]))
    })),
    accidentYearByCompanyData: Object.keys(stats.accidentsByYear).map(year => ({
      year,
      ...Object.fromEntries(Object.entries(stats.accidentsByYearByCompany).map(([company, data]) => [company, data[year] || 0]))
    })),
    accidentSectorData: Object.entries(stats.accidentsBySector).map(([sector, NombreAT]) => ({ name: sector, value: NombreAT })),
    accidentsByDayOfWeekByCompanyData: Object.entries(stats.accidentsByDayOfWeekByCompany).map(([company, data]) => ({
      company,
      data: Object.entries(data).map(([day, NombreAT]) => ({ day: DAYS[parseInt(day)], NombreAT }))
    })),
    accidentDayOfWeekData: DAYS.map((day, index) => ({
      day,
      NombreAT: stats.accidentsByDayOfWeek[index],
    })),
    accidentsByAgeByCompanyData: Object.entries(stats.accidentsByAgeByCompany).map(([company, ageData]) => ({
      company,
      data: Object.entries(ageData)
        .map(([age, NombreAT]) => ({ age: parseInt(age), NombreAT }))
        .sort((a, b) => a.age - b.age)
    })),
    accidentsByTypeTravailleurData: Object.entries(stats.accidentsByTypeTravailleur).map(([type, NombreAT]) => ({
      type, NombreAT
    })),
    accidentsByAgeData: Object.entries(stats.accidentsByAge)
      .map(([age, NombreAT]) => ({ age: parseInt(age), NombreAT }))
      .sort((a, b) => a.age - b.age)
  }), [stats]);


  /**
   * Rend une charte en fonction du type, des données et de la configuration.
   * 
   * @param {string} type - Le type de la charte (par exemple, "bar", "line", etc.)
   * @param {object[]} data - Les données à afficher sur la charte
   * @param {object} config - La configuration de la charte, qui inclut le composant de charte
   *                          à utiliser, la classe CSS pour le conteneur, le titre de la charte,
   *                          et les enfants à afficher dans le composant de charte.
   * 
   * @returns {ReactElement} La charte rendue
   */
  const renderChart = (type, data, config) => {
    const ChartComponent = config.component;
    return (
      <div className={config.className}>
        <h2>{config.title}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            {config.children}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

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

      {graphs.accidentsBySex.visible && renderChart('pie', memoizedChartData.accidentsBySexData, {
        component: PieChart,
        title: "Accidents par sexe",
        className: "col-span-full",
        children: (
          <>
            <Pie
              data={memoizedChartData.accidentsBySexData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {memoizedChartData.accidentsBySexData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </>
        )
      })}

      {graphs.accidentsByTypeTravailleur.visible && renderChart('bar', memoizedChartData.accidentsByTypeTravailleurData, {
        component: BarChart,
        title: "Nombre d'accidents par type de travailleur",
        className: "col-span-full",
        children: (
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NombreAT" fill="#82ca9d" />
          </>
        )
      })}

      {graphs.accidentsByAge.visible && renderChart('bar', memoizedChartData.accidentsByAgeData, {
        component: BarChart,
        title: "Nombre d'accidents par âge du travailleur",
        className: "col-span-full",
        children: (
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NombreAT" fill="#8884d8" />
          </>
        )
      })}
      {graphs.accidentsByDayOfWeek.visible && renderChart(BarChart, memoizedChartData.accidentDayOfWeekData, {
        component: BarChart,
        title: "Accidents par jour de la semaine",
        className: "col-span-full",
        children: (
          <>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="NombreAT" fill="#FFBB28" />
          </>
        )
      })}

      {graphs.accidentsByMonth.visible && renderChart('bar', memoizedChartData.accidentMonthData, {
        component: BarChart,
        title: "Nombre total d'accidents par mois",
        className: "col-span-full",
        children: (
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NombreAT" fill="#82ca9d" />
          </>
        )
      })}

      {graphs.accidentsByYear.visible && renderChart('bar', memoizedChartData.accidentYearData, {
        component: BarChart,
        title: "Nombre total d'accidents par an",
        className: "col-span-full",
        children: (
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NombreAT" fill="#ffc658" />
          </>
        )
      })}

      {graphs.accidentsBySector.visible && renderChart('pie', memoizedChartData.accidentSectorData, {
        component: PieChart,
        title: "Accidents par secteur",
        className: "col-span-full",
        children: (
          <>
            <Pie
              data={memoizedChartData.accidentSectorData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {memoizedChartData.accidentSectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </>
        )
      })}

      {graphs.accidentsByYearAndCompany.visible && renderChart('line', memoizedChartData.accidentYearByCompanyData, {
        component: LineChart,
        title: "Accidents par an et par entreprise",
        className: "col-span-full",
        children: (
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(stats.accidentsByYearByCompany).map((companyName, index) => (
              <Line
                key={companyName}
                type="monotone"
                dataKey={companyName}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </>
        )
      })}

      {graphs.accidentsByMonthAndCompany.visible && renderChart('line', memoizedChartData.accidentMonthByCompanyData, {
        component: LineChart,
        title: "Accidents par mois et par entreprise",
        className: "col-span-full",
        children: (
          <>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(stats.accidentsByMonthByCompany).map((companyName, index) => (
              <Line
                key={companyName}
                type="monotone"
                dataKey={companyName}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </>
        )
      })}

      {graphs.accidentsByCompanyAndSector.visible && (
        <div className="text-center">
          <h2>Accidents par entreprise par secteur</h2>
          <div className="col-span-full flex flex-wrap overflow-x-auto">
            {Object.keys(stats.accidentsByCompany).map((companyName) => (
              <div key={companyName} className="my-4 w-1/3 min-w-[300px]">
                <h3 className="text-xl font-bold text-center">{companyName}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.accidentsByCompany[companyName]).map(([sector, NombreAT]) => ({
                        name: sector,
                        value: NombreAT,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {Object.entries(stats.accidentsByCompany[companyName]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
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
                  <BarChart data={Object.entries(typeTravailleurData).map(([typeTravailleur, NombreAT]) => ({
                    typeTravailleur,
                    NombreAT
                  }))}>
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