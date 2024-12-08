import React, { forwardRef } from 'react';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from 'axios';
import { Tooltip, Button } from '@mui/material';
import { useTheme } from '../Hook/ThemeContext';
import config from '../config.json';

const apiUrl = config.apiUrl;

const BoutonArchivage = forwardRef(({ onClick, darkMode }, ref) => (
  <Tooltip title="Cliquez ici pour archiver l'action" arrow>
    <Button
      onClick={onClick}
      ref={ref}
      variant="contained"
      sx={{
        backgroundColor: darkMode ? '#947729' : '#ffbc03',
        transition: 'all 0.1s ease-in-out',
        '&:hover': {
          backgroundColor: darkMode ? '#b8982f' : '#cc9900',
          transform: 'scale(1.08)',
          boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
        },
        '& .MuiSvgIcon-root': {
          color: darkMode ? '#fff' : 'inherit'
        }
      }}
    >
      <ArchiveIcon />
    </Button>
  </Tooltip>
));

BoutonArchivage.displayName = 'BoutonArchivage';

const BoutonArchiver = ({ donnee, type, onSuccess, updateList }) => {
  const { darkMode } = useTheme();

  const archiver = async () => {
    try {
      console.log('=== DÉBUT PROCESSUS D\'ARCHIVAGE ===');
      console.log('Type de donnée à archiver:', type);

      // Récupérer d'abord les données complètes
      let donneeComplete;
      if (type === 'accident') {
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents/${donnee._id}`);
        donneeComplete = response.data;
      } else if (type === 'vehicle') {
        // Récupérer le véhicule et ses records en parallèle
        const [vehicleResponse, recordsResponse] = await Promise.all([
          axios.get(`http://${apiUrl}:3100/api/vehicles/${donnee._id}`),
          axios.get(`http://${apiUrl}:3100/api/vehicles/${donnee._id}/records`)
        ]);
        
        // Combiner les données du véhicule et ses records
        donneeComplete = {
          ...vehicleResponse.data,
          records: recordsResponse.data
        };
        console.log('Records trouvés:', recordsResponse.data.length);
      } else {
        const response = await axios.get(`http://${apiUrl}:3100/api/planaction/${donnee._id}`);
        donneeComplete = response.data;
      }

      console.log('Données complètes récupérées:', donneeComplete);

      const archiveData = {
        type: type,
        donnees: {
          ...donneeComplete,
          date: new Date().toISOString()
        },
        titre: type === 'planaction'
          ? `${donneeComplete.AddActionEntreprise} - ${donneeComplete.AddAction}`
          : type === 'vehicle'
            ? `${donneeComplete.entrepriseName} - ${donneeComplete.numPlaque}`
            : `${donneeComplete.entrepriseName} - ${donneeComplete.typeAccident}`,
        taille: JSON.stringify(donneeComplete).length
      };

      console.log('Données préparées pour l\'archive:', archiveData);

      // Créer l'archive
      const archiveResponse = await axios.post(`http://${apiUrl}:3100/api/archives`, archiveData);
      console.log('Réponse de la création d\'archive:', archiveResponse.data);

      if (!archiveResponse.data) {
        throw new Error("Échec de la création de l'archive");
      }

      // Supprimer la donnée originale
      const deleteUrl = type === 'planaction'
        ? `http://${apiUrl}:3100/api/planaction/${donnee._id}`
        : type === 'vehicle'
          ? `http://${apiUrl}:3100/api/vehicles/${donnee._id}`
          : `http://${apiUrl}:3100/api/accidents/${donnee._id}`;

      console.log('Suppression de la donnée originale:', deleteUrl);
      const deleteResponse = await axios.delete(deleteUrl);
      console.log('Réponse de la suppression:', deleteResponse.status);

      if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        console.log('Suppression réussie');
        if (updateList) {
          updateList();
        }
        if (onSuccess) {
          onSuccess('Élément archivé avec succès');
        }
      } else {
        throw new Error('Échec de la suppression');
      }

      console.log('=== FIN PROCESSUS D\'ARCHIVAGE ===');
    } catch (error) {
      console.error("=== ERREUR LORS DE L'ARCHIVAGE ===");
      console.error("Message d'erreur:", error.message);
      console.error("Détails de l'erreur:", error);
      if (onSuccess) {
        onSuccess("Erreur lors de l'archivage", 'error');
      }
    }
  };

  return (
    <BoutonArchivage onClick={archiver} darkMode={darkMode} />
  );
};

export default BoutonArchiver;