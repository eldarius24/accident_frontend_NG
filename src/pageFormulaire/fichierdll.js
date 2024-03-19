import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Formulaire({ location }) {
    const handleFileUpload = (file) => {
        console.log("Fichier téléchargé :", file.name);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }, []);


    return (
        <form>
            <Button
                style={{ margin: '20px', marginTop: '20px'}}
                sx={{ backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' } }}
                component={Link}
                to={'/accueil'}
                variant="contained"
                
            >
                Accueil
            </Button>
            <h3>Vous pouvez ajouter des pièces à joindre au dossier (courriers, e-mails, etc..).</h3>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    border: '2px dashed #84a784',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    margin: '20px 1rem',
                    backgroundColor: '#d2e2d2',
                }}
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <span style={{ textAlign: 'center', width: '45%', color: 'black' }}>
                    Glisser-déposer un fichier ici ou
                </span>
                <input
                    type="file"
                    id="fileInput"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    style={{ display: 'none' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <label
                    htmlFor="fileInput"
                    style={{
                        textAlign: 'center',
                        width: '45%',
                        backgroundColor: '#84a784',
                        color: 'black',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#84a784')}
                >
                    Télécharger un document
                </label>
            </div>
        </form>
    );
}
