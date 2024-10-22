import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Tooltip, Card, CardActions, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { confirmAlert } from 'react-confirm-alert';
import { saveAs } from 'file-saver';
import deleteFile from "./deleteFile";
import * as pdfjsLib from 'pdfjs-dist/webpack';
import CustomSnackbar from '../../_composants/CustomSnackbar';

/**
 * Fonction pour lister les fichiers associés à un accident
 * @param {number} accidentId Identifiant de l'accident
 * @returns {Promise<object[]>} La liste des fichiers associés à l'accident
 */
export default function listFilesInAccident(accidentId) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });


    /**
     * Affiche un message dans une snackbar.
     * @param {string} message - Le message à afficher.
     * @param {string} [severity='info'] - La gravité du message. Les valeurs possibles sont 'info', 'success', 'warning' et 'error'.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    // Function to close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        /**
         * Charge les fichiers associés à l'accident et les aperçus correspondants.
         * Met à jour les états `files` et `previews` et affiche un message dans une snackbar pour indiquer le résultat de l'opération.
         * @returns {Promise<void>}
         */
        async function fetchData() {
            try {
                const files = await listFilesInAccident(accidentId);
                setFiles(files);
                const previews = await Promise.all(files.map(file => getPreview(file.fileId, file.fileName)));
                const previewMap = files.reduce((acc, file, index) => {
                    acc[file.fileId] = previews[index];
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

    /**
     * Supprime un fichier de la base de données et de la liste des fichiers de l'accident
     * Lorsque la suppression est terminée, recharge la page pour afficher les modifications
     * Affiche des messages dans une snackbar pour informer l'utilisateur du résultat de l'opération
     * @param {string} fileId - L'ID du fichier à supprimer
     * @returns {Promise<void>}
     */
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

    /**
     * Affiche une boîte de dialogue de confirmation pour supprimer un fichier
     * Appelle la fonction handleDeleteFile pour supprimer le fichier si l'utilisateur clique sur "Oui"
     * Ferme la boîte de dialogue si l'utilisateur clique sur "Non"
     * @param {string} fileId - L'ID du fichier à supprimer
     */
    function popUpDelete(fileId) {
        return (
            confirmAlert({
                /**
                 * Fonction personnalisée pour afficher une boîte de dialogue de confirmation de suppression
                 * 
                 * Cette fonction retourne un JSX élément représentant une boîte de dialogue personnalisée.
                 * La boîte de dialogue affiche un titre, un message de confirmation et des boutons "Oui" et "Non".
                 * Lorsque l'utilisateur clique sur le bouton "Oui", la fonction handleDeleteFile est appelée pour supprimer le fichier.
                 * Lorsque l'utilisateur clique sur le bouton "Non", la boîte de dialogue se ferme.
                 * @param {{ onClose: () => void }} props - Les props de la boîte de dialogue
                 * @returns {JSX.Element} Le JSX élément représentant la boîte de dialogue personnalisée
                 */
                customUI: ({ onClose }) => (
                    <div className="custom-confirm-dialog">
                        <h1 className="custom-confirm-title">Supprimer</h1>
                        <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                        <div className="custom-confirm-buttons">
                            <Tooltip title="Cliquez sur OUI pour supprimer" arrow>
                                <button className="custom-confirm-button" onClick={() => { handleDeleteFile(fileId); onClose(); }} >
                                    Oui
                                </button>
                            </Tooltip>
                            <Tooltip title="Cliquez sur NON pour annuler la suppression" arrow>
                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}>
                                    Non
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                )
            })
        );
    }

    async function listFilesInAccident(accidentId) {
        if (!accidentId) throw new Error('Pas d\'accidentId indiqué');

        try {
            const accident = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
            if (!accident || !accident.data.files) throw new Error('Pas de fichiers trouvés');
            return accident.data.files;
        } catch (error) {
            throw new Error('Erreur de requête:', error);
        }
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

    // Fonction pour générer une miniature pour les fichiers PDF
    const getPDFThumbnail = async (blob) => {
        try {
            const pdf = await pdfjsLib.getDocument(URL.createObjectURL(blob)).promise;
            const page = await pdf.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;
            return canvas.toDataURL(); // Retourne l'image en base64
        } catch (error) {
            console.error('Erreur lors de la génération de la miniature PDF:', error);
            return null;
        }
    };

    // Fonction pour obtenir un extrait de texte pour les fichiers .txt
    const getTextPreview = async (blob) => {
        try {
            const text = await blob.text();
            const previewText = text.substring(0, 200); // On extrait les 200 premiers caractères
            return previewText + (text.length > 200 ? "..." : "");
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'extrait de texte:', error);
            return null;
        }
    };

    // Modifier cette fonction pour gérer les fichiers PDF et TXT
    const getPreview = async (fileId, fileName) => {
        try {
            const blob = await getFile(fileId);
            const fileType = fileName.split('.').pop().toLowerCase();

            if (fileType === 'pdf') {
                const pdfThumbnail = await getPDFThumbnail(blob);
                return { type: 'pdf', url: pdfThumbnail };
            } else if (fileType === 'txt') {
                const textPreview = await getTextPreview(blob);
                return { type: 'txt', text: textPreview };
            } else {
                return { type: 'image', url: URL.createObjectURL(blob) };
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la prévisualisation:', error);
            return null;
        }
    };


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


    const [scaledFileId, setScaledFileId] = useState(null);

    return (
        <div>
            <h3>Liste des fichiers associés à l'accident</h3>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {Array.isArray(files) && files.map(file => (
                    <li key={file.fileId} style={{ listStyleType: 'none', margin: '10px' }}>
                        <Card sx={{
                            position: scaledFileId === file.fileId ? 'fixed' : 'static',
                            transform: scaledFileId === file.fileId ? 'translate(-50%, -50%) scale(3)' : 'scale(1)',
                            top: scaledFileId === file.fileId ? '50vh' : 'auto',
                            left: scaledFileId === file.fileId ? '50vw' : 'auto',
                            transformOrigin: 'center',
                            zIndex: scaledFileId === file.fileId ? 999 : 'auto',
                            transition: 'all 0.3s ease',
                            backgroundColor: '#fab82b56',
                            minWidth: 275,
                            maxWidth: 275,
                            minHeight: 275,
                            maxHeight: 275,
                            border: '2px solid #000000'
                        }}>
                            <CardContent sx={{ maxWidth: 200, maxHeight: 190 }}>
                                <Typography sx={{ fontSize: 12, color: 'text.secondary', marginTop: '10px' }}>
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
                            </CardContent>
                            <CardActions>
                                <Tooltip title="Cliquez ici pour télécharger le fichié sur votre ordinateur" arrow>
                                    <Button sx={{
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.08)',
                                            boxShadow: 6
                                        }
                                    }} onClick={() => downloadFile({ fileId: file.fileId, fileName: file.fileName })} variant="contained" color="primary">
                                        <GetAppIcon />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Cliquez ici pour supprimer le fichier" arrow>
                                    <Button sx={{
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.08)',
                                            boxShadow: 6
                                        }
                                    }} onClick={() => popUpDelete(file.fileId)} variant="contained" color="error">
                                        <DeleteForeverIcon />
                                    </Button>
                                </Tooltip>
                                <Tooltip title={scaledFileId === file.fileId ? "Réduire" : "Agrandir"} arrow>
                                    <Button sx={{
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.08)',
                                            boxShadow: 6
                                        }
                                    }}
                                        onClick={() => setScaledFileId(scaledFileId === file.fileId ? null : file.fileId)}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        {scaledFileId === file.fileId ? <ZoomOutIcon /> : <ZoomInIcon />}
                                    </Button>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </li>
                ))}
            </ul>
            <CustomSnackbar
                open={snackbar.open}
                handleClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </div>
    );
}
