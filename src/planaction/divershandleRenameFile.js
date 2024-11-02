import React, { useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { Tooltip, Snackbar, Alert } from '@mui/material';
import { useLogger } from '../Hook/useLogger';

// Function to fetch action details
const fetchActionDetails = async (actionId) => {
  try {
    const response = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
    if (response.data) {
      return {
        workerFirstName: response.data.prenomTravailleur || '',
        workerLastName: response.data.nomTravailleur || '',
        company: response.data.entrepriseName || '',
        actionDate: response.data.DateHeureaction ? new Date(response.data.DateHeureaction).toLocaleDateString() : ''
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching action details:', error);
    return null;
  }
};

const RenameDialog = ({ fileId, currentFileName, actionId, files, setFiles, onClose }) => {
  const { logAction } = useLogger();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [newFileName, setNewFileName] = useState(currentFileName);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRename = async () => {
    try {
      const actionDetails = await fetchActionDetails(actionId);
      if (!actionDetails) {
        throw new Error('Unable to fetch action details');
      }

      await axios.put(`http://localhost:3100/api/planaction/${actionId}`, {
        files: files.map(file => file.fileId === fileId ? { ...file, fileName: newFileName } : file)
      });

      setFiles(files.map(file => file.fileId === fileId ? { ...file, fileName: newFileName } : file));

      await logAction({
        actionType: 'modification',
        details: `File renamed - Old name: ${currentFileName} - New name: ${newFileName} - Worker: ${actionDetails.workerFirstName} ${actionDetails.workerLastName} - Action date: ${actionDetails.actionDate}`,
        entity: 'File',
        entityId: fileId,
        company: actionDetails.company
      });

      showSnackbar('File renamed successfully', 'success');
      onClose();
    } catch (error) {
      console.error('Error renaming file:', error);
      showSnackbar('Error renaming file', 'error');
    }
  };

  return (
    <>
      <div className="custom-confirm-dialog">
        <h1 className="custom-confirm-title">Rename File</h1>
        <p className="custom-confirm-message">Enter the new file name:</p>
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <div className="custom-confirm-buttons">
          <Tooltip title="Click to confirm the new name" arrow>
            <button className="custom-confirm-button" onClick={handleRename}>
              Confirm
            </button>
          </Tooltip>
          <Tooltip title="Click to cancel renaming" arrow>
            <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
              Cancel
            </button>
          </Tooltip>
        </div>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const handleRenameFile = (fileId, currentFileName, actionId, files, setFiles) => {
  confirmAlert({
    customUI: ({ onClose }) => (
      <RenameDialog
        fileId={fileId}
        currentFileName={currentFileName}
        actionId={actionId}
        files={files}
        setFiles={setFiles}
        onClose={onClose}
      />
    )
  });
};

export default handleRenameFile;
