import axios from 'axios';
import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importez les styles pour la boîte de dialogue
import listFilesInAccident from './FilesActions';

const dropZoneStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    border: '2px dashed #00b1b2',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '20px 1rem',
    backgroundColor: '#00b2b246',
};

const labelStyle = {
    textAlign: 'center',
    width: '45%',
    backgroundColor: '#00b1b2',
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

    /** Fonction pour envoyer un fichier vers le serveur 
     * 
     * @param {*} file Fichier à envoyer
     * @param {string} name Nom du fichier
     */
    const handleFileUpload = async (file, name) => {
        if (!accidentId) return console.error('Pas d\'accidentId dans le state');
        if (!file) return console.error('Pas de fichier à envoyer');

        try {
            const dataFile = new FormData();
            dataFile.append('file', file, name);
            const response = await axios.post(`http://localhost:3100/api/stockFile/${accidentId}`, dataFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Réponse du serveur :', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'envoi d\'un fichier :', error);
        }
    };

    /** Fonction pour afficher la boîte de dialogue personnalisée pour entrer le nom du fichier
     * 
     * @param {*} file Fichier à envoyer
     */
    const promptForFileName = (file) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                let fileName = file.name;

                return (
                    <div className="custom-confirm-dialog">
                        <h1 className="custom-confirm-title">Renommer le fichier</h1>
                        <p className="custom-confirm-message">Si vous le désirez, entrez un nouveau nom pour le fichier:</p>
                        <input 
                            type="text"
                            defaultValue={fileName}
                            onChange={(e) => { fileName = e.target.value; }}
                            className="custom-confirm-input"
                        />
                        <div className="custom-confirm-buttons">
                            <button
                                className="custom-confirm-button"
                                onClick={() => { handleFileUpload(file, fileName); onClose(); }}
                            >
                                Envoyer
                            </button>
                            <button
                                className="custom-confirm-button custom-confirm-no"
                                onClick={onClose}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                );
            }
        });
    };

    const handleDrop = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) promptForFileName(file);
    }, []);

    const handleFileInputChange = e => {
        const file = e.target.files[0];
        if (file) promptForFileName(file);
    };

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
                    Pour ajouter un fichier, Glisser-déposer le ici
                </span>
                <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label
                    htmlFor="fileInput"
                    style={labelStyle}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#95ad22')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#00b1b2')}
                >
                    Ajouter un fichier a l'accident
                </label>
            </div>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
        </div>
    );
}
