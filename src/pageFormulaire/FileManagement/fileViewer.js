
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import {CircularProgress } from '@mui/material';

const FileViewer = ({ file }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                
                if (fileType === 'pdf') {
                    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                    const url = URL.createObjectURL(pdfBlob);
                    setFullContent(url);
                } 
                else if (fileType === 'docx') {
                    console.log("Processing DOCX file...");
                    const arrayBuffer = await response.data.arrayBuffer();
                    
                    try {
                        const result = await mammoth.convertToHtml({ arrayBuffer });
                        console.log("Conversion result:", result);
                        
                        if (result && result.value) {
                            // Ajouter des styles de base pour améliorer la lisibilité
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
                            setFullContent(styledContent);
                        } else {
                            throw new Error("La conversion n'a pas produit de contenu");
                        }
                    } catch (conversionError) {
                        console.error("Erreur lors de la conversion DOCX:", conversionError);
                        setError("Erreur lors de la conversion du document DOCX");
                        setFullContent(null);
                    }
                } 
                else if (fileType === 'txt') {
                    const text = await response.data.text();
                    setFullContent(text);
                }
                else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
                    const url = URL.createObjectURL(response.data);
                    setFullContent(url);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du fichier:', error);
                setError("Erreur lors du chargement du fichier");
                setFullContent(null);
            } finally {
                setLoading(false);
            }
        };

        loadFullContent();

        return () => {
            if (fullContent && typeof fullContent === 'string' && fullContent.startsWith('blob:')) {
                URL.revokeObjectURL(fullContent);
            }
        };
    }, [file]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 'calc(100vh - 140px)'
            }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 140px)',
                color: 'red'
            }}>
                <Typography>{error}</Typography>
            </div>
        );
    }

    const fileType = file.fileName.split('.').pop().toLowerCase();

    switch (fileType) {
        case 'pdf':
            return (
                <div style={{
                    width: '100%',
                    height: 'calc(100vh - 140px)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <object
                        data={`${fullContent}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                    >
                        <iframe
                            src={`${fullContent}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
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
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 140px)',
                        overflow: 'auto',
                        backgroundColor: '#fff',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                    }}
                    dangerouslySetInnerHTML={{ __html: fullContent }}
                />
            );

        case 'txt':
            return (
                <div style={{
                    width: '100%',
                    height: 'calc(100vh - 140px)',
                    overflow: 'auto',
                    padding: '20px',
                    backgroundColor: '#fff'
                }}>
                    <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                        {fullContent}
                    </Typography>
                </div>
            );

        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return (
                <div style={{
                    width: '100%',
                    height: 'calc(100vh - 140px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff'
                }}>
                    <img
                        src={fullContent}
                        alt={file.fileName}
                        style={{ 
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            );

        default:
            return (
                <div style={{
                    width: '100%',
                    height: 'calc(100vh - 140px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff'
                }}>
                    <Typography>
                        Ce type de fichier ne peut pas être prévisualisé
                    </Typography>
                </div>
            );
    }
};

export default FileViewer;