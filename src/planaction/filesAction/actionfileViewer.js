import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';
import * as XLSX from 'xlsx';
import { useTheme } from '../../pageAdmin/user/ThemeContext';

const FileViewer = ({ file, actionId, isEntreprise = false }) => {
    const { darkMode } = useTheme();
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const { logAction } = useLogger();

    const processExcelFile = async (blob) => {
        try {
            const buffer = await blob.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const html = XLSX.utils.sheet_to_html(worksheet, { editable: false });

            const styledHtml = `
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        color: ${darkMode ? '#e5e7eb' : '#333'};
                        background-color: ${darkMode ? '#424242' : '#ffffff'};
                    }
                    th, td {
                        border: 1px solid ${darkMode ? '#4b5563' : '#ddd'};
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: ${darkMode ? '#484848' : '#f5f5f5'};
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: ${darkMode ? '#515151' : '#f9f9f9'};
                    }
                    tr:hover {
                        background-color: ${darkMode ? '#616161' : '#f0f0f0'};
                    }
                </style>
                ${html}
            `;
            return styledHtml;
        } catch (error) {
            console.error('Erreur lors du traitement du fichier Excel:', error);
            throw new Error('Erreur lors du traitement du fichier Excel');
        }
    };

    const getactionDiversDetails = async (actionId) => {
        try {
            const response = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
            if (response.data) {
                return {
                    nomTravailleur: response.data.AddActionQui,
                    prenomTravailleur: response.data.AddActionQui, // Si vous avez le prénom
                    entreprise: response.data.AddActionEntreprise,
                    dateAction: new Date(response.data.AddActionDate).toLocaleDateString(),
                    action: response.data.AddAction // Ajout de l'action
                };
            }
            return null;
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'action:', error);
            return null;
        }
    };


    useEffect(() => {
        const loadContent = async () => {
            if (!file) return;

            setIsLoading(true);
            setErrorMessage(null);

            try {

                const actionDetails = await getactionDiversDetails(actionId);
                const response = await axios.get(`http://localhost:3100/api/getFileAction/${file.fileId}`, {
                    responseType: 'blob',
                    headers: {
                        'Accept': '*/*'
                    }
                });

                try {
                    await logAction({
                        actionType: 'consultation',
                        details: `Prévisualisation du fichier - Nom: ${file.fileName} - Action: ${actionDetails?.action || 'Non spécifiée'} - La personne qui doit gerer le travail: ${actionDetails?.nomTravailleur || 'Non spécifié'} - Date action: ${actionDetails?.dateAction || 'Non spécifiée'}`,
                        entity: 'Action',
                        entityId: file.fileId,
                        entreprise: actionDetails?.entreprise || null
                    });
                } catch (logError) {
                    console.error('Erreur lors de la création du log:', logError);
                }

                const blob = response.data;
                const fileType = file.fileName.split('.').pop().toLowerCase();

                switch (fileType) {
                    case 'xlsx':
                    case 'xls':
                    case 'csv':
                        try {
                            const excelHtml = await processExcelFile(response.data);
                            setContent({ type: 'excel', content: excelHtml });
                        } catch (excelError) {
                            setErrorMessage("Error converting Excel file");
                        }
                        break;
                    case 'pdf':
                        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                        const url = URL.createObjectURL(pdfBlob);
                        setContent({
                            type: 'pdf',
                            url,
                            options: {
                                toolbar: 0,
                                zoom: 'page-fit',
                                navpanes: 0,
                                scrollbar: 1
                            }
                        });
                        break;
                    case 'docx':
                        const arrayBuffer = await blob.arrayBuffer();
                        const result = await mammoth.convertToHtml({ arrayBuffer });
                        if (result && result.value) {
                            const styledContent = `
                                <div style="
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    color: #333;
                                    max-width: 800px;
                                    margin: 0 auto;
                                    padding: 20px;
                                ">
                                    ${result.value}
                                </div>
                            `;
                            setContent({ type: 'docx', content: styledContent });
                        } else {
                            throw new Error('Error converting DOCX document');
                        }
                        break;
                    case 'txt':
                        const text = await blob.text();
                        setContent({ type: 'txt', content: text });
                        break;
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                        const imageUrl = URL.createObjectURL(blob);
                        setContent({ type: 'image', url: imageUrl });
                        break;
                    default:
                        throw new Error(`File type "${fileType}" not supported`);
                }
            } catch (error) {
                console.error('Error loading file:', error);
                setErrorMessage("Error loading file");
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();

        return () => {
            if (content?.url) {
                URL.revokeObjectURL(content.url);
            }
        };
    }, [file, actionId, isEntreprise]);

    if (isLoading) {
        return (
            <Box className="flex justify-center items-center h-full" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box className="flex justify-center items-center h-full flex-col" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff', color: darkMode ? '#ffffff' : '#333' }}>
                <Typography style={{ color: 'error' }} className="mb-2">{errorMessage}</Typography>
                <Typography style={{ color: darkMode ? '#9ca3af' : '#666' }}>
                    Vous pouvez toujours télécharger le fichier pour le visualiser avec une application appropriée.
                </Typography>
            </Box>
        );
    }

    if (!content) {
        return (
            <Box className="flex justify-center items-center h-full" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff', color: darkMode ? '#ffffff' : '#333' }}>
                <Typography style={{ color: 'inherit' }}>Aucun contenu à afficher</Typography>
            </Box>
        );
    }

    switch (content.type) {
        case 'excel':
        case 'xlsx':
        case 'xls':
        case 'csv':
            return (
                <Box className="w-full h-full flex flex-col" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                    <Box className="flex justify-center gap-4 p-2" style={{ borderBottom: `1px solid ${darkMode ? '#616161' : '#ddd'}` }}>
                        <button onClick={() => setZoom(z => z * 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom +</button>
                        <button onClick={() => setZoom(z => z / 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom -</button>
                        <button onClick={() => setZoom(1)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Réinitialiser</button>
                        <button onClick={() => setRotation(r => r - 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↶</button>
                        <button onClick={() => setRotation(r => r + 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↷</button>
                    </Box>
                    <Box className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                        <div
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out',
                                transformOrigin: 'center center',
                                padding: '1rem'
                            }}
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                    </Box>
                </Box>
            );

        case 'pdf':
            return (
                <Box className="w-full h-full relative" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                    <object
                        data={`${content.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <iframe
                            src={`${content.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                            className="w-full h-full border-none"
                            title={file.fileName}
                        >
                            <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Ce navigateur ne prend pas en charge l'affichage des PDF.</p>
                        </iframe>
                    </object>
                </Box>
            );

            case 'docx':
                return (
                    <Box className="w-full h-full flex flex-col" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                        <Box className="flex justify-center gap-4 p-2" style={{ borderBottom: `1px solid ${darkMode ? '#616161' : '#ddd'}` }}>
                            <button onClick={() => setZoom(z => z * 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom +</button>
                            <button onClick={() => setZoom(z => z / 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom -</button>
                            <button onClick={() => setZoom(1)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Réinitialiser</button>
                            <button onClick={() => setRotation(r => r - 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↶</button>
                            <button onClick={() => setRotation(r => r + 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↷</button>
                        </Box>
                        <Box className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff', color: darkMode ? '#ffffff' : '#333' }}>
                            <div
                                style={{
                                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                    transition: 'transform 0.2s ease-in-out',
                                    transformOrigin: 'center center',
                                    padding: '1rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        </Box>
                    </Box>
                );

        case 'txt':
            return (
                <Box className="w-full h-full flex flex-col" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                    <Box className="flex justify-center gap-4 p-2" style={{ borderBottom: `1px solid ${darkMode ? '#616161' : '#ddd'}` }}>
                        <button onClick={() => setZoom(z => z * 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom +</button>
                        <button onClick={() => setZoom(z => z / 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom -</button>
                        <button onClick={() => setZoom(1)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Réinitialiser</button>
                        <button onClick={() => setRotation(r => r - 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↶</button>
                        <button onClick={() => setRotation(r => r + 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↷</button>
                    </Box>
                    <Box className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                        <pre
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'sans-serif',
                                fontSize: '0.875rem',
                                color: darkMode ? '#ffffff' : '#333',
                                padding: '1rem'
                            }}
                        >
                            {content.content}
                        </pre>
                    </Box>
                </Box>
            );

        case 'image':
            return (
                <Box className="w-full h-full flex flex-col" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                    <Box className="flex justify-center gap-4 p-2" style={{ borderBottom: `1px solid ${darkMode ? '#616161' : '#ddd'}` }}>
                        <button onClick={() => setZoom(z => z * 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom +</button>
                        <button onClick={() => setZoom(z => z / 1.2)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Zoom -</button>
                        <button onClick={() => setZoom(1)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Réinitialiser</button>
                        <button onClick={() => setRotation(r => r - 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↶</button>
                        <button onClick={() => setRotation(r => r + 90)} className="px-3 py-1 rounded" style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}>Rotation ↷</button>
                    </Box>
                    <Box className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff', padding: '1rem' }}>
                        <img
                            src={content.url}
                            alt={file.fileName}
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                </Box>
            );
            
        default:
            return (
                <Box className="flex justify-center items-center h-full">
                    <Typography color="error">
                        Unsupported file format
                    </Typography>
                </Box>
            );
    }
};

export default FileViewer;
