import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import listFilesInAccident from './FilesActions';

const dropZoneStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    border: '2px dashed #84a784',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '20px 1rem',
    backgroundColor: '#d2e2d2',
};

const labelStyle = {
    textAlign: 'center',
    width: '45%',
    backgroundColor: '#84a784',
    color: 'black',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

/**
 * Page de téléchargement de fichier
 * 
 * @param {int} accidentId Envoyer via state, id de l'accident pour lequel on veut télécharger un fichier
 * @returns affiche un formulaire pour télécharger un fichier
 */
export default function PageDownloadFile() {
    const accidentId = useLocation().state;
    const navigate = useNavigate();

    /**
     * 
     * @param {*} file 
     * @returns 
     */
    const handleFileUpload = async file => {

        if (!accidentId) {
            console.error('Pas d\'accidentId dans le state');
            return;
        };

        if (!file) {
            console.error('Pas de fichier à envoyer');
            return;
        };

        const dataFile = new FormData();
        dataFile.append('file', file);

        console.log('Fichier à envoyer:', dataFile);

        try {
            console.log("File ", dataFile.get('file'));
            const response = await axios.post(`http://localhost:3100/api/stockFile/${accidentId}`, dataFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Réponse du serveur :', response.data);
            //navigate('/');
        } catch (error) {
            console.error('Erreur de requête:', error);
        }
    }



    const handleDrop = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    }, []);

    return (
        <div>
            {listFilesInAccident(accidentId)}
            <h3>Vous pouvez ajouter des pièces à joindre au dossier (courriers, e-mails, etc..).</h3>

            <div
                style={dropZoneStyle}
                onDrop={handleDrop}
                onDragOver={e => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <span style={{ textAlign: 'center', width: '45%', color: 'black' }}>
                    Glisser-déposer un fichier ici ou
                </span>
                <input
                    type="file"
                    id="fileInput"
                    onChange={e => handleFileUpload(e.target.files[0])}
                    style={{ display: 'none' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label
                    htmlFor="fileInput"
                    style={labelStyle}
                    onMouseEnter={e => (e.target.style.backgroundColor = 'green')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#84a784')}
                >
                    Télécharger un document
                </label>
            </div>
        </div>
    );
}





