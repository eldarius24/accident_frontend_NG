import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Home from './Home';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const Login = (props) => {
  const { register } = useForm();
  const [password, setPassword] = useState('');
  const [frameWidth, setFrameWidth] = useState(window.innerWidth * -0.5);

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClicktest = () => {
    if (password === '123456') {
      props.setFormVisible(true);
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

  return (
    <div>
      {props.isFormVisible ? (
        <Home />
      ) : (
        <div style={frameStyle}>
          <div>
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
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <TextField
                {...register('nameLogin')}
                id="outlined-multiline-nameLogin"
                label="Identifiant"
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                multiline
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <TextField
                {...register('mdpLogin')}
                id="outlined-multiline-mdpLogin"
                label="Mot de passe"
                sx={{ backgroundColor: '#84a784', width: '50%', boxShadow: 3 }}
                multiline
                type="password"
                onChange={handleChangePassword}
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
