import axios from 'axios';

/**
 * Récupère les données des accidents à partir de l'API.
 * 
 * Cette fonction effectue une requête GET vers l'API pour récupérer les données des accidents.
 * Si la requête échoue, une erreur est levée avec un message d'erreur.
 * Si la réponse est valide, les données sont renvoyées.
 * 
 * @returns {Array} Un tableau contenant les données des accidents.
 * @throws {Error} Si la requête échoue, une erreur est levée avec un message d'erreur.
 */
export default async function recupererDonnees() {
    try {
        const urlApi = process.env.REACT_APP_API_URL;
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
