import React, { useState } from 'react';
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
  const { setDarkMode } = useTheme();

  const onSubmit = async (data) => {
    const { email, password } = data;
  
    try {
      // Log de tentative de connexion
      await logAction({
        actionType: 'connexion',
        details: `Tentative de connexion pour l'utilisateur: ${email}`,
        entity: 'Auth',
        userName: email, // On utilise l'email comme userName pour le moment
        userId: 'anonymous' // ID temporaire pour les logs de tentative
      });

      const response = await axios.post('http://localhost:3100/api/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      const userData = response.data;
  
      if (!userData || response.status !== 200) {
        setIsPasswordValid(false);
        
        // Log d'échec de connexion
        await logAction({
          actionType: 'connexion',
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
  
      // Log de connexion réussie
      await logAction({
        actionType: 'connexion',
        details: `Connexion réussie pour l'utilisateur: ${userData.userName}`,
        entity: 'Auth',
        userName: userData.userName,
        userId: userData._id,
        entreprise: userData.entreprisesConseillerPrevention?.[0]
      });

      setDarkMode(!!userData.darkMode);
      navigate('/');
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response ? error.response.data : error.message);
      setIsPasswordValid(false);
      
      // Log d'erreur de connexion
      await logAction({
        actionType: 'connexion',
        details: `Erreur de connexion pour l'utilisateur: ${email} - ${error.response ? error.response.data : error.message}`,
        entity: 'Auth',
        userName: email,
        userId: 'anonymous'
      });
      
      alert('Login failed: ' + (error.response ? error.response.data.message : 'Unknown error'));
    }
  };

  // Reste du code inchangé...
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ee752d60',
      '& fieldset': {
        borderColor: '#ee752d',
      },
      '&:hover fieldset': {
        borderColor: '#ee752d',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ee752d',
      },
    },
    '& .MuiInputBase-input': {
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 100px #ee752d60 inset',
        WebkitTextFillColor: 'inherit',
      },
    },
  };

  return (
    <div>
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center min-h-20 space-y-4">
          <TextField
            {...register('email')}
            id="outlined-multiline-static"
            label="Email"
            className="w-1/2 shadow-md"
            sx={textFieldStyles}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title="Rentrer votre Email et votre mot de passe pour vous connecter. Si vous n'en avez pas faite la demande au support via l'adresse suivante : bgillet.lecortil@cortigroupe.be" arrow>
            <Button 
              sx={{
                backgroundColor: '#ee752d60',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#95ad22',
                  transform: 'scale(1.08)',
                  boxShadow: 6
                }
              }}
              type="submit"
              className="bg-[#00479871] hover:bg-green-950 w-1/2 shadow-md"
            >
              Se connecter
            </Button>
          </Tooltip>
          <h6>Pour avoir accès, veuillez le demander au support : bgillet.lecortil@cortigroupe.be</h6>
        </form>

        <div className="image-cortigroupe"></div>
        <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
          <h5 style={{ marginBottom: '40px' }}>
            Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be
          </h5>
        </Tooltip>
      </div>
    </div>
  );
};

export default Login;