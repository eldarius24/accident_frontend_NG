// toolbar.js (ResponsiveAppBar)
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

function ResponsiveAppBar({ navigation }) {
  const location = useLocation();

  const isFormulairePage = location.pathname === '/formulaire';

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#84a784' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: -50,
              display: { xs: 'flex', md: 'flex', alignItems: 'center', justifyContent: 'center' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              '@media (min-width: 750px)': {
                fontSize: '2rem',
              },
              '@media (max-width: 630px)': {
                fontSize: '1.5rem',
                letterSpacing: '.1rem',
                mr: -20,
              },
              '@media (max-width: 500px)': {
                fontSize: '1.2rem',
                letterSpacing: '.1rem',
                mr: -20,
              },
            }}
          >
            Gestion des accidents
          </Typography>

          {/* Utilisation de la propriété navigation */}
          {navigation}
          <Box
            sx={{
              display: { xs: 'flex', md: 'flex', alignItems: 'center', justifyContent: 'center' },
              flexGrow: 1,
            }}
          ></Box>
          {/* Condition pour le texte et la destination du bouton */}
          <Button
            component={Link}
            to={isFormulairePage ? '/' : '/formulaire'}
            variant="contained"
            sx={{ backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }
           }}
          >
            {isFormulairePage ? 'Accueil' : 'Formulaire'}
          </Button>


          {/* Le reste de votre contenu */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
