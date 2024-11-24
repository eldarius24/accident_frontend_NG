import axios from 'axios';

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
        setLoading(true); // Assurez-vous que le loading est activé au début
        try {
            const [actionsResponse, enterprisesResponse, sectorsResponse] = await Promise.all([
                axios.get(`http://${apiUrl}:3100/api/planaction`),
                axios.get(`http://${apiUrl}:3100/api/entreprises`),
                axios.get(`http://${apiUrl}:3100/api/secteurs`)
            ]);

            // Récupérer les actions
            const actionsData = actionsResponse.data || [];
            
            // Extraire toutes les entreprises uniques des actions
            const entreprisesFromActions = [...new Set(actionsData
                .filter(action => action?.AddActionEntreprise)
                .map(action => action.AddActionEntreprise)
            )];

            // Obtenir les entreprises de la table entreprises
            let entreprisesData = (enterprisesResponse.data || [])
                .filter(e => e?.AddEntreName)
                .map(e => ({
                    label: e.AddEntreName,
                    id: e._id
                }));

            // Ajouter les entreprises uniques des actions
            entreprisesFromActions.forEach(actionEntreprise => {
                if (!entreprisesData.some(e => e.label === actionEntreprise)) {
                    entreprisesData.push({
                        label: actionEntreprise,
                        id: `legacy-${actionEntreprise}`
                    });
                }
            });

            // Filtrer selon les permissions si nécessaire
            if (!isAdminOrDev && userInfo?.entreprisesConseillerPrevention) {
                entreprisesData = entreprisesData.filter(e =>
                    userInfo.entreprisesConseillerPrevention.includes(e.label)
                );
            }

            // Mettre à jour les états dans un ordre spécifique
            setAddactions(actionsData);
            setEnterprises(entreprisesData);
            
            const secteursData = sectorsResponse.data || [];
            setAllSectors(secteursData);
            setAvailableSectors(secteursData
                .filter(s => s?.secteurName)
                .map(s => s.secteurName)
            );

        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Erreur lors de la récupération des données', 'error');
            // Réinitialiser les états en cas d'erreur
            setAddactions([]);
            setEntreprises([]);
            setAllSectors([]);
            setAvailableSectors([]);
        } finally {
            setLoading(false);
        }
    };
};



export default createFetchData;