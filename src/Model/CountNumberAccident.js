/**
 * Counts the number of accidents and assigns group and enterprise numbers to each accident.
 * @param {Array} accidents - The array of accidents.
 * @returns {Array} - The array of accidents with assigned group and enterprise numbers.
 */
export default function CountNumberAccidentGroupe(accidents) {
    accidents.sort((a, b) => new Date(a.DateHeureAccident) - new Date(b.DateHeureAccident));

    let groupe = 0;
    let entrepriseNumbers = {};

    accidents.forEach((accident) => {
        groupe++;
        accident.numeroGroupe = groupe;

        const entrepriseName = accident.entrepriseName;
        entrepriseNumbers[entrepriseName] = (entrepriseNumbers[entrepriseName] || 0) + 1;
        accident.numeroEntreprise = entrepriseNumbers[entrepriseName];
    });

    accidents.forEach((accident) => {
        console.log("accidents after sort  => ", accident.numeroGroupe, "->", accident.numeroEntreprise, "->", accident.DateHeureAccident);
    });

    return accidents;
}