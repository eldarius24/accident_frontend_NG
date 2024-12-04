import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button
} from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { useLogger } from '../Hook/useLogger';
import { useTheme } from '../Hook/ThemeContext';
import config from '../config.json';

const VehicleFileViewer = ({ file, vehicleId }) => {
    const { darkMode } = useTheme();
    const [content, setContent] = useState(null);
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
            throw new Error('Erreur lors du traitement du fichier Excel');
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            if (!file?.fileId) return;

            try {
                const response = await axios.get(`http://${config.apiUrl}:3100/api/getFile/${file.fileId}`, {
                    responseType: 'blob',
                    headers: {
                        'Accept': '*/*'
                    }
                });

                const blob = response.data;
                const fileType = file.fileName.split('.').pop().toLowerCase();

                try {
                    switch (fileType) {
                        case 'xlsx':
                        case 'xls':
                        case 'csv':
                            const excelHtml = await processExcelFile(blob);
                            setContent({ type: 'excel', content: excelHtml });
                            break;

                        case 'pdf':
                            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                            const pdfUrl = URL.createObjectURL(pdfBlob);
                            setContent({
                                type: 'pdf',
                                url: pdfUrl,
                                options: { toolbar: 1, zoom: 'page-fit', navpanes: 0, scrollbar: 1 }
                            });
                            break;

                        case 'docx':
                            const arrayBuffer = await blob.arrayBuffer();
                            const result = await mammoth.convertToHtml({ arrayBuffer });
                            if (result?.value) {
                                setContent({
                                    type: 'docx',
                                    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6; 
                                       color: ${darkMode ? '#ffffff' : '#333'}; max-width: 800px; margin: 0 auto; 
                                       padding: 20px;">${result.value}</div>`
                                });
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
                            throw new Error(`Format non supporté: ${fileType}`);
                    }
                } catch (error) {
                    setError(`Erreur traitement: ${error.message}`);
                }
            } catch (error) {
                setError('Erreur chargement fichier');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        return () => {
            if (content?.url) URL.revokeObjectURL(content.url);
        };
    }, [file, darkMode]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <Typography color="error" mb={2}>{error}</Typography>
                <Typography color="textSecondary">
                    Vous pouvez télécharger le fichier pour le visualiser avec une application appropriée.
                </Typography>
            </Box>
        );
    }

    const renderControls = () => (
        <Box className="flex justify-center gap-4 p-2"
            style={{ borderBottom: `1px solid ${darkMode ? '#616161' : '#ddd'}` }}>
            <Button onClick={() => setZoom(z => z * 1.2)}>Zoom +</Button>
            <Button onClick={() => setZoom(z => z / 1.2)}>Zoom -</Button>
            <Button onClick={() => setZoom(1)}>Reset</Button>
            <Button onClick={() => setRotation(r => r - 90)}>Rotation ↶</Button>
            <Button onClick={() => setRotation(r => r + 90)}>Rotation ↷</Button>
        </Box>
    );

    const commonStyles = {
        transform: `scale(${zoom}) rotate(${rotation}deg)`,
        transition: 'transform 0.2s ease-in-out',
        transformOrigin: 'center center'
    };

    if (!content) return null;

    return (
        <Box height="100%" overflow="auto" bgcolor={darkMode ? '#424242' : '#ffffff'}>
            {renderControls()}
            <Box p={2}>
                {(() => {
                    switch (content.type) {
                        case 'excel':
                        case 'csv':
                            return (
                                <div style={commonStyles}
                                    dangerouslySetInnerHTML={{ __html: content.content }} />
                            );


                        case 'pdf':
                            return (
                                <Box sx={{ width: '100%', height: 'calc(100vh - 100px)' }}> {/* Ajuster la hauteur */}
                                    <object
                                        data={`${content.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                                        type="application/pdf"
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <iframe
                                            src={`${content.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                                            style={{ width: '100%', height: '100%' }}
                                            title={file.fileName}
                                            frameBorder="0"
                                        >
                                            <p>Ce navigateur ne prend pas en charge la visualisation PDF.</p>
                                        </iframe>
                                    </object>
                                </Box>
                            );

                        case 'docx':
                        case 'txt':
                            return (
                                <div style={commonStyles}>
                                    {content.type === 'docx' ? (
                                        <div dangerouslySetInnerHTML={{ __html: content.content }} />
                                    ) : (
                                        <pre style={{ whiteSpace: 'pre-wrap' }}>{content.content}</pre>
                                    )}
                                </div>
                            );

                        case 'image':
                            return (
                                <img
                                    src={content.url}
                                    alt={file.fileName}
                                    style={{
                                        ...commonStyles,
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            );

                        default:
                            return (
                                <Typography color="error">
                                    Format de fichier non pris en charge
                                </Typography>
                            );
                    }
                })()}
            </Box>
        </Box>
    );
};

export default VehicleFileViewer;