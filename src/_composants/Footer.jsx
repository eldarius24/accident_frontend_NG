import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useTheme } from '../Hook/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <>
      <div className="image-cortigroupe"></div>
      <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
        <h5 role="note" style={{ marginBottom: '40px', color: darkMode ? '#ffffff' : 'inherit' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '300%',
                height: '100%',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                animation: 'shine 3s infinite linear',
                '@keyframes shine': {
                  to: {
                    transform: 'translateX(50%)'
                  }
                }
              }
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                fontWeight: 500,
                letterSpacing: '0.1em',
                padding: '0.5rem 1.5rem',
                borderRadius: '50px',
                background: darkMode
                  ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                  : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                backdropFilter: 'blur(5px)',
                border: darkMode
                  ? '1px solid rgba(122,142,28,0.2)'
                  : '1px solid rgba(238,117,45,0.2)',
                color: darkMode ? '#ffffff' : '#2D3748',
                boxShadow: darkMode
                  ? '0 4px 6px rgba(0,0,0,0.1)'
                  : '0 4px 6px rgba(238,117,45,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 6px 12px rgba(0,0,0,0.2)'
                    : '0 6px 12px rgba(238,117,45,0.2)',
                  '& .highlight': {
                    color: darkMode ? '#7a8e1c' : '#ee752d'
                  }
                }
              }}
            >
              <span>Développé par </span>
              <span className="highlight" style={{
                transition: 'color 0.3s ease',
                fontWeight: 700
              }}>
                Remy
              </span>
              <span> & </span>
              <span className="highlight" style={{
                transition: 'color 0.3s ease',
                fontWeight: 700
              }}>
                Benoit
              </span>
              <span> pour </span>
              <span style={{
                backgroundImage: darkMode
                  ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                  : 'linear-gradient(45deg, #ee752d, #f4a261)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 700
              }}>
                Le Cortigroupe
              </span>
              <span style={{
                fontSize: '1.2em',
                marginLeft: '4px',
                backgroundImage: darkMode
                  ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                  : 'linear-gradient(45deg, #ee752d, #f4a261)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                ®
              </span>
            </Typography>
          </Box>
        </h5>
      </Tooltip>
    </>
  );
};

export default Footer;