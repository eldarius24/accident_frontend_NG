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

/**
 * Formulaire de login
 * @returns Un formulaire de login
 * @example
 * <Login />
 */
const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { setDarkMode } = useTheme();

  /**
   * Fonction de connexion
   * @param {Object} data - Email et mot de passe
   * @property {string} data.email - Email
   * @property {string} data.password - Mot de passe
   * @returns {Promise<void>}
   * @example
   * <Login />
   */
  const onSubmit = async (data) => {
    const { email, password } = data;
  
    try {
      const response = await axios.post('http://localhost:3100/api/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      const userData = response.data;
  
      if (!userData || response.status !== 200) {
        setIsPasswordValid(false);
        alert('Login failed');
        return;
      }
  
      const tokenData = {
        data: userData
      };
      localStorage.setItem('token', JSON.stringify(tokenData));
  
      setDarkMode(!!userData.darkMode);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response ? error.response.data : error.message);
      setIsPasswordValid(false);
      alert('Login failed: ' + (error.response ? error.response.data.message : 'Unknown error'));
    }
  };

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