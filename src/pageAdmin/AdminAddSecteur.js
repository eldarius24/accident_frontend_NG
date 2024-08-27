import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import TextFieldP from '../_composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import Button from '@mui/material/Button';
import config from '../config.json';

/**
 * 
 * @param {[string]} entreprise informations de l'entreprise
 * @param {[string]} secteurData Secteur à éditer
 * @returns 
 */
export default function AddSecteur({secteurData }) {
    let location = useLocation();
    let entreprise = location.state.entreprise;

    const apiUrl = config.apiUrl;
    const { setValue, watch, handleSubmit } = useForm();


    const [secteurName, setSecteurName] = useState(watch('secteurName') ? watch('secteurName') : (secteurData && secteurData.secteurName ? secteurData.secteurName : null));

    useEffect(() => {
        setValue('secteurName', secteurName)
    }, [secteurName]);



    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = async (data) => {
        try {
            const baseUrl = `http://${apiUrl}:3100/api`;
            data.entrepriseId = entreprise._id;
    
            console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);
    
            // Création du secteur
            const responseSecteur = await axios.put(`${baseUrl}/secteurs`, data);
            entreprise.SecteursId.push(responseSecteur.data._id);
            console.log('Réponse du serveur en création :', responseSecteur.data);
    
            console.log("Entreprise à modifier :", entreprise);
    
            // Ajout du secteur à l'entreprise
            const responseEntreprise = await axios.put(`${baseUrl}/entreprises/${entreprise._id}`, entreprise);
            console.log('Réponse du serveur en ajout de secteur à l\'entreprise :', responseEntreprise.data);
    
        } catch (error) {
            console.error('Erreur de requête:', error.message);
        }
    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Créer un nouveau secteur</h2>
                


                <TextFieldP id='secteurName' label="Nom du secteur" onChange={setSecteurName} defaultValue={secteurName}></TextFieldP>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        sx={{
                            backgroundColor: '#84a784',
                            '&:hover': { backgroundColor: 'green' },
                            padding: '10px 20px',
                            width: '50%',
                            marginTop: '1cm',
                            height: '300%',
                            fontSize: '2rem', // Taille de police de base

                            // Utilisation de Media Queries pour ajuster la taille de police
                            '@media (min-width: 750px)': {
                                fontSize: '3rem', // Taille de police plus grande pour les écrans plus larges
                            },
                            '@media (max-width: 550px)': {
                                fontSize: '1.5rem', // Taille de police plus petite pour les écrans plus étroits
                            },
                        }}
                        variant="contained"
                    >
                        Ajouter le secteur
                    </Button>
                </div>


            </div>

        </form>
    );
}