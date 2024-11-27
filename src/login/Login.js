import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Tooltip, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import AccidentCounter from './accidentCounter';
import config from '../config.json';
import Footer from '../_composants/Footer';
const apiUrl = config.apiUrl;

// Fonction utilitaire pour les logs
const logAction = async (action) => {
  try {
    await axios.post(`http://${apiUrl}:3100/api/logs`, action);
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

  useEffect(() => {
    const fetchLastAccident = async () => {
      try {
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents`);

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
    transition: 'all 0.1s ease-in-out',
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
    transition: 'all 0.1s ease-in-out',
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

      const response = await axios.post(`http://${apiUrl}:3100/api/login`, { email, password }, {
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0rem 0',
            position: 'relative',
            padding: '30px 0',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '300%',
              height: '100%',
              background: darkMode
                ? 'linear-gradient(90deg, transparent 0%, rgba(122,142,28,0.1) 45%, rgba(122,142,28,0.3) 50%, rgba(122,142,28,0.1) 55%, transparent 100%)'
                : 'linear-gradient(90deg, transparent 0%, rgba(238,117,45,0.1) 45%, rgba(238,117,45,0.3) 50%, rgba(238,117,45,0.1) 55%, transparent 100%)',
              animation: 'shine 3s infinite linear',
            },
            '@keyframes shine': {
              to: {
                transform: 'translateX(50%)',
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '-2px',
              padding: '3px',
              background: darkMode
                ? 'linear-gradient(45deg, #7a8e1c, transparent, #a4bd24, transparent, #7a8e1c)'
                : 'linear-gradient(45deg, #ee752d, transparent, #f4a261, transparent, #ee752d)',
              borderRadius: '16px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'borderRotate 4s linear infinite',
            },
            '@keyframes borderRotate': {
              from: {
                transform: 'rotate(0deg)',
              },
              to: {
                transform: 'rotate(360deg)',
              },
            },
          }}

        >
          <Box
            sx={{
              position: 'relative',
              padding: '20px 40px',
              borderRadius: '15px',
              background: darkMode
                ? 'rgba(0,0,0,0.3)'
                : 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: darkMode
                ? '0 8px 32px 0 rgba(0,0,0, 0.37)'
                : '0 8px 32px 0 rgba(238,117,45, 0.37)',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 900,
                background: darkMode
                  ? 'linear-gradient(45deg, #7a8e1c 0%, #a4bd24 25%, #d4e157 50%, #a4bd24 75%, #7a8e1c 100%)'
                  : 'linear-gradient(45deg, #ee752d 0%, #f4a261 25%, #ffb74d 50%, #f4a261 75%, #ee752d 100%)',
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                textAlign: 'center',
                animation: 'gradient 3s linear infinite',
                '@keyframes gradient': {
                  '0%': {
                    backgroundPosition: '0% center',
                  },
                  '100%': {
                    backgroundPosition: '200% center',
                  },
                },
                textShadow: darkMode
                  ? '0 0 20px rgba(122,142,28,0.5)'
                  : '0 0 20px rgba(238,117,45,0.5)',
                position: 'relative',
                '&::before': {
                  content: 'attr(data-text)',
                  position: 'absolute',
                  left: '2px',
                  top: '2px',
                  width: '100%',
                  height: '100%',
                  backgroundImage: darkMode
                    ? 'linear-gradient(45deg, #7a8e1c 0%, transparent 100%)'
                    : 'linear-gradient(45deg, #ee752d 0%, transparent 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  zIndex: -1,
                  filter: 'blur(1px)',
                },
              }}
              data-text="T.I.G.R.E"
            >
              T.I.G.R.E
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                fontWeight: 500,
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(128, 128, 128, 0.8)', // Ajout de la couleur grise
                textAlign: 'center',
                letterSpacing: '0.2em',
                marginTop: '15px',
                position: 'relative',
                textTransform: 'uppercase',
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50%',
                  height: '2px',
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
                    : 'linear-gradient(90deg, transparent, #ee752d, transparent)',
                },
              }}
            >
              Traitement Informatisé pour la Gestion des Risques en Entreprise
            </Typography>
          </Box>

          {/* Particules décoratives */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              zIndex: 0,
              opacity: 0.5,
              '& .particle': {
                position: 'absolute',
                width: '3px',
                height: '3px',
                background: darkMode ? '#7a8e1c' : '#ee752d',
                borderRadius: '50%',
                animation: 'float 3s infinite ease-in-out',
              },
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-20px)',
                },
              },
            }}
          >
            {[...Array(20)].map((_, i) => (
              <Box
                key={i}
                className="particle"
                sx={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </Box>
        </Box>
        <AccidentCounter
          days={isNaN(daysWithoutAccident) ? 0 : daysWithoutAccident}
          lastDate={lastAccidentDate}
          darkMode={darkMode}
        />
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
            autoComplete="email" // déjà présent
            inputProps={{
              'aria-required': 'true',
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
            autoComplete="current-password" // Ajout de cette ligne
            inputProps={{
              'aria-required': 'true'
            }}
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
        <Footer />
      </div>
    </div>
  );
};

export default Login;