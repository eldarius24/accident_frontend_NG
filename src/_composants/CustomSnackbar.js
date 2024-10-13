import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top', // Reste en bas pour le positionnement
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '100%',
          fontSize: '1rem', // Augmenter la taille du texte
          padding: '10px', // Ajouter du padding pour rendre l'alert plus grande
          backgroundColor: severity === 'success' ? '#eeffee' : '#ffe8e8', // Couleur de fond différente selon la gravité
          color: severity === 'success' ? '#257525' : '#ff0000', // Couleur du texte différente selon la gravité
          outline: severity === 'success' ? '3px solid green' : '5px solid red', // Bordure extérieure différente selon la gravité
          position: 'relative', 
          top: '60px', // Décaler la Snackbar de 40px vers le haut
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
