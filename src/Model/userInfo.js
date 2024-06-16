/**
 * fonction isAdmin pour savoir si l'utilisateur est connecté en tant qu'administrateur
 * @returns {boolean} true si l'utilisateur est connecté en tant qu'administrateur, false sinon
 */
export function isAdmin() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token?.data?.boolAdministrateur;
}

/**
 * fonction isLogged pour savoir si l'utilisateur est connecté
 * @returns {boolean} true si l'utilisateur est connecté, false sinon
 */
export function isLogged() {
    return !!localStorage.getItem('token');
}

/**
 * fonction EntreprisesConseillerPrevention pour savoir les entreprises dont l'utilisateur est conseiller en prévention
 * @returns {string[]} les entreprises dont l'utilisateur est conseiller en prévention
 */
export function EntreprisesConseillerPrevention() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token?.data?.entrepriseConseiller;
}

/**
 * fonction EntreprisesVisiteur pour savoir les entreprises dont l'utilisateur est visiteur
 * @returns {string[]} les entreprises dont l'utilisateur est visiteur
 */
export function EntreprisesVisiteur() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token?.data?.entrepriseVisiteur;
}
