import React from 'react';
import { useLocation } from 'react-router-dom';

const quesEntrep = () => {
  const location = useLocation();
  const { enterprise } = location.state || {};

  return (
    <div>
      <h1>Questionnaire Entreprise</h1>
      {/* Votre contenu ici */}
    </div>
  );
};

export default quesEntrep;  // C'est important d'avoir cet export par défaut