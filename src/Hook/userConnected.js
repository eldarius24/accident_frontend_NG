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
    const isUserPrevention = userInfo.entreprisesUserPrevention?.length > 0;
    //véhicule
    const isVehicleAdmin = userInfo.boolAdministrateurVehicule;

    const isFleetManager = userInfo.userGetionaireVehicule?.length > 0;

    const isAdminOrDevOrConseiller = isAdmin || isDeveloppeur || isConseiller;
    const isAdminOrDev = isAdmin || isDeveloppeur || isVehicleAdmin;
    const isAdminOuConseiller = isAdmin || isConseiller;
    const isUserPreventionOrAdmin = isAdmin || isUserPrevention;
    const isUserPreventionOrAdminOrConseiller = isAdminOrDevOrConseiller || isUserPrevention;
    const isUserPreventionOrConseiller = isUserPrevention || isConseiller;
    const isVehicleAdminManager = isVehicleAdmin || isFleetManager;

    return {
        userInfo,
        isAuthenticated: true,
        isAdmin,
        isUserPrevention,
        isDeveloppeur,
        isAdminOrDevOrConseiller,
        isAdminOrDev,
        isConseiller,
        isAdminOuConseiller,
        isUserPreventionOrAdmin,
        isUserPreventionOrAdminOrConseiller,
        isUserPreventionOrConseiller,
        //véhicule
        isVehicleAdmin,
        isFleetManager,
        isVehicleAdminManager
    };
};