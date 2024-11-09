import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Switch, FormControlLabel, AppBar, Toolbar, Typography, Container, Button, Tooltip, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useUserConnected } from './Hook/userConnected';
import HomeIcon from '@mui/icons-material/Home';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ViewListIcon from '@mui/icons-material/ViewList';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from './pageAdmin/user/ThemeContext';
import axios from 'axios';
import config from './config.json';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useLogger } from './Hook/useLogger';
import { useNavigate } from 'react-router-dom';
import SupportDialog from './Dialog/supportDialog';
import HelpIcon from '@mui/icons-material/Help';
/**
 * A responsive app bar that displays different buttons based on the user's
 * privileges and the current page.
 *
 * @returns {JSX.Element} The responsive app bar.
 */
function ResponsiveAppBar() {
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { darkMode, toggleDarkMode } = useTheme();
  const apiUrl = config.apiUrl;
  const { logAction } = useLogger();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      if (userInfo) {
        // Crée un log de déconnexion avant de supprimer le token
        await logAction({
          actionType: 'déconnexion',
          details: `Déconnexion de l'utilisateur ${userInfo.userName}`,
          entity: 'Auth',
          entityId: userInfo._id,
          entreprise: userInfo.entreprisesConseillerPrevention?.[0] || null
        });
      }

      // Supprime le token et redirige
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, [userInfo, logAction, navigate]);

  const renderLogoutButton = () => (
    <Tooltip title="Cliquez ici pour vous déconnecter" arrow>
      <Button
        onClick={handleLogout}  // Utilise handleLogout au lieu du lien direct
        variant="contained"
        sx={{
          ...buttonStyle,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#95ad22',
            transform: 'scale(1.08)',
            boxShadow: 6
          }
        }}
        startIcon={<LogoutIcon />}
      >
        {showText && "logout"}
      </Button>
    </Tooltip>
  );


  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#6e6e6e' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#6e6e6e';
  }, [darkMode]);


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showText = windowWidth > 1000;

  const { isquesEntrep, isentreprise, issiegelesion, isnaturelesion, isagentmateriel, isdeviation, isAddSecteur, isadminEntreprises, isaddEntrprise, isadminUser, isaddUser, isFormulaireAction, isFormulaireAccident, isPageAdmin, isPageStats, isLoginPage, isplanAction, isHiddenPage } = useMemo(() => ({
    isFormulaireAccident: location.pathname === '/formulaire',
    isPageAdmin: location.pathname === '/adminaction',
    isPageStats: location.pathname === '/statistiques',
    isLoginPage: location.pathname === '/login',
    isplanAction: location.pathname === '/planAction',
    isFormulaireAction: location.pathname === '/formulaireAction',
    isaddUser: location.pathname === '/addUser',
    isadminUser: location.pathname === '/adminUser',
    isaddEntrprise: location.pathname === '/addEntreprise',
    isadminEntreprises: location.pathname === '/adminEntreprises',
    isAddSecteur: location.pathname === '/addSecteur',
    isdeviation: location.pathname === '/deviation',
    isagentmateriel: location.pathname === '/agentmateriel',
    isnaturelesion: location.pathname === '/naturelesion',
    issiegelesion: location.pathname === '/siegelesion',
    isentreprise: location.pathname === '/entreprise',
    isquesEntrep: location.pathname === '/quesEntrep',
    isHiddenPage: [].includes(location.pathname),


  }), [location.pathname]);



  const buttonStyle = useMemo(() => ({
    backgroundColor: darkMode ? '#424242' : '#01aeac',
    color: darkMode ? '#000' : '#fff',
    '&:hover': {
      backgroundColor: darkMode ? '#95519b' : '#95ad22',
      boxShadow: darkMode
        ? '0 0 10px rgba(255,255,255,0.2)'
        : '0 0 10px rgba(0,0,0,0.2)'
    },
    mr: 1,
    whiteSpace: 'nowrap',
    minWidth: showText ? 'auto' : '40px',
    padding: showText ? 'auto' : '6px',
    fontSize: windowWidth > 1650 ? '1.2rem' : windowWidth > 1220 ? '1rem' : '0.8rem',
    transition: 'all 0.3s ease-in-out',
    height: windowWidth > 1850 ? '50px' : windowWidth > 1220 ? '40px' : '32px',
    px: windowWidth > 1850 ? 4 : windowWidth > 1220 ? 2 : 1,
    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
    backdropFilter: darkMode ? 'blur(4px)' : 'none',
  }), [windowWidth, showText, darkMode]);

  const textStyle = useMemo(() => ({
    fontFamily: 'monospace',
    fontWeight: 700,
    color: darkMode ? '#fff' : '#95519b',
    textAlign: 'center',
    flexGrow: 1,
    fontSize: windowWidth > 1350 ? '2rem' : windowWidth > 530 ? '1.5rem' : '0.6rem',
    letterSpacing: windowWidth > 1350 ? '.3rem' : windowWidth > 530 ? '.1rem' : '.01rem',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      textShadow: darkMode
        ? '0 0 10px rgba(255,255,255,0.3)'
        : '0 0 10px rgba(149,81,155,0.3)'
    }
  }), [windowWidth, darkMode]);

  if (isHiddenPage || isLoginPage || isdeviation || isagentmateriel || isnaturelesion || issiegelesion) {
    return null;
  }

  /**
   * Renders a button with a tooltip, icon, and text.
   * 
   * @param {string} to - The destination URL of the button.
   * @param {string} tooltip - The text shown in the tooltip when hovering over the button.
   * @param {JSX.Element} icon - The icon component to display on the button.
   * @param {string} text - The text displayed on the button.
   */
  const renderButton = (to, tooltip, icon, text) => (
    <Tooltip title={tooltip} arrow>
      <Button
        component={Link}
        to={to}
        variant="contained"
        sx={{
          ...buttonStyle,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#95ad22',
            transform: 'scale(1.08)',
            boxShadow: 6
          }
        }}
        startIcon={icon}
      >
        {showText && text}
      </Button>
    </Tooltip>
  );


  const handleThemeChange = () => {
    toggleDarkMode();
  };


  return (
    <AppBar position="sticky" sx={{ backgroundColor: darkMode ? '#535353' : '#ffdb88' }}>
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          px: 2  // Ajoute un petit padding horizontal pour éviter que les éléments touchent les bords
        }}
      >
        {/* Groupe de boutons à gauche */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          ml: 0 // Marge gauche à 0
        }}>
          <Tooltip title="Changer de thème">
            <Switch
              checked={darkMode}
              onChange={handleThemeChange}
              color="default"
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          </Tooltip>
          {renderLogoutButton()}
          {isAdmin && ['/logView', '/', '/addSecteur', '/adminaction', '/adminUser', "/adminEntreprises", "/addEntreprise", "/addUser"].includes(location.pathname) &&
            renderButton("/adminaction", "Cliquez ici accèder à l'espace d'administration", <AdminPanelSettingsIcon />, "Admin")}
        </Box>

        {/* Logo au centre */}
        <Box sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none' // Empêche le logo de interférer avec les clics
        }}>
        </Box>
        <Box>
          <Typography variant="h5" noWrap sx={textStyle}>
            T.I.G.R.E
          </Typography>
        </Box>


        {/* Groupe de boutons à droite */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: 'flex-end',
          mr: 0 // Marge droite à 0
        }}>
          {!['/'].includes(location.pathname) &&
            renderButton("/", "Cliquez ici pour revenir a l'accueil", <HomeIcon />, "Home")}

          {isAdminOuConseiller && (
            <>
              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/formulaireAction', '/planAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/formulaire", "Cliquez ici pour ajouté un nouvelle accident", <AddIcon />, "Accident")}

              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/formulaireAction', '/planAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/statistiques", "Cliquez ici pour accéder aux statistiques", <BarChartIcon />, "Statistiques")}

              {!['/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/planAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/planAction", "Cliquez ici pour accéder aux plans d'actions", <PendingActionsIcon />, "Plans d'actions")}

              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/formulaireAction", "Cliquez ici pour ajouter une nouvelle action", <AddIcon />, "Nouvelle action")}

              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addSecteur', '/addEntreprise', '/addUser', '/adminEntreprises', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/addUser", "Cliquez ici pour ajouter un nouvel utilisateur", <AddIcon />, "Utilisateurs")}

              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addSecteur', '/adminUser', '/addEntreprise', '/adminEntreprises', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/adminUser", "Cliquez ici pour gérer les utilisateurs", <ViewListIcon />, "utilisateurs")}

              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addUser', '/adminUser', '/addEntreprise', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/addEntreprise", "Cliquez ici pour ajouter une nouvelle entreprise", <AddIcon />, "Entreprises")}

              {!['/actionfichierdll', '/quesEntrep', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addUser', '/adminUser', '/adminEntreprises', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/adminEntreprises", "Cliquez ici pour afficher, éditez ou supprimer une entreprise ou créer un secteur d'activé", <ViewListIcon />, "Entreprises")}

              {!['/actionfichierdll', '/addSecteur', '/addEntreprise', '/adminaction', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addUser', '/adminUser', '/adminEntreprises', '/planAction', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/entreprise", "Cliquez ici pour gérer les document divers", <ViewListIcon />, "Documents divers")}

              {!['/actionfichierdll', "/", '/addSecteur', '/addEntreprise', '/quesEntrep', '/adminaction', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addUser', '/adminUser', '/adminEntreprises', '/planAction', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/quesEntrep", "Cliquez ici pour gérer les entreprises", <ViewListIcon />, "ajouter un fichier")}

            </>
          )}
          <Tooltip title="Contacter le support" arrow>
            <Button
              variant="contained"
              onClick={() => setSupportDialogOpen(true)}
              sx={buttonStyle}
              startIcon={<HelpIcon />}
            >
              {showText && "Support"}
            </Button>
          </Tooltip>

          <SupportDialog
            open={supportDialogOpen}
            onClose={() => setSupportDialogOpen(false)}
          />

        </Box>
      </Toolbar>

    </AppBar >
  );
}

export default ResponsiveAppBar;