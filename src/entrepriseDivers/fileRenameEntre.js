import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip, Snackbar, Alert } from '@mui/material';
import config from '../config.json';

const apiUrl = config.apiUrl;

const RenameDialog = React.memo(({ fileId, currentFileName, questionnaireId, enterpriseName, onRename, onClose, logAction }) => {
  const [newFileName, setNewFileName] = useState(currentFileName);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleRename = useCallback(async () => {
    try {
      if (newFileName === currentFileName) {
        onClose();
        return;
      }

      const response = await axios.put(`http://${apiUrl}:3100/api/questionnaires/${questionnaireId}`, {
        fileId,
        newFileName
      });

      if (response.data) {
        await logAction({
          actionType: 'modification',
          details: `Fichier renommé - Ancien nom: ${currentFileName} - Nouveau nom: ${newFileName}`,
          entity: 'Divers Entreprise',
          entityId: fileId,
          entreprise: enterpriseName
        });
        onRename(fileId, newFileName);
        showSnackbar('Fichier renommé avec succès', 'success');
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors du renommage:', error);
      showSnackbar('Erreur lors du renommage du fichier', 'error');
    }
  }, [fileId, currentFileName, newFileName, questionnaireId, enterpriseName, onRename, onClose, logAction, showSnackbar]);

  const handleInputChange = useCallback((e) => {
    setNewFileName(e.target.value.trim());
  }, []);

  return (
    <>
      <div className="custom-confirm-dialog">
        <h1 className="custom-confirm-title">Renommer le fichier</h1>
        <p className="custom-confirm-message">Entrez le nouveau nom du fichier :</p>
        <input
          type="text"
          value={newFileName}
          onChange={handleInputChange}
          className="custom-confirm-input"
          style={{
            border: '2px solid #0098f9',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '16px',
            width: '60%',
            backgroundColor: '#f0f8ff',
            color: 'black',
          }}
        />
        <div className="custom-confirm-buttons">
          <Tooltip title="Confirmer le nouveau nom" arrow>
            <button 
              className="custom-confirm-button" 
              onClick={handleRename}
              disabled={!newFileName || newFileName === currentFileName}
            >
              Confirmer
            </button>
          </Tooltip>
          <Tooltip title="Annuler le renommage" arrow>
            <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
              Annuler
            </button>
          </Tooltip>
        </div>
      </div>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
});

RenameDialog.displayName = 'RenameDialog';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const handleRenameFile = debounce((fileId, currentFileName, questionnaireId, enterpriseName, onRename, logAction) => {
  confirmAlert({
    customUI: ({ onClose }) => (
      <RenameDialog
        fileId={fileId}
        currentFileName={currentFileName}
        questionnaireId={questionnaireId}
        enterpriseName={enterpriseName}
        onRename={onRename}
        onClose={onClose}
        logAction={logAction}
      />
    )
  });
}, 300);

export default handleRenameFile;