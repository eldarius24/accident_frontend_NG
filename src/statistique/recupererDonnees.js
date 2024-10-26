import axios from 'axios';

export default async function recupererDonnees() {
    try {
        const urlApi = process.env.REACT_APP_API_URL || 'localhost';
        const reponse = await axios.get(`http://${urlApi}:3100/api/accidents`, {
            timeout: 5000,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!Array.isArray(reponse.data)) {
            throw new Error('Format de données invalide reçu du serveur');
        }

        return reponse.data;

    } catch (erreur) {
        let messageErreur = 'Erreur lors de la récupération des données : ';
        
        if (erreur.response) {
            messageErreur += `Erreur serveur ${erreur.response.status}: ${erreur.response.data?.message || 'Erreur serveur inconnue'}`;
        } else if (erreur.request) {
            messageErreur += 'Aucune réponse reçue du serveur. Veuillez vérifier votre connexion.';
        } else {
            messageErreur += erreur.message || 'Une erreur inconnue est survenue';
        }

        console.error(messageErreur);
        throw erreur;
    }
}
