import React, { useState, useEffect } from 'react';
import SystemeArchivage from './archivages'; 
import axios from 'axios';
import config from '../config.json';


const apiUrl = config.apiUrl;

const Archivage = ({ darkMode }) => {
  const [donneesArchivees, setDonneesArchivees] = useState([]);
  const [archiveOuverte, setArchiveOuverte] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chargerArchives = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://${apiUrl}:3100/api/archives/accident`);
      setDonneesArchivees(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des archives :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (archiveOuverte) {
      chargerArchives();
    }
  }, [archiveOuverte]);

  const onArchiver = async (archiveData) => {
    try {
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const onRestaurer = async (id) => {
    try {
    } catch (error) {
      console.error("Erreur lors de la restauration de l'archive:", error);
    }
  };

  return (
    <div>
      <h1>Gestion des Archives</h1>

      <SystemeArchivage
        typeArchive="accident" 
        donnees={donneesArchivees} 
        onArchiver={onArchiver} 
        onRestaurer={onRestaurer} 
        darkMode={darkMode} 
      />
    </div>
  );
};

export default Archivage;
