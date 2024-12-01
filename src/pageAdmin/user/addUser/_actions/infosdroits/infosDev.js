// Layout/Admin/User/_actions/infosdroits/InfosDev.js
import React from 'react';
import { useTheme } from '../../../../../Hook/ThemeContext';

const InfosDev = () => {
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
        Informations sur les droits d'accès
      </h1>
      <div className="space-y-6">
        <div className="rounded-lg shadow-md overflow-hidden" style={cardStyles}>
          <h2 className="text-xl font-semibold p-4" style={headerStyles}>
            Droits Administrateur
          </h2>
          <div className="p-4" style={itemStyles}>
            <p>L'administrateur du site a un accès complet à toutes les fonctionnalités, notamment :</p>
            <ul className="list-disc pl-5 mt-2">
              <li>✅ Gestion complète des utilisateurs</li>
              <li>✅ Gestion complète des droits d'accès</li>
              <li>✅ Gestion complète des entreprises et secteurs</li>
              <li>✅ Gestion complète des logs</li>
              <li>❌ Gestion complète des messages support liés a l'administration</li>
              <li>✅ Gestion complète des messages support liés aux dévelopements</li>
              <li>✅ Gestion complète des archivages</li>
              <li>✅ Visualistion total de tous les accidents</li>
              <li>❌ Visualistion limitée de tous les accidents</li>
              <li>❌ Visualistion limitée des accidents liés a l'entreprise</li>
              <li>✅ Gestion de tous les accidents</li>
              <li>❌ Gestion des accidents liés a l'entreprise</li>
              <li>✅ Visualistion total de toutes les actions</li>
              <li>❌ Visualistion des actions liés a l'entreprise</li>
              <li>✅ Gestion de tous les actions</li>
              <li>❌ Gestion des actions liés a l'entreprise</li>
              <li>✅ Visualistion total de toutes les document divers</li>
              <li>❌ Visualistion des document divers liés a l'entreprise</li>
              <li>✅ Gestion de tous les document divers</li>
              <li>❌ Gestion des document divers liés a l'entreprise</li>
            </ul>
          </div>
        </div>
        {/* Ajoutez d'autres sections selon vos besoins */}
      </div>
    </div>
  );
};

export default InfosDev;