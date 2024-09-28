import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

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
  });
  const [visibleGraphs, setVisibleGraphs] = useState({
    accidentsBySex: true,
    accidentsByMonth: true,
    accidentsByYear: true,
    accidentsByYearAndCompany: true,
    accidentsByMonthAndCompany: true,
    accidentsBySector: true,
    accidentsByCompanyAndSector: true,
    accidentsByDayOfWeekAndCompany: true,
  });
  const graphLabels = {
    accidentsBySex: "Accidents par sexe",
    accidentsByMonth: "Accidents par mois",
    accidentsByYear: "Accidents par an",
    accidentsByYearAndCompany: "Accidents par an et par entreprise",
    accidentsByMonthAndCompany: "Accidents par mois et par entreprise",
    accidentsBySector: "Accidents par secteur",
    accidentsByCompanyAndSector: "Accidents par entreprise et secteur",
    accidentsByDayOfWeekAndCompany: "Accidents par jour et par entreprise",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'localhost';
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents`);
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const newStats = {
        totalAccidents: data.length,
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
      };

      data.forEach((accident) => {
        const { typeAccident, DateHeureAccident, entrepriseName, sexe, secteur } = accident;
        const date = new Date(DateHeureAccident);
        const month = date.getMonth();
        const year = date.getFullYear();
        const dayOfWeek = date.getDay();
        const companyName = entrepriseName || 'Inconnue';

        // Increment counters
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
  }, [data]);

  const toggleGraphVisibility = useCallback((graphName) => {
    setVisibleGraphs(prev => ({ ...prev, [graphName]: !prev[graphName] }));
  }, []);

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
    }))
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

  return (
    <div className="col-span-full">
      <div className="flex flex-col items-center justify-center h-full mb-8">
        <h2 className="text-center">Total des accidents</h2>
        <p className="text-3xl font-bold text-center">{stats.totalAccidents}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Afficher/Masquer les graphiques :</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(visibleGraphs).map(([graphName, isVisible]) => (
            <label key={graphName} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => toggleGraphVisibility(graphName)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{graphLabels[graphName]}</span>
            </label>
          ))}
        </div>
      </div>

      {visibleGraphs.accidentsBySex && renderChart('pie', memoizedChartData.accidentsBySexData, {
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

      {visibleGraphs.accidentsByMonth && renderChart('bar', memoizedChartData.accidentMonthData, {
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

      {visibleGraphs.accidentsByYear && renderChart('bar', memoizedChartData.accidentYearData, {
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

      {visibleGraphs.accidentsByYearAndCompany && renderChart('line', memoizedChartData.accidentYearByCompanyData, {
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

      {visibleGraphs.accidentsByMonthAndCompany && renderChart('line', memoizedChartData.accidentMonthByCompanyData, {
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

      {visibleGraphs.accidentsBySector && renderChart('pie', memoizedChartData.accidentSectorData, {
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

      {visibleGraphs.accidentsByCompanyAndSector && (
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

      {visibleGraphs.accidentsByDayOfWeekAndCompany && (
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

      <div className="image-cortigroupe"></div>
      <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Statistiques;