import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';
import * as XLSX from 'xlsx';

const FileViewer = ({ file, accidentId, isEntreprise = false }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logAction } = useLogger();

    const processExcelFile = async (blob) => {
        try {
            const buffer = await blob.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });

            // Prendre la première feuille
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convertir en HTML avec des styles
            const html = XLSX.utils.sheet_to_html(worksheet, { editable: false });

            // Ajouter des styles CSS pour un meilleur rendu
            const styledHtml = `
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    tr:hover {
                        background-color: #f0f0f0;
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
                // Configuration de la requête
                const response = await axios.get(`http://localhost:3100/api/getFile/${file.fileId}`, {
                    responseType: 'blob',
                    headers: {
                        'Accept': '*/*'
                    }
                });

                // Log de l'action
                if (isEntreprise) {
                    await logAction({
                        actionType: 'consultation',
                        details: `Prévisualisation du fichier - Nom: ${file.fileName} - Entreprise: ${file.entrepriseName}`,
                        entity: 'Entreprise',
                        entityId: file.fileId,
                        entreprise: file.entrepriseName
                    });
                }

                const blob = response.data;
                const fileType = file.fileName.split('.').pop().toLowerCase();


                
                try {
                    switch (fileType) {
                        case 'xlsx':
                        case 'xls':
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
                                        color: #333;
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
            return (
                <div className="w-full h-[calc(100vh-140px)] overflow-auto bg-white p-4">
                    <div
                        className="excel-preview"
                        dangerouslySetInnerHTML={{ __html: fullContent.content }}
                    />
                </div>
            );
        case 'pdf':
            return (
                <Box className="w-full h-full relative">
                    <object
                        data={`${fullContent.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <iframe
                            src={`${fullContent.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                            className="w-full h-full border-none"
                            title={file.fileName}
                        >
                            <p>Ce navigateur ne supporte pas l'affichage des PDF.</p>
                        </iframe>
                    </object>
                </Box>
            );

        case 'docx':
            return (
                <Box
                    className="w-full h-full overflow-auto bg-white p-4"
                    dangerouslySetInnerHTML={{ __html: fullContent.content }}
                />
            );

        case 'txt':
            return (
                <Box className="w-full h-full overflow-auto bg-white p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                        {fullContent.content}
                    </pre>
                </Box>
            );

        case 'image':
            return (
                <Box className="w-full h-full flex justify-center items-center bg-white">
                    <img
                        src={fullContent.url}
                        alt={file.fileName}
                        className="max-w-full max-h-full object-contain"
                    />
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