import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useUserConnected } from './Hook/userConnected';
import HomeIcon from '@mui/icons-material/Home';

function ResponsiveAppBar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isAdminOuConseiller, userInfo, isConseiller } = useUserConnected();
  const { isFormulaireAccident, isPageAdmin, isPageStats, isLoginPage } = useMemo(() => ({
    isFormulaireAccident: location.pathname === '/formulaire',
    isPageAdmin: location.pathname === '/adminaction',
    isPageStats: location.pathname === '/statistiques',
    isLoginPage: location.pathname === '/login',
  }), [location.pathname]);



  const buttonStyle = {
    backgroundColor: '#01aeac',
    '&:hover': { backgroundColor: '#95519b' },
    mr: 1,
  };

  const textStyle = {
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.3rem',
    color: '#95519b',
    textAlign: 'center',
    flexGrow: 1,
    '@media (min-width: 850px)': {
      fontSize: '2rem',
    },
    '@media (max-width: 750px)': {
      fontSize: '1.5rem',
      letterSpacing: '.1rem',
    },
    '@media (max-width: 600px)': {
      fontSize: '0.7rem',
      letterSpacing: '.04rem',
    },
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f9ba2b90' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Tooltip title="Cliquez ici pour vous déconnecter" arrow>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              onClick={() => localStorage.removeItem('token')}
              sx={buttonStyle}
            >
              logout
            </Button>
          </Tooltip>
          {isAdmin && (
            <>
              {location.pathname !== '/adminaction' && (
                <Tooltip title="Cliquez ici accèder à l'espace d'administration" arrow>
                  <Button
                    component={Link}
                    to={'/adminaction'}
                    variant="contained"
                    sx={buttonStyle}
                  >
                    <AdminPanelSettingsIcon />
                  </Button>
                </Tooltip>
              )}
            </>
          )}
          <Tooltip title="Traitement Informatisé de Getions des Risques d'Entreprise" arrow>
            <Typography variant="h5" noWrap sx={textStyle}>
              T.I.G.R.E
            </Typography>
          </Tooltip>
          {location.pathname !== '/' && (
            <Tooltip title="Cliquez ici pour revenir a l'accueil" arrow>
              <Button
                component={Link}
                to={isFormulaireAccident ? '/' : '/'}
                variant="contained"
                sx={buttonStyle}
              >
                <HomeIcon />
              </Button>
            </Tooltip>
          )}
          {isAdminOuConseiller && (
            <>
              {location.pathname !== '/formulaire' && (
                <Tooltip title="Cliquez ici pour ajouté un nouvelle accident" arrow>
                  <Button
                    component={Link}
                    to={'/formulaire'}
                    variant="contained"
                    sx={buttonStyle}
                  >
                    <AddIcon />
                    Accident
                  </Button>
                </Tooltip>
              )}

              {location.pathname !== '/statistiques' && (
                <Tooltip title="Cliquez ici pour accéder aux statistiques" arrow>
                  <Button
                    component={Link}
                    to={isPageStats ? '/' : '/statistiques'}
                    variant="contained"
                    sx={buttonStyle}
                    startIcon={<BarChartIcon />}
                  >
                    Statistiques
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar >
  );
}

export default ResponsiveAppBar;