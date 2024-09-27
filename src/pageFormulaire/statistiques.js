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
} from 'recharts';

const Statistiques = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalAccidents: 0,
    accidentsByType: {},
    accidentsByMonth: {},
    accidentsBySecteur: {},
    accidentsByYear: {},
    accidentsBySex: {}, // Accidents par sexe
    averageAgeOfWorkers: 0,
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
      const accidentsBySecteur = {};
      const accidentsByYear = {};
      const accidentsBySex = { Masculin: 0, Féminin: 0 }; // Mise à jour pour les valeurs "Masculin" et "Féminin"
      let totalAge = 0;

      data.forEach((accident) => {
        // Comptage par type d'accident
        accidentsByType[accident.typeAccident] = (accidentsByType[accident.typeAccident] || 0) + 1;

        // Comptage par mois
        const month = new Date(accident.DateHeureAccident).getMonth();
        accidentsByMonth[month] = (accidentsByMonth[month] || 0) + 1;

        // Comptage par secteur
        if (accident.secteur) {
          accidentsBySecteur[accident.secteur] = (accidentsBySecteur[accident.secteur] || 0) + 1;
        }

        // Comptage par année
        const year = new Date(accident.DateHeureAccident).getFullYear();
        accidentsByYear[year] = (accidentsByYear[year] || 0) + 1;

        // Comptage par sexe
        if (accident.sexe === 'Masculin') {
          accidentsBySex.Masculin += 1;
        } else if (accident.sexe === 'Féminin') {
          accidentsBySex.Féminin += 1;
        }

        // Calcul de l'âge moyen
        if (accident.dateNaissance) {
          const age = new Date().getFullYear() - new Date(accident.dateNaissance).getFullYear();
          totalAge += age;
        }
      });

      const averageAgeOfWorkers = totalAge / totalAccidents;

      setStats({
        totalAccidents,
        accidentsByType,
        accidentsByMonth,
        accidentsBySecteur,
        accidentsByYear,
        accidentsBySex, // Enregistrer les données par sexe
        averageAgeOfWorkers,
      });
    }
  }, [data]);

  const monthsNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  const accidentTypeData = Object.entries(stats.accidentsByType).map(([type, count], index) => ({
    type,
    count,
    id: `type-${index}`,
  }));

  const accidentMonthData = Object.entries(stats.accidentsByMonth).map(([month, count], index) => ({
    month: monthsNames[parseInt(month)],
    count,
    id: `month-${index}`,
  }));

  const accidentSecteurData = Object.entries(stats.accidentsBySecteur).map(([secteur, count], index) => ({
    secteur,
    count,
    id: `secteur-${index}`,
  }));

  const accidentYearData = Object.entries(stats.accidentsByYear).map(([year, count], index) => ({
    year: year.toString(),
    count,
    id: `year-${index}`,
  }));

  // Créer les données pour les accidents par sexe
  const accidentSexData = [
    { sexe: 'Masculin', count: stats.accidentsBySex.Masculin },
    { sexe: 'Féminin', count: stats.accidentsBySex.Féminin },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div>
        <h2>Total des accidents</h2>
        <p className="text-3xl font-bold">{stats.totalAccidents}</p>
      </div>

      <div>
        <h2>Âge moyen des travailleurs</h2>
        <p className="text-3xl font-bold">{stats.averageAgeOfWorkers.toFixed(1)} ans</p>
      </div>

      <div className="col-span-full">
        <h2>Accidents par type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accidentTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-full">
        <h2>Accidents par mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={accidentMonthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" fill="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-full">
        <h2>Accidents par secteur</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accidentSecteurData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="secteur" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-full">
        <h2>Accidents par an</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={accidentYearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nouvelle section pour afficher les accidents par sexe */}
      <div className="col-span-full">
        <h2>Accidents par sexe</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accidentSexData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sexe" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistiques;
