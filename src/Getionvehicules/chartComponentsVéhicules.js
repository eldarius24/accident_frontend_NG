import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import {
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Couleurs pour les graphiques véhicules
export const VEHICLE_COLORS = [
    '#1E88E5', // Bleu
    '#43A047', // Vert
    '#FB8C00', // Orange
    '#E53935', // Rouge
    '#8E24AA', // Violet
    '#00ACC1', // Cyan
    '#FFB300', // Jaune
];

// Styles des tooltips
const getVehicleTooltipStyle = (darkMode) => ({
    backgroundColor: darkMode ? '#1a1a1a' : 'white',
    border: `2px solid ${darkMode ? '#404040' : '#1E88E5'}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: darkMode ? '#e0e0e0' : '#333333',
    boxShadow: darkMode
        ? '0 4px 20px rgba(0,0,0,0.6)'
        : '0 4px 20px rgba(0,0,0,0.15)',
    fontSize: '14px',
    lineHeight: '1.6',
    minWidth: '200px',
});

// Tooltips personnalisés
const VehicleBarChartTooltip = ({ active, payload, label, darkMode }) => {
    if (active && payload && payload.length) {
        return (
            <div style={getVehicleTooltipStyle(darkMode)}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{label}</div>
                {payload.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{entry.name}:</span>
                        <span style={{ marginLeft: '20px', color: entry.color }}>
                            {entry.name.toLowerCase().includes('coût') || entry.name.toLowerCase().includes('cout')
                                ? `${entry.value.toLocaleString()} €`
                                : entry.name.toLowerCase().includes('km')
                                    ? `${entry.value.toLocaleString()} km`
                                    : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Composant de graphique en barres pour véhicules
const MemoizedVehicleBarChart = memo(({ data, title, xKey, yKey, fill, darkMode }) => (
    <div className="col-span-full">
        <Box
            sx={{
                position: 'relative',
                padding: '20px',
                background: darkMode ? '#1a1a1a' : '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#333333' }}>
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xKey}
                        tick={{ fill: darkMode ? '#ffffff' : '#666666' }}
                    />
                    <YAxis
                        tick={{ fill: darkMode ? '#ffffff' : '#666666' }}
                        tickFormatter={(value) => {
                            if (yKey.toLowerCase().includes('cout') || yKey.toLowerCase().includes('coût')) {
                                return `${value.toLocaleString()} €`;
                            }
                            if (yKey.toLowerCase().includes('km')) {
                                return `${value.toLocaleString()} km`;
                            }
                            return value.toLocaleString();
                        }}
                    />
                    <Tooltip content={props => <VehicleBarChartTooltip {...props} darkMode={darkMode} />} />
                    <Legend />
                    <Bar dataKey={yKey} fill={fill || VEHICLE_COLORS[0]} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    </div>
));

// Composant de graphique en ligne pour véhicules
const MemoizedVehicleLineChart = memo(({ data, title, xKey, series, darkMode }) => (
    <div className="col-span-full">
        <Box
            sx={{
                position: 'relative',
                padding: '20px',
                background: darkMode ? '#1a1a1a' : '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#333333' }}>
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xKey}
                        tick={{ fill: darkMode ? '#ffffff' : '#666666' }}
                    />
                    <YAxis
                        tick={{ fill: darkMode ? '#ffffff' : '#666666' }}
                        tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip content={props => <VehicleBarChartTooltip {...props} darkMode={darkMode} />} />
                    <Legend />
                    {series.map((serie, index) => (
                        <Line
                            key={serie.dataKey}
                            type="monotone"
                            dataKey={serie.dataKey}
                            name={serie.name}
                            stroke={VEHICLE_COLORS[index % VEHICLE_COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </Box>
    </div>
));

// Composant de graphique circulaire pour véhicules
const MemoizedVehiclePieChart = memo(({ data, title, darkMode }) => (
    <div className="col-span-full">
        <Box
            sx={{
                position: 'relative',
                padding: '20px',
                background: darkMode ? '#1a1a1a' : '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#333333' }}>
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value, percent }) => 
                            `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`
                        }
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={VEHICLE_COLORS[index % VEHICLE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={props => <VehicleBarChartTooltip {...props} darkMode={darkMode} />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    </div>
));

// Fonction principale de rendu des graphiques
export const renderVehicleChart = (type, data, config) => {
    switch (type) {
        case 'bar':
            return (
                <MemoizedVehicleBarChart
                    data={data}
                    title={config.title}
                    xKey={config.xKey}
                    yKey={config.yKey}
                    fill={config.fill}
                    darkMode={config.darkMode}
                />
            );

        case 'line':
            return (
                <MemoizedVehicleLineChart
                    data={data}
                    title={config.title}
                    xKey={config.xKey}
                    series={config.series}
                    darkMode={config.darkMode}
                />
            );

        case 'pie':
            return (
                <MemoizedVehiclePieChart
                    data={data}
                    title={config.title}
                    darkMode={config.darkMode}
                />
            );

        default:
            return null;
    }
};

// Configuration des graphiques
export const getVehicleChartConfig = (type, data, options = {}) => {
    const baseConfig = {
        darkMode: options.darkMode || false,
        title: options.title || '',
        ...options
    };

    switch (type) {
        case 'bar':
            return {
                ...baseConfig,
                xKey: options.xKey || 'name',
                yKey: options.yKey || 'value',
                fill: options.fill || VEHICLE_COLORS[0]
            };

            case 'line':
                return {
                    ...baseConfig,
                    xKey: options.xKey || 'month',
                    series: options.series || [{
                        dataKey: options.yKey || 'value',
                        name: options.yKey === 'cost' ? 'Coût' : 'Kilométrage'
                    }]
                };

        case 'pie':
            return baseConfig;

        default:
            return baseConfig;
    }
};