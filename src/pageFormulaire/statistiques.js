import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Grid, Box
} from '@mui/material';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const Statistiques = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalAccidents: 0,
    accidentsByType: {},
    accidentsByMonth: {},
    accidentsByYear: {},
    accidentsByMonthByCompany: {},
    accidentsByYearByCompany: {},
    accidentsBySex: {},
    accidentsBySector: {},
    accidentsByCompany: {},
    accidentsByDayOfWeek: {},
    accidentsByDayOfWeekByCompany: {},
    accidentsByAge: {},
    accidentsByAgeByCompany: {},
    accidentsByTypeTravailleur: {},
    accidentsByTypeTravailleurByCompany: {},
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'localhost';
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents`);
        setData(response.data);
        const years = [...new Set(response.data.map(accident => new Date(accident.DateHeureAccident).getFullYear()))];
        setAllYears(years);
        const currentYear = new Date().getFullYear();
        setSelectedYears(years.includes(currentYear) ? [currentYear] : [years[years.length - 1]]);
        const types = [...new Set(response.data.map(accident => accident.typeTravailleur))];
        setWorkerTypes(types);
        setSelectedWorkerTypes(types);
        const extractedSectors = [...new Set(response.data.map(accident => accident.secteur))];
        setSectors(extractedSectors);
        setSelectedSectors(extractedSectors);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter(accident => {
        const accidentYear = new Date(accident.DateHeureAccident).getFullYear();
        return selectedYears.includes(accidentYear) &&
          selectedWorkerTypes.includes(accident.typeTravailleur) &&
          selectedSectors.includes(accident.secteur);
      });

      const newStats = {
        totalAccidents: filteredData.length,
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
      };

      const calculateAge = (birthDate, accidentDate) => {
        let age = accidentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = accidentDate.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && accidentDate.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      // Comptage des accidents par type de travailleur
      filteredData.forEach((accident) => {
        const { DateHeureAccident, entrepriseName, sexe, secteur, dateNaissance } = accident;
        const typeAccident = accident.typeAccident || 'Non spécifié';
        const date = new Date(DateHeureAccident);
        const month = date.getMonth();
        const year = date.getFullYear();
        const dayOfWeek = date.getDay();
        const companyName = entrepriseName || 'Inconnue';
        const typeTravailleur = accident.typeTravailleur || 'Non spécifié';

        if (dateNaissance && DateHeureAccident) {
          const birthDate = new Date(dateNaissance);
          const accidentDate = new Date(DateHeureAccident);
          const age = calculateAge(birthDate, accidentDate);
          newStats.accidentsByAge[age] = (newStats.accidentsByAge[age] || 0) + 1;
          if (!newStats.accidentsByAgeByCompany[companyName]) {
            newStats.accidentsByAgeByCompany[companyName] = {};
          }
          newStats.accidentsByAgeByCompany[companyName][age] = (newStats.accidentsByAgeByCompany[companyName][age] || 0) + 1;
          if (!newStats.accidentsByTypeTravailleurByCompany[companyName]) {
            newStats.accidentsByTypeTravailleurByCompany[companyName] = {};
          }
          newStats.accidentsByTypeTravailleurByCompany[companyName][typeTravailleur] =
            (newStats.accidentsByTypeTravailleurByCompany[companyName][typeTravailleur] || 0) + 1;
        }

        // Increment counters
        newStats.accidentsByTypeTravailleur[typeTravailleur] = (newStats.accidentsByTypeTravailleur[typeTravailleur] || 0) + 1;
        newStats.accidentsByType[typeAccident] = (newStats.accidentsByType[typeAccident] || 0) + 1;
        newStats.accidentsByMonth[month] = (newStats.accidentsByMonth[month] || 0) + 1;
        newStats.accidentsByYear[year] = (newStats.accidentsByYear[year] || 0) + 1;
        newStats.accidentsByDayOfWeek[dayOfWeek] = (newStats.accidentsByDayOfWeek[dayOfWeek] || 0) + 1;

        // Company specific stats
        newStats.accidentsByYearByCompany[companyName] = newStats.accidentsByYearByCompany[companyName] || {};
        newStats.accidentsByYearByCompany[companyName][year] = (newStats.accidentsByYearByCompany[companyName][year] || 0) + 1;
        newStats.accidentsByMonthByCompany[companyName] = newStats.accidentsByMonthByCompany[companyName] || {};
        newStats.accidentsByMonthByCompany[companyName][month] = (newStats.accidentsByMonthByCompany[companyName][month] || 0) + 1;
        newStats.accidentsByDayOfWeekByCompany[companyName] = newStats.accidentsByDayOfWeekByCompany[companyName] || { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        newStats.accidentsByDayOfWeekByCompany[companyName][dayOfWeek] = (newStats.accidentsByDayOfWeekByCompany[companyName][dayOfWeek] || 0) + 1;

        if (sexe === 'Masculin' || sexe === 'Féminin') {
          newStats.accidentsBySex[sexe] += 1;
        }

        const sector = secteur || 'Non spécifié';
        newStats.accidentsBySector[sector] = (newStats.accidentsBySector[sector] || 0) + 1;
        newStats.accidentsByCompany[companyName] = newStats.accidentsByCompany[companyName] || {};
        newStats.accidentsByCompany[companyName][sector] = (newStats.accidentsByCompany[companyName][sector] || 0) + 1;
      });

      setStats(newStats);
    }
  }, [data, selectedYears, selectedWorkerTypes, selectedSectors]);

  const [allChecked, setAllChecked] = useState(true);
  const handleChangeYearsFilter = (event) => {
    const value = event.target.value;
    if (value.includes('All')) {
      setSelectedYears(value.length === allYears.length + 1 ? [] : allYears);
    } else {
      setSelectedYears(value);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <FormControl sx={{ width: '30%', minWidth: '200px' }}>
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

        <FormControl sx={{ width: '30%', minWidth: '200px' }}>
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

        <FormControl sx={{ width: '30%', minWidth: '200px' }}>
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
            {workerTypes.map((type) => (
              <MenuItem key={type} value={type} style={{ backgroundColor: '#ee742d59' }}>
                <Checkbox checked={selectedWorkerTypes.includes(type)} style={{ color: '#257525' }} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 'calc(25% - 15px)', minWidth: '200px' }}>
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