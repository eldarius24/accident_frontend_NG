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



export default function listFilesInAccident(accidentId) {
    const [files, setFiles] = useState([]);

    async function handleDeleteFile(fileId) {
        try {
            //supprime le fichier de la base de données
            const response = await axios.delete(`http://localhost:3100/api/file/${fileId}`);
            console.log('Fichier supprimé:', response);

            //supprime la référence du fichier dans l'accident
            const accident = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
            const files = accident.data.files.filter(file => file.fileId !== fileId);
            console.log('Fichiers restants:', files);
            const resultSupress = await axios.put(`http://localhost:3100/api/accidents/${accidentId}`, { files: files });
            console.log('Fichier retiré de l\'accident:', resultSupress);

        } catch (error) {
            console.error('Erreur de requête:', error);
        }
    }

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
    useEffect(() => {
        if (!accidentId) return console.error('Pas d\'accidentId indiqué');

        //liste les fichiers liés à l'accident
        const listFiles = async () => {
            try {
                const accident = await axios.get(`http://localhost:3100/api/accidents/${accidentId}`);
                if (!accident) throw new Error('Pas d\'accident trouvé');
                return accident.data.files;
            } catch (error) {
                return console.error('Erreur de requête:', error);
            }
        }
        listFiles().then(files => setFiles(files));
    }, [files]);

    const downloadFile = async ({ fileId, fileName }) => {
        if (!fileId) return console.error('Pas de fichierId indiqué');
        if (!fileName) return console.error('Pas de nom de fichier indiqué');

        
        try {
            console.log('Téléchargement du fichier:', fileId);
            console.log('Nom du fichier:', fileName);
            const response = await axios.get(`http://localhost:3100/api/getFile/${fileId}`, {
                responseType: 'blob',
            });
            console.log('Réponse du serveur :', response);

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            console.log('Blob:', blob);
            saveAs(blob, fileName);
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
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
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