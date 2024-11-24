import axios from 'axios';
import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import listFilesInaction from './actionFilesAction';
import { Tooltip } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';

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

const getactionDiversDetails = async (actionId) => {
    try {
        const response = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
        if (response.data) {
            return {
                nomTravailleur: response.data.nomTravailleur,
                prenomTravailleur: response.data.prenomTravailleur,
                entreprise: response.data.entrepriseName,
                dateaction: new Date(response.data.DateHeureaction).toLocaleDateString()
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'action:', error);
        return null;
    }
};

/**
 * Page de téléchargement de fichier
 * 
 * @param {int} actionId Envoyer via state, id de l'action pour lequel on veut télécharger un fichier
 * @returns affiche un formulaire pour télécharger un fichier
 */
export default function PageDownloadFile() {
    const actionId = useLocation().state;
    const { logAction } = useLogger(); // Ajout du hook useLogger
    /** Fonction pour envoyer un fichier vers le serveur 
     * 
     * @param {*} file Fichier à envoyer
     * @param {string} name Nom du fichier
     */
    const handleFileUpload = async (file, name) => {
        if (!actionId || !file) {
            console.error('Missing required parameters:', { actionId, file: !!file });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file, name);

            const response = await axios.post(
                `http://localhost:3100/api/stockFileAction/${actionId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                // Récupérer les détails de l'action pour le log
                const actionDetails = await getactionDiversDetails(actionId);

                await logAction({
                    actionType: 'import',
                    details: `Upload de fichier - Nom: ${name} - Taille: ${(file.size / 1024).toFixed(2)}KB - Type: ${file.type} - Action: ${actionDetails?.AddAction}`,
                    entity: 'Plan Action',
                    entityId: actionId,
                    entreprise: actionDetails?.entreprise || null
                });

                window.location.reload();
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            // Afficher une notification d'erreur à l'utilisateur ici si nécessaire
        }
    };

    /** Fonction pour afficher la boîte de dialogue personnalisée pour entrer le nom du fichier
     * 
     * @param {*} file Fichier à envoyer
     */
    const promptForFileName = (file) => {
        confirmAlert({
            /**
             * Boîte de dialogue personnalisée pour demander le nom du fichier à uploader
             * 
             * @param {{ onClose: () => void }} props - Fonction pour fermer la boîte de dialogue
             * @returns Un JSX Element qui contient la boîte de dialogue personnalisée
             * 
             * La boîte de dialogue contient un champ de saisie pour renommer le fichier
             * et deux boutons : "Envoyer" et "Annuler".
             * Lorsque le bouton "Envoyer" est cliqué, la fonction handleFileUpload est appelée
             * avec le fichier à envoyer et le nom du fichier renommé.
             * Lorsque le bouton "Annuler" est cliqué, la fonction onClose est appelée pour fermer la boîte de dialogue.
             */
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
                                border: '2px solid #0098f9', // Encadre l'input avec une bordure bleue
                                padding: '10px',
                                borderRadius: '5px',
                                fontSize: '16px',
                                width: '60%', // Prend toute la largeur du conteneur
                                backgroundColor: '#f0f8ff', // Donne un fond léger et contrastant
                                color: 'black', // Texte en noir
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
            {listFilesInaction(actionId)}
            <h3>Vous pouvez ajouter des pièces à joindre au dossier (courriers, e-mails, etc..).</h3>
            <Tooltip
                title="Faites glisser un fichier ici pour ajouter un fichier lié à l’action"
                arrow
                placement="top"
                PopperProps={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -100], // Ajustez cet offset pour centrer verticalement
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
                <Tooltip title="Cliquez ici pour importer des fichiers lié a l’action" arrow>
                    <label
                        htmlFor="fileInput"
                        style={labelStyle}
                        onMouseEnter={e => (e.target.style.backgroundColor = '#95ad22')}
                        onMouseLeave={e => (e.target.style.backgroundColor = '#00b1b2')}
                    >
                        Ajouter un fichier a l'action
                    </label>
                </Tooltip>
            </div>
            <div className="image-cortigroupe"></div>
            <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
                <h5 style={{ marginBottom: '40px' }}> <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '300%',
                            height: '100%',
                            background: darkMode
                                ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                                : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                            animation: 'shine 3s infinite linear',
                            '@keyframes shine': {
                                to: {
                                    transform: 'translateX(50%)'
                                }
                            }
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '50px',
                            background: darkMode
                                ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                                : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                            backdropFilter: 'blur(5px)',
                            border: darkMode
                                ? '1px solid rgba(122,142,28,0.2)'
                                : '1px solid rgba(238,117,45,0.2)',
                            color: darkMode ? '#ffffff' : '#2D3748',
                            boxShadow: darkMode
                                ? '0 4px 6px rgba(0,0,0,0.1)'
                                : '0 4px 6px rgba(238,117,45,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            position: 'relative',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: darkMode
                                    ? '0 6px 12px rgba(0,0,0,0.2)'
                                    : '0 6px 12px rgba(238,117,45,0.2)',
                                '& .highlight': {
                                    color: darkMode ? '#7a8e1c' : '#ee752d'
                                }
                            }
                        }}
                    >
                        <span>Développé par </span>
                        <span className="highlight" style={{
                            transition: 'color 0.3s ease',
                            fontWeight: 700
                        }}>
                            Remy
                        </span>
                        <span> & </span>
                        <span className="highlight" style={{
                            transition: 'color 0.3s ease',
                            fontWeight: 700
                        }}>
                            Benoit
                        </span>
                        <span> pour </span>
                        <span style={{
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 700
                        }}>
                            Le Cortigroupe
                        </span>
                        <span style={{
                            fontSize: '1.2em',
                            marginLeft: '4px',
                            background: darkMode
                                ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                                : 'linear-gradient(45deg, #ee752d, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            ®
                        </span>
                    </Typography>
                </Box></h5>
            </Tooltip>
        </div>
    );
}
