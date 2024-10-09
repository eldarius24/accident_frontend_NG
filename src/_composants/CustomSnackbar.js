import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '100%',
          fontSize: '1rem',  // Augmenter la taille du texte
          padding: '10px',      // Ajouter du padding pour rendre l'alert plus grande
          backgroundColor: severity === 'success' ? 'transparent' : 'transparent',  // Couleur de fond différente selon la gravité
          color: severity === 'success' ? '#257525' : '#ff0000',  // Couleur du texte différente selon la gravité
          outline: severity === 'success' ? '5px solid green' : '5px solid red',  // Bordure extérieure différente selon la gravité
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
