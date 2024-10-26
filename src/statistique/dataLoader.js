import recupererDonnees from './recupererDonnees';

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
        const donneesRecues = await recupererDonnees();
        
        if (!donneesRecues || !Array.isArray(donneesRecues)) {
            throw new Error('Format de données invalide');
        }

        setData(donneesRecues);
        
        // Extraction des années
        const annees = [...new Set(donneesRecues.map(accident =>
            new Date(accident.DateHeureAccident).getFullYear()
        ))].filter(annee => !isNaN(annee)).sort((a, b) => a - b);
        setAllYears(annees);
        
        // Définir l'année courante ou la plus récente
        const anneeCourante = new Date().getFullYear();
        setSelectedYears(annees.includes(anneeCourante) ? [anneeCourante] : [annees[annees.length - 1]]);
        
        // Extraction des types de travailleurs
        const types = [...new Set(donneesRecues.map(accident => 
            accident.typeTravailleur || 'Non spécifié'
        ))].filter(Boolean);
        setWorkerTypes(types);
        setSelectedWorkerTypes(types);
        
        // Extraction des secteurs
        const secteursExtraits = [...new Set(donneesRecues.map(accident => 
            accident.secteur || 'Non spécifié'
        ))].filter(Boolean);
        setSectors(secteursExtraits);
        setSelectedSectors(secteursExtraits);
        
        // Extraction des statuts assureur
        const statutsAssureur = [...new Set(donneesRecues.map(accident =>
            accident.AssureurStatus || 'Non spécifié'
        ))].filter(Boolean);
        setAssureurStatus(statutsAssureur);
        setSelectedAssureurStatus(statutsAssureur);
        
        // Extraction des types d'accidents
        const typesAccidents = [...new Set(donneesRecues.map(accident =>
            accident.typeAccident || 'Non spécifié'
        ))].filter(Boolean);
        setAccidentTypes(typesAccidents);
        setSelectedAccidentTypes(typesAccidents);
        
    } catch (erreur) {
        console.error('Échec du chargement des données d\'accidents:', erreur);
        throw erreur;
    }
}