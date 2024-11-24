import React from 'react';
import './formulaire.css';
import { Tooltip } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const SiegeLesion = () => {
  const { darkMode } = useTheme();

  const darkModeStyles = {
    backgroundColor: darkMode ? '#1a1a1a' : '#f3f4f6',
    color: darkMode ? '#ffffff' : '#1f2937',
  };

  const cardStyles = {
    backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
    color: darkMode ? '#ffffff' : '#1f2937',
  };

  const headerStyles = {
    backgroundColor: darkMode ? '#4a5568' : '#3b82f6',
    color: '#ffffff',
  };

  const itemStyles = {
    '&:hover': {
      backgroundColor: darkMode ? '#3a3a3a' : '#f3f4f6',
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6" style={darkModeStyles}>
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: darkMode ? '#60a5fa' : '#1e40af' }}>
        Liste des codes siège lésion
      </h1>
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg shadow-md overflow-hidden" style={cardStyles}>
            <h2 className="text-xl font-semibold p-4" style={headerStyles}>
              {category.id} - {category.title}
            </h2>
            <ul className="divide-y divide-gray-200">
              {category.items.map((item) => (
                <li key={item.id} className="p-4" style={itemStyles}>
                  <span className="font-medium" style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}>{item.id}</span> - {item.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="image-cortigroupe"></div>
      <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
        <h5 style={{ marginBottom: '40px', color: darkMode ? '#9ca3af' : '#4b5563' }}>
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
                background: darkMode
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
                background: darkMode
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
    </div>
  );
};
const categories = [
  {
    id: '00',
    title: "Localisation de la blessure non déterminée",
    items: []
  },
  {
    id: '10',
    title: "Tête, sans autre spécification",
    items: [
      { id: '11', title: "Tête (caput), cerveau, nerfs crâniens et vaisseaux cérébraux" },
      { id: '12', title: "Zone faciale" },
      { id: '13', title: "Œil / yeux" },
      { id: '14', title: "Oreille(s)" },
      { id: '15', title: "Dentition" },
      { id: '18', title: "Tête, multiples endroits affectés" },
      { id: '19', title: "Autres parties de la tête" }
    ]
  },
  {
    id: '20',
    title: "Cou, y compris colonne vertébrale et vertèbres du cou",
    items: [
      { id: '21', title: "Cou, y compris colonne vertébrale et vertèbres du cou" },
      { id: '29', title: "Autres parties du cou" }
    ]
  },
  {
    id: '30',
    title: "Dos, y compris colonne vertébrale et vertèbres du dos",
    items: [
      { id: '31', title: "Dos, y compris colonne vertébrale et vertèbres du dos" },
      { id: '39', title: "Autres parties du dos" }
    ]
  },
  {
    id: '40',
    title: "Torse et organes, sans autre spécification",
    items: [
      { id: '41', title: "Cage thoracique, côtes y compris omoplates et articulations" },
      { id: '42', title: "Poitrine, y compris organes" },
      { id: '43', title: "Abdomen et pelvis, y compris organes" },
      { id: '48', title: "Torse, multiples endroits affectés" },
      { id: '49', title: "Autres parties du torse" }
    ]
  },
  {
    id: '50',
    title: "Membres supérieurs, sans autre spécification",
    items: [
      { id: '51', title: "Épaule et articulations de l'épaule" },
      { id: '52', title: "Bras, y compris coude" },
      { id: '53', title: "Main" },
      { id: '54', title: "Doigt(s)" },
      { id: '55', title: "Poignet" },
      { id: '58', title: "Membres supérieurs, multiples endroits affectés" },
      { id: '59', title: "Autres parties des membres supérieurs" }
    ]
  },
  {
    id: '60',
    title: "Membres inférieurs, sans autre spécification",
    items: [
      { id: '61', title: "Hanche et articulation de la hanche" },
      { id: '62', title: "Jambe, y compris genou" },
      { id: '63', title: "Cheville" },
      { id: '64', title: "Pied" },
      { id: '65', title: "Orteil(s)" },
      { id: '68', title: "Membres inférieurs, multiples endroits affectés" },
      { id: '69', title: "Autres parties des membres inférieurs" }
    ]
  },
  {
    id: '70',
    title: "Ensemble du corps et endroits multiples, sans autre spécification",
    items: [
      { id: '71', title: "Ensemble du corps (effets systémiques)" },
      { id: '78', title: "Multiples endroits du corps affectés" }
    ]
  },
  {
    id: '99',
    title: "Autres parties du corps blessées",
    items: []
  }
];

export default SiegeLesion;