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


const MemoizedDetailedCompanyChart = memo(({ title, companies }) => (
    <div className="text-center">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full">
                    <h3 className="text-lg font-semibold mb-2">{company}</h3>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="year"
                                    label={{ value: 'Année', position: 'bottom' }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Taux de fréquence',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip
                                    content={({ payload, label }) => {
                                        if (payload && payload.length > 0) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-2 border rounded shadow">
                                                    <p className="font-bold">Année: {label}</p>
                                                    <p>Taux de fréquence: {data.tf.toFixed(2)}</p>
                                                    <p>Heures prestées: {data.heuresPreste.toLocaleString()}</p>
                                                    <p>Accidents: {data.accidents}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="tf"
                                    stroke="#00b1b2"
                                    strokeWidth={2}
                                    dot={{ r: 6, fill: '#00b1b2' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Année
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Taux de fréquence
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Heures prestées
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Accidents
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.year}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.tf.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.heuresPreste.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.accidents}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedTfByCompanyChart = memo(({ companies, selectedYears }) => (
    <div className="text-center">
        <h2>Taux de fréquence par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={data.filter(item => selectedYears.includes(parseInt(item.year)))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                content={({ payload, label }) => {
                                    if (payload && payload.length > 0) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-2 border rounded shadow">
                                                <p className="font-bold">Année: {label}</p>
                                                <p>Taux de fréquence: {data.tf.toFixed(2)}</p>
                                                <p>Heures prestées: {data.heuresPreste.toLocaleString()}</p>
                                                <p>Accidents: {data.accidents}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="tf"
                                name="Taux de fréquence"
                                stroke="#00b1b2"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#00b1b2' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedWorkerTypeByCompanyChart = memo(({ companies }) => (
    <div className="text-center">
        <h2>Accidents par type de travailleur et par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="typeTravailleur" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="NombreAT" fill="#0088FE" name="Nombre d'accidents" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedAgeByCompanyChart = memo(({ companies }) => (
    <div className="text-center">
        <h2>Accidents par âge du travailleur et par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="age" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="NombreAT" fill="#8884d8" name="Nombre d'accidents" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedTfYearCompanyChart = memo(({ data, selectedYears }) => {
    // Extraire toutes les années uniques et les trier
    const sortedYears = [...new Set(
        data.flatMap(item =>
            Object.keys(item).filter(key =>
                key !== 'company' && selectedYears.includes(parseInt(key))
            )
        )
    )].sort((a, b) => parseInt(a) - parseInt(b));

    // Préparer les données formatées et triées
    const formattedData = sortedYears.map(year => ({
        year,
        ...Object.fromEntries(
            data.map(item => [
                item.company,
                item[year] || null
            ])
        )
    }));

    return (
        <div className="text-center mb-8">
            <h2>Taux de fréquence par année et par entreprise</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={formattedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="year"
                        type="category"
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {data.map((item, index) => (
                        <Line
                            key={item.company}
                            type="monotone"
                            dataKey={item.company}
                            stroke={COLORS[index % COLORS.length]}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});

const MemoizedAccidentSectorCompanyChart = memo(({ companies, title }) => (
    <div className="text-center">
        <h2>{title}</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={Object.entries(data).map(([sector, NombreAT]) => ({
                                    name: sector,
                                    value: NombreAT
                                }))}
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
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedDayOfWeekCompanyChart = memo(({ data }) => (
    <div className="text-center">
        <h2>Accidents par jour de la semaine par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {data.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="NombreAT" fill="#0088FE" name="Nombre d'accidents" />
                        </BarChart>
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

        case 'detailedCompany':
            return (
                <MemoizedDetailedCompanyChart
                    title={config.title}
                    companies={config.companies}
                />
            );

        case 'tfByCompany':
            return (
                <MemoizedTfByCompanyChart
                    companies={config.companies}
                    selectedYears={config.selectedYears}
                />
            );

        case 'workerTypeByCompany':
            return (
                <MemoizedWorkerTypeByCompanyChart
                    companies={config.companies}
                />
            );

        case 'ageByCompany':
            return (
                <MemoizedAgeByCompanyChart
                    companies={config.companies}
                />
            );

        case 'tfYearCompany':
            return (
                <MemoizedTfYearCompanyChart
                    data={config.data}
                    selectedYears={config.selectedYears}
                />
            );

        case 'accidentSectorCompany':
            return (
                <MemoizedAccidentSectorCompanyChart
                    companies={config.companies}
                    title={config.title}
                />
            );

        case 'dayOfWeekCompany':
            return (
                <MemoizedDayOfWeekCompanyChart
                    data={config.data}
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

        case 'detailedCompany':
            return {
                ...baseConfig,
                companies: options.companies || [],
            };

        case 'tfByCompany':
            return {
                ...baseConfig,
                companies: options.companies || [],
                selectedYears: options.selectedYears || [],
            };

        case 'workerTypeByCompany':
            return {
                ...baseConfig,
                companies: options.companies || [],
            };

        case 'ageByCompany':
            return {
                ...baseConfig,
                companies: options.companies || [],
            };

        case 'tfYearCompany':
            return {
                ...baseConfig,
                data: options.data || [],
                selectedYears: options.selectedYears || [],
            };

        case 'accidentSectorCompany':
            return {
                ...baseConfig,
                companies: options.companies || [],
                title: options.title || "Accidents par entreprise par secteur",
            };

        case 'dayOfWeekCompany':
            return {
                ...baseConfig,
                data: options.data || [],
            };

        default:
            return baseConfig;
    }
};

