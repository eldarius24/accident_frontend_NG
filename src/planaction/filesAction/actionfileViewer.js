import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useLogger } from '../../Hook/useLogger';
import * as XLSX from 'xlsx';

const FileViewer = ({ file, actionId, isEntreprise = false }) => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
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
            console.error('Error processing Excel file:', error);
            throw new Error('Error processing Excel file');
        }
    };

    const getactionDiversDetails = async (actionId) => {
        try {
            const response = await axios.get(`http://localhost:3100/api/planaction/${actionId}`);
            if (response.data) {
                return {
                    nomTravailleur: response.data.AddActionQui,
                    entreprise: response.data.AddActionEntreprise,
                    dateAction: new Date(response.data.AddActionDate).toLocaleDateString()
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
                        details: `Prévisualisation du fichier - Nom: ${file.fileName} - pour l'action de: ${actionDetails?.nomTravailleur} - Date action: ${actionDetails?.dateAction}`,
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
            <Box className="flex justify-center items-center h-full">
                <CircularProgress />
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box className="flex justify-center items-center h-full flex-col">
                <Typography color="error" className="mb-2">{errorMessage}</Typography>
                <Typography color="textSecondary">
                    You can still download the file to view it with an appropriate application.
                </Typography>
            </Box>
        );
    }

    if (!content) {
        return (
            <Box className="flex justify-center items-center h-full">
                <Typography color="textSecondary">No content to display</Typography>
            </Box>
        );
    }

    switch (content.type) {
        case 'excel':
            return (
                <div className="w-full h-[calc(100vh-140px)] overflow-auto bg-white p-4">
                    <div
                        className="excel-preview"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                </div>
            );
        case 'pdf':
            return (
                <Box className="w-full h-full relative">
                    <object
                        data={`${content.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <iframe
                            src={`${content.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
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
                <Box
                    className="w-full h-full overflow-auto bg-white p-4"
                    dangerouslySetInnerHTML={{ __html: content.content }}
                />
            );
        case 'txt':
            return (
                <Box className="w-full h-full overflow-auto bg-white p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                        {content.content}
                    </pre>
                </Box>
            );
        case 'image':
            return (
                <Box className="w-full h-full flex justify-center items-center bg-white">
                    <img
                        src={content.url}
                        alt={file.fileName}
                        className="max-w-full max-h-full object-contain"
                    />
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
