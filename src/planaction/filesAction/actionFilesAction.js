import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Tooltip, Card, Modal, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { confirmAlert } from 'react-confirm-alert';
import { saveAs } from 'file-saver';
import CustomSnackbar from '../../_composants/CustomSnackbar';
import FileViewer from './actionfileViewer';
import getPreview from "./actiongetPreview";
import handleRenameFile from "./actionhandleRenameFile";
import { blueGrey } from '@mui/material/colors';
import { useLogger } from '../../Hook/useLogger';
import deleteFile, { getactionDiversDetails } from "./actiondeleteFile";
import showDeleteConfirm from './actionshowDeleteConfirm';

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
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
};

/**
 * Affiche la liste des fichiers associés à un action.
 * 
 * @param {number} actionId Identifiant de l'action
 * @returns {JSX.Element} Liste des fichiers associés à l'action
 */

export default function ListFilesInaction(actionId) {
    const { logAction } = useLogger();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            handleCloseModal();
        }
    };

    /**
     * Affiche un message dans une snackbar.
     * @param {string} message - Le message à afficher.
     * @param {string} [severity='info'] - La gravité du message. Les valeurs possibles sont 'info', 'success', 'warning' et 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
     * Ferme la snackbar si l'utilisateur clique sur le bouton "Fermer" ou en dehors de la snackbar.
     * Si l'utilisateur clique sur la snackbar elle-même (et non sur le bouton "Fermer"), la snackbar ne se ferme pas.
     * 
     * @param {object} event - L'événement qui a déclenché la fermeture de la snackbar.
     * @param {string} reason - La raison pour laquelle la snackbar se ferme. Si elle vaut 'clickaway', cela signifie que l'utilisateur a cliqué en dehors de la snackbar.
     */
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };
    useEffect(() => {
        async function fetchData() {
            if (!actionId) return;

            try {
                const response = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
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

        if (actionId) {
            fetchData();
        }
    }, [actionId]);

    /**
     * Supprime un fichier de la base de données et de la liste des fichiers de l'action
     * Si la suppression réussit, met à jour l'état de la liste des fichiers et affiche un message de réussite.
     * Si la suppression échoue, affiche un message d'erreur.
     * @param {string} fileId - L'ID du fichier à supprimer
     */
    const handleDeleteFile = async (fileId) => {
        try {
            const fileToDelete = files.find(file => file.fileId === fileId);
            if (!fileToDelete) {
                showSnackbar('Fichier non trouvé', 'error');
                return;
            }

            const actionDetails = await getactionDiversDetails(actionId);

            await deleteFile({
                fileId,
                actionId,
                fileName: fileToDelete.fileName,
                async onDeleteSuccess(details) {
                    await logAction({
                        actionType: 'suppression',
                        details: `Suppression du fichier - Nom: ${fileToDelete.fileName} - Action: ${details.nomTravailleur} - Date action: ${details.dateAction}`,
                        entity: 'action',
                        entityId: fileId,
                        entreprise: details.entreprise || null
                    });
                }
            });

            setFiles(prevFiles => prevFiles.filter(file => file.fileId !== fileId));
            showSnackbar('Fichier en cours de suppression', 'success');
            setTimeout(() => showSnackbar('Fichier supprimé avec succès', 'success'), 1000);
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            showSnackbar('Erreur lors de la suppression du fichier', 'error');
        }
    };

    /**

     * Affiche une boîte de dialogue de confirmation de suppression

     * pour demander confirmation de suppression d'un fichier

     * @param {string} fileId - L'ID du fichier à supprimer

     */

    const handleFileDelete = (fileId) => {
        showDeleteConfirm({
            message: "Êtes-vous sûr de vouloir supprimer ce fichier ?",
            onConfirm: () => handleDeleteFile(fileId),
            title: "Supprimer le fichier",
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            confirmTooltip: "Cliquer pour confirmer la suppression",
            cancelTooltip: "Cliquer pour annuler la suppression"
        });
    };

    /**
     * Récupère un fichier de la base de données en fonction de son ID.
     * @param {string} fileId - L'ID du fichier à récupérer.
     * @returns {Promise<Blob>} Le fichier récupéré sous forme de blob.
     * @throws {Error} Si le fichier n'a pas pu être récupéré.
     */
    async function getFile(fileId) {
        if (!fileId) throw new Error('Pas de fileId indiqué');

        try {
            const response = await axios.get(`http://localhost:3100/api/getFileAction/${fileId}`, {
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`Erreur de récupération du fichier : ${response.status}`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du fichier:', error);
        }
    }

    /**
  * Télécharge un fichier et crée un log de l'action.
  * @param {Object} params Les paramètres de la fonctio
  * @param {string} params.fileId L'ID du fichier
  * @param {string} params.fileName Le nom du fichier
  * @param {string} params.actionId L'ID de l'action associé
  */
    const downloadFile = async ({ fileId, fileName }) => {
        if (!fileId || !fileName) {
            throw new Error('Informations de fichier manquantes');
        }

        try {
            // Téléchargement du fichier
            const blob = await getFile(fileId);
            saveAs(blob, fileName);
            // Récupération des détails de l'action
            const actionDetails = await getactionDiversDetails(actionId);
            // Log de l'action de téléchargement
            await logAction({
                actionType: 'export',
                details: `Téléchargement du fichier - Nom: ${fileName} - Travailleur: ${actionDetails?.nomTravailleur} ${actionDetails?.prenomTravailleur} - Date action: ${actionDetails?.dateaction}`,
                entity: 'action',
                entityId: fileId,
                entreprise: actionDetails?.entreprise || null
            });

            showSnackbar('Téléchargement réussi', 'success');
        } catch (error) {
            console.error('Erreur de téléchargement:', error);
            showSnackbar('Erreur lors du téléchargement du fichier', 'error');
        }
    };

    /**
     * Ouvre la modale pour afficher le fichier.
     * @param {{fileId: string, fileName: string, fileType: string}} file - Les informations du fichier.
     */

    const handleOpenModal = (file) => {
        setSelectedFile(file);
        setModalOpen(true);
    };

    /**
     * Closes the modal and resets the selected file state.
     * 
     * This function sets the selected file to null and changes
     * the modal's open state to false, effectively closing the modal.
     */
    const handleCloseModal = () => {
        setSelectedFile(null);
        setModalOpen(false);
    };

    return (
        <div>
            <h3>Liste des fichiers associés à l'action</h3>
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
                                            backgroundColor: blueGrey[500], // Au lieu de color: pink[500]
                                            minWidth: '36px',
                                            width: '36px',
                                            height: '36px',
                                            padding: 0,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: blueGrey[700], // Couleur plus foncée au survol
                                                transform: 'scale(1.08)',
                                                boxShadow: 6
                                            }
                                        }}
                                        onClick={() => handleRenameFile(
                                            file.fileId,
                                            file.fileName,
                                            actionId,
                                            files,
                                            setFiles
                                        )}
                                        variant="contained"
                                    // Enlever color='pink[500]' car nous utilisons sx pour la couleur
                                    >
                                        <DriveFileRenameOutlineIcon sx={{ fontSize: 20 }} />
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
                                        onClick={() => downloadFile({ fileId: file.fileId, fileName: file.fileName, actionId: actionId })}
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
                                        onClick={() => handleFileDelete(file.fileId)}
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
                keepMounted={false}
                disableEnforceFocus={false}
                disableAutoFocus={false}
                onKeyDown={handleKeyDown}
            >
                <Box sx={modalStyle}
                    role="dialog"
                    aria-modal="true"
                >
                    <Tooltip title="Fermer la fenêtre" arrow>
                        <Button
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                zIndex: 1,
                                color: 'white',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                            aria-label="Fermer la fenêtre"
                        >
                            <CloseIcon />
                        </Button>
                    </Tooltip>
                    {selectedFile && (
                        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}
                            tabIndex={-1}
                        >
                            <FileViewer
                                file={selectedFile}
                                fileContent={previews[selectedFile.fileId]}
                                actionId={actionId}  // Ajout de l'ID de l'action
                            />
                        </Box>
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
