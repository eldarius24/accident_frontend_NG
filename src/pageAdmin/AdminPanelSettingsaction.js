import React, { } from 'react';
import '../pageFormulaire/formulaire.css';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
export default function AdminPanelSettingsaction() {

    const defaultStyle = {
        margin: '10px', backgroundColor: '#84a784', '&:hover': { backgroundColor: 'green' },
        fontSize: '1rem', // Taille de police de base
        // Utilisation de Media Queries pour ajuster la taille de police
        '@media (min-width: 750px)': {
            fontSize: '1rem', // Taille de police plus grande pour les écrans plus larges
        },
        '@media (max-width: 550px)': {
            fontSize: '0.5rem', // Taille de police plus petite pour les écrans plus étroits
        },
    }


    return (
        <div className="frameStyle-style">
            <h3>Administration des droits</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                <Button type="submit"
                    component={Link}
                    to={'/addUser'}
                    sx={defaultStyle} variant="contained"> Créer un nouvel utilisateur</Button>
                <Button type="submit"
                    component={Link}
                    to={'/adminUser'}
                    sx={defaultStyle} variant="contained">Consulter les utilisateurs</Button>
            </Box>

            <h3>Administration des entreprises</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                <Button type="submit"
                    component={Link}
                    to={'/addEntreprise'}
                    sx={defaultStyle} variant="contained"> Créer une nouvelle entreprise</Button>
                <Button type="submit"
                    component={Link}
                    to={'/adminEntreprises'}
                    sx={defaultStyle} variant="contained">Consulter les entreprises</Button>

            </Box>
        </div>

        
        
    );
}