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
    const [imageUrls, setImageUrls] = useState({});

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
            console.error('Erreur de requête:', error);
        }
    }

    /** popup de confirmation de suppression
     * 
     * @param {*} fileId id du fichier à supprimer
     * @returns 
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

    /**
     * récupération des fichiers liés à l'accident à l'ouverture de la page
     */
    async function listFilesInAccident(accidentId) {
        if (!accidentId) return console.error('Pas d\'accidentId indiqué');

        //liste les fichiers liés à l'accident
        const listFiles = async () => {
            try {
                const accident = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
                if (!accident) throw new Error('Pas d\'accident trouvé');
                const fetchedFiles = accident.data.files;
                /*
                const urls = await Promise.all(fetchedFiles.map(async file => {
                    if (isImage(file.fileName)) {
                        const response = await axios.get(`http://localhost:3100/api/getFile/${file.fileId}`, {
                            responseType: 'blob',
                        });
                        const url = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
                        
                        return { fileId: file.fileId, url };
                    
                    }
                    return { fileId: file.fileId, url: null };
                }));

                const urlMap = urls.reduce((acc, curr) => {
                    acc[curr.fileId] = curr.url;
                    return acc;
                }, {});

                setImageUrls(urlMap);
                */
                return fetchedFiles;
            } catch (error) {
                return console.error('Erreur de requête:', error);
            }
        }
        setFiles(await listFiles())
    }

    useEffect(() => {
        async function fetchData() {
            await listFilesInAccident(accidentId);
        }
        fetchData();
    }, [accidentId]);

    /** Récupération du fichier
     * 
     * @param {*} fileId id du fichier à récupérer
     * @returns 
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

    /** telechargement du fichier
     * 
     * @param {*} fileId id du fichier à télécharger 
     * @param {*} fileName nom du fichier à télécharger
     * @returns 
     */
    const downloadFile = async ({ fileId, fileName }) => {
        if (!fileId) return console.error('Pas de fichierId indiqué');
        if (!fileName) return console.error('Pas de nom de fichier indiqué');

        try {
            getFile(fileId).then(blob => {
                saveAs(blob, fileName);
            });
        } catch (error) {
            console.error('Erreur de requête:', error);
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
                                <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                    {file.fileName}
                                </Typography>
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
