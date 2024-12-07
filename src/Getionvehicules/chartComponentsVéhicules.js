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
const getTooltipStyle = (darkMode) => ({
    backgroundColor: darkMode ? '#1a1a1a' : 'white',
    border: `2px solid ${darkMode ? '#404040' : '#ee742d'}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: darkMode ? '#e0e0e0' : '#333333',
    boxShadow: darkMode
        ? '0 4px 20px rgba(0,0,0,0.6)'
        : '0 4px 20px rgba(0,0,0,0.15)',
    fontSize: '14px',
    lineHeight: '1.6',
    minWidth: '200px',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
});

const getTooltipContentStyle = (darkMode) => ({
    title: {
        fontSize: '25px',
        fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#333333',
        marginBottom: '8px',
        borderBottom: `1px solid ${darkMode ? '#404040' : '#ee742d33'}`,
        paddingBottom: '6px'
    },
    label: {
        color: darkMode ? '#b0b0b0' : '#666666',
        fontSize: '20px',
        marginBottom: '4px'
    },
    value: {
        color: darkMode ? '#ffffff' : '#333333',
        fontSize: '20px',
        fontWeight: '500'
    },
    row: {
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
    }
});

const CustomBarChartTooltip = ({ active, payload, label, darkMode }) => {
    if (active && payload && payload.length) {
        const tooltipStyle = getTooltipStyle(darkMode);
        const contentStyle = getTooltipContentStyle(darkMode);
        return (
            <div style={tooltipStyle}>
                <div style={contentStyle.title}>{label}</div>
                {payload.map((entry, index) => (
                    <div key={index} style={contentStyle.row}>
                        <span style={contentStyle.label}>{entry.name}:</span>
                        <span style={contentStyle.value}>
                            {entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const CustomPieChartTooltip = ({ active, payload, darkMode, company }) => {
    if (active && payload && payload.length) {
        const tooltipStyle = getTooltipStyle(darkMode);
        const contentStyle = getTooltipContentStyle(darkMode);
        const data = payload[0];
        return (
            <div style={tooltipStyle}>
                {company && (
                    <div style={contentStyle.title}>
                        {company}
                    </div>
                )}
                <div style={contentStyle.row}>
                    <span style={{
                        ...contentStyle.label,
                        color: data.payload.fill || data.color  // Utilise la couleur du secteur
                    }}>
                        {data.name}:
                    </span>
                    <span style={contentStyle.value}>
                        {data.value.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

const CustomLineChartTooltip = ({ active, payload, label, darkMode }) => {
    if (active && payload && payload.length) {
        const tooltipStyle = getTooltipStyle(darkMode);
        const contentStyle = getTooltipContentStyle(darkMode);
        return (
            <div style={tooltipStyle}>
                <div style={contentStyle.title}>{label}</div>
                {payload.map((entry, index) => (
                    <div key={index} style={contentStyle.row}>
                        <span style={contentStyle.label}>{entry.name}:</span>
                        <span style={{
                            ...contentStyle.value,
                            color: entry.color
                        }}>
                            {entry.value.toLocaleString()}
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
                <Tooltip content={props => <CustomBarChartTooltip {...props} darkMode={darkMode} />} />
                <Legend />
                <Bar dataKey={yKey} fill={fill || VEHICLE_COLORS[0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
));

// Composant de graphique en ligne pour véhicules
const MemoizedVehicleLineChart = memo(({ data, title, xKey, series, darkMode }) => (
    <div className="col-span-full">
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
                <Tooltip content={props => <CustomLineChartTooltip {...props} darkMode={darkMode} />} />
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
    </div>
));

// Composant de graphique circulaire pour véhicules
const MemoizedVehiclePieChart = memo(({ data, title, darkMode }) => (
    <div className="col-span-full">
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
                <Tooltip content={props => <CustomPieChartTooltip {...props} darkMode={darkMode} />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
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