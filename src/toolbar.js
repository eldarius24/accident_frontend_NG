import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const buttonStyle = {
  backgroundColor: '#01aeac',
  '&:hover': { backgroundColor: '#95519b' }
};

const textStyle = {
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
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

/** Composant de la barre de navigation
 * 
 * @returns ResponsiveAppBar component
 */
function ResponsiveAppBar() {
  const location = useLocation();

  const { isFormulaireAccident, isPageAdmin } = useMemo(() => ({
    isFormulaireAccident: location.pathname === '/formulaire',
    isPageAdmin: location.pathname === '/adminaction'
  }), [location.pathname]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f9ba2b' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            onClick={() => localStorage.removeItem('token')}
            sx={buttonStyle}
          >
            logout
          </Button>
          <Button
            component={Link}
            to={isPageAdmin ? '/' : '/adminaction'}
            variant="contained"
            sx={buttonStyle}
          >
            <AdminPanelSettingsIcon />
          </Button>
          <Typography variant="h5" noWrap sx={textStyle}>
            T.I.G.R.E
          </Typography>
          <Button
            component={Link}
            to={isFormulaireAccident ? '/' : '/formulaire'}
            variant="contained"
            sx={buttonStyle}
            startIcon={isFormulaireAccident ? <ArrowBackIcon /> : <AddIcon />}
          >
            Ajout d'un AT
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;