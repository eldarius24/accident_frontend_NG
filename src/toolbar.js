// toolbar.js (ResponsiveAppBar)
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function ResponsiveAppBar({ navigation }) {
  const location = useLocation();

  const isFormulairePage = location.pathname === '/formulaire';
  const isFormulairePage1 = location.pathname === '/adminaction';
  const isFormulairePage2 = location.pathname === '/planAction';

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#84a784' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
        <Button
            component={Link}
            to={isFormulairePage1 ? '/' :'/adminaction'}
            variant="contained"
            sx={{ backgroundColor: '#84a784',  '&:hover': { backgroundColor: 'green' } }}
            
          >
            <AdminPanelSettingsIcon 
            
            />
          </Button>
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
            }}
          >
            T.I.G.R.E
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
            sx={{ backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' } }}
            startIcon={isFormulairePage ? <ArrowBackIcon /> : <AddIcon />}
          >
            {isFormulairePage ? 'Retour' : 'Ajouter'}
          </Button> 
          <Button
            component={Link}
            to={isFormulairePage2 ? '/' : '/planAction'}
            variant="contained"
            sx={{ backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' } }}
            startIcon={isFormulairePage2 ? <ArrowBackIcon /> : <AddIcon />}
          >
            {isFormulairePage2 ? 'Retour' : 'Plan d\'actions'}
          </Button>              
          {/* Le reste de votre contenu */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
