// Dans chargerDonnees.js
import axios from 'axios';
import config from '../config.json';

/**
 * Charge toutes les données, y compris les archives
 */
export default async function chargerDonnees({
    setData,
    setAllYears,
    setSelectedYears,
    setWorkerTypes,
    setSelectedWorkerTypes,
    setSectors,
    setSelectedSectors,
    setAssureurStatus,
    setSelectedAssureurStatus,
    setAccidentTypes,
    setSelectedAccidentTypes,
    setCompanies,
    setSelectedCompanies
}) {
    try {
        const urlApi = config.apiUrl;

        // Charger les données actives et archivées en parallèle
        const [accidentsResponse, tfResponse, archivesResponse] = await Promise.all([
            axios.get(`http://${urlApi}:3100/api/accidents`),
            axios.get(`http://${urlApi}:3100/api/questionnaires`),
            axios.get(`http://${urlApi}:3100/api/archives/accident`)
        ]);


        const donneesAccidents = accidentsResponse.data;
        const donneesTf = tfResponse.data;

        // Extraire les données des archives
        const donneesArchivees = archivesResponse.data.map(archive => archive.donnees);

        // Fusionner les données actives et archivées
        const toutesLesDonnees = [...donneesAccidents, ...donneesArchivees];

        if (!Array.isArray(toutesLesDonnees)) {
            throw new Error('Format de données invalide');
        }

        setData(toutesLesDonnees);

        // Extraire les années des accidents (actifs et archivés)
        const anneesAccidents = toutesLesDonnees
            .map(accident => new Date(accident.DateHeureAccident).getFullYear())
            .filter(annee => !isNaN(annee));

        // Extraire les années des données TF
        const anneesTf = donneesTf
            .flatMap(questionnaire => questionnaire.annees || [])
            .map(annee => parseInt(annee))
            .filter(annee => !isNaN(annee));

        // Créer un tableau de toutes les années uniques avec leurs sources
        const toutesAnnees = [...new Set([...anneesAccidents, ...anneesTf])]
            .sort((a, b) => a - b);

        setAllYears(toutesAnnees);

        // Définir l'année courante ou la plus récente
        const anneeCourante = new Date().getFullYear();
        const anneeParDefaut = toutesAnnees.find(a => a === anneeCourante) ||
            toutesAnnees[toutesAnnees.length - 1];

        setSelectedYears(anneeParDefaut ? [anneeParDefaut] : []);

        // Extraire toutes les valeurs uniques pour les filtres
        const types = [...new Set(toutesLesDonnees.map(accident =>
            accident.typeTravailleur || 'Non spécifié'
        ))].filter(Boolean);
        setWorkerTypes(types);
        setSelectedWorkerTypes(types);

        const secteursExtraits = [...new Set(toutesLesDonnees.map(accident =>
            accident.secteur || 'Non spécifié'
        ))].filter(Boolean);
        setSectors(secteursExtraits);
        setSelectedSectors(secteursExtraits);

        const statutsAssureur = [...new Set(toutesLesDonnees.map(accident =>
            accident.AssureurStatus || 'Non spécifié'
        ))].filter(Boolean);
        setAssureurStatus(statutsAssureur);
        setSelectedAssureurStatus(statutsAssureur);

        const typesAccidents = [...new Set(toutesLesDonnees.map(accident =>
            accident.typeAccident || 'Non spécifié'
        ))].filter(Boolean);
        setAccidentTypes(typesAccidents);
        setSelectedAccidentTypes(typesAccidents);

        const entreprises = [...new Set(toutesLesDonnees.map(accident =>
            accident.entrepriseName || 'Non spécifié'
        ))].filter(Boolean);
        setCompanies(entreprises);
        setSelectedCompanies(entreprises);

    } catch (erreur) {
        console.error('Échec du chargement des données:', erreur);
        throw erreur;
    }
}