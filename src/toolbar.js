import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const buttonStyle = {
  backgroundColor: '#84a784',
  '&:hover': { backgroundColor: 'green' }
};

const textStyle = {
  mr: -50,
  display: { xs: 'flex', md: 'flex', alignItems: 'center', justifyContent: 'center' },
  flexGrow: 1,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  '@media (min-width: 850px)': {
    fontSize: '2rem',
  },
  '@media (max-width: 750px)': {
    fontSize: '1.5rem',
    letterSpacing: '.1rem',
    mr: -20,
  },
  '@media (max-width: 600px)': {
    fontSize: '0.7rem',
    letterSpacing: '.04rem',
    mr: -20,
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
    <AppBar position="sticky" sx={{ backgroundColor: '#84a784' }}>
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