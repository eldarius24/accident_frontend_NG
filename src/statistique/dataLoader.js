import axios from 'axios';

/**
 * Charge les données d'accidents à partir de l'API.
 * 
 * Une fois les données chargées, elle les stocke dans l'état `data` et
 * initialise les autres états avec les données extraites :
 * - `allYears`: toutes les années disponibles dans les données
 * - `selectedYears`: l'année courante ou la plus récente
 * - `workerTypes`: les types de travailleurs
 * - `selectedWorkerTypes`: tous les types de travailleurs
 * - `sectors`: les secteurs d'activité
 * - `selectedSectors`: tous les secteurs
 * - `assureurStatus`: les statuts assureur
 * - `selectedAssureurStatus`: tous les statuts assureur
 * - `accidentTypes`: les types d'accidents
 * - `selectedAccidentTypes`: tous les types d'accidents
 * 
 * Si une erreur se produit pendant le chargement des données, elle est
 * capturée et affichée dans la console.
 * 
 * @param {{ setData: (any) => void; setAllYears: (any) => void; setSelectedYears: (any) => void; setWorkerTypes: (any) => void; setSelectedWorkerTypes: (any) => void; setSectors: (any) => void; setSelectedSectors: (any) => void; setAssureurStatus: (any) => void; setSelectedAssureurStatus: (any) => void; setAccidentTypes: (any) => void; setSelectedAccidentTypes: (any) => void }} props
 */
/**
 * Charge les données d'accidents et de TF à partir de l'API.
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
    setSelectedAccidentTypes
}) {
    try {
        // Charger les données d'accidents
        const urlApi = process.env.REACT_APP_API_URL || 'localhost';
        const [accidentsResponse, tfResponse] = await Promise.all([
            axios.get(`http://${urlApi}:3100/api/accidents`),
            axios.get(`http://${urlApi}:3100/api/questionnaires`)
        ]);

        const donneesAccidents = accidentsResponse.data;
        const donneesTf = tfResponse.data;
        
        if (!Array.isArray(donneesAccidents)) {
            throw new Error('Format de données invalide');
        }

        setData(donneesAccidents);
        
        // Extraire les années des accidents
        const anneesAccidents = donneesAccidents
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
        
        // Reste du code inchangé pour les autres setters...
        const types = [...new Set(donneesAccidents.map(accident => 
            accident.typeTravailleur || 'Non spécifié'
        ))].filter(Boolean);
        setWorkerTypes(types);
        setSelectedWorkerTypes(types);
        
        const secteursExtraits = [...new Set(donneesAccidents.map(accident => 
            accident.secteur || 'Non spécifié'
        ))].filter(Boolean);
        setSectors(secteursExtraits);
        setSelectedSectors(secteursExtraits);
        
        const statutsAssureur = [...new Set(donneesAccidents.map(accident =>
            accident.AssureurStatus || 'Non spécifié'
        ))].filter(Boolean);
        setAssureurStatus(statutsAssureur);
        setSelectedAssureurStatus(statutsAssureur);
        
        const typesAccidents = [...new Set(donneesAccidents.map(accident =>
            accident.typeAccident || 'Non spécifié'
        ))].filter(Boolean);
        setAccidentTypes(typesAccidents);
        setSelectedAccidentTypes(typesAccidents);
        
    } catch (erreur) {
        console.error('Échec du chargement des données:', erreur);
        throw erreur;
    }
}