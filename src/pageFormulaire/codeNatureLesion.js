import React from 'react';
import './formulaire.css';
import { Tooltip } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';
const NatureLesion = () => {
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
        Liste codes nature lésion
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
    title: "Nature de la blessure inconnue ou non précisée",
    items: []
  },
  {
    id: '10',
    title: "Plaies et blessures superficielles",
    items: [
      { id: '11', title: "Blessures superficielles" },
      { id: '12', title: "Plaies ouvertes" },
      { id: '13', title: "Plaies avec pertes de substances" },
      { id: '19', title: "Autres types de plaies et de blessures superficielles" }
    ]
  },
  {
    id: '20',
    title: "Fractures osseuses",
    items: [
      { id: '21', title: "Fractures fermées" },
      { id: '22', title: "Fractures ouvertes" },
      { id: '29', title: "Autres types de fractures osseuses" }
    ]
  },
  {
    id: '30',
    title: "Luxations, entorses et foulures",
    items: [
      { id: '31', title: "Luxations et sub-luxations" },
      { id: '32', title: "Entorses et foulures" },
      { id: '39', title: "Autres types de luxations, d'entorses et de foulures" }
    ]
  },
  {
    id: '40',
    title: "Amputations traumatiques (perte de parties du corps)",
    items: [
      { id: '41', title: "Amputations" }
    ]
  },
  {
    id: '50',
    title: "Commotions et traumatismes internes",
    items: [
      { id: '51', title: "Commotions et traumatismes internes" },
      { id: '52', title: "Traumatismes internes" },
      { id: '53', title: "Commotions et traumatismes internes qui, en l'absence de traitement, peuvent mettre la survie en cause" },
      { id: '54', title: "Effets nocifs de l'électricité" },
      { id: '59', title: "Autres types de commotions et de traumatismes internes" }
    ]
  },
  {
    id: '60',
    title: "Brûlures, brûlures par exposition à un liquide bouillant et gelures",
    items: [
      { id: '61', title: "Brûlures et brûlures par exposition à un liquide bouillant (thermiques)" },
      { id: '62', title: "Brûlures chimiques (corrosions)" },
      { id: '63', title: "Gelures" },
      { id: '69', title: "Autres types de brûlures, de brûlures par exposition à un liquide bouillant et de gelures" }
    ]
  },
  {
    id: '70',
    title: "Empoisonnements et infections",
    items: [
      { id: '71', title: "Empoisonnements aigus" },
      { id: '72', title: "Infections aiguës" },
      { id: '79', title: "Autres types d'empoisonnements et d'infections" }
    ]
  },
  {
    id: '80',
    title: "Noyade et asphyxie",
    items: [
      { id: '81', title: "Asphyxies" },
      { id: '82', title: "Noyades et submersions non mortelles" },
      { id: '89', title: "Autres types de noyades et d'asphyxies" }
    ]
  },
  {
    id: '90',
    title: "Effets du bruit, des vibrations et de la pression",
    items: [
      { id: '91', title: "Perte auditive aiguë" },
      { id: '92', title: "Effets de la pression (barotrauma)" },
      { id: '99', title: "Autres effets du bruit, des vibrations et de la pression" }
    ]
  },
  {
    id: '100',
    title: "Effets des extrêmes de température, de la lumière et des radiations",
    items: [
      { id: '101', title: "Chaleur et coups de soleil" },
      { id: '102', title: "Effets des radiations (non thermiques)" },
      { id: '103', title: "Effets du froid" },
      { id: '109', title: "Autres effets des extrêmes de température, de la lumière et des radiations" }
    ]
  },
  {
    id: '110',
    title: "Choc",
    items: [
      { id: '111', title: "Chocs consécutifs à des agressions et menaces" },
      { id: '112', title: "Chocs traumatiques" },
      { id: '119', title: "Autres types de chocs" }
    ]
  },
  {
    id: '120',
    title: "Blessures multiples",
    items: []
  },
  {
    id: '999',
    title: "Autres blessures déterminées non classées sous d'autres rubriques",
    items: []
  }
];

export default NatureLesion;