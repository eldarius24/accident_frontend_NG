import React, { } from 'react';
import '../pageFormulaire/formulaire.css';
import { Box, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
export default function AdminPanelSettingsaction() {

    const defaultStyle = {
        margin: '10px', backgroundColor: '#0098f9', '&:hover': { backgroundColor: '#95ad22' },
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
        <div>
            <div className="frameStyle-style">
                <h3>Administration des droits</h3>

                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                    <Tooltip title="Cliquez ici Créer un nouvel utilisateur" arrow>
                        <Button type="submit"
                            component={Link}
                            to={'/addUser'}
                            sx={defaultStyle} variant="contained"> Créer un nouvel utilisateur
                        </Button>
                    </Tooltip>
                    <Tooltip title="Cliquez ici afficher, éditér ou supprimer un utilisateur" arrow>
                        <Button type="submit"
                            component={Link}
                            to={'/adminUser'}
                            sx={defaultStyle} variant="contained">Consulter les utilisateurs
                        </Button>
                    </Tooltip>
                </Box>

                <h3>Administration des entreprises</h3>

                <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                    <Tooltip title="Cliquez ici Créer une nouvelle entreprise" arrow>
                        <Button type="submit"
                            component={Link}
                            to={'/addEntreprise'}
                            sx={defaultStyle} variant="contained"> Créer une nouvelle entreprise
                        </Button>
                    </Tooltip>
                    <Tooltip title="Cliquez ici afficher, éditez ou supprimer une entreprise ou créer un secteur d'activé" arrow>
                        <Button type="submit"
                            component={Link}
                            to={'/adminEntreprises'}
                            sx={defaultStyle} variant="contained">Consulter les entreprises
                        </Button>
                    </Tooltip>

                </Box>
            </div>
            <div className="image-cortigroupe"></div>
            <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>

        </div>



    );
}