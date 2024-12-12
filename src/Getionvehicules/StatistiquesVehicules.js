import React, { useState, useEffect, useMemo } from 'react';
import {
    FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Box, Paper, Typography
} from '@mui/material';
import { renderVehicleChart, getVehicleChartConfig } from './chartComponentsVéhicules';
import axios from 'axios';
import config from '../config.json';
import { useTheme } from '../Hook/ThemeContext';
import StyledChart from '../_composants/styledTitle';
import UseYearFilterStat from './VehicleYearFilter';

const StatistiquesVehicules = () => {
    const [data, setData] = useState([]);
    const [allYears, setAllYears] = useState([]);
    const { selectedYears, setSelectedYears, handleYearChange } = UseYearFilterStat('vehicle-statistics');
    const { darkMode } = useTheme();
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [graphs, setGraphs] = useState({
        costByYear: { visible: true, label: "Coût total par année" },
        costByMonth: { visible: true, label: "Coût par mois" },
        kmByYear: { visible: true, label: "Kilométrage total par année" },
        kmByMonth: { visible: true, label: "Kilométrage par mois" },
        costByCompany: { visible: true, label: "Coût par entreprise" },
        kmByCompany: { visible: true, label: "Kilométrage par entreprise" },
        costByVehicle: { visible: true, label: "Coût par véhicule" },
        kmByVehicle: { visible: true, label: "Kilométrage par véhicule" },

    });



    // Fonction pour charger les données
    const loadData = async () => {
        try {
            const urlApi = config.apiUrl;
            const [vehiclesResponse, recordsResponse] = await Promise.all([
                axios.get(`http://${urlApi}:3100/api/vehicles`),
                axios.get(`http://${urlApi}:3100/api/vehicles/records`)
            ]);

            const vehiclesData = vehiclesResponse.data;
            const recordsData = recordsResponse.data;

            console.log('Données brutes:', {
                vehicles: vehiclesData,
                records: recordsData.map(r => ({
                    ...r,
                    kilometrage: Number(r.kilometrage),
                    cost: Number(r.cost)
                }))
            });

            // Extraire les années uniques des enregistrements
            const years = [...new Set(recordsData.map(record =>
                new Date(record.date).getFullYear()
            ))].sort();

            setAllYears(years);
            if (years.length > 0 && selectedYears.length === 0) {
                setSelectedYears([years[years.length - 1]]); // Année la plus récente
            }

            // Extraire et initialiser les entreprises
            const uniqueCompanies = [...new Set(vehiclesData.map(vehicle => vehicle.entrepriseName))];
            setCompanies(uniqueCompanies);
            if (uniqueCompanies.length > 0 && selectedCompanies.length === 0) {
                setSelectedCompanies(uniqueCompanies); // Sélectionner toutes les entreprises par défaut
            }

            // Stocker les données normalisées
            setData({
                vehicles: vehiclesData,
                records: recordsData.map(record => ({
                    ...record,
                    date: new Date(record.date),
                    kilometrage: Number(record.kilometrage) || 0,
                    cost: Number(record.cost) || 0
                }))
            });
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };


    const formatMonthKey = (date) => {
        return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    };

    const sortMonthKeys = (monthKeys) => {
        return monthKeys.sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const dateA = new Date(Date.parse(`${monthA} 1, ${yearA}`));
            const dateB = new Date(Date.parse(`${monthB} 1, ${yearB}`));
            return dateA - dateB;
        });
    };

    const processKilometrageData = (records, vehicles, selectedYears, selectedCompanies) => {
        // Créer une map des véhicules pour un accès rapide
        const vehiclesMap = new Map(vehicles.map(v => [v._id, v]));
        
        // Organiser tous les records et données véhicules par véhicule
        const combinedDataByVehicle = {};
        
        // D'abord, initialiser avec les données de GestionVehicules
        vehicles.forEach(vehicle => {
            if (selectedCompanies.includes(vehicle.entrepriseName)) {
                const lastUpdatedDate = vehicle.lastUpdated ? new Date(vehicle.lastUpdated) : new Date();
                
                combinedDataByVehicle[vehicle._id] = {
                    entrepriseName: vehicle.entrepriseName,
                    numPlaque: vehicle.numPlaque,
                    kilometrage: Number(vehicle.kilometrage) || 0,
                    records: [{
                        date: lastUpdatedDate,
                        kilometrage: Number(vehicle.kilometrage) || 0
                    }]
                };
            }
        });
    
        // Ajouter les records de VehicleDetails
        records.forEach(record => {
            if (record.vehicleId && record.vehicleId._id && record.kilometrage !== undefined) {
                const vehicleId = record.vehicleId._id;
                const vehicle = vehiclesMap.get(vehicleId);
                
                if (vehicle && selectedCompanies.includes(vehicle.entrepriseName)) {
                    if (!combinedDataByVehicle[vehicleId]) {
                        combinedDataByVehicle[vehicleId] = {
                            entrepriseName: vehicle.entrepriseName,
                            numPlaque: vehicle.numPlaque,
                            kilometrage: Number(vehicle.kilometrage) || 0,
                            records: []
                        };
                    }
                    
                    // Assurons-nous que la date est un objet Date
                    const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
                    
                    combinedDataByVehicle[vehicleId].records.push({
                        date: recordDate,
                        kilometrage: Number(record.kilometrage)
                    });
                }
            }
        });
    
        const kmByVehicle = {}; // Ajout de l'initialisation manquante

        Object.values(combinedDataByVehicle).forEach(vehicleData => {
            if (selectedCompanies.includes(vehicleData.entrepriseName)) {
                const allRecords = vehicleData.records.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );
        
                if (allRecords.length >= 2) {
                    const kmDiff = allRecords[allRecords.length - 1].kilometrage - 
                                  allRecords[0].kilometrage;
                    if (kmDiff >= 0) {
                        kmByVehicle[vehicleData.numPlaque] = kmDiff;
                    }
                }
            }
        });


        // Pour chaque véhicule, ajouter la dernière lecture connue si elle n'existe pas déjà
        Object.values(combinedDataByVehicle).forEach(vehicleData => {
            const latestRecord = vehicleData.records[vehicleData.records.length - 1];
            if (latestRecord.kilometrage !== vehicleData.kilometrage) {
                vehicleData.records.push({
                    date: new Date(),
                    kilometrage: vehicleData.kilometrage
                });
            }
            // Trier les records par date
            vehicleData.records.sort((a, b) => a.date - b.date);
        });
    
        // Calculer les kilométrages par année
        const kmByYear = {};
        Object.values(combinedDataByVehicle).forEach(vehicleData => {
            selectedYears.forEach(year => {
                const yearRecords = vehicleData.records
                    .filter(r => new Date(r.date).getFullYear() === year)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
            
                if (yearRecords.length >= 2) {
                    const kmDiff = yearRecords[yearRecords.length - 1].kilometrage - yearRecords[0].kilometrage;
                    if (kmDiff >= 0) { // Changé > à >= pour inclure 0
                        kmByYear[year] = (kmByYear[year] || 0) + kmDiff;
                    }
                }
            });
        });
    
        // Calculer les kilométrages par mois
        const kmByMonth = {};
        Object.values(combinedDataByVehicle).forEach(vehicleData => {
            // Grouper par mois
            const monthlyRecords = {};
            
            vehicleData.records.forEach(record => {
                const date = new Date(record.date);
                const monthKey = date.toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                });
                
                if (!monthlyRecords[monthKey]) {
                    monthlyRecords[monthKey] = {
                        first: record.kilometrage,
                        last: record.kilometrage,
                        year: date.getFullYear()
                    };
                } else {
                    monthlyRecords[monthKey].last = record.kilometrage;
                }
            });
        
            // Calculer les différences
            Object.entries(monthlyRecords).forEach(([monthKey, data]) => {
                if (selectedYears.includes(data.year)) {
                    const kmDiff = data.last - data.first;
                    if (kmDiff >= 0) {
                        kmByMonth[monthKey] = (kmByMonth[monthKey] || 0) + kmDiff;
                    }
                }
            });
        });
    
        // Calculer les kilométrages par entreprise
        const kmByCompany = {};
        Object.values(combinedDataByVehicle).forEach(vehicleData => {
            if (selectedCompanies.includes(vehicleData.entrepriseName)) {
                const allRecords = vehicleData.records.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );
        
                if (allRecords.length >= 2) {
                    const kmDiff = allRecords[allRecords.length - 1].kilometrage - 
                                  allRecords[0].kilometrage;
                    if (kmDiff >= 0) {
                        kmByCompany[vehicleData.entrepriseName] = 
                            (kmByCompany[vehicleData.entrepriseName] || 0) + kmDiff;
                    }
                }
            }
        });
    
        // Calculer les kilométrages par véhicule
        Object.values(combinedDataByVehicle).forEach(vehicleData => {
            if (selectedCompanies.includes(vehicleData.entrepriseName)) {
                const allRecords = vehicleData.records.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );
        
                if (allRecords.length >= 2) {
                    const kmDiff = allRecords[allRecords.length - 1].kilometrage - 
                                  allRecords[0].kilometrage;
                    if (kmDiff >= 0) {
                        kmByVehicle[vehicleData.numPlaque] = kmDiff;
                    }
                }
            }
        });
    
        return {
            kmByYear,
            kmByMonth,
            kmByCompany,
            kmByVehicle
        };
    };


    const processedData = useMemo(() => {
        if (!data.vehicles || !data.records || selectedCompanies.length === 0) {
            return {
                costByYear: {},
                costByMonth: {},
                kmByYear: {},
                kmByMonth: {},
                costByCompany: {},
                kmByCompany: {},
                costByVehicle: {},
                kmByVehicle: {}
            };
        }
    
        const recordsByVehicle = {};
        const tempMonthlyData = {
            costs: {},
            kilometers: {}
        };
        const processedCosts = {
            costByYear: {},
            costByMonth: {},
            costByCompany: {},
            costByVehicle: {}
        };
    
        // Trier d'abord tous les enregistrements par véhicule et par date
        data.records.forEach(record => {
            const vehicleInfo = record.vehicleId;
            if (!vehicleInfo) return;
    
            if (!recordsByVehicle[vehicleInfo._id]) {
                recordsByVehicle[vehicleInfo._id] = [];
            }
            recordsByVehicle[vehicleInfo._id].push({
                ...record,
                year: new Date(record.date).getFullYear()
            });
    
            // Traitement des coûts
            const year = new Date(record.date).getFullYear();
            const monthKey = formatMonthKey(record.date);
            const cost = Number(record.cost) || 0;
    
            if (selectedYears.includes(year) && selectedCompanies.includes(vehicleInfo.entrepriseName)) {
                // Coûts mensuels
                tempMonthlyData.costs[monthKey] = (tempMonthlyData.costs[monthKey] || 0) + cost;
                // Coûts annuels
                processedCosts.costByYear[year] = (processedCosts.costByYear[year] || 0) + cost;
                // Coûts par mois
                processedCosts.costByMonth[monthKey] = (processedCosts.costByMonth[monthKey] || 0) + cost;
                // Coûts par entreprise
                processedCosts.costByCompany[vehicleInfo.entrepriseName] =
                    (processedCosts.costByCompany[vehicleInfo.entrepriseName] || 0) + cost;
                // Coûts par véhicule
                processedCosts.costByVehicle[vehicleInfo.numPlaque] =
                    (processedCosts.costByVehicle[vehicleInfo.numPlaque] || 0) + cost;
            }
        });
    
        // Calculer les kilométrages avec la fonction dédiée
        const kilometrageData = processKilometrageData(
            data.records, 
            data.vehicles, 
            selectedYears, 
            selectedCompanies
        );
    
        const sortedMonths = sortMonthKeys(Object.keys(tempMonthlyData.costs));
    
        return {
            costByYear: processedCosts.costByYear,
            costByMonth: Object.entries(processedCosts.costByMonth).map(([month, value]) => ({
                month,
                value
            })),
            kmByYear: kilometrageData.kmByYear,
            kmByMonth: Object.entries(kilometrageData.kmByMonth).map(([month, value]) => ({
                month,
                value
            })),
            costByCompany: Object.entries(processedCosts.costByCompany).map(([name, value]) => ({
                name,
                value
            })),
            kmByCompany: Object.entries(kilometrageData.kmByCompany).map(([name, value]) => ({
                name,
                value
            })),
            costByVehicle: Object.entries(processedCosts.costByVehicle).map(([name, value]) => ({
                name,
                value
            })),
            kmByVehicle: Object.entries(kilometrageData.kmByVehicle).map(([name, value]) => ({
                name,
                value
            }))
        };
    }, [data, selectedYears, selectedCompanies]);

    useEffect(() => {
        if (data.records?.length > 0) {
            console.log('Premier enregistrement exemple:', {
                record: data.records[0],
                date: new Date(data.records[0].date),
                kilometrage: Number(data.records[0].kilometrage),
                cost: Number(data.records[0].cost)
            });
        }
    }, [data.records]);

    useEffect(() => {
        console.log('Données mensuelles triées:', {
            km: processedData.kmByMonth,
            costs: processedData.costByMonth
        });
    }, [processedData]);

    useEffect(() => {
        loadData();
    }, []);

    const handleChangeCompaniesFilter = (event) => {
        const value = event.target.value;
        if (value.includes('all')) {
            setSelectedCompanies(selectedCompanies.length === companies.length ? [] : companies);
        } else {
            setSelectedCompanies(value);
        }
    };

    const handleChangeGraphsFilter = (event) => {
        const value = event.target.value;
        setGraphs(prev => ({
            ...prev,
            ...Object.fromEntries(
                Object.keys(prev).map(key => [
                    key,
                    { ...prev[key], visible: value.includes('all') ? true : value.includes(key) }
                ])
            )
        }));
    };

    const chartData = useMemo(() => {
        // Helper function pour convertir les valeurs en nombres
        const processValue = (value) => {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        };

        // Helper function pour convertir un objet en tableau pour le graphique
        const objectToChartData = (obj, keyName) => {
            if (!obj) return [];
            return Object.entries(obj).map(([key, value]) => ({
                [keyName]: key,
                value: processValue(value)
            }));
        };

        const processCostData = (data, nameKey) => {
            if (!data) return [];
            if (Array.isArray(data)) {
                return data.map(item => ({
                    [nameKey]: item[nameKey],
                    value: processValue(item.value)
                }));
            }
            return objectToChartData(data, nameKey);
        };

        // Log pour déboguer
        console.log('ProcessedData reçu:', {
            costByYear: processedData.costByYear,
            costByMonth: processedData.costByMonth,
            kmByYear: processedData.kmByYear,
            kmByMonth: processedData.kmByMonth
        });

        return {
            costByYear: processCostData(processedData.costByYear, 'year'),
            costByMonth: processCostData(processedData.costByMonth, 'month'),
            kmByYear: processCostData(processedData.kmByYear, 'year'),
            kmByMonth: processCostData(processedData.kmByMonth, 'month'),
            costByCompany: processCostData(processedData.costByCompany, 'name'),
            kmByCompany: processCostData(processedData.kmByCompany, 'name'),
            costByVehicle: processCostData(processedData.costByVehicle, 'name'),
            kmByVehicle: processCostData(processedData.kmByVehicle, 'name')
        };
    }, [processedData]);

    useEffect(() => {
        console.log('ChartData après traitement:', chartData);
    }, [chartData]);


    const selectStyle = {
        backgroundColor: darkMode ? '#424242' : '#ee742d59',
        '& .MuiSelect-icon': {
            color: darkMode ? '#fff' : 'inherit'
        }
    };

    const menuItemStyle = {
        backgroundColor: darkMode ? '#424242' : '#ee742d59',
        color: darkMode ? '#fff' : 'inherit',
        '&:hover': {
            backgroundColor: darkMode ? '#505050' : '#ee742d80'
        },
        '&.Mui-selected': {
            backgroundColor: darkMode ? '#424242' : '#ee742d59',
        },
        '&.Mui-selected:hover': {
            backgroundColor: darkMode ? '#505050' : '#ee742d80'
        },
        '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
            color: darkMode ? '#fff' : 'inherit'
        }
    };

    const checkboxStyles = {
        all: {
            color: darkMode ? '#ff6b6b' : 'red',
            '&.Mui-checked': {
                color: darkMode ? '#ff8080' : 'red'
            }
        },
        accidents: {
            color: darkMode ? '#FF9E71' : '#FF8042',
            '&.Mui-checked': {
                color: darkMode ? '#FFB08E' : '#FF8042'
            }
        },
        tf: {
            color: darkMode ? '#00E5B7' : '#00C49F',
            '&.Mui-checked': {
                color: darkMode ? '#33EAC4' : '#00C49F'
            }
        },
        default: {
            color: darkMode ? '#4CAF50' : '#257525',
            '&.Mui-checked': {
                color: darkMode ? '#81C784' : '#257525'
            }
        }
    };

    return (
        <div className="col-span-full" style={{ margin: '20px' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2rem 0',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '4px',
                    background: darkMode
                        ? 'linear-gradient(90deg, rgba(122,142,28,0.2) 0%, rgba(122,142,28,1) 50%, rgba(122,142,28,0.2) 100%)'
                        : 'linear-gradient(90deg, rgba(238,117,45,0.2) 0%, rgba(238,117,45,1) 50%, rgba(238,117,45,0.2) 100%)',
                    borderRadius: '2px'
                }
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#2D3748',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textAlign: 'center',
                        textShadow: darkMode
                            ? '2px 2px 4px rgba(0,0,0,0.3)'
                            : '2px 2px 4px rgba(0,0,0,0.1)',
                        '&::first-letter': {
                            color: darkMode ? '#7a8e1c' : '#ee752d',
                            fontSize: '120%'
                        },
                        position: 'relative',
                        padding: '0 20px'
                    }}
                >
                    Statistiques des véhicules
                </Typography>
            </Box>

            {/* Filtres */}
            <Box sx={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {/* Filtre des années */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Années</InputLabel>
                    <Select
                        sx={selectStyle}
                        multiple
                        value={selectedYears}
                        onChange={handleYearChange}
                        renderValue={(selected) => `${selected.length} année(s)`}
                    >
                        {allYears.map((year) => (
                            <MenuItem key={year} value={year} sx={menuItemStyle}>
                                <Checkbox checked={selectedYears.includes(year)} sx={checkboxStyles.default} />
                                <ListItemText primary={year} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filtre des entreprises */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Entreprises</InputLabel>
                    <Select
                        sx={selectStyle}
                        multiple
                        value={selectedCompanies}
                        onChange={handleChangeCompaniesFilter}
                        renderValue={(selected) => `${selected.length} entreprise(s)`}
                    >
                        <MenuItem value="all" sx={menuItemStyle}>
                            <Checkbox checked={selectedCompanies.length === companies.length} sx={checkboxStyles.all} />
                            <ListItemText primary="Toutes les entreprises" />
                        </MenuItem>
                        {companies.map((company) => (
                            <MenuItem key={company} value={company} sx={menuItemStyle}>
                                <Checkbox checked={selectedCompanies.includes(company)} sx={checkboxStyles.default} />
                                <ListItemText primary={company} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filtre des graphiques */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Graphiques</InputLabel>
                    <Select
                        sx={selectStyle}
                        multiple
                        value={Object.entries(graphs)
                            .filter(([_, { visible }]) => visible)
                            .map(([key]) => key)}
                        onChange={handleChangeGraphsFilter}
                        renderValue={(selected) => `${selected.length} graphique(s)`}
                    >
                        {Object.entries(graphs).map(([key, { label }]) => (
                            <MenuItem key={key} value={key} sx={menuItemStyle}>
                                <Checkbox checked={graphs[key].visible} sx={checkboxStyles.default} />
                                <ListItemText primary={label} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Affichage des graphiques */}
            {graphs.costByYear.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="bar"
                        data={chartData.costByYear}
                        title="Coût total par année"
                        xAxis="year"
                        yKey="value"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={(type, data) => getVehicleChartConfig(type, data, {
                            darkMode,
                            title: "Coût total par année",
                            xKey: "year",
                            yKey: "value"
                        })}
                    />
                </Paper>

            )}

            {graphs.kmByYear.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="bar"
                        data={chartData.kmByYear}
                        title="Kilométrage total par année"
                        xAxis="year"
                        yKey="value"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={(type, data) => getVehicleChartConfig(type, data, {
                            darkMode,
                            title: "Kilométrage total par année",
                            xKey: "year",
                            yKey: "value",
                            fill: '#43A047', // Vert pour les kilométrages
                            series: [{
                                dataKey: "value",
                                name: "Kilométrage"
                            }]
                        })}
                    />
                </Paper>

            )}

            {graphs.costByMonth.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="line"
                        data={chartData.costByMonth}
                        title="Évolution des coûts mensuels"
                        xAxis="month"
                        yKey="value"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={(type, data) => getVehicleChartConfig(type, data, {
                            darkMode,
                            title: "Évolution des coûts mensuels",
                            xKey: "month",
                            yKey: "value",
                            series: [{
                                dataKey: "value",
                                name: "Coût"
                            }]
                        })}
                    />
                </Paper>

            )}

            {graphs.kmByMonth.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="line"
                        data={chartData.kmByMonth}
                        title="Évolution du kilométrage mensuel"
                        xAxis="month"
                        yKey="value"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={(type, data) => getVehicleChartConfig(type, data, {
                            darkMode,
                            title: "Évolution du kilométrage mensuel",
                            xKey: "month",
                            yKey: "value",
                            series: [{
                                dataKey: "value",
                                name: "Kilométrage"
                            }]
                        })}
                    />
                </Paper>

            )}

            {graphs.costByCompany.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="pie"
                        data={chartData.costByCompany}
                        title="Répartition des coûts par entreprise"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={getVehicleChartConfig}
                    />
                </Paper>

            )}

            {graphs.kmByCompany.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="pie"
                        data={chartData.kmByCompany}
                        title="Répartition du kilométrage par entreprise"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={getVehicleChartConfig}
                    />
                </Paper>

            )}

            {/* Graphiques par véhicule */}
            {graphs.costByVehicle.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="bar"
                        data={chartData.costByVehicle}
                        title="Coût total par véhicule" 
                        xAxis="name"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={getVehicleChartConfig}
                    />
                </Paper>

            )}

            {graphs.kmByVehicle.visible && (
                <Paper
                    elevation={3}
                    sx={{
                        border: darkMode ? '1px solid #ffffff' : '1px solid #ee742d',
                        borderRadius: '8px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                        '&:hover': {
                            boxShadow: darkMode
                                ? '0 8px 16px rgba(255, 255, 255, 0.1)'
                                : '0 8px 16px rgba(238, 116, 45, 0.2)'
                        }
                    }}
                >
                    <StyledChart
                        chartType="bar"
                        data={chartData.kmByVehicle}
                        title="Kilométrage total par véhicule"
                        xAxis="name"
                        darkMode={darkMode}
                        renderOptimizedChart={renderVehicleChart}
                        getRenderConfig={getVehicleChartConfig}
                    />
                </Paper>
            )}
        </div>
    );
};

export default StatistiquesVehicules;