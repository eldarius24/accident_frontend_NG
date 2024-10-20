import React, { useMemo} from 'react';
import '../pageFormulaire/formulaire.css';
import { Box, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useTheme } from '../pageAdmin/user/ThemeContext';
/**
 * Component React qui permet d'afficher le panel d'administration des droits
 * 
 * Ce component React permet d'afficher le panel d'administration des droits.
 * Il contient des boutons qui permettent de 
 * - Créer un nouvel utilisateur
 * - Consulter les utilisateurs
 * - Créer une nouvelle entreprise
 * - Consulter les entreprises
 * 
 * @returns Un component React qui affiche le panel d'administration des droits
 */
export default function AdminPanelSettingsaction() {
    const { darkMode } = useTheme();
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

    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']  // Couleurs pour le thème sombre
            : ['#e62a5625', '#95519b25'],  // Couleurs pour le thème clair
        [darkMode]
    );

    return (
        <div>
            <div className="frameStyle-style" style={{
                backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            }}>
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
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>

        </div>



    );
}