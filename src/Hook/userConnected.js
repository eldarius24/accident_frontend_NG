
/**
 * useUserConnected est un hook qui permet de connatre l'ensemble des information
 * concernant l'utilisateur connect , notamment si il est administrateur ou conseiller.
 * Si l'utilisateur n'est pas connect , alors le hook renvoie un objet avec la
 * seule propri t  isAuthenticated   false .
 * 
 * @returns {Object} Un objet avec les propri t s suivantes :
 * - isAuthenticated : boolean, vrai si l'utilisateur est connect .
 * - isAdmin : boolean, vrai si l'utilisateur est administrateur.
 * - isConseiller : boolean, vrai si l'utilisateur est conseiller.
 * - isAdminOuConseiller : boolean, vrai si l'utilisateur est administrateur ou conseiller.
 * - userInfo : objet, contenant toutes les informations de l'utilisateur.
 */
export const useUserConnected = () => {
    const token = JSON.parse(localStorage.getItem('token'));

    if (!token || !token.data)
        return { isAuthenticated : false };
        
    const userInfo = token.data;

    const isAdmin = userInfo.boolAdministrateur;
    const isConseiller = userInfo.entreprisesConseillerPrevention.length > 0 ? true : false;
    
    const isAdminOuConseiller = isAdmin || isConseiller;

    return { isAuthenticated : true, isAdmin, isConseiller, isAdminOuConseiller, userInfo };
};