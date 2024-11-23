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

const onRestaurer = async (id) => {
  try {
    if (!id) {
      console.error("L'ID de l'archive est manquant.");
      return;
    }

    const response = await axios.post(`http://localhost:3100/api/archives/${id}/restore`);
    console.log("Archive restaurée avec succès", response);
  } catch (error) {
    console.error("Erreur lors de la restauration de l'archive:", error);
  }
};

const SystemeArchivage = ({
  donnees,
  typeArchive,
  onArchiver,
  darkMode
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
      // Pour les archives d'actions, utiliser AddActionanne
      // Pour les accidents, extraire l'année de la date
      const annee = typeArchive === 'action'
        ? item.donnees.AddActionanne
        : new Date(item.date).getFullYear().toString();

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

  useEffect(() => {
    const chargerArchives = async () => {
      if (!typeArchive) {
        console.error("Le type d'archive n'est pas défini !");
        return;
      }

      try {
        console.log("Requête API pour le type :", typeArchive);
        const response = await axios.get(`http://localhost:3100/api/archives/${typeArchive}`);
        const data = response.data;
        console.log("Données reçues depuis l'API :", data);

        setDonneesArchivees(data);
        calculerStatistiques(data);
      } catch (error) {
        console.error("Erreur lors du chargement des archives :", error);
        setDonneesArchivees([]);
      }
    };

    if (archiveOuverte) {
      chargerArchives();
    }
  }, [archiveOuverte, typeArchive]);

  const filtrerArchives = () => {
    if (!donneesArchivees) return [];

    return donneesArchivees.filter(item => {
      // Adapter la recherche selon le type d'archive
      const titreRecherche = item.titre.toLowerCase();
      const dateRecherche = typeArchive === 'action'
        ? item.donnees.AddActionanne
        : new Date(item.date).getFullYear().toString();

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
    margin: '10px', backgroundColor: '#0098f9', '&:hover': { backgroundColor: '#95ad22' },
    fontSize: '1rem', // Taille de police de base
    // Utilisation de Media Queries pour ajuster la taille de police
    '@media (min-width: 750px)': {
        fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
    },
    '@media (max-width: 550px)': {
        fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
    },
}

  return (
    <div className="systeme-archivage">
        <Tooltip title={`Visualisation des archives d'${getButtonText(typeArchive)}`} arrow>
      <Button
        onClick={() => setArchiveOuverte(true)}
        variant="contained"
        startIcon={<ArchiveIcon />}
        className="btn-archiver"
        sx={{
          ...defaultStyle,
          color: darkMode ? '#ffffff' : 'black',
          backgroundColor: darkMode ? '#424242' : '#ee742d59',
          transition: 'all 0.3s ease-in-out',
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
          Archives - {typeArchive}
        </DialogTitle>

        <DialogContent sx={{
          backgroundColor: darkMode ? '#424242' : '#fff',
          color: darkMode ? '#fff' : 'inherit'
        }}>
          {/* Section Statistiques */}
          <Card sx={{ mb: 2, backgroundColor: darkMode ? '#333' : '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6">
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

          {/* Filtres */}
          <div className="filtres-container">
            <TextField
              label="Rechercher"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon className="icon-recherche" />
              }}
            />

            <FormControl size="small">
              <InputLabel>Année</InputLabel>
              <Select
                value={anneeFiltre}
                onChange={(e) => setAnneeFiltre(e.target.value)}
                label="Année"
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

          {/* Table des Archives */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Date d'archivage</TableCell>
                <TableCell>Taille</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrerArchives().map((archive, index) => {
                const archiveId = archive._id || `archive-${index}`;
                return (
                  <TableRow key={archiveId}>
                    <TableCell>{archive.titre}</TableCell>
                    <TableCell>
                      {typeArchive === 'action'
                        ? archive.donnees.AddActionanne
                        : new Date(archive.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{(archive.taille / 1024).toFixed(2)} Ko</TableCell>
                    <TableCell>
                      <Tooltip title="Restaurer">
                        <IconButton onClick={() => onRestaurer(archiveId)} size="small">
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