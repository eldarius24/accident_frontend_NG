import axios from 'axios';
import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import listFilesInAccident from './FilesActions';
import { Tooltip } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';
import config from '../../config.json';


const apiUrl = config.apiUrl;

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

const getAccidentDetails = async (accidentId) => {
    try {
        const response = await axios.get(`http://${apiUrl}:3100/api/accidents/${accidentId}`);
        if (response.data) {
            return {
                nomTravailleur: response.data.nomTravailleur,
                prenomTravailleur: response.data.prenomTravailleur,
                entreprise: response.data.entrepriseName,
                dateAccident: new Date(response.data.DateHeureAccident).toLocaleDateString()
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'accident:', error);
        return null;
    }
};

export default function PageDownloadFile() {
    const accidentId = useLocation().state;
    const { logAction } = useLogger(); // Ajout du hook useLogger
    const handleFileUpload = async (file, name) => {
        if (!accidentId || !file) return;

        try {
            const accidentDetails = await getAccidentDetails(accidentId);
            const dataFile = new FormData();
            dataFile.append('file', file, name);
            const response = await axios.post(`http://${apiUrl}:3100/api/stockFile/${accidentId}`, dataFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            await logAction({
                actionType: 'import',
                details: `Upload de fichier - Nom: ${name} - Taille: ${(file.size / 1024).toFixed(2)}KB - Type: ${file.type} - Travailleur: ${accidentDetails?.nomTravailleur} ${accidentDetails?.prenomTravailleur} - Date accident: ${accidentDetails?.dateAccident}`,
                entity: 'Accident',
                entityId: response.data._id || null,
                entreprise: accidentDetails?.entreprise || null
            });
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'envoi d\'un fichier :', error);
        }
    };

    const promptForFileName = (file) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                let fileName = file.name;
                return (
                    <div className="custom-confirm-dialog" style={{ textAlign: 'center' }}>
                        <h1 className="custom-confirm-title">Renommer le fichier</h1>
                        <p className="custom-confirm-message">Si vous le désirez, entrez un nouveau nom pour le fichier:</p>
                        <input
                            type="text"
                            defaultValue={fileName}
                            onChange={(e) => { fileName = e.target.value; }}
                            className="custom-confirm-input"
                            style={{
                                border: '2px solid #0098f9',
                                padding: '10px',
                                borderRadius: '5px',
                                fontSize: '16px',
                                width: '60%',
                                backgroundColor: '#f0f8ff',
                                color: 'black',
                            }}
                        />
                        <div className="custom-confirm-buttons">
                            <Tooltip title="Cliquez sur ENVOYER apres avoir changer le nom si besoin" arrow>
                                <button
                                    className="custom-confirm-button"
                                    onClick={() => { handleFileUpload(file, fileName); onClose(); }}
                                >
                                    Envoyer
                                </button>
                            </Tooltip>
                            <Tooltip title="Cliquez sur ANNULER pour annuler l'envoi du fichier" arrow>
                                <button
                                    className="custom-confirm-button custom-confirm-no"
                                    onClick={onClose}
                                >
                                    Annuler
                                </button>
                            </Tooltip>
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
            <Tooltip
                title="Faites glisser un fichier ici pour ajouter un fichier lié à l’accident"
                arrow
                placement="top"
                PopperProps={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -100],
                            },
                        },
                    ],
                }}
            >
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
            </Tooltip>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Cliquez ici pour importer des fichiers lié a l’accident" arrow>
                    <label
                        htmlFor="fileInput"
                        style={labelStyle}
                        onMouseEnter={e => (e.target.style.backgroundColor = '#95ad22')}
                        onMouseLeave={e => (e.target.style.backgroundColor = '#00b1b2')}
                    >
                        Ajouter un fichier a l'accident
                    </label>
                </Tooltip>
            </div>
        </div>
    );
}
