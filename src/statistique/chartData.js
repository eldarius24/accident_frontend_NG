const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Export par défaut au lieu d'un export nommé
export default function genererDonneesGraphiques(stats) {
    if (!stats) return {};
    
    return {
        accidentsBySexData: Object.entries(stats.accidentsBySex || {})
            .map(([sexe, NombreAT]) => ({ 
                name: sexe, 
                value: NombreAT 
            })),

        accidentMonthData: Object.entries(stats.accidentsByMonth || {})
            .map(([month, NombreAT]) => ({ 
                month: MONTHS[parseInt(month)], 
                NombreAT 
            })),

        accidentYearData: Object.entries(stats.accidentsByYear || {})
            .map(([year, NombreAT]) => ({ 
                year: year.toString(), 
                NombreAT 
            })),

        accidentMonthByCompanyData: MONTHS.map((month, index) => ({
            month,
            ...Object.fromEntries(
                Object.entries(stats.accidentsByMonthByCompany || {})
                    .map(([company, data]) => [company, data[index] || 0])
            )
        })),

        accidentYearByCompanyData: Object.keys(stats.accidentsByYear || {})
            .map(year => ({
                year,
                ...Object.fromEntries(
                    Object.entries(stats.accidentsByYearByCompany || {})
                        .map(([company, data]) => [company, data[year] || 0])
                )
            })),

        accidentSectorData: Object.entries(stats.accidentsBySector || {})
            .map(([sector, NombreAT]) => ({ 
                name: sector, 
                value: NombreAT 
            })),

        accidentsByDayOfWeekByCompanyData: Object.entries(stats.accidentsByDayOfWeekByCompany || {})
            .map(([company, data]) => ({
                company,
                data: Object.entries(data).map(([day, NombreAT]) => ({ 
                    day: DAYS[parseInt(day)], 
                    NombreAT 
                }))
            })),

        accidentDayOfWeekData: DAYS.map((day, index) => ({
            day,
            NombreAT: (stats.accidentsByDayOfWeek || [])[index] || 0,
        })),

        accidentsByAgeByCompanyData: Object.entries(stats.accidentsByAgeByCompany || {})
            .map(([company, ageData]) => ({
                company,
                data: Object.entries(ageData)
                    .map(([age, NombreAT]) => ({ 
                        age: parseInt(age), 
                        NombreAT 
                    }))
                    .sort((a, b) => a.age - b.age)
            })),

        accidentsByTypeTravailleurData: Object.entries(stats.accidentsByTypeTravailleur || {})
            .map(([type, NombreAT]) => ({
                type, 
                NombreAT
            })),

        accidentsByAgeData: Object.entries(stats.accidentsByAge || {})
            .map(([age, NombreAT]) => ({ 
                age: parseInt(age), 
                NombreAT 
            }))
            .sort((a, b) => a.age - b.age)
    };
}

export { MONTHS, DAYS };