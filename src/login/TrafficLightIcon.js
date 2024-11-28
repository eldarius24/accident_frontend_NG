import React from 'react';
import { SvgIcon } from '@mui/material';

const TrafficLightIcon = ({ color, ...props }) => {
    // Determine active light based on color
    const isRed = color === '#ff0000';
    const isOrange = color === '#ff9800' || color === '#ffd700';
    const isGreen = color === '#4caf50';

    return (
        <SvgIcon {...props} viewBox="0 0 200 144" sx={{ fontSize: '144px' }}>
            {/* Define the blinking animation */}
            <defs>
                <radialGradient id="emergencyGlow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#ff0000" stopOpacity="1"/>
                    <stop offset="100%" stopColor="#ff0000" stopOpacity="0"/>
                </radialGradient>
                
                <filter id="emergencyBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
                </filter>
            </defs>

            {/* Background rectangle */}
            <rect
                x="64"
                y="12"
                width="72"
                height="120"
                rx="12"
                fill="#333"
                stroke="#666"
                strokeWidth="2"
            />

            {/* Emergency lights - Only visible when red */}
            {isRed && (
                <>
                    {/* Left emergency light base */}
                    <rect
                        x="8"
                        y="12"
                        width="48"
                        height="72"
                        rx="8"
                        fill="#333"
                        stroke="#666"
                        strokeWidth="1"
                    />

                    {/* Right emergency light base */}
                    <rect
                        x="144"
                        y="12"
                        width="48"
                        height="72"
                        rx="8"
                        fill="#333"
                        stroke="#666"
                        strokeWidth="1"
                    />

                    {/* Left emergency light glow */}
                    <circle
                        cx="32"
                        cy="48"
                        r="24"
                        fill="url(#emergencyGlow)"
                        filter="url(#emergencyBlur)">
                        <animate
                            attributeName="opacity"
                            values="1;0.3;1"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    {/* Right emergency light glow */}
                    <circle
                        cx="168"
                        cy="48"
                        r="24"
                        fill="url(#emergencyGlow)"
                        filter="url(#emergencyBlur)">
                        <animate
                            attributeName="opacity"
                            values="1;0.3;1"
                            dur="0.5s"
                            repeatCount="indefinite"
                            begin="0.25s"
                        />
                    </circle>

                    {/* Left emergency light */}
                    <circle
                        cx="32"
                        cy="48"
                        r="16"
                        fill="#ff0000">
                        <animate
                            attributeName="opacity"
                            values="1;0.3;1"
                            dur="0.5s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    {/* Right emergency light */}
                    <circle
                        cx="168"
                        cy="48"
                        r="16"
                        fill="#ff0000">
                        <animate
                            attributeName="opacity"
                            values="1;0.3;1"
                            dur="0.5s"
                            repeatCount="indefinite"
                            begin="0.25s"
                        />
                    </circle>
                </>
            )}

            {/* Regular traffic lights */}
            <circle
                cx="100"
                cy="42"
                r="18"
                fill={isRed ? '#ff0000' : '#660000'}
                opacity={isRed ? 1 : 0.3}
            />

            <circle
                cx="100"
                cy="72"
                r="18"
                fill={isOrange ? '#ffa500' : '#805300'}
                opacity={isOrange ? 1 : 0.3}
            />

            <circle
                cx="100"
                cy="102"
                r="18"
                fill={isGreen ? '#00ff00' : '#006600'}
                opacity={isGreen ? 1 : 0.3}
            />
        </SvgIcon>
    );
};

export default TrafficLightIcon;