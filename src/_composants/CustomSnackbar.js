import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Un composant React qui affiche un message dans une Snackbar.
 * La gravité du message est définie par la propriété severity.
 * La couleur de fond et du texte, ainsi que la bordure extérieure,
 * sont définies en fonction de la gravité.
 * La position de la Snackbar est définie par les propriétés
 * anchorOrigin et top.
 * La taille du texte est définie par la propriété fontSize.
 * Le padding est défini par la propriété padding.
 * @param {boolean} open - Si la Snackbar doit être affichée.
 * @param {function} handleClose - La fonction à appeler pour fermer la
 *                                 Snackbar.
 * @param {string} message - Le message à afficher.
 * @param {'info' | 'success' | 'warning' | 'error'} severity - La gravité du
 *                                                             message.
 */
const CustomSnackbar = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'button', // Reste en bas pour le positionnement
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
          top: '-60px', // Décaler la Snackbar de 40px vers le haut
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
