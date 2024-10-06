
export const useUserConnected = () => {
    const token = JSON.parse(localStorage.getItem('token'));

    let isAuthenticated = false;
    if (token && token.data)
        isAuthenticated = true;   

    const userInfo = token.data;

    const isAdmin = userInfo.boolAdministrateur;
    const isConseiller = userInfo.entreprisesConseillerPrevention.lenght > 0 ? true : false;
    const isVisiteur = isAdmin && isConseiller;

    return { isAuthenticated, isAdmin, isConseiller, isVisiteur, userInfo };
};