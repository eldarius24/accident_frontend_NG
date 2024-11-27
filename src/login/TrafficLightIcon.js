import React from 'react';
import { SvgIcon } from '@mui/material';

const TrafficLightIcon = ({ color, ...props }) => {
    // Determine active light based on color
    const isRed = color === '#ff0000';
    const isOrange = color === '#ff9800' || color === '#ffd700';
    const isGreen = color === '#4caf50';

    return (
        <SvgIcon {...props} viewBox="0 0 144 144" sx={{ fontSize: '144px' }}>
            {/* Background rectangle */}
            <rect
                x="36"
                y="12"
                width="72"
                height="120"
                rx="12"
                fill="#333"
                stroke="#666"
                strokeWidth="2"
            />

            {/* Red light */}
            <circle
                cx="72"
                cy="42"
                r="18"
                fill={isRed ? '#ff0000' : '#660000'}
                opacity={isRed ? 1 : 0.3}
            />

            {/* Orange light */}
            <circle
                cx="72"
                cy="72"
                r="18"
                fill={isOrange ? '#ffa500' : '#805300'}
                opacity={isOrange ? 1 : 0.3}
            />

            {/* Green light */}
            <circle
                cx="72"
                cy="102"
                r="18"
                fill={isGreen ? '#00ff00' : '#006600'}
                opacity={isGreen ? 1 : 0.3}
            />
        
    </SvgIcon>
);
    
};

export default TrafficLightIcon;