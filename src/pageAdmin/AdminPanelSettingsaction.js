import React, { } from 'react';

import '../pageFormulaire/formulaire.css';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
export default function AdminPanelSettingsaction() {


    return (
        <div className="frameStyle-style">
            <h3>Administration des droits</h3>

            <h3>Actions</h3>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                <Button type="submit"
                    component={Link}
                    to={'/admin'}
                    sx={{
                        margin: '10px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' },
                        fontSize: '1rem', // Taille de police de base
                        // Utilisation de Media Queries pour ajuster la taille de police
                        '@media (min-width: 750px)': {
                            fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
                        },
                        '@media (max-width: 550px)': {
                            fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
                        },
                    }} variant="contained"> Créer un nouvel utilisateur</Button>
                <Button type="submit" sx={{
                    margin: '10px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' },
                    fontSize: '1rem', // Taille de police de base
                    // Utilisation de Media Queries pour ajuster la taille de police
                    '@media (min-width: 750px)': {
                        fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
                    },
                    '@media (max-width: 550px)': {
                        fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
                    },
                }} variant="contained"> Consulter les utilisateurs</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                <Button type="submit" sx={{
                    margin: '10px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' },
                    fontSize: '1rem', // Taille de police de base
                    // Utilisation de Media Queries pour ajuster la taille de police
                    '@media (min-width: 750px)': {
                        fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
                    },
                    '@media (max-width: 550px)': {
                        fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
                    },
                }} variant="contained"> Supprimer toutes les données</Button>
                <Button type="submit" sx={{
                    margin: '10px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' },
                    fontSize: '1rem', // Taille de police de base
                    // Utilisation de Media Queries pour ajuster la taille de police
                    '@media (min-width: 750px)': {
                        fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
                    },
                    '@media (max-width: 550px)': {
                        fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
                    },
                }} variant="contained"> Archiver toutes les données</Button>
                <Button type="submit" sx={{
                    margin: '10px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' },
                    fontSize: '1rem', // Taille de police de base
                    // Utilisation de Media Queries pour ajuster la taille de police
                    '@media (min-width: 750px)': {
                        fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
                    },
                    '@media (max-width: 550px)': {
                        fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
                    },
                }} variant="contained"> Consulter les archives</Button>




            </Box>


        </div>


    );
}