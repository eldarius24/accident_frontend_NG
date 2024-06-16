import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { set, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';



const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
<<<<<<< HEAD
    const email = data.email;
    const password = data.password;
=======
    const password = data.password;
    const email = data.email;
>>>>>>> c1a8521531ba3fe9f85111ce22f2b79eb547758f

    try {
      const response = await axios.post('http://localhost:3100/api/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const user = await response;
      if (response.status == 200 && user) {
        localStorage.setItem('token', JSON.stringify(user));
        navigate('/')
      } else {
        setIsPasswordValid(false);
        alert('Login failed');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1 id="h7">T.I.G.R.E</h1>
          <h4>Traitement Informatisé de Gestions des Risque d'Entreprise</h4>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Grid container spacing={0} style={{ flexBasis: '60%', maxWidth: '60%' }} justifyContent="center">
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



          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <TextField {...register('email')} id="outlined-multiline-static" label="Email" sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <TextField
                {...register('password')}
                id="outlined-multiline-password"
                label="Mot de passe"
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
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
            </div>

            <Button
              type="submit"
              sx={{ backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' }, width: '50%', boxShadow: 3 }}
              style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}
            >
              Se connecter
            </Button>
          </form>



          <h6>Pour avoir accès, veuillez le demander au support : bgillet.lecortil@cortigroupe.be </h6>
        </div>
      </div>
      <div className="image-cortigroupe"></div>
      <h5> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Login;
