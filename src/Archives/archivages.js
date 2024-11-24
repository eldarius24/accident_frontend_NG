import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Button, Dialog, DialogTitle, DialogContent,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,
  TextField, MenuItem, Select, FormControl, InputLabel,
  Typography, Tooltip, Chip
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const onRestaurer = async (id, type, onSuccess) => {
  try {
    if (!id) {
      console.error("L'ID de l'archive est manquant.");
      return;
    }

    await axios.post(`http://localhost:3100/api/archives/${id}/restore`);
    console.log("Archive restaurée avec succès");
    
    // Appeler la fonction de rappel si elle existe
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Erreur lors de la restauration de l'archive:", error);
  }
};

const SystemeArchivage = ({
  donnees,
  typeArchive,
  onArchiver,
  darkMode,
  onSuccess
}) => {
  const [archiveOuverte, setArchiveOuverte] = useState(false);
  const [donneesArchivees, setDonneesArchivees] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [anneeFiltre, setAnneeFiltre] = useState('tout');
  const [statistiques, setStatistiques] = useState({
    totalArchives: 0,
    archivesParAnnee: {},
    tailleStockage: 0
  });

  const calculerStatistiques = (archives) => {
    const stats = archives.reduce((acc, item) => {
      // Adapter la logique selon le type d'archive
      const annee = typeArchive === 'planaction'
        ? item.donnees.AddActionanne
        : new Date(item.donnees.DateHeureAccident || item.date).getFullYear().toString();

      acc.archivesParAnnee[annee] = (acc.archivesParAnnee[annee] || 0) + 1;
      acc.totalArchives += 1;
      acc.tailleStockage += item.taille || 0;
      return acc;
    }, {
      totalArchives: 0,
      archivesParAnnee: {},
      tailleStockage: 0
    });

    setStatistiques(stats);
  };

  const refreshArchives = async () => {
    try {
      const response = await axios.get(`http://localhost:3100/api/archives/${typeArchive}`);
      setDonneesArchivees(response.data);
      calculerStatistiques(response.data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des archives:", error);
    }
  };

  useEffect(() => {
    if (archiveOuverte) {
      refreshArchives();
    }
  }, [archiveOuverte, typeArchive]);

  const filtrerArchives = () => {
    if (!donneesArchivees) return [];

    return donneesArchivees.filter(item => {
      const titreRecherche = item.titre?.toLowerCase() || '';
      const dateRecherche = typeArchive === 'planaction'
        ? item.donnees.AddActionanne
        : new Date(item.donnees.DateHeureAccident || item.date).getFullYear().toString();

      const matchRecherche = titreRecherche.includes(recherche.toLowerCase());
      const matchAnnee = anneeFiltre === 'tout' || dateRecherche === anneeFiltre;
      return matchRecherche && matchAnnee;
    });
  };

  const getButtonText = (type) => {
    switch(type) {
      case 'planaction':
        return 'Accéder aux archives des actions';
      case 'accident':
        return 'Accéder aux archives des accidents';
      default:
        return 'Accéder aux Archives';
    }
  };

  const defaultStyle = {
    margin: '10px',
    backgroundColor: '#0098f9',
    '&:hover': { backgroundColor: '#95ad22' },
    fontSize: '1rem',
    '@media (min-width: 750px)': {
      fontSize: '1rem',
    },
    '@media (max-width: 550px)': {
      fontSize: '0.5rem',
    },
    padding: '15px 60px',
  };

  const handleRestore = async (archiveId) => {
    await onRestaurer(archiveId, typeArchive, () => {
      refreshArchives();
      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return (
    <div className="systeme-archivage">
      <Tooltip title={`Visualisation des archives ${typeArchive === 'planaction' ? "d'actions" : "d'accidents"}`} arrow>
        <Button
          onClick={() => setArchiveOuverte(true)}
          variant="contained"
          startIcon={<ArchiveIcon />}
          className="btn-archiver"
          sx={{
            ...defaultStyle,
            color: darkMode ? '#ffffff' : 'black',
            backgroundColor: darkMode ? '#424242' : '#ee742d59',
            transition: 'all 0.1s ease-in-out',
            '&:hover': {
              backgroundColor: darkMode ? '#7a8e1c' : '#95ad22',
              transform: 'scale(1.08)',
              boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
            },
            boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
            textTransform: 'none',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}
        >
          {getButtonText(typeArchive)}
        </Button>
      </Tooltip>

      <Dialog
        open={archiveOuverte}
        onClose={() => setArchiveOuverte(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: darkMode ? '#333' : '#f5f5f5',
          color: darkMode ? '#fff' : 'inherit'
        }}>
          Archives - {typeArchive === 'planaction' ? "Actions" : "Accidents"}
        </DialogTitle>

        <DialogContent sx={{
          backgroundColor: darkMode ? '#424242' : '#fff',
          color: darkMode ? '#fff' : 'inherit'
        }}>
          <Card sx={{ mb: 2, backgroundColor: darkMode ? '#333' : '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" color={darkMode ? '#fff' : 'inherit'}>
                Statistiques des Archives
              </Typography>
              <div className="stats-grid">
                <Chip
                  label={`Total: ${statistiques.totalArchives}`}
                  color="primary"
                />
                <Chip
                  label={`Taille: ${(statistiques.tailleStockage / 1024 / 1024).toFixed(2)} Mo`}
                  color="secondary"
                />
              </div>
            </CardContent>
          </Card>

          <div className="filtres-container">
            <TextField
              label="Rechercher"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon className="icon-recherche" />,
                style: { color: darkMode ? '#fff' : 'inherit' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#fff' : 'inherit'
                }
              }}
            />

            <FormControl size="small">
              <InputLabel sx={{ color: darkMode ? '#fff' : 'inherit' }}>Année</InputLabel>
              <Select
                value={anneeFiltre}
                onChange={(e) => setAnneeFiltre(e.target.value)}
                label="Année"
                sx={{
                  color: darkMode ? '#fff' : 'inherit',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                  }
                }}
              >
                <MenuItem value="tout">Toutes les années</MenuItem>
                {Object.keys(statistiques.archivesParAnnee).map(annee => (
                  <MenuItem key={annee} value={annee}>
                    {annee} ({statistiques.archivesParAnnee[annee]} archives)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>Titre</TableCell>
                <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>Date d'archivage</TableCell>
                <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>Taille</TableCell>
                <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrerArchives().map((archive, index) => {
                const archiveId = archive._id || `archive-${index}`;
                return (
                  <TableRow key={archiveId}>
                    <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>{archive.titre}</TableCell>
                    <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                      {typeArchive === 'planaction'
                        ? archive.donnees.AddActionanne
                        : new Date(archive.donnees.DateHeureAccident || archive.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                      {(archive.taille / 1024).toFixed(2)} Ko
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Restaurer">
                        <IconButton 
                          onClick={() => handleRestore(archiveId)}
                          size="small"
                          sx={{ color: darkMode ? '#fff' : 'inherit' }}
                        >
                          <UnarchiveIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemeArchivage;