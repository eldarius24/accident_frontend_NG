import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';
import * as XLSX from 'xlsx';
import { getAccidentDetails } from "./deleteFile";
import { useTheme } from '../../pageAdmin/user/ThemeContext';
import config from '../../config.json';

const apiUrl = config.apiUrl;
const FileViewer = ({ file, accidentId, isEntreprise = false }) => {
    const { darkMode } = useTheme();
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logAction } = useLogger();
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const processExcelFile = async (blob) => {
        try {
            const buffer = await blob.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
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

    useEffect(() => {
        const loadFullContent = async () => {
            if (!file) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`http://${apiUrl}:3100/api/getFile/${file.fileId}`, {
                    responseType: 'blob',
                    headers: {
                        'Accept': '*/*'
                    }
                });

                // Log de l'action avec les détails de l'accident
                if (!isEntreprise) {
                    try {
                        const accidentDetails = await getAccidentDetails(accidentId);
                        await logAction({
                            actionType: 'consultation',
                            details: `Prévisualisation du fichier - Nom: ${file.fileName} - Travailleur: ${accidentDetails?.nomTravailleur} ${accidentDetails?.prenomTravailleur} - Date accident: ${accidentDetails?.dateAccident} - Entreprise: ${accidentDetails?.entreprise}`,
                            entity: 'Accident',
                            entityId: file.fileId,
                            entreprise: accidentDetails?.entreprise || null
                        });
                    } catch (logError) {
                        console.error('Erreur lors de la création du log:', logError);
                    }
                }

                const blob = response.data;
                const fileType = file.fileName.split('.').pop().toLowerCase();

                try {
                    switch (fileType) {
                        case 'xlsx':
                        case 'xls':
                        case 'csv':
                            try {
                                const excelHtml = await processExcelFile(response.data);
                                setFullContent({ type: 'excel', content: excelHtml });
                            } catch (excelError) {
                                setError("Erreur lors de la conversion du fichier Excel");
                            }
                            break;
                        case 'pdf':
                            // Créer un nouveau Blob avec le type MIME PDF explicite
                            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                            const url = URL.createObjectURL(pdfBlob);
                            setFullContent({
                                type: 'pdf',
                                url,
                                // Ajouter des options pour la prévisualisation PDF
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
                                        color: darkMode ? '#ffffff' : '#333';
                                        max-width: 800px;
                                        margin: 0 auto;
                                        padding: 20px;
                                    ">
                                        ${result.value}
                                    </div>
                                `;
                                setFullContent({ type: 'docx', content: styledContent });
                            } else {
                                throw new Error('Erreur lors de la conversion du document DOCX');
                            }
                            break;
                        case 'txt':
                            const text = await blob.text();
                            setFullContent({ type: 'txt', content: text });
                            break;

                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                        case 'gif':
                            const imageUrl = URL.createObjectURL(blob);
                            setFullContent({ type: 'image', url: imageUrl });
                            break;
                        default:
                            throw new Error(`Le format de fichier "${fileType}" n'est pas pris en charge`);
                    }
                } catch (error) {
                    console.error('Erreur lors du traitement du fichier:', error);
                    setError(`Erreur lors du traitement du fichier: ${error.message}`);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du fichier:', error);
                setError("Erreur lors du chargement du fichier");
            } finally {
                setLoading(false);
            }
        };
        loadFullContent();

        return () => {
            if (fullContent?.url) {
                URL.revokeObjectURL(fullContent.url);
            }
        };
    }, [file, accidentId, isEntreprise]);

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-full">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="flex justify-center items-center h-full flex-col">
                <Typography color="error" className="mb-2">{error}</Typography>
                <Typography color="textSecondary">
                    Vous pouvez toujours télécharger le fichier pour le visualiser avec une application appropriée.
                </Typography>
            </Box>
        );
    }

    if (!fullContent) {
        return (
            <Box className="flex justify-center items-center h-full">
                <Typography color="textSecondary">Aucun contenu à afficher</Typography>
            </Box>
        );
    }

    switch (fullContent.type) {
        case 'excel':
        case 'xlsx':
        case 'xls':
        case 'csv':
            return (
                <Box className="w-full h-full flex flex-col" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                    <Box className="flex justify-center gap-4 p-2" style={{ borderBottom: `1px solid ${darkMode ? '#616161' : '#ddd'}` }}>
                        <button
                            onClick={() => setZoom(z => z * 1.2)}
                            className="px-3 py-1 rounded"
                            style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}
                        >
                            Zoom +
                        </button>
                        <button
                            onClick={() => setZoom(z => z / 1.2)}
                            className="px-3 py-1 rounded"
                            style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}
                        >
                            Zoom -
                        </button>
                        <button
                            onClick={() => setZoom(1)}
                            className="px-3 py-1 rounded"
                            style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}
                        >
                            Réinitialiser Zoom
                        </button>
                        <button
                            onClick={() => setRotation(r => r - 90)}
                            className="px-3 py-1 rounded"
                            style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}
                        >
                            Rotation ↶
                        </button>
                        <button
                            onClick={() => setRotation(r => r + 90)}
                            className="px-3 py-1 rounded"
                            style={{ backgroundColor: darkMode ? '#515151' : '#f5f5f5', color: darkMode ? '#ffffff' : '#333' }}
                        >
                            Rotation ↷
                        </button>
                    </Box>
                    <Box className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                        <div
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out',
                                transformOrigin: 'center center',
                                padding: '1rem'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: fullContent.content || fullContent.preview
                            }}
                        />
                    </Box>
                </Box>
            );

        case 'pdf':
            return (
                <Box className="w-full h-full relative">
                    <object
                        data={`${fullContent.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <iframe
                            src={`${fullContent.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                            className="w-full h-full border-none"
                            title={file.fileName}
                        >
                            <p>This browser does not support PDF viewing.</p>
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
                    <Box className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#424242' : '#ffffff' }}>
                        <Box
                            sx={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out',
                                transformOrigin: 'center center',
                                color: darkMode ? '#ffffff' : '#333'
                            }}
                            dangerouslySetInnerHTML={{ __html: fullContent.content }}
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
                                maxWidth: '100%',
                                maxHeight: '100%',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'sans-serif',
                                fontSize: '0.875rem',
                                color: darkMode ? '#ffffff' : '#333'
                            }}
                        >
                            {fullContent.content}
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
                            src={fullContent.url}
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
                        Format de fichier non pris en charge
                    </Typography>
                </Box>
            );
    }
};

export default FileViewer;