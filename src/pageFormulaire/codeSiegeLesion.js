import React from 'react';
import './formulaire.css';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import Footer from '../_composants/Footer';
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
      <Footer />
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