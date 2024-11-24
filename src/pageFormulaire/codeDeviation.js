import React from 'react';
import './formulaire.css';
import { Tooltip } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';
const Deviation = () => {
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
        Liste des codes déviation
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
    id: '0',
    title: "Pas d'information",
    items: []
  },
  {
    id: '10',
    title: "Déviation par problème électrique, explosion, feu",
    items: [
      { id: '11', title: "Problème électrique par défaillance dans l'installation - entraînant un contact indirect" },
      { id: '12', title: "Problème électrique - entraînant un contact direct" },
      { id: '13', title: "Explosion" },
      { id: '14', title: "Incendie, embrasement" },
      { id: '19', title: "Autre Déviation connue du groupe 10 mais non listée ci-dessus" }
    ]
  },
  {
    id: '20',
    title: "Déviation par débordement, renversement, fuite, écoulement, vaporisation, dégagement",
    items: [
      { id: '21', title: "A l'état de solide - débordement, renversement" },
      { id: '22', title: "A l'état de liquide - fuite, suintement, écoulement, éclaboussure, aspersion" },
      { id: '23', title: "A l'état gazeux - vaporisation, formation d'aérosol, formation de gaz" },
      { id: '24', title: "Pulvérulent - génération de fumée, émission de poussières, particules" },
      { id: '29', title: "Autre Déviation connue du groupe 20 mais non listée ci-dessus" }
    ]
  },
  {
    id: '30',
    title: "Rupture, bris, éclatement, glissade, chute, effondrement d'Agent matériel",
    items: [
      { id: '31', title: "Rupture de matériel, aux joints, aux connexions" },
      { id: '32', title: "Rupture, éclatement, causant des éclats (bois, verre, métal, pierre, plastique, autres)" },
      { id: '33', title: "Glissade, chute, effondrement d'Agent matériel - supérieur (tombant sur la victime)" },
      { id: '34', title: "Glissade, chute, effondrement d'Agent matériel - inférieur (entraînant la victime)" },
      { id: '35', title: "Glissade, chute, effondrement d'Agent matériel - de plain-pied" },
      { id: '39', title: "Autre Déviation connue du groupe 30 mais non listée ci-dessus" }
    ]
  },
  {
    id: '40',
    title: "Perte, totale ou partielle, de contrôle de machine, moyen de transport - équipement de manutention, outil à main, objet, animal",
    items: [
      { id: '41', title: "Perte, totale ou partielle, de contrôle - de machine (y compris le démarrage intempestif) ainsi que de la matière travaillée par la machine" },
      { id: '42', title: "Perte, totale ou partielle, de contrôle de moyen de transport - d'équipement de manutention (motorisé ou non)" },
      { id: '43', title: "Perte, totale ou partielle, de contrôle d'outil à main (motorisé ou non) ainsi que de la matière travaillée par l'outil" },
      { id: '44', title: "Perte, totale ou partielle, de contrôle d'objet (porté, déplacé, manipulé, etc.)" },
      { id: '45', title: "Perte, totale ou partielle, de contrôle d'animal" },
      { id: '49', title: "Autre Déviation connue du groupe 40 mais non listée ci-dessus" }
    ]
  },
  {
    id: '50',
    title: "Glissade ou trébuchement avec chute, chute de personne",
    items: [
      { id: '51', title: "Chute de personne - de hauteur" },
      { id: '52', title: "Glissade ou trébuchement avec chute, chute de personne - de plain-pied" },
      { id: '59', title: "Autre Déviation connue du groupe 50 mais non listée ci-dessus" }
    ]
  },
  {
    id: '60',
    title: "Mouvement du corps sans contrainte physique (conduisant généralement à une blessure externe)",
    items: [
      { id: '61', title: "En marchant sur un objet coupant" },
      { id: '62', title: "En s'agenouillant, s'asseyant, s'appuyant contre" },
      { id: '63', title: "En étant attrapé, entraîné, par quelque chose ou par son élan" },
      { id: '64', title: "Mouvements non coordonnés, gestes intempestifs, inopportuns" },
      { id: '69', title: "Autre Déviation connue du groupe 60 mais non listée ci-dessus" }
    ]
  },
  {
    id: '70',
    title: "Mouvement du corps sous ou avec contrainte physique (conduisant généralement à une blessure interne)",
    items: [
      { id: '71', title: "En soulevant, en portant, en se levant" },
      { id: '72', title: "En poussant, en tractant" },
      { id: '73', title: "En déposant, en se baissant" },
      { id: '74', title: "En torsion, en rotation, en se tournant" },
      { id: '75', title: "En marchant lourdement, faux pas, glissade - sans chute" },
      { id: '79', title: "Autre Déviation connue du groupe 70 mais non listée ci-dessus" }
    ]
  },
  {
    id: '80',
    title: "Surprise, frayeur, violence, agression, menace, présence",
    items: [
      { id: '81', title: "Surprise, frayeur" },
      { id: '82', title: "Violence, agression, menace entre membres de l'entreprise soumis à l'autorité de l'employeur" },
      { id: '83', title: "Violence, agression, menace - provenant de personnes externes à l'entreprise envers les victimes dans le cadre de leur fonction (attaque de banque, chauffeurs de bus, etc.)" },
      { id: '84', title: "Agression, bousculade - par animal" },
      { id: '85', title: "Présence de la victime ou d'un tiers créant en soi un danger pour elle/lui-même et le cas échéant pour autrui" },
      { id: '89', title: "Autre Déviation connue du groupe 80 mais non listée ci-dessus" }
    ]
  },
  {
    id: '99',
    title: "Autre Déviation non listée dans cette classification",
    items: []
  }
];

export default Deviation;