import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useUserConnected } from '../Hook/userConnected';
import { useTheme } from '../pageAdmin/user/ThemeContext';
import axios from 'axios';
import config from '../config.json';
import AutoCompleteQ from '../_composants/autoCompleteQ';
import listetypeSupport from '../liste/listeSupport.json';

const defaultOptions = [""];

const SupportDialog = ({ open, onClose, isLoginPage = false }) => {
  const { userInfo } = useUserConnected();
  const { darkMode } = useTheme();
  const apiUrl = config.apiUrl;
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [typeSupport, setTypeSupport] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const supportOptions = React.useMemo(() => {
    try {
      if (listetypeSupport && Array.isArray(listetypeSupport.AssureurStatus)) {
        return listetypeSupport.AssureurStatus;
      }
      return defaultOptions;
    } catch (error) {
      return defaultOptions;
    }
  }, []);

  // Style pour les composants en fonction du mode sombre/clair
  const dialogStyle = {
    backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
  };

  const inputStyle = {
    backgroundColor: darkMode ? '#424242' : '#ee752d60',
    '& .MuiOutlinedInput-root': {
      backgroundColor: darkMode ? '#424242' : '#ee752d60',
    },
    '& .MuiInputLabel-root': {
      color: darkMode ? '#ffffff' : '#000000',
    },
    '& .MuiOutlinedInput-input': {
      color: darkMode ? '#ffffff' : '#000000',
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!typeSupport) {
      setStatus({
        type: 'error',
        message: 'Veuillez sélectionner un type de support'
      });
      return;
    }

    if (isLoginPage && (!userName || !guestEmail)) {
      setStatus({
        type: 'error',
        message: 'Veuillez remplir votre nom et email'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const emailData = {
        subject,
        message,
        typeSupport,
        from: isLoginPage ? guestEmail : userInfo?.userLogin,
        userName: isLoginPage ? userName : userInfo?.userName || userInfo?.userLogin
      };

      const result = await axios.post(`http://${apiUrl}:3100/api/support/send-email`, emailData);

      if (result.data.success) {
        setStatus({
          type: 'success',
          message: 'Message envoyé avec succès'
        });
        setTimeout(() => {
          onClose();
          setSubject('');
          setMessage('');
          setTypeSupport('');
          setUserName('');
          setGuestEmail('');
        }, 2000);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Une erreur est survenue lors de l\'envoi'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubject('');
      setMessage('');
      setTypeSupport('');
      setUserName('');
      setGuestEmail('');
      setStatus({ type: '', message: '' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="support-dialog-title"
      keepMounted={false}
      disableEscapeKeyDown={isSubmitting}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      PaperProps={{
        style: dialogStyle,
        role: "dialog",
        "aria-modal": true
      }}
    >
      <DialogTitle
        id="support-dialog-title"
        sx={{
          backgroundColor: darkMode ? '#535353' : '#ee752d60',
          color: darkMode ? 'white' : 'black'
        }}
      >
        Contacter le Support
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {isLoginPage && (
            <>
              <TextField
                id="userName"
                margin="dense"
                label="Votre nom"
                fullWidth
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting}
                sx={{
                  mb: 2,
                  ...inputStyle
                }}
                aria-required="true"
                aria-label="Votre nom"
                inputProps={{
                  'aria-describedby': 'userName-helper-text'
                }}
              />
              <TextField
                margin="dense"
                label="Votre email"
                fullWidth
                required
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                disabled={isSubmitting}
                sx={{
                  mb: 2,
                  ...inputStyle
                }}
                aria-required="true"
                aria-label="Votre email"
                inputProps={{
                  'aria-describedby': 'userEmail-helper-text'
                }}
              />
            </>
          )}

          <AutoCompleteQ
            id="typeSupport"
            option={supportOptions}
            label="Type de support"
            onChange={setTypeSupport}
            defaultValue={typeSupport}
            required={true}
            sx={{ width: '100%', mb: 2 }}
            aria-required="true"
            aria-label="Sélectionner le type de support"
          />

          <TextField
            margin="dense"
            label="Sujet"
            fullWidth
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isSubmitting}
            sx={{
              mb: 2,
              ...inputStyle
            }}
            aria-required="true"
            aria-label="Sujet du message"
            inputProps={{
              'aria-describedby': 'subject-helper-text'
            }}
          />

          <TextField
            margin="dense"
            label="Message"
            fullWidth
            required
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            sx={inputStyle}
            aria-required="true"
            aria-label="Message"
            inputProps={{
              'aria-describedby': 'message-helper-text'
            }}
          />

          {status.message && (
            <Alert
              severity={status.type === 'error' ? 'error' : 'success'}
              sx={{ mt: 2 }}
            >
              {status.message}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="contained"
            sx={{
              backgroundColor: darkMode ? '#424242' : '#ee752d60',
              '&:hover': {
                backgroundColor: '#95ad22',
                transform: 'scale(1.08)',
                boxShadow: 6
              }
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: darkMode ? '#424242' : '#ee752d60',
              '&:hover': {
                backgroundColor: '#95ad22',
                transform: 'scale(1.08)',
                boxShadow: 6
              }
            }}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupportDialog;