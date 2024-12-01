import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const RoleInfoButton = ({ role, infoText, darkMode }) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {role}
      <Tooltip 
        title={infoText}
        arrow
        sx={{
          backgroundColor: darkMode ? '#424242' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
        }}
      >
        <IconButton 
          size="small"
          sx={{
            color: darkMode ? '#7a8e1c' : '#ee742d',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(122, 142, 28, 0.1)' : 'rgba(238, 116, 45, 0.1)',
            }
          }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RoleInfoButton;