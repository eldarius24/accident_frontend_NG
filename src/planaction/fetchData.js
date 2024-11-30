import axios from 'axios';

const REQUIRED_FIELDS = [
    'AddAction',
    'AddActionDate',
    'AddActionQui',
    'AddActionSecteur',
    'AddActionEntreprise',
    'AddboolStatus',
    'AddActoinmoi',
    'AddActionanne',
    'AddActionDange',
    'priority',
    '_id'
];

const createFetchData = (apiUrl) => (
    setAddactions,
    setEnterprises,
    setAllSectors,
    setAvailableSectors,
    setLoading,
    showSnackbar,
    isAdminOrDev,
    userInfo
) => {
    return async () => {
        setLoading(true);
        try {
            const actionsResponse = await axios.get(
                `http://${apiUrl}:3100/api/planaction/filtered-fields?fields=${JSON.stringify(REQUIRED_FIELDS)}`
            );

            if (!actionsResponse.data || !actionsResponse.data.success) {
                throw new Error('Réponse des actions invalide');
            }

            const actionsData = actionsResponse.data.data || [];
            
            const entreprisesFromActions = [...new Set(actionsData
                .filter(action => action?.AddActionEntreprise)
                .map(action => action.AddActionEntreprise)
            )];

            const enterprisesResponse = await axios.get(
                `http://${apiUrl}:3100/api/entreprises/by-names`, {
                    params: {
                        names: JSON.stringify(entreprisesFromActions)
                    }
                }
            );

            if (!enterprisesResponse.data || !enterprisesResponse.data.success) {
                throw new Error('Réponse des entreprises invalide');
            }

            const sectorsResponse = await axios.get(
                `http://${apiUrl}:3100/api/secteurs/by-enterprises`, {
                    params: {
                        names: JSON.stringify(entreprisesFromActions)
                    }
                }
            );

            if (!sectorsResponse.data || !sectorsResponse.data.success) {
                throw new Error('Réponse des secteurs invalide');
            }

            let entreprisesData = (enterprisesResponse.data.data || [])
                .filter(e => e?.AddEntreName)
                .map(e => ({
                    label: e.AddEntreName,
                    id: e._id
                }));

            entreprisesFromActions.forEach(actionEntreprise => {
                if (!entreprisesData.some(e => e.label === actionEntreprise)) {
                    entreprisesData.push({
                        label: actionEntreprise,
                        id: `legacy-${actionEntreprise}`
                    });
                }
            });

            if (!isAdminOrDev && userInfo?.entreprisesConseillerPrevention) {
                entreprisesData = entreprisesData.filter(e =>
                    userInfo.entreprisesConseillerPrevention.includes(e.label)
                );
            }

            const secteursData = sectorsResponse.data.data || [];

            setAddactions(actionsData);
            setEnterprises(entreprisesData);
            setAllSectors(secteursData);
            const availableSectors = secteursData
                .filter(s => s?.secteurName)
                .map(s => s.secteurName);
            setAvailableSectors(availableSectors);

            showSnackbar('Données récupérées avec succès', 'success');

        } catch (error) {
            showSnackbar('Erreur lors de la récupération des données', 'error');
            
            setAddactions([]);
            setEnterprises([]);
            setAllSectors([]);
            setAvailableSectors([]);
        } finally {
            setLoading(false);
        }
    };
};

export default createFetchData;