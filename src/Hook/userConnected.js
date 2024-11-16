import { useSession } from './useSession';

export const useUserConnected = () => {
    useSession();
    
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