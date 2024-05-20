import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextFieldP from './composants/textFieldP';
import axios from 'axios';



const Login = (props, accidentData) => {
  const navigate = useNavigate();
  const { register, setValue, watch, handleSubmit } = useForm();
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setsetEmail] = useState(watch('email') ? watch('email') : (accidentData && accidentData.email ? accidentData.email : null));



  useEffect(() => {
    setValue('email', email)
  }, [email]);

  const onSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3100/api/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response;
      console.log("data", data);
      if (response.status == 200 && data) {
        localStorage.setItem('token', data);
        navigate('/accueil')
      } else {
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
                  {/* Insérez votre code pour l'image 1 */}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="image-container2">
                  {/* Insérez votre code pour l'image 2 */}
                </div>
              </Grid>
            </Grid>
          </div>



          <form onSubmit={handleSubmit(onSubmit)}>

            <TextFieldP id='email' label="Email" onChange={setsetEmail} defaultValue={email}></TextFieldP>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>

              <TextField
                {...register('mdpLogin')}
                id="outlined-multiline-mdpLogin"
                label="Mot de passe"
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                type={showPassword ? 'text' : "password"}
                error={!isPasswordValid}
                helperText={!isPasswordValid && 'Mot de passe incorrect'}
                onChange={(event) => setPassword(event.target.value)}
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
