import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../composants/textFieldP';
import '../pageFormulaire/formulaire.css';
import Button from '@mui/material/Button';
import config from '../config.json';

/**
 * 
 * @param {[string]} entreprise informations de l'entreprise
 * @param {[string]} secteurData Secteur à éditer
 * @returns 
 */
export default function AddSecteur({entreprise, secteurData }) {

    const apiUrl = config.apiUrl;
    const { setValue, watch, handleSubmit } = useForm();


    const [secteurName, setSecteurName] = useState(watch('secteurName') ? watch('secteurName') : (secteurData && secteurData.secteurName ? secteurData.secteurName : null));

    useEffect(() => {
        setValue('secteurName', secteurName)
    }, [secteurName]);



    /**************************************************************************
     * METHODE ON SUBMIT
     * ************************************************************************/
    const onSubmit = (data) => {

        data.entrepriseId = entreprise._id;
        console.log("Formulaire.js -> onSubmit -> Données à enregistrer :", data);
        
        //mode CREATION
        axios.put("http://" + apiUrl + ":3100/api/secteur", data)
            .then(response => {
                console.log('Réponse du serveur en création :', response.data);
            })
            .catch(error => {
                console.error('Erreur de requête:', error.message);
            });
    };

    return (
        <form className="background-image" onSubmit={handleSubmit(onSubmit)}>
            <div className="frameStyle-style">
                <h2>Créer une nouvelle entreprise</h2>
                <h3>Toutes les données doivent êtres obligatoirement remplie</h3>


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