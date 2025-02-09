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
                            animation: blinkAnimation 1.75s linear infinite;  
                        }
                        @keyframes blinkAnimation {
                            0%, 100% { opacity: 1; }
                            20% { opacity: 0; }
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

                {/* Boîtiers */}
                <rect
                    x="96"
                    y="8"
                    width="108"
                    height="200"
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
                    </>
                )}

                {/* Feux rouges */}
                {isRed && (
                    <>
                        {/* Feux latéraux */}
                        <circle
                            cx="48"
                            cy="72"
                            r="36"
                            fill="url(#emergencyGlow)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="252"
                            cy="72"
                            r="36"
                            fill="url(#emergencyGlow)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="48"
                            cy="72"
                            r="24"
                            fill="#ff0000"
                            className="blink"
                        />
                        <circle
                            cx="252"
                            cy="72"
                            r="24"
                            fill="#ff0000"
                            className="blink"
                        />
                        {/* Feu central rouge */}
                        <circle
                            cx="150"
                            cy="54"
                            r="36"
                            fill="url(#emergencyGlow)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="54"
                            r="27"
                            fill="#ff0000"
                            className="blink"
                        />
                    </>
                )}

                {/* Feu orange */}
                {isOrange && (
                    <>
                        <circle
                            cx="150"
                            cy="108"
                            r="36"
                            fill="url(#emergencyGlowOrange)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="108"
                            r="27"
                            fill="#ffa500"
                            className="blink"
                        />
                    </>
                )}

                {/* Feux verts */}
                {isGreen && (
                    <>
                        {/* Feux latéraux */}
                        <circle
                            cx="48"
                            cy="72"
                            r="36"
                            fill="url(#emergencyGlowGreen)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="252"
                            cy="72"
                            r="36"
                            fill="url(#emergencyGlowGreen)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="48"
                            cy="72"
                            r="24"
                            fill="#00ff00"
                            className="blink"
                        />
                        <circle
                            cx="252"
                            cy="72"
                            r="24"
                            fill="#00ff00"
                            className="blink"
                        />
                        {/* Feux centraux verts */}
                        <circle
                            cx="150"
                            cy="54"
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
                            cy="162"
                            r="36"
                            fill="url(#emergencyGlowGreen)"
                            style={{ filter: "url(#emergencyBlur)" }}
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="54"
                            r="27"
                            fill="#00ff00"
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="108"
                            r="27"
                            fill="#00ff00"
                            className="blink"
                        />
                        <circle
                            cx="150"
                            cy="162"
                            r="27"
                            fill="#00ff00"
                            className="blink"
                        />
                    </>
                )}

                {/* Feux éteints */}
                {!isRed && !isGreen && (
                    <circle
                        cx="150"
                        cy="54"
                        r="27"
                        fill="#660000"
                        opacity={0.3}
                    />
                )}
                {!isOrange && !isGreen && (
                    <circle
                        cx="150"
                        cy="108"
                        r="27"
                        fill="#805300"
                        opacity={0.3}
                    />
                )}
                {!isGreen && (
                    <circle
                        cx="150"
                        cy="162"
                        r="27"
                        fill="#006600"
                        opacity={0.3}
                    />
                )}
            </svg>
        </div>
    );
};

export default TrafficLightIcon;