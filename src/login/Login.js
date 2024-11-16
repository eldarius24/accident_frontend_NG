import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import config from '../config.json'; // Ajout de l'import de config

// Fonction utilitaire pour les logs
const logAction = async (action) => {
  try {
    await axios.post('http://localhost:3100/api/logs', action);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du log:', error);
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode } = useTheme();
  const [daysWithoutAccident, setDaysWithoutAccident] = useState(0);
  const [lastAccidentDate, setLastAccidentDate] = useState(null);
  const apiUrl = config.apiUrl;

  useEffect(() => {
    const fetchLastAccident = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/accidents');

        if (response.data && response.data.length > 0) {
          const sortedAccidents = response.data.sort((a, b) => {
            const dateA = new Date(a.DateHeureAccident);
            const dateB = new Date(b.DateHeureAccident);
            return dateB - dateA;
          });

          const lastAccident = sortedAccidents[0];

          if (lastAccident && lastAccident.DateHeureAccident) {
            const accidentDate = new Date(lastAccident.DateHeureAccident);
            const today = new Date();

            if (!isNaN(accidentDate.getTime())) {
              const days = calculateDaysDifference(today, accidentDate);
              setDaysWithoutAccident(days);
              setLastAccidentDate(accidentDate);
            } else {
              setDaysWithoutAccident(0);
            }
          } else {
            setDaysWithoutAccident(0);
          }
        } else {
          setDaysWithoutAccident(0);
        }
      } catch (error) {
        setDaysWithoutAccident(0);
      }
    };

    fetchLastAccident();
  }, []);

  const calculateDaysDifference = (date1, date2) => {
    try {
      if (!date1 || !date2) return 0;

      const firstDate = new Date(date1);
      const secondDate = new Date(date2);

      if (isNaN(firstDate.getTime()) || isNaN(secondDate.getTime())) return 0;

      firstDate.setHours(0, 0, 0, 0);
      secondDate.setHours(0, 0, 0, 0);

      const diffTime = firstDate.getTime() - secondDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return Math.abs(diffDays);
    } catch (error) {
      return 0;
    }
  };

  // Style pour le compteur de jours
  const counterStyle = {
    textAlign: 'center',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '400px',
    backgroundColor: darkMode ? '#424242' : '#ee752d60',
    borderRadius: '8px',
    boxShadow: darkMode ? '0 3px 6px rgba(255,255,255,0.1)' : '0 3px 6px rgba(0,0,0,0.1)',
    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
    transition: 'all 0.3s ease-in-out',
  };

  const numberStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: darkMode ? '#ffffff' : '#000000',
    margin: '10px 0',
  };

  const textStyle = {
    fontSize: '18px',
    color: darkMode ? '#ffffff' : '#000000',
    marginBottom: '5px',
  };

  const dateStyle = {
    fontSize: '14px',
    color: darkMode ? '#cccccc' : '#666666',
    marginTop: '5px',
  };

  // Style des champs texte adapté au mode sombre/clair
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: darkMode ? '#424242' : '#ee752d60',
      '& fieldset': {
        borderColor: darkMode ? '#535353' : '#ee752d',
      },
      '&:hover fieldset': {
        borderColor: darkMode ? '#6e6e6e' : '#ee752d',
      },
      '&.Mui-focused fieldset': {
        borderColor: darkMode ? '#535353' : '#ee752d',
      },
    },
    '& .MuiInputBase-input': {
      color: darkMode ? '#ffffff' : 'inherit',
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
        WebkitBoxShadow: `0 0 0 100px ${darkMode ? '#424242' : '#ee752d60'} inset`,
        WebkitTextFillColor: darkMode ? '#ffffff' : 'inherit',
      },
    },
    '& .MuiInputLabel-root': {
      color: darkMode ? '#ffffff' : 'inherit',
    },
    '& .MuiIconButton-root': {
      color: darkMode ? '#ffffff' : 'inherit',
    },
  };

  // Style du bouton adapté au mode sombre/clair
  const buttonStyle = {
    backgroundColor: darkMode ? '#424242' : '#ee752d60',
    color: darkMode ? '#ffffff' : 'inherit',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#95ad22',
      transform: 'scale(1.08)',
      boxShadow: 6
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      // Log de tentative de connexion
      await logAction({
        actionType: 'connexion',
        details: `Tentative de connexion pour l'utilisateur: ${email}`,
        entity: 'Auth',
        userName: email,
        userId: 'anonymous'
      });

      const response = await axios.post('http://localhost:3100/api/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const userData = response.data;

      if (!userData || response.status !== 200) {
        setIsPasswordValid(false);

        await logAction({
          actionType: 'error',
          details: `Échec de connexion pour l'utilisateur: ${email} - Données invalides`,
          entity: 'Auth',
          userName: email,
          userId: 'anonymous'
        });

        alert('Login failed');
        return;
      }

      const tokenData = {
        data: userData
      };
      localStorage.setItem('token', JSON.stringify(tokenData));

      await logAction({
        actionType: 'connexion',
        details: `Connexion réussie pour l'utilisateur: ${userData.userName}`,
        entity: 'Auth',
        userName: userData.userName,
        userId: userData._id,
        entreprise: userData.entreprisesConseillerPrevention?.[0]
      });

      navigate('/');

    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response ? error.response.data : error.message);
      setIsPasswordValid(false);

      await logAction({
        actionType: 'error',
        details: `Erreur de connexion pour l'utilisateur: ${email} - ${error.response ? error.response.data : error.message}`,
        entity: 'Auth',
        userName: email,
        userId: 'anonymous'
      });

      alert('Login failed: ' + (error.response ? error.response.data.message : 'Unknown error'));
    }
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
      minHeight: '100vh'
    }}>
      <div className="max-h-screen">
        <div className="image-tigre"></div>
        <div className="flex justify-center max-h-96">
          <Tooltip title="Attention aux chocs et aux vibrations !!!" arrow>
            <Grid className="max-w-lg" container>
              <Grid item xs={6}>
                <div className="image-container1"></div>
              </Grid>
              <Grid item xs={6}>
                <div className="image-container2"></div>
              </Grid>
            </Grid>
          </Tooltip>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center min-h-20 space-y-4"
          role="form"
          aria-label="Formulaire de connexion"
        >
          <TextField
            {...register('email')}
            id="outlined-multiline-static"
            label="Email"
            className="w-1/2 shadow-md"
            sx={textFieldStyles}
            aria-label="Adresse email"
            required
            autoComplete="email"
            inputProps={{
              'aria-required': 'true'
            }}
          />

          <TextField
            sx={textFieldStyles}
            {...register('password')}
            id="outlined-multiline-password"
            label="Mot de passe"
            className="w-1/2 shadow-md"
            type={showPassword ? 'text' : "password"}
            error={!isPasswordValid}
            helperText={!isPasswordValid && 'Mot de passe incorrect'}
            aria-describedby={!isPasswordValid ? 'password-error-text' : undefined}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-pressed={showPassword}
                    tabIndex={0}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title="Rentrer votre Email et votre mot de passe pour vous connecter. Si vous n'en avez pas faite la demande au support via l'adresse suivante : bgillet.lecortil@cortigroupe.be" arrow>
            <Button
              sx={buttonStyle}
              type="submit"
              className="bg-[#00479871] hover:bg-green-950 w-1/2 shadow-md"
              aria-label="Se connecter"
              role="button"
            >
              Se connecter
            </Button>
          </Tooltip>
          <h6 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
            Pour avoir accès, veuillez le demander au support
          </h6>
        </form>
        {/* Compteur de jours sans accident */}
        <div style={counterStyle}>
          <div style={textStyle}>Le Cortigroupe a passé</div>
          <div style={numberStyle}>
            {isNaN(daysWithoutAccident) ? '0' : daysWithoutAccident}
          </div>
          <div style={textStyle}>sans accident</div>
          {lastAccidentDate && !isNaN(lastAccidentDate.getTime()) && (
            <div style={dateStyle}>
              Dernier accident le : {lastAccidentDate.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}

        </div>
        <div className="image-cortigroupe"></div>
        <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
          <h5
            role="note"
            style={{
              marginBottom: '40px',
              color: darkMode ? '#ffffff' : 'inherit'
            }}>
            Développé par Remy et Benoit pour Le Cortigroupe.
          </h5>
        </Tooltip>
      </div>
    </div>
  );
};

export default Login;