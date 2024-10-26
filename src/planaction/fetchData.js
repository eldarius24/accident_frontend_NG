// src/planaction/utils/fetchData.js
import axios from 'axios';

const createFetchData = (apiUrl) => (
    setAddactions,
    setEntreprises,
    setAllSectors,
    setAvailableSectors,
    setLoading,
    showSnackbar,
    isAdmin,
    userInfo
) => {
    return async () => {
        try {
            const [actionsResponse, enterprisesResponse, sectorsResponse] = await Promise.all([
                axios.get(`http://${apiUrl}:3100/api/planaction`),
                axios.get(`http://${apiUrl}:3100/api/entreprises`),
                axios.get(`http://${apiUrl}:3100/api/secteurs`)
            ]);

            setAddactions(actionsResponse.data);
            
            let entreprisesData = enterprisesResponse.data.map(e => ({
                label: e.AddEntreName,
                id: e._id
            }));

            if (!isAdmin) {
                entreprisesData = entreprisesData.filter(e =>
                    userInfo.entreprisesConseillerPrevention?.includes(e.label)
                );
            }
            
            setEntreprises(entreprisesData);
            const secteursData = sectorsResponse.data;
            setAllSectors(secteursData);
            setAvailableSectors(secteursData.map(s => s.secteurName));
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Erreur lors de la récupération des données', 'error');
        } finally {
            setLoading(false);
        }
    };
};

export default createFetchData;