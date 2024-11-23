import React, { useState, useEffect } from 'react';
import SystemeArchivage from './archivages'; 
import axios from 'axios';

const Archivage = ({ darkMode }) => {
  const [donneesArchivees, setDonneesArchivees] = useState([]);
  const [archiveOuverte, setArchiveOuverte] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chargerArchives = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3100/api/archives/accident');
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
      // Logique d'archivage ici
      console.log("Archiver les données:", archiveData);
      // Vous pouvez envoyer les données d'archivage au backend si nécessaire
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const onRestaurer = async (id) => {
    try {
      // Logique pour restaurer une archive
      console.log("Restaurer l'archive avec l'ID :", id);
      // Vous pouvez envoyer une requête pour restaurer l'archive
    } catch (error) {
      console.error("Erreur lors de la restauration de l'archive:", error);
    }
  };

  return (
    <div>
      <h1>Gestion des Archives</h1>

      <SystemeArchivage
        typeArchive="accident" // Passer le type d'archive ici
        donnees={donneesArchivees} // Passer les données d'archive
        onArchiver={onArchiver} // Passer la fonction d'archivage
        onRestaurer={onRestaurer} // Passer la fonction de restauration
        darkMode={darkMode} // Passer le mode sombre
      />
    </div>
  );
};

export default Archivage;
