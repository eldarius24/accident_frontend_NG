import axios from "axios";
import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GetAppIcon from '@mui/icons-material/GetApp';
import { confirmAlert } from 'react-confirm-alert';
import { saveAs } from 'file-saver';
import deleteFile from "./deleteFile";

export default function listFilesInAccident(accidentId) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState({});

    useEffect(() => {
        async function fetchData() {
            await listFilesInAccident(accidentId);
        }
        fetchData();
    }, [accidentId]);

    /** Suppresion d'un fichier de la base de données et de la liste des fichiers de l'accident
     * 
     * @param {*} fileId id du fichier à supprimer
     */
    async function handleDeleteFile(fileId) {
        try {
            await deleteFile({ fileId, accidentId });
            const updatedFiles = files.filter(file => file.id !== fileId);
            setFiles(updatedFiles);
        } catch (error) {
            throw new Error('Erreur de requête:', error);
        }
    }

    /** popup de confirmation de suppression
     * 
     * @param {*} fileId id du fichier à supprimer
     */
    function popUpDelete(fileId) {
        console.log('Suppression du fichier:', fileId);
        return (
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className="custom-confirm-dialog">
                            <h1 className="custom-confirm-title">Supprimer</h1>
                            <p className="custom-confirm-message">Êtes-vous sûr de vouloir supprimer cet élément?</p>
                            <div className="custom-confirm-buttons">
                                <button className="custom-confirm-button" onClick={() => { handleDeleteFile(fileId); onClose(); }} > Oui </button>
                                <button className="custom-confirm-button custom-confirm-no" onClick={onClose}> Non </button>
                            </div>
                        </div>);
                }
            })
        )
    }

    /** récupération des fichiers liés à l'accident à l'ouverture de la page
     * 
     * @param {*} accidentId id de l'accident
     * @returns retourne la liste des fichiers liés à l'accident
     */
    async function listFilesInAccident(accidentId) {
        if (!accidentId) throw new Error('Pas d\'accidentId indiqué');

        //liste les fichiers liés à l'accident
        const listFiles = async () => {
            try {
                const accident = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
                const previews = await Promise.all(files.map(file => getPreview(file.fileId)));
                const previewMap = files.reduce((acc, file, index) => {
                    acc[file.fileId] = previews[index];
                    return acc;
                }, {});
                setPreviews(previewMap);
                if (!accident) throw new Error('Pas d\'accident trouvé');
                return accident.data.files;
            } catch (error) {
                throw new Error('Erreur de requête:', error);
            }
        }
        setFiles(await listFiles())


    }

    /** Récupération du fichier
     * 
     * @param {*} fileId id du fichier à récupérer
     * @returns  retourne le fichier
     */
    async function getFile(fileId) {
        if (!fileId) throw new Error('Pas de fileId indiqué');

        try {
            const response = await axios.get(`http://localhost:3100/api/getFile/${fileId}`, {
                responseType: 'blob',
            });
            if (response.status !== 200) throw new Error(`erreur dans la récupération de fichier : ${response.status}`);

            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du fichier:', error);
        }
    }

    const getPreview = async (fileId) => {
        try {
            const blob = await getFile(fileId);
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erreur lors de la récupération de la prévisualisation:', error);
            return null;
        }
    };

    /** telechargement du fichier
     * 
     * @param {*} fileId id du fichier à télécharger 
     * @param {*} fileName nom du fichier à télécharger
     */
    const downloadFile = async ({ fileId, fileName }) => {
        if (!fileId) throw new Error('Pas de fichierId indiqué');
        if (!fileName) throw new Error('Pas de nom de fichier indiqué');

        try {
            const blob = await getFile(fileId);
            saveAs(blob, fileName);
        } catch (error) {
            throw new Error('Erreur de requête:', error);
        }
    };

    return (
        <div>
            <h3>Liste des fichiers associés à l'accident</h3>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {files && files.map(file => (
                    <li key={file.fileId} style={{ listStyleType: 'none', margin: '10px' }}>
                        <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 275, maxHeight: 275 }}>
                            <CardContent sx={{ maxWidth: 200, maxHeight: 190 }}>
                            {previews[file.fileId] ? (
                                    <img src={previews[file.fileId]} alt={file.fileName} style={{ width: '100%', height: 'auto' }} />
                                ) : (
                                <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                    {file.fileName}
                                </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => downloadFile({ fileId: file.fileId, fileName: file.fileName })} variant="contained" color="primary"> <GetAppIcon /></Button>
                                <Button onClick={() => popUpDelete(file.fileId)} variant="contained" color="error">  <DeleteForeverIcon /> </Button>
                            </CardActions>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    )
}
