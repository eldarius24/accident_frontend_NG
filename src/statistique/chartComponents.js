import React, { memo } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

const MemoizedPieChart = memo(({ data, title }) => (
    <div className="col-span-full">
        <h2>{title}</h2>
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
                    label={({ name, value }) => `${name}: ${value}`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
));

const MemoizedBarChart = memo(({ data, title, xKey, dataKey = "NombreAT", fill }) => (
    <div className="col-span-full">
        <h2>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} fill={fill} />
            </BarChart>
        </ResponsiveContainer>
    </div>
));

const MemoizedLineChart = memo(({ data, title, xKey, series }) => (
    <div className="col-span-full">
        <h2>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((serie, index) => (
                    <Line
                        key={serie}
                        type="monotone"
                        dataKey={serie}
                        stroke={COLORS[index % COLORS.length]}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    </div>
));

const MemoizedCompanyChart = memo(({ title, companies, ChartType, renderData }) => (
    <div className="text-center">
        <h2>{title}</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        {ChartType === PieChart ? (
                            <PieChart>
                                <Pie
                                    data={Object.entries(data).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {Object.entries(data).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        ) : (
                            <BarChart data={renderData(data)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={renderData.xKey} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {renderData.children}
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

/**
 * Rendu d'un graphique optimis  en fonction du type de graphique
 * 
 * @param {string} type - type de graphique ('pie', 'bar', 'line', 'company')
 * @param {object} data - donn es du graphique
 * @param {object} config - configuration du graphique
 * @returns {JSX.Element|null} - le graphique JSX ou null si le type n'est pas pris en charge
 */
export const renderOptimizedChart = (type, data, config) => {
    switch (type) {
        case 'pie':
            return <MemoizedPieChart data={data} title={config.title} />;

        case 'bar':
            return (
                <MemoizedBarChart
                    data={data}
                    title={config.title}
                    xKey={config.xAxis}
                    fill={config.fill}
                />
            );

        case 'line':
            return (
                <MemoizedLineChart
                    data={data}
                    title={config.title}
                    xKey={config.xAxis}
                    series={config.series}
                />
            );

        case 'company':
            return (
                <MemoizedCompanyChart
                    title={config.title}
                    companies={config.companies}
                    ChartType={config.component}
                    renderData={config.renderData}
                />
            );

        default:
            return null;
    }
};

/**
 * Retourne la configuration de rendu pour un graphique
 * en fonction de son type.
 *
 * @param {string} type - type de graphique ('pie', 'bar', 'line', 'company')
 * @param {object} data - donn es du graphique
 * @param {object} [options={}] - options de configuration du graphique
 * @returns {object} - la configuration de rendu
 */
export const getRenderConfig = (type, data, options = {}) => {
    const baseConfig = {
        className: "col-span-full",
        ...options,
    };

    switch (type) {
        case 'pie':
            return {
                ...baseConfig,
                component: PieChart,
            };

        case 'bar':
            return {
                ...baseConfig,
                component: BarChart,
                dataKey: "NombreAT",
            };

        case 'line':
            return {
                ...baseConfig,
                component: LineChart,
                series: options.series || [],
            };

        case 'company':
            return {
                ...baseConfig,
                companies: options.companies || [],
                renderData: options.renderData || (data => data),
            };

        default:
            return baseConfig;
    }
};