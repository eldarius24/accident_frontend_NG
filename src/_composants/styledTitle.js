import React, { memo } from 'react';

const StyledChart = ({ 
  chartType = 'line', // Défini par défaut sur 'line'
  data,
  title,
  darkMode = false,
  renderOptimizedChart,
  getRenderConfig,
  xAxis = 'year', // xAxis par défaut pour un graphique de ligne
  fill,
  className = '',
  showStyledTitle = true,
  showChartTitle = false
}) => {
  // Définir les gradients en dehors du JSX
  const titleGradient = darkMode
    ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
    : 'linear-gradient(45deg, #ee752d, #f4a261)';

  const blurBackground = darkMode
    ? 'rgba(122,142,28,0.1)'
    : 'rgba(238,117,45,0.1)';

  const lineGradient = darkMode
    ? 'linear-gradient(90deg, transparent, #7a8e1c, transparent)'
    : 'linear-gradient(90deg, transparent, #ee752d, transparent)';

  const topLineGradient = darkMode
    ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.3), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.3), transparent)';

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {showStyledTitle && (
        <div className="flex flex-col items-center relative my-6">
          {/* Background blur effect */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-12 blur-lg rounded-lg z-0"
            style={{
              backgroundColor: blurBackground
            }}
          />
          
          {/* Main title */}
          <div 
            className="text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest relative px-6 py-2 z-10 text-center"
            style={{
              backgroundImage: titleGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            }}
          >
            {title}
          </div>

          {/* Bottom gradient line */}
          <div className="relative w-full h-0.5">
            <div
              className="absolute bottom-0 left-0 w-full h-0.5"
              style={{
                backgroundImage: lineGradient
              }}
            />
          </div>

          {/* Top gradient line overlay */}
          <div className="absolute w-full h-full opacity-50 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-px"
              style={{
                backgroundImage: topLineGradient
              }}
            />
          </div>
        </div>
      )}

      {/* Zone du graphique */}
      <div className="w-full">
        {renderOptimizedChart(
          chartType,
          data,
          getRenderConfig(chartType, data, {
            title: showChartTitle ? title : "",
            xAxis: xAxis,
            fill: fill || (darkMode ? '#a4bd24' : '#82ca9d'), // Couleur par défaut pour le graphique de ligne
            darkMode: darkMode
          })
        )}
      </div>
    </div>
  );
};

export default memo(StyledChart);
