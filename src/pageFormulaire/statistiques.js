import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';


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
    accidentsByDayOfWeekByCompany: {}, // Nouveau champ pour accidents par jour de la semaine par entreprise
  });

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
      const totalAccidents = data.length;
      const accidentsByType = {};
      const accidentsByMonth = {};
      const accidentsByYear = {};
      const accidentsByYearByCompany = {};
      const accidentsByMonthByCompany = {};
      const accidentsBySex = { Masculin: 0, Féminin: 0 };
      const accidentsBySector = {};
      const accidentsByCompany = {};
      const accidentsByDayOfWeek = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const accidentsByDayOfWeekByCompany = {}; // Nouveau

      data.forEach((accident) => {
        accidentsByType[accident.typeAccident] = (accidentsByType[accident.typeAccident] || 0) + 1;

        const month = new Date(accident.DateHeureAccident).getMonth();
        accidentsByMonth[month] = (accidentsByMonth[month] || 0) + 1;

        const year = new Date(accident.DateHeureAccident).getFullYear();
        accidentsByYear[year] = (accidentsByYear[year] || 0) + 1;

        const companyName = accident.entrepriseName || 'Inconnue';
        if (!accidentsByYearByCompany[companyName]) {
          accidentsByYearByCompany[companyName] = {};
        }
        accidentsByYearByCompany[companyName][year] = (accidentsByYearByCompany[companyName][year] || 0) + 1;

        if (!accidentsByMonthByCompany[companyName]) {
          accidentsByMonthByCompany[companyName] = {};
        }
        accidentsByMonthByCompany[companyName][month] = (accidentsByMonthByCompany[companyName][month] || 0) + 1;

        if (accident.sexe === 'Masculin' || accident.sexe === 'Féminin') {
          accidentsBySex[accident.sexe] += 1;
        }

        const sector = accident.secteur || 'Non spécifié';
        accidentsBySector[sector] = (accidentsBySector[sector] || 0) + 1;

        if (!accidentsByCompany[companyName]) {
          accidentsByCompany[companyName] = {};
        }
        accidentsByCompany[companyName][sector] = (accidentsByCompany[companyName][sector] || 0) + 1;

        const dayOfWeek = new Date(accident.DateHeureAccident).getDay();
        accidentsByDayOfWeek[dayOfWeek] = (accidentsByDayOfWeek[dayOfWeek] || 0) + 1;

        // Enregistrement des accidents par jour de la semaine et par entreprise
        if (!accidentsByDayOfWeekByCompany[companyName]) {
          accidentsByDayOfWeekByCompany[companyName] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        }
        accidentsByDayOfWeekByCompany[companyName][dayOfWeek] =
          (accidentsByDayOfWeekByCompany[companyName][dayOfWeek] || 0) + 1;
      });

      setStats({
        totalAccidents,
        accidentsByType,
        accidentsByMonth,
        accidentsByYear,
        accidentsByMonthByCompany,
        accidentsByYearByCompany,
        accidentsBySex,
        accidentsBySector,
        accidentsByCompany,
        accidentsByDayOfWeek,
        accidentsByDayOfWeekByCompany, // Nouveau
      });
    }
  }, [data]);


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
    accidentsByMonth: "Nombre total d'accidents par mois",
    accidentsByYear: "Nombre total d'accidents par an",
    accidentsByYearAndCompany: "Accidents par an et par entreprise",
    accidentsByMonthAndCompany: "Accidents par mois et par entreprise",
    accidentsBySector: "Accidents par secteur",
    accidentsByCompanyAndSector: "Accidents par entreprise par secteur",
    accidentsByDayOfWeekAndCompany: "Accidents par jour de la semaine par entreprise",
  };

  const monthsNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  const accidentTypeData = Object.entries(stats.accidentsByType).map(([type, NombreAT], index) => ({
    type,
    NombreAT,
    id: `type-${index}`,
  }));

  const accidentMonthData = Object.entries(stats.accidentsByMonth).map(([month, NombreAT], index) => ({
    month: monthsNames[parseInt(month)],
    NombreAT,
    id: `month-${index}`,
  }));

  const accidentYearData = Object.entries(stats.accidentsByYear).map(([year, NombreAT], index) => ({
    year: year.toString(),
    NombreAT,
    id: `year-${index}`,
  }));

  const accidentMonthByCompanyData = Object.keys(stats.accidentsByMonth).map((month) => {
    const row = { month: monthsNames[month] };
    Object.keys(stats.accidentsByMonthByCompany).forEach((companyName) => {
      row[companyName] = stats.accidentsByMonthByCompany[companyName][month] || 0;
    });
    return row;
  });

  const accidentYearByCompanyData = Object.keys(stats.accidentsByYear).map((year) => {
    const row = { year };
    Object.keys(stats.accidentsByYearByCompany).forEach((companyName) => {
      row[companyName] = stats.accidentsByYearByCompany[companyName][year] || 0;
    });
    return row;
  });

  const accidentsBySexData = Object.entries(stats.accidentsBySex).map(([sexe, NombreAT]) => ({
    name: sexe,
    value: NombreAT,
  }));

  const accidentSectorData = Object.entries(stats.accidentsBySector).map(([sector, NombreAT], index) => ({
    name: sector,
    value: NombreAT,
  }));

  const accidentCompanyData = [];
  for (const company in stats.accidentsByCompany) {
    for (const sector in stats.accidentsByCompany[company]) {
      accidentCompanyData.push({
        name: `${company} - ${sector}`,
        value: stats.accidentsByCompany[company][sector],
      });
    }
  }

  const accidentDayOfWeekData = Object.entries(stats.accidentsByDayOfWeek).map(([day, NombreAT]) => ({
    day: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][parseInt(day)],
    NombreAT,
  }));

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

  const toggleGraphVisibility = (graphName) => {
    setVisibleGraphs(prev => ({ ...prev, [graphName]: !prev[graphName] }));
  };

  return (
    <div className="col-span-full">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-center">Total des accidents</h2>
        <p className="text-3xl font-bold text-center">{stats.totalAccidents}</p>
      </div>

      <div className="mb-8 ml-4"> {/* Ajout de la marge à gauche (ml-4) */}
        <h3 className="text-lg font-semibold mb-4">Afficher/Masquer les graphiques :</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(visibleGraphs).map(([graphName, isVisible]) => (
            <label key={graphName} className=" items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => toggleGraphVisibility(graphName)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">{graphLabels[graphName]}</span>
            </label>
          ))}
        </div>
      </div>

      {visibleGraphs.accidentsBySex && (
        <div className="col-span-full">
          <h2>Accidents par sexe</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accidentsBySexData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {accidentsBySexData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {visibleGraphs.accidentsByMonth && (
        <div className="col-span-full">
          <h2>Nombre total d'accidents par mois</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accidentMonthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="NombreAT" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {visibleGraphs.accidentsByYear && (
        <div className="col-span-full">
          <h2>Nombre total d'accidents par an</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accidentYearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="NombreAT" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {visibleGraphs.accidentsByYearAndCompany && (
        <div className="col-span-full">
          <h2>Accidents par an et par entreprise</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accidentYearByCompanyData}>
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
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {visibleGraphs.accidentsByMonthAndCompany && (
        <div className="col-span-full">
          <h2>Accidents par mois et par entreprise</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accidentMonthByCompanyData}>
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
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}


      {visibleGraphs.accidentsBySector && (
        <div className="col-span-full">
          <h2>Accidents par secteur</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accidentSectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {accidentSectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

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
            {Object.keys(stats.accidentsByDayOfWeekByCompany).map((companyName) => {
              const companyDayOfWeekData = Object.entries(stats.accidentsByDayOfWeekByCompany[companyName]).map(
                ([day, NombreAT]) => ({
                  day: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][parseInt(day)],
                  NombreAT,
                })
              );

              return (
                <div key={companyName} className="my-4 w-full md:w-1/2 lg:w-1/3">
                  <h3 className="text-xl font-bold text-center">{companyName}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={companyDayOfWeekData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="NombreAT" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="image-cortigroupe"></div>
      <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Statistiques;