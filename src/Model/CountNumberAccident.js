/**
 * Compte le nombre d'accidents et attribue un numéro de groupe et d'entreprise à chaque accident.
 * @param {Array} accidents - Le tableau des accidents.
 * @returns {Array} - Le tableau des accidents avec les numéros de groupe et d'entreprise attribués.
 */
export default function CountNumberAccidentGroupe(accidents) {
    // Trie les accidents par date dans l'ordre croissant
    accidents.sort((a, b) => new Date(a.DateHeureAccident) - new Date(b.DateHeureAccident));

    let groupe = 0;
    let entrepriseNumbers = {};
    let currentYear = null;

    // Supprime les accidents nuls ou vides du tableau
    accidents = accidents.filter(accident => accident !== null && Object.keys(accident).length !== 0);

    accidents.forEach((accident) => {
        const accidentYear = new Date(accident.DateHeureAccident).getFullYear();
        if (accidentYear !== currentYear) {
            // Si l'année de l'accident est différente de l'année en cours, réinitialise les numéros de groupe et d'entreprise
            currentYear = accidentYear;
            groupe = 1;
            entrepriseNumbers = {};
        } else {
            // Incrémente le numéro de groupe
            groupe++;
        }

        // Attribue le numéro de groupe à l'accident
        accident.numeroGroupe = `${accidentYear}-${groupe}`;

        const entrepriseName = accident.entrepriseName;
        // Incrémente le numéro d'entreprise pour le nom d'entreprise spécifique
        entrepriseNumbers[entrepriseName] = (entrepriseNumbers[entrepriseName] || 0) + 1;
        // Attribue le numéro d'entreprise à l'accident
        accident.numeroEntreprise = `${accidentYear}-${entrepriseNumbers[entrepriseName]}`;
    });


    return accidents;
}