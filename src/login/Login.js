import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';


/**
 * Page de connexion à l'application T.I.G.R.E
 * Stocke les données de connexion dans le local storage
 * 
 * @returns page de connexion
 */
const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;


    try {
      const response = await axios.post('http://localhost:3100/api/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const user = await response;

      if (!user || response.status !== 200) {
        setIsPasswordValid(false);
        alert('Login failed');
        return;
      }
      localStorage.setItem('token', JSON.stringify(user));
      navigate('/')

    } catch (error) {
      console.error('Erreur lors de la connexion.', error);
    }
  };

  return (
    <div className='max-h-screen'>
        <h2 >T.I.G.R.E</h2>
        <h4>Traitement Informatisé de Gestions des Risque d'Entreprise</h4>
        <div className="flex justify-center max-h-96">
          <Grid className='max-w-lg' container>
            <Grid item xs={6}>
              <div className="image-container1">
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="image-container2">
              </div>
            </Grid>
          </Grid>
        </div>



        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center min-h-20 space-y-4">
          <TextField {...register('email')} id="outlined-multiline-static" label="Email" className="bg-[#0098f9] w-1/2 shadow-md" />

          <TextField
            {...register('password')}
            id="outlined-multiline-password"
            label="Mot de passe"
            className="bg-[#0098f9] w-1/2 shadow-md"
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

          <Button
            type="submit"
            className="bg-[#0098f9] hover:bg-green-950 w-1/2 shadow-md"
          >
            Se connecter
          </Button>
        </form>



        <h6>Pour avoir accès, veuillez le demander au support : bgillet.lecortil@cortigroupe.be </h6>
      <div className="image-cortigroupe"></div>
      <h5> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Login;
