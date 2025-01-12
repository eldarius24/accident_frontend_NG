import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const EmailSignataire = ({ entreprises, onChange, darkMode }) => {
      const [emailMap, setEmailMap] = useState({});
    const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialiser ou nettoyer la map d'emails quand les entreprises changent
    const newEmailMap = {};
    entreprises.forEach(entreprise => {
      if (!emailMap[entreprise]) {
        newEmailMap[entreprise] = '';
      } else {
        newEmailMap[entreprise] = emailMap[entreprise];
      }
    });
    setEmailMap(newEmailMap);
  }, [entreprises]);

  const handleEmailChange = (entreprise, email) => {
    const newEmailMap = { ...emailMap, [entreprise]: email };
    setEmailMap(newEmailMap);
    
    // Validation de l'email
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email !== '') {
      newErrors[entreprise] = 'Adresse email invalide';
    } else {
      delete newErrors[entreprise];
    }
    setErrors(newErrors);
    
    onChange(newEmailMap);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {entreprises.map(entreprise => (
        <div key={entreprise} className="w-1/2">
          <TextField
            fullWidth
            label={`Email pour ${entreprise}`}
            type="email"
            value={emailMap[entreprise] || ''}
            onChange={(e) => handleEmailChange(entreprise, e.target.value)}
            error={!!errors[entreprise]}
            helperText={errors[entreprise]}
            sx={{
              backgroundColor: darkMode ? '#424242' : '#00479871',
              boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : 3,
              '& .MuiInputLabel-root': {
                color: darkMode ? '#fff' : 'inherit'
              },
              '& .MuiOutlinedInput-root': {
                color: darkMode ? '#fff' : 'inherit',
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                },
                '& input': {
                  color: darkMode ? '#fff' : 'inherit'
                }
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default EmailSignataire;