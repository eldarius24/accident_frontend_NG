import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';

const FileViewer = ({ file }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const response = await axios.get(`http://localhost:3100/api/getFile/${file.fileId}`, {
                    responseType: 'blob'
                });
                
                const fileType = file.fileName.split('.').pop().toLowerCase();
                
                switch(fileType) {
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
                        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                        const url = URL.createObjectURL(pdfBlob);
                        setFullContent({ type: 'pdf', url });
                        break;

                    case 'docx':
                        console.log("Processing DOCX file...");
                        const arrayBuffer = await response.data.arrayBuffer();
                        
                        try {
                            const result = await mammoth.convertToHtml({ arrayBuffer });
                            console.log("Conversion result:", result);
                            
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
                                throw new Error("La conversion n'a pas produit de contenu");
                            }
                        } catch (conversionError) {
                            setError("Erreur lors de la conversion du document DOCX");
                        }
                        break;

                    case 'txt':
                        const text = await response.data.text();
                        setFullContent({ type: 'txt', content: text });
                        break;

                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                        const imageUrl = URL.createObjectURL(response.data);
                        setFullContent({ type: 'image', url: imageUrl });
                        break;

                    default:
                        setError(`Le format de fichier "${fileType}" n'est pas pris en charge pour la visualisation`);
                        break;
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
            if (fullContent && fullContent.url) {
                URL.revokeObjectURL(fullContent.url);
            }
        };
    }, [file]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-140px)]">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-140px)]">
                <div className="text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <p className="text-gray-600">Vous pouvez toujours télécharger le fichier pour le visualiser avec une application appropriée.</p>
                </div>
            </div>
        );
    }

    if (!fullContent) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-140px)]">
                <p className="text-gray-600">Aucun contenu à afficher</p>
            </div>
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
                <div className="w-full h-[calc(100vh-140px)] relative overflow-hidden">
                    <object
                        data={`${fullContent.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        className="w-full h-full border-none"
                    >
                        <iframe
                            src={`${fullContent.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                            className="w-full h-full border-none"
                            title={file.fileName}
                        >
                            <p>Ce navigateur ne supporte pas l'affichage des PDF.</p>
                        </iframe>
                    </object>
                </div>
            );

        case 'docx':
            return (
                <div 
                    className="w-full h-[calc(100vh-140px)] overflow-auto bg-white shadow-inner p-4"
                    dangerouslySetInnerHTML={{ __html: fullContent.content }}
                />
            );

        case 'txt':
            return (
                <div className="w-full h-[calc(100vh-140px)] overflow-auto bg-white p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                        {fullContent.content}
                    </pre>
                </div>
            );

        case 'image':
            return (
                <div className="w-full h-[calc(100vh-140px)] flex justify-center items-center bg-white">
                    <img
                        src={fullContent.url}
                        alt={file.fileName}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );

        default:
            return (
                <div className="flex justify-center items-center h-[calc(100vh-140px)]">
                    <p className="text-gray-600">Format non pris en charge</p>
                </div>
            );
    }
};

export default FileViewer;