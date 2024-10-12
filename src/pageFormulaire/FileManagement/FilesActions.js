import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Tooltip, Card, CardActions, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import { confirmAlert } from 'react-confirm-alert';
import { saveAs } from 'file-saver';
import deleteFile from "./deleteFile";
import * as pdfjsLib from 'pdfjs-dist/webpack';
import CustomSnackbar from '../../_composants/CustomSnackbar';

export default function listFilesInAccident(accidentId) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });


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
        return (
            confirmAlert({
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

    return (
        <div>
            <h3>Liste des fichiers associés à l'accident</h3>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {Array.isArray(files) && files.map(file => (
                    <li key={file.fileId} style={{ listStyleType: 'none', margin: '10px' }}>
                        <Card sx={{ backgroundColor: '#fab82b56', minWidth: 275, maxWidth: 275, minHeight: 275, maxHeight: 275, border: '2px solid #000000' }}>
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
                                    <Button onClick={() => downloadFile({ fileId: file.fileId, fileName: file.fileName })} variant="contained" color="primary">
                                        <GetAppIcon />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Cliquez ici pour supprimer le fichier" arrow>
                                    <Button onClick={() => popUpDelete(file.fileId)} variant="contained" color="error">
                                        <DeleteForeverIcon />
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
