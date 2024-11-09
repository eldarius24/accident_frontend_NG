import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import config from '../config.json';
import AutoCompleteQ from '../_composants/autoCompleteQ';
import listetypeSupport from '../liste/listeSupport.json';

// Options par défaut au cas où le fichier JSON ne se charge pas correctement
const defaultOptions = [
  ""

];

const SupportDialog = ({ open, onClose }) => {
  const { userInfo } = useUserConnected();
  const apiUrl = config.apiUrl;

  // États du formulaire
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [typeSupport, setTypeSupport] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifier et préparer les options
  const supportOptions = React.useMemo(() => {
    try {
      // Vérifier que listetypeSupport existe et a la propriété AssureurStatus
      if (listetypeSupport && Array.isArray(listetypeSupport.AssureurStatus)) {
        return listetypeSupport.AssureurStatus;
      }
      console.warn('Format de listeSupport.json invalide, utilisation des options par défaut');
      return defaultOptions;
    } catch (error) {
      console.error('Erreur lors du chargement des options de support:', error);
      return defaultOptions;
    }
  }, []);

  useEffect(() => {
    // Log pour debug
    console.log('Type support actuel:', typeSupport);
    console.log('Options disponibles:', supportOptions);
  }, [typeSupport, supportOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!typeSupport) {
      setStatus({
        type: 'error',
        message: 'Veuillez sélectionner un type de support'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      if (!userInfo?.userLogin) {
        throw new Error('Information utilisateur manquante');
      }

      const emailData = {
        subject,
        message,
        typeSupport,
        from: userInfo.userLogin,
        userName: userInfo.userName || userInfo.userLogin
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
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
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
      disablePortal={false}
      PaperProps={{
        sx: {
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#424242' : 'white'
        },
        role: 'dialog',
        'aria-modal': 'true'
      }}
    >
      <DialogTitle
        id="support-dialog-title"
        sx={{
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#535353' : '#ee752d60',
          color: theme => theme.palette.mode === 'dark' ? 'white' : 'black'
        }}
      >
        Contacter le Support
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {/* Debug pour voir les options disponibles */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ display: 'none' }}>
              Options disponibles: {JSON.stringify(supportOptions)}
            </div>
          )}

          <AutoCompleteQ
            id='typeSupport'
            option={supportOptions} // Utilisation des options vérifiées
            label='Type de support'
            onChange={(typeSupportSelect) => {
              console.log('Nouvelle sélection:', typeSupportSelect); // Debug log
              setTypeSupport(typeSupportSelect);
            }}
            defaultValue={typeSupport}
            required={true}
            sx={{
              width: '100%',
              mb: 2
            }}
          />

          <TextField
            autoFocus
            margin="dense"
            label="Sujet"
            fullWidth
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isSubmitting}
            id="support-subject"
            aria-label="Sujet du message"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme =>
                  theme.palette.mode === 'dark' ? '#424242' : '#ee752d60',
              }
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
            id="support-message"
            aria-label="Contenu du message"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme =>
                  theme.palette.mode === 'dark' ? '#424242' : '#ee752d60',
              }
            }}
          />

          {status.message && (
            <Alert
              severity={status.type === 'error' ? 'error' : 'success'}
              sx={{ mt: 2 }}
              role="alert"
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
            aria-label="Annuler et fermer le formulaire"
            sx={{
              backgroundColor: theme =>
                theme.palette.mode === 'dark' ? '#424242' : '#ee752d60',
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
            aria-label={isSubmitting ? 'Envoi en cours' : 'Envoyer le message'}
            startIcon={isSubmitting ? <CircularProgress size={20} aria-hidden="true" /> : null}
            sx={{
              backgroundColor: theme =>
                theme.palette.mode === 'dark' ? '#424242' : '#ee752d60',
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