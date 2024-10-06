
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