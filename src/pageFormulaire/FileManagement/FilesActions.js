import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Tooltip, Card, Modal, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';  // Ajout de l'icône d'édition
import { confirmAlert } from 'react-confirm-alert';
import { saveAs } from 'file-saver';
import deleteFile from "./deleteFile";
import CustomSnackbar from '../../_composants/CustomSnackbar';
import FileViewer from './fileViewer';
import getPreview from "./getPreview";
import handleRenameFile from "./handleRenameFile";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'hidden'
};

export default function ListFilesInAccident(accidentId) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
                if (!response || !response.data.files) throw new Error('Pas de fichiers trouvés');
                setFiles(response.data.files);

                const previewPromises = response.data.files.map(file => getPreview(file.fileId, file.fileName));
                const previewResults = await Promise.all(previewPromises);

                const previewMap = response.data.files.reduce((acc, file, index) => {
                    acc[file.fileId] = previewResults[index];
                    return acc;
                }, {});

                setPreviews(previewMap);
                showSnackbar('Fichiers chargés avec succès', 'success');
            } catch (error) {
                console.error("Erreur lors du chargement des fichiers:", error);
                showSnackbar('Erreur lors du chargement des fichiers', 'error');
            }
        }

        if (accidentId) {
            fetchData();
        }
    }, [accidentId]);

    async function handleDeleteFile(fileId) {
        try {
            await deleteFile({ fileId, accidentId });
            const updatedFiles = files.filter(file => file.id !== fileId);
            setFiles(updatedFiles);
            showSnackbar('Fichier en cours de suppression', 'success');
            setTimeout(() => showSnackbar('Fichier supprimé avec succès', 'success'), 1000);
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            showSnackbar('Erreur lors de la suppression du fichier', 'error');
        }
    }

    function popUpDelete(fileId) {
        confirmAlert({
            customUI: ({ onClose }) => (
                <div className="custom-confirm-dialog">
                    <h1 className="custom-confirm-title">Supprimer</h1>
                    <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                    <div className="custom-confirm-buttons">
                        <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                            <button
                                className="custom-confirm-button"
                                onClick={() => {
                                    handleDeleteFile(fileId);
                                    onClose();
                                }}
                            >
                                Oui
                            </button>
                        </Tooltip>
                        <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                            <button
                                className="custom-confirm-button custom-confirm-no"
                                onClick={onClose}
                            >
                                Non
                            </button>
                        </Tooltip>
                    </div>
                </div>
            )
        });
    }

    async function getFile(fileId) {
        if (!fileId) throw new Error('Pas de fileId indiqué');

        try {
            const response = await axios.get(`http://localhost:3100/api/getFile/${fileId}`, {
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`Erreur de récupération du fichier : ${response.status}`);

            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du fichier:', error);
        }
    }


    const downloadFile = async ({ fileId, fileName }) => {
        if (!fileId || !fileName) throw new Error('Informations de fichier manquantes');

        try {
            const blob = await getFile(fileId);
            saveAs(blob, fileName);
            showSnackbar('Téléchargement réussi', 'success');
        } catch (error) {
            console.error('Erreur de téléchargement:', error);
            showSnackbar('Erreur lors du téléchargement du fichier', 'error');
        }
    };

    const handleOpenModal = (file) => {
        setSelectedFile(file);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedFile(null);
        setModalOpen(false);
    };

    return (
        <div>
            <h3>Liste des fichiers associés à l'accident</h3>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {Array.isArray(files) && files.map(file => (
                    <li key={file.fileId} style={{ listStyleType: 'none', margin: '10px' }}>
                        <Card sx={{
                            backgroundColor: '#fab82b56',
                            width: 275,
                            height: 275,
                            border: '2px solid #000000',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: 0 // Enlever le padding par défaut
                        }}>
                            <Box sx={{
                                width: '50px', // Largeur fixe pour la zone des boutons
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 3,
                                borderRight: '5px solid rgba(0, 0, 0, 0.1)',
                                padding: '8px'
                            }}>

                                <Tooltip title="Renommer le fichier" arrow>
                                    <Button
                                        sx={{
                                            minWidth: '36px',
                                            width: '36px',
                                            height: '36px',
                                            padding: 0,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                        onClick={() => handleRenameFile(
                                            file.fileId,
                                            file.fileName,
                                            accidentId,
                                            files,
                                            setFiles
                                        )}
                                        variant="contained"
                                        color="warning"
                                    >
                                        <EditIcon sx={{ fontSize: 20 }} />
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Télécharger le fichier" arrow>
                                    <Button
                                        sx={{
                                            minWidth: '36px',
                                            width: '36px',
                                            height: '36px',
                                            padding: 0,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                        onClick={() => downloadFile({ fileId: file.fileId, fileName: file.fileName })}
                                        variant="contained"
                                        color="primary"
                                    >
                                        <GetAppIcon sx={{ fontSize: 20 }} />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Supprimer le fichier" arrow>
                                    <Button
                                        sx={{
                                            minWidth: '36px',
                                            width: '36px',
                                            height: '36px',
                                            padding: 0,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                        onClick={() => popUpDelete(file.fileId)}
                                        variant="contained"
                                        color="error"
                                    >
                                        <DeleteForeverIcon sx={{ fontSize: 20 }} />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Visualiser le fichier" arrow>
                                    <Button
                                        sx={{
                                            minWidth: '36px',
                                            width: '36px',
                                            height: '36px',
                                            padding: 0,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                        onClick={() => handleOpenModal(file)}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        <VisibilityIcon sx={{ fontSize: 20 }} />
                                    </Button>
                                </Tooltip>
                            </Box>

                            {/* Conteneur pour le contenu */}
                            <Box sx={{
                                flexGrow: 1,
                                overflow: 'hidden',
                                padding: '16px'
                            }}>
                                <Typography sx={{ fontSize: 12, color: 'text.secondary', marginBottom: 1 }}>
                                    {file.fileName}
                                </Typography>
                                {previews[file.fileId] ? (
                                    previews[file.fileId].type === 'image' ? (
                                        <img src={previews[file.fileId].url} alt={file.fileName} style={{ width: '100%', height: 'auto' }} />
                                    ) : previews[file.fileId].type === 'pdf' ? (
                                        <img src={previews[file.fileId].url} alt={file.fileName} style={{ width: '100%', height: 'auto' }} />
                                    ) : previews[file.fileId].type === 'txt' ? (
                                        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                            {previews[file.fileId].text}
                                        </Typography>
                                    ) : null
                                ) : (
                                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                        {file.fileName}
                                    </Typography>
                                )}
                            </Box>
                        </Card>
                    </li>
                ))}
            </ul>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="file-viewer-modal"
            >
                <Box sx={modalStyle}>
                    <Button
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </Button>
                    {selectedFile && (
                        <FileViewer
                            file={selectedFile}
                            fileContent={previews[selectedFile.fileId]}
                        />
                    )}
                </Box>
            </Modal>

            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </div>
    );
}