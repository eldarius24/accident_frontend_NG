import React, { forwardRef } from 'react';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from 'axios';
import { Tooltip, TableCell, Button } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';

// Separate Button component with forwarded ref
const BoutonArchivage = forwardRef(({ onClick, darkMode }, ref) => (
  <Tooltip title="Cliquez ici pour archiver l'action" arrow>
    <Button
      onClick={onClick}
      ref={ref}
      variant="contained"
      sx={{
        backgroundColor: darkMode ? '#947729' : '#ffbc03',
        transition: 'all 0.3s ease-in-out',
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
        titre: type === 'action'
          ? `${donnee.AddActionEntreprise} - ${donnee.AddAction}`
          : `${donnee.entrepriseName} - ${donnee.typeAccident}`,
        taille: JSON.stringify(donnee).length
      };

      await axios.post('http://localhost:3100/api/archives', archiveData);
      await axios.delete(`http://localhost:3100/api/${type === 'action' ? 'planaction' : 'accidents'}/${donnee._id}`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  return (
    <TableCell style={{ padding: 0, width: '70px' }}>
      <BoutonArchivage onClick={archiver} darkMode={darkMode} />
    </TableCell>
  );
};

export default BoutonArchiver;