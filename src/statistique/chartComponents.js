import React, { memo } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

// Définition des styles communs pour tous les Tooltips
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

// Tooltips personnalisés pour chaque type de graphique
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

const CustomTfTooltip = ({ active, payload, label, darkMode }) => {
    if (active && payload && payload.length) {
        const tooltipStyle = getTooltipStyle(darkMode);
        const contentStyle = getTooltipContentStyle(darkMode);
        const data = payload[0].payload;
        return (
            <div style={tooltipStyle}>
                <div style={contentStyle.title}>Année: {label}</div>
                <div style={contentStyle.row}>
                    <span style={contentStyle.label}>Taux de fréquence:</span>
                    <span style={contentStyle.value}>
                        {data.tf.toFixed(2)}
                    </span>
                </div>
                <div style={contentStyle.row}>
                    <span style={contentStyle.label}>Heures prestées:</span>
                    <span style={contentStyle.value}>
                        {data.heuresPreste.toLocaleString()}
                    </span>
                </div>
                <div style={contentStyle.row}>
                    <span style={contentStyle.label}>Accidents:</span>
                    <span style={contentStyle.value}>
                        {data.accidents}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};


const MemoizedGenderByCompanyChart = memo(({ companies, darkMode }) => (
    <div className="text-center">
        <h2>Accidents par genre et par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
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
                            <Tooltip
                                content={props =>
                                    <CustomPieChartTooltip
                                        {...props}
                                        darkMode={darkMode}
                                        company={company}
                                    />
                                }
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedPieChart = memo(({ data, title, darkMode }) => (
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
                <Tooltip content={props => <CustomPieChartTooltip {...props} darkMode={darkMode} />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
));

const MemoizedBarChart = memo(({ data, title, xKey, dataKey = "NombreAT", fill, darkMode }) => (
    <div className="col-span-full">
        <h2>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={xKey}
                    tick={{
                        fill: darkMode ? '#ffffff' : '#666666'
                    }}
                />
                <YAxis tick={{ fill: darkMode ? '#ffffff' : '#666666' }} />
                <Tooltip content={props => <CustomBarChartTooltip {...props} darkMode={darkMode} />} />
                <Legend />
                <Bar dataKey={dataKey} fill={fill} />
            </BarChart>
        </ResponsiveContainer>
    </div>
));

const MemoizedLineChart = memo(({ data, title, xKey, series, darkMode }) => (
    <div className="col-span-full">
        <h2>{title}</h2>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={xKey}
                    tick={{
                        fill: darkMode ? '#ffffff' : '#666666'
                    }}
                />
                <YAxis />
                <Tooltip content={props => <CustomLineChartTooltip {...props} darkMode={darkMode} />} />
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

const MemoizedCompanyChart = memo(({ title, companies, ChartType, renderData, darkMode }) => (
    <div className="text-center">
        <h2>{title}</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        {ChartType === PieChart ? (
                            <PieChart>
                                <Pie
                                    data={Object.entries(data).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill={darkMode ? '#ffffff' : '#666666'}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {Object.entries(data).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={props => <CustomPieChartTooltip {...props} darkMode={darkMode} />} />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: darkMode ? '#ffffff' : '#666666' }}>
                                            {value}
                                        </span>
                                    )}
                                />

                            </PieChart>
                        ) : (
                            <BarChart data={renderData(data)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey={renderData.xKey}
                                    tick={{
                                        fill: darkMode ? '#ffffff' : '#666666'
                                    }}
                                />
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


const MemoizedDetailedCompanyChart = memo(({ title, companies, darkMode }) => (
    <div className="text-center">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-lg font-semibold mb-2">{company}</h3>
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
                                    tick={{
                                        fill: darkMode ? '#ffffff' : '#666666'
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Taux de fréquence',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip content={props => <CustomLineChartTooltip {...props} darkMode={darkMode} />} />
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

const MemoizedTfByCompanyChart = memo(({ companies, selectedYears, darkMode }) => (
    <div className="text-center">
        <h2>Taux de fréquence par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={data.filter(item => selectedYears.includes(parseInt(item.year)))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="year"
                                tick={{
                                    fontSize: 12,
                                    fill: darkMode ? '#ffffff' : '#666666'
                                }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={props => <CustomLineChartTooltip {...props} darkMode={darkMode} />} />
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

const MemoizedWorkerTypeByCompanyChart = memo(({ companies, darkMode }) => (
    <div className="text-center">
        <h2>Accidents par type de travailleur et par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="typeTravailleur"
                                tick={{
                                    fontSize: 12,
                                    fill: darkMode ? '#ffffff' : '#666666'
                                }}
                            />
                            <YAxis />
                            <Tooltip content={props => <CustomBarChartTooltip {...props} darkMode={darkMode} />} />
                            <Legend />
                            <Bar dataKey="NombreAT" fill="#0088FE" name="Nombre d'accidents" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedAgeByCompanyChart = memo(({ companies, darkMode }) => (
    <div className="text-center">
        <h2>Accidents par âge du travailleur et par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="age"
                                tick={{
                                    fontSize: 12,
                                    fill: darkMode ? '#ffffff' : '#666666'
                                }}
                            />
                            <YAxis />
                            <Tooltip content={props => <CustomBarChartTooltip {...props} darkMode={darkMode} />} />
                            <Legend />
                            <Bar dataKey="NombreAT" fill="#8884d8" name="Nombre d'accidents" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedTfYearCompanyChart = memo(({ data, selectedYears, darkMode }) => {
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
                        tick={{
                            fontSize: 12,
                            fill: darkMode ? '#ffffff' : '#666666'
                        }}
                    />
                    <YAxis />
                    <Tooltip content={props => <CustomLineChartTooltip {...props} darkMode={darkMode} />} />
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

const MemoizedAccidentSectorCompanyChart = memo(({ companies, title, darkMode }) => (
    <div className="text-center">
        <h2>{title}</h2>
        <div className="flex flex-wrap justify-center">
            {companies.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
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
                            <Tooltip
                                content={props =>
                                    <CustomPieChartTooltip
                                        {...props}
                                        darkMode={darkMode}
                                        company={company}
                                    />
                                }
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    </div>
));

const MemoizedDayOfWeekCompanyChart = memo(({ data, darkMode }) => (
    <div className="text-center">
        <h2>Accidents par jour de la semaine par entreprise</h2>
        <div className="flex flex-wrap justify-center">
            {data.map(({ company, data }) => (
                <div key={company} className="my-4 w-full md:w-1/2 lg:w-1/3">
                    <h3 style={{ color: darkMode ? '#ffffff' : 'inherit' }} className="text-xl font-bold text-center">{company}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                tick={{
                                    fontSize: 12,
                                    fill: darkMode ? '#ffffff' : '#666666'
                                }}
                            />
                            <YAxis />
                            <Tooltip content={props => <CustomBarChartTooltip {...props} darkMode={darkMode} />} />
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
            return <MemoizedPieChart
                data={data}
                title={config.title}
                darkMode={config.darkMode}
            />;

        case 'bar':
            return (
                <MemoizedBarChart
                    data={data}
                    title={config.title}
                    xKey={config.xAxis}
                    fill={config.fill}
                    darkMode={config.darkMode}
                />
            );

        case 'line':
            return (
                <MemoizedLineChart
                    data={data}
                    title={config.title}
                    xKey={config.xAxis}
                    series={config.series}
                    darkMode={config.darkMode}
                />
            );

        case 'company':
            return (
                <MemoizedCompanyChart
                    title={config.title}
                    companies={config.companies}
                    ChartType={config.component}
                    renderData={config.renderData}
                    darkMode={config.darkMode}
                />
            );

        case 'detailedCompany':
            return (
                <MemoizedDetailedCompanyChart
                    title={config.title}
                    companies={config.companies}
                    darkMode={config.darkMode}
                />
            );

        case 'tfByCompany':
            return (
                <MemoizedTfByCompanyChart
                    companies={config.companies}
                    selectedYears={config.selectedYears}
                    darkMode={config.darkMode}
                />
            );

        case 'workerTypeByCompany':
            return (
                <MemoizedWorkerTypeByCompanyChart
                    companies={config.companies}
                    darkMode={config.darkMode}
                />
            );

        case 'ageByCompany':
            return (
                <MemoizedAgeByCompanyChart
                    companies={config.companies}
                    darkMode={config.darkMode}
                />
            );

        case 'tfYearCompany':
            return (
                <MemoizedTfYearCompanyChart
                    data={config.data}
                    selectedYears={config.selectedYears}
                    darkMode={config.darkMode}
                />
            );

        case 'accidentSectorCompany':
            return (
                <MemoizedAccidentSectorCompanyChart
                    companies={config.companies}
                    title={config.title}
                    darkMode={config.darkMode}
                />
            );

        case 'dayOfWeekCompany':
            return (
                <MemoizedDayOfWeekCompanyChart
                    data={config.data}
                    darkMode={config.darkMode}
                />
            );

        case 'genderByCompany':
            return (
                <MemoizedGenderByCompanyChart
                    companies={config.companies}
                    darkMode={config.darkMode}
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

            case 'genderByCompany':
                return {
                  ...baseConfig,
                  companies: options.companies || [],
                };

        default:
            return baseConfig;
    }
};

