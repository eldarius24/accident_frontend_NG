import React from 'react';

const TrafficLightIcon = ({ color, ...props }) => {
    const isRed = color === '#ff0000';
    const isOrange = color === '#ff9800' || color === '#ffd700';
    const isGreen = color === '#4caf50';

    return (
        <div style={{ display: 'inline-block' }}>
            <svg
                width="300"
                height="216"
                viewBox="0 0 300 216"
                {...props}
            >
                <style>
                    {`
                        .blink {
                            animation: blinkAnimation 1.5s linear infinite;  
                        }
                        .blink-delayed {
                            animation: blinkAnimation 1.5s linear infinite 0.75s;  
                        }
                        @keyframes blinkAnimation {
                            0%, 100% { opacity: 1; }
                            15% { opacity: 0.3; }
                        }
                    `}
                </style>

                <defs>
                    <radialGradient id="emergencyGlow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="emergencyGlowOrange" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#ffa500" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ffa500" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="emergencyGlowGreen" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#00ff00" stopOpacity="1" />
                        <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
                    </radialGradient>
                    <filter id="emergencyBlur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                    </filter>
                </defs>

                <rect
                    x="96"
                    y="18"
                    width="108"
                    height="180"
                    rx="18"
                    fill="#333"
                    stroke="#666"
                    strokeWidth="3"
                />

                {(isRed || isGreen) && (
                    <>
                        <rect
                            x="12"
                            y="18"
                            width="72"
                            height="108"
                            rx="12"
                            fill="#333"
                            stroke="#666"
                            strokeWidth="2"
                        />

                        <rect
                            x="216"
                            y="18"
                            width="72"
                            height="108"
                            rx="12"
                            fill="#333"
                            stroke="#666"
                            strokeWidth="2"
                        />

                        <circle
                            cx="48"
                            cy="72"
                            r="36"
                            fill={isGreen ? "url(#emergencyGlowGreen)" : "url(#emergencyGlow)"}
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink-delayed"
                        />

                        <circle
                            cx="252"
                            cy="72"
                            r="36"
                            fill={isGreen ? "url(#emergencyGlowGreen)" : "url(#emergencyGlow)"}
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink-delayed"
                        />

                        <circle
                            cx="48"
                            cy="72"
                            r="24"
                            fill={isGreen ? "#00ff00" : "#ff0000"}
                            className="blink-delayed"
                        />

                        <circle
                            cx="252"
                            cy="72"
                            r="24"
                            fill={isGreen ? "#00ff00" : "#ff0000"}
                            className="blink-delayed"
                        />
                    </>
                )}

                {/* Effets de lueur pour les feux centraux */}
                {isRed && (
                    <circle
                        cx="150"
                        cy="63"
                        r="36"
                        fill="url(#emergencyGlow)"
                        style={{ filter: "url(#emergencyBlur)" }}
                        className="blink"
                    />
                )}
                {isOrange && (
                    <circle
                        cx="150"
                        cy="108"
                        r="36"
                        fill="url(#emergencyGlowOrange)"
                        style={{ filter: "url(#emergencyBlur)" }}
                        className="blink"
                    />
                )}
                {isGreen && (
                    <>
                        <circle
                            cx="150"
                            cy="63"
                            r="36"
                            fill="url(#emergencyGlowGreen)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="108"
                            r="36"
                            fill="url(#emergencyGlowGreen)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="153"
                            r="36"
                            fill="url(#emergencyGlowGreen)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                    </>
                )}

                {/* Feux centraux */}
                <circle
                    cx="150"
                    cy="63"
                    r="27"
                    fill={isGreen ? '#00ff00' : (isRed ? '#ff0000' : '#660000')}
                    opacity={isRed || isGreen ? 1 : 0.3}
                    className={isRed || isGreen ? "blink" : ""}
                />

                <circle
                    cx="150"
                    cy="108"
                    r="27"
                    fill={isGreen ? '#00ff00' : (isOrange ? '#ffa500' : '#805300')}
                    opacity={isGreen || isOrange ? 1 : 0.3}
                    className={isOrange || isGreen ? "blink" : ""}
                />

                <circle
                    cx="150"
                    cy="153"
                    r="27"
                    fill={isGreen ? '#00ff00' : '#006600'}
                    opacity={isGreen ? 1 : 0.3}
                    className={isGreen ? "blink" : ""}
                />
            </svg>
        </div>
    );
};

export default TrafficLightIcon;