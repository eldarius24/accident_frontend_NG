import React, { useState, useCallback } from 'react';
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

const SupportDialog = ({ open, onClose }) => {
  const { userInfo } = useUserConnected();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = config.apiUrl;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      if (!userInfo?.userLogin) {
        throw new Error('Information utilisateur manquante');
      }

      console.log('Envoi à:', `http://${apiUrl}:3100/api/support/send-email`);
      const result = await axios.post(`http://${apiUrl}:3100/api/support/send-email`, {
        subject: formData.subject,
        message: formData.message,
        from: userInfo.userLogin,
        userName: userInfo.userName || userInfo.userLogin
      });

      if (result.data.success) {
        setStatus({
          type: 'success',
          message: 'Message envoyé avec succès'
        });
        setTimeout(() => {
          onClose();
          setFormData({ subject: '', message: '' });
        }, 2000);
      } else {
        throw new Error(result.data.message || 'Erreur lors de l\'envoi du message');
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

  return (
    <Dialog 
      open={open} 
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#424242' : 'white'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#535353' : '#ee752d60',
          color: theme => theme.palette.mode === 'dark' ? 'white' : 'black'
        }}
      >
        Contacter le Support
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Sujet"
            fullWidth
            required
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              subject: e.target.value
            }))}
            disabled={isSubmitting}
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
            value={formData.message}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              message: e.target.value
            }))}
            disabled={isSubmitting}
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
            >
              {status.message}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant="contained"
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
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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