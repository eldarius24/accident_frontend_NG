import React, { forwardRef } from 'react';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from 'axios';
import { Tooltip, Button } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';
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

const BoutonArchiver = ({ donnee, type, onSuccess }) => {
  const { darkMode } = useTheme();

  const archiver = async () => {
    try {
      const archiveData = {
        type: type,
        donnees: donnee,
        titre: type === 'planaction'
          ? `${donnee.AddActionEntreprise} - ${donnee.AddAction}`
          : `${donnee.entrepriseName} - ${donnee.typeAccident}`,
        taille: JSON.stringify(donnee).length
      };

      await axios.post(`http://${apiUrl}:3100/api/archives`, archiveData);
      
      // Adapter l'URL selon le type
      const deleteUrl = type === 'planaction' 
        ? `http://${apiUrl}:3100/api/planaction/${donnee._id}`
        : `http://${apiUrl}:3100/api/accidents/${donnee._id}`;
            
      await axios.delete(deleteUrl);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  // Ne plus retourner le TableCell ici
  return (
    <BoutonArchivage onClick={archiver} darkMode={darkMode} />
  );
};

export default BoutonArchiver;