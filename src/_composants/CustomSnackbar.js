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
      autoHideDuration={2000}
      onClose={handleClose}
      sx={{ bottom: '60px !important' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '100%',
          fontSize: '1rem',
          padding: '10px',
          backgroundColor: severity === 'success' ? '#eeffee' : '#ffe8e8',
          color: severity === 'success' ? '#257525' : '#ff0000',
          outline: severity === 'success' ? '3px solid green' : '5px solid red',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;