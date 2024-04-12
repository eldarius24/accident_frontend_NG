import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Home from './Home';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextFieldP from './composants/textFieldP';



const Login = (props,accidentData) => {
  const { register, setValue, watch } = useForm();
  const [password, setPassword] = useState('');
  const [frameWidth, setFrameWidth] = useState(window.innerWidth * -0.5);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);



  const handleClicktest = () => {
    if (password === '123456') {
      setIsPasswordValid(true);
      props.setFormVisible(true);
    } else {
      setIsPasswordValid(false);
    }
  };



  useEffect(() => {
    const handleResize = () => {
      setFrameWidth(window.innerWidth * -0.5);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const frameStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${frameWidth * 1.3}px`, // Adjust the coefficient as needed
    border: '2px solid #84a784',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '20px 1rem',
    backgroundColor: '#d2e2d2',
  };

  const [nameLogin, setnameLogin] = useState(watch('nameLogin') ? watch('nameLogin') : (accidentData && accidentData.nameLogin ? accidentData.nameLogin : null));

  useEffect(() => {
    setValue('nameLogin', nameLogin)
  }, [nameLogin]);

  return (
    <div>
      {props.isFormVisible ? (
        <Home />
      ) : (
        
        <div style={frameStyle}>
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
            
            <TextFieldP id='nameLogin' label="Nom de l'utilisateur" onChange={setnameLogin} defaultValue={nameLogin}></TextFieldP>            

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
                        {showPassword ? <Visibility /> : <VisibilityOff  />}
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
              onClick={handleClicktest}
            >
              Se connecter
            </Button>
            <h6>Pour avoir accès, veuillez le demander au support : bgillet.lecortil@cortigroupe.be </h6>
          </div>
        </div>
      )}
      <div className="image-cortigroupe"></div>
      <h5> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
    </div>
  );
};

export default Login;
