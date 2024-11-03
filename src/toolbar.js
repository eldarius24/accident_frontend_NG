import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Switch, FormControlLabel, AppBar, Toolbar, Typography, Container, Button, Tooltip } from '@mui/material';
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
/**
 * A responsive app bar that displays different buttons based on the user's
 * privileges and the current page.
 *
 * @returns {JSX.Element} The responsive app bar.
 */
function ResponsiveAppBar() {
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
    backgroundColor: '#01aeac',
    '&:hover': { backgroundColor: '#95519b' },
    mr: 1,
    whiteSpace: 'nowrap',
    
   
    minWidth: showText ? 'auto' : '40px',
    padding: showText ? 'auto' : '6px',
    fontSize: windowWidth > 50000 ? '1.2rem' : windowWidth > 10000 ? '1rem' : '0.8rem',
    transition: 'all 0.3s ease-in-out',
    // Ajuste la hauteur du bouton en fonction de la taille de la fenêtre
    height: windowWidth > 50000 ? '50px' : windowWidth > 1650 ? '40px' : '32px',
    // Ajuste le padding horizontal en fonction de la taille de la fenêtre
    px: windowWidth > 50000 ? 4 : windowWidth > 1650 ? 2 :  1,
  }), [windowWidth, showText]);



  const textStyle = {
    fontFamily: 'monospace',
    fontWeight: 700,
    color: '#95519b',
    textAlign: 'center',
    flexGrow: 1,
    fontSize: windowWidth > 1650 ? '2rem' : windowWidth > 530 ? '1.5rem' : '0.6rem',
    letterSpacing: windowWidth > 1650 ? '.3rem' : windowWidth > 530 ? '.1rem' : '.01rem',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',

    }
  };

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


  const handleThemeChange = async () => {
    try {
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        if (token && token.data) {
          // Basculer le thème
          toggleDarkMode();

          // Mettre à jour le token dans le localStorage
          token.data.darkMode = !darkMode;
          localStorage.setItem('token', JSON.stringify(token));

          // Mettre à jour le thème sur le serveur si nécessaire
          if (token.data._id) {
            await axios.put(`http://${apiUrl}:3100/api/users/${token.data._id}/updateTheme`, {
              darkMode: !darkMode
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du thème:', error);
    }
  };


  return (
    <AppBar position="sticky" sx={{ backgroundColor: darkMode ? '#535353' : '#ffdb88' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Tooltip title="Changer de thème">
            <Switch
              checked={darkMode}
              onChange={handleThemeChange}
              color="default"
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          </Tooltip>
          {renderLogoutButton("/login", "Cliquez ici pour vous déconnecter", <LogoutIcon />, "logout")}

          {isAdmin && ['/logView', '/', '/addSecteur', '/adminaction', '/adminUser', "/adminEntreprises", "/addEntreprise", "/addUser"].includes(location.pathname) &&
            renderButton("/adminaction", "Cliquez ici accèder à l'espace d'administration", <AdminPanelSettingsIcon />, "Admin")}

          <Typography variant="h5" noWrap sx={textStyle}>
            T.I.G.R.E
          </Typography>

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
                renderButton("/adminEntreprises", "Cliquez ici pour gérer les entreprises", <ViewListIcon />, "Entreprises")}

              {!['/actionfichierdll', '/addSecteur', '/addEntreprise', '/adminaction', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addUser', '/adminUser', '/adminEntreprises', '/planAction', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/entreprise", "Cliquez ici pour gérer les entreprises", <ViewListIcon />, "Entreprise divers")}

              {!['/actionfichierdll', "/",'/addSecteur' ,'/addEntreprise', '/quesEntrep', '/adminaction', '/entreprise', '/logView', '/fichierdll', '/fichierdllaction', '/addUser', '/adminUser', '/adminEntreprises', '/planAction', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) &&
                renderButton("/quesEntrep", "Cliquez ici pour gérer les entreprises", <ViewListIcon />, "ajouter un fichier")}

            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;