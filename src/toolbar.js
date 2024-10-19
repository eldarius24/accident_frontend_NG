import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useUserConnected } from './Hook/userConnected';
import HomeIcon from '@mui/icons-material/Home';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ViewListIcon from '@mui/icons-material/ViewList';
import LogoutIcon from '@mui/icons-material/Logout';

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showText = windowWidth > 900;

  const { isAddSecteur, isadminEntreprises, isaddEntrprise, isadminUser, isaddUser, isFormulaireAction, isFormulaireAccident, isPageAdmin, isPageStats, isLoginPage, isplanAction, isHiddenPage } = useMemo(() => ({
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
    isHiddenPage: ['/deviation', '/agentmateriel', '/naturelesion', '/siegelesion'].includes(location.pathname),
  }), [location.pathname]);

  const buttonStyle = {
    backgroundColor: '#01aeac',
    '&:hover': { backgroundColor: '#95519b' },
    mr: 1,
    whiteSpace: 'nowrap',
    minWidth: showText ? 'auto' : '40px',
    padding: showText ? 'auto' : '6px',
  };

  const textStyle = {
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.3rem',
    color: '#95519b',
    textAlign: 'center',
    flexGrow: 1,
    fontSize: windowWidth > 950 ? '2rem' : windowWidth > 850 ? '1.5rem' : '0.7rem',
    letterSpacing: windowWidth > 950 ? '.3rem' : windowWidth > 850 ? '.1rem' : '.04rem',
  };

  if (isHiddenPage || isLoginPage) {
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
        sx={buttonStyle}
        startIcon={icon}
      >
        {showText && text}
      </Button>
    </Tooltip>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f9ba2b90' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {renderButton("/login", "Cliquez ici pour vous déconnecter", <LogoutIcon />, "logout")}
          
          {isAdmin && ['/', '/addSecteur', '/adminaction','/adminUser',"/adminEntreprises","/addEntreprise","/addUser"].includes(location.pathname) && 
            renderButton("/adminaction", "Cliquez ici accèder à l'espace d'administration", <AdminPanelSettingsIcon />, "Admin")}
          
          <Typography variant="h5" noWrap sx={textStyle}>
            T.I.G.R.E
          </Typography>
          
          {!['/'].includes(location.pathname) && 
            renderButton("/", "Cliquez ici pour revenir a l'accueil", <HomeIcon />, "Home")}
          
          {isAdminOuConseiller && (
            <>
              {!['/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/formulaireAction', '/planAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/formulaire", "Cliquez ici pour ajouté un nouvelle accident", <AddIcon />, "Accident")}
              
              {!['/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/formulaireAction', '/planAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/statistiques", "Cliquez ici pour accéder aux statistiques", <BarChartIcon />, "Statistiques")}
              
              {!['/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/planAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/planAction", "Cliquez ici pour accéder aux plans d'actions", <PendingActionsIcon />, "Plans d'actions")}
              
              {!['/addSecteur', '/addUser', '/adminUser', '/addEntreprise', '/adminEntreprises', '/adminaction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/formulaireAction", "Cliquez ici pour ajouter une nouvelle action", <AddIcon />, "Nouvelle action")}
              
              {!['/addSecteur', '/addEntreprise', '/addUser', '/adminEntreprises', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/addUser", "Cliquez ici pour ajouter un nouvel utilisateur", <AddIcon />, "Utilisateur")}
              
              {!['/addSecteur', '/adminUser', '/addEntreprise', '/adminEntreprises', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/adminUser", "Cliquez ici pour gérer les utilisateurs", <ViewListIcon />, "utilisateurs")}
              
              {!['/addUser', '/adminUser', '/addEntreprise', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/addEntreprise", "Cliquez ici pour ajouter une nouvelle entreprise", <AddIcon />, "Entreprise")}
              
              {!['/addUser', '/adminUser', '/adminEntreprises', '/planAction', '/', '/formulaireAction', '/formulaire', '/statistiques'].includes(location.pathname) && 
                renderButton("/adminEntreprises", "Cliquez ici pour gérer les entreprises", <ViewListIcon />, "Entreprises")}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;