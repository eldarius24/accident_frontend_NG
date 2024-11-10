/**
 * useUserConnected est un hook qui permet de connaître l'ensemble des informations
 * concernant l'utilisateur connecté, notamment s'il est administrateur, développeur ou conseiller.
 * Si l'utilisateur n'est pas connecté, alors le hook renvoie un objet avec la
 * seule propriété isAuthenticated à false.
 *
 * @returns {Object} Un objet avec les propriétés suivantes :
 * - isAuthenticated : boolean, vrai si l'utilisateur est connecté.
 * - isAdmin : boolean, vrai si l'utilisateur est administrateur.
 * - isDeveloppeur : boolean, vrai si l'utilisateur est développeur.
 * - isAdminOrDev : boolean, vrai si l'utilisateur est administrateur ou développeur.
 * - isConseiller : boolean, vrai si l'utilisateur est conseiller.
 * - isAdminOuConseiller : boolean, vrai si l'utilisateur est administrateur, développeur ou conseiller.
 * - userInfo : objet, contenant toutes les informations de l'utilisateur.
 */
export const useUserConnected = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token || !token.data)
        return { isAuthenticated: false };
   
    const userInfo = token.data;
    const isAdmin = userInfo.boolAdministrateur;
    const isDeveloppeur = userInfo.boolDeveloppeur;
    const isConseiller = userInfo.entreprisesConseillerPrevention?.length > 0;
    const isAdminOrDevOrConseiller = isAdmin || isDeveloppeur || isConseiller;
    const isAdminOrDev = isAdmin || isDeveloppeur;
    const isAdminOuConseiller = isAdmin || isConseiller;

    return {
        userInfo,
        isAuthenticated: true,
        isAdmin,
        isDeveloppeur,
        isAdminOrDevOrConseiller,
        isAdminOrDev,
        isConseiller,
        isAdminOuConseiller
    };
};