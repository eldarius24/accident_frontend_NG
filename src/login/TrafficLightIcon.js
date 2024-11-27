import React from 'react';
import { SvgIcon } from '@mui/material';

const TrafficLightIcon = ({ color, ...props }) => {
    // Determine active light based on color
    const isRed = color === '#ff0000';
    const isOrange = color === '#ff9800' || color === '#ffd700';
    const isGreen = color === '#4caf50';

    return (
        <SvgIcon {...props} viewBox="0 0 288 288" sx={{ 
            fontSize: '288px',
            marginRight: '16px', // Add space between icon and text
            verticalAlign: 'middle' // Align with text
        }}>
            <rect
                x="72"  // Doubled from 36
                y="24"  // Doubled from 12
                width="144" // Doubled from 72
                height="240" // Doubled from 120
                rx="24"  // Doubled from 12
                fill="#333"
                stroke="#666"
                strokeWidth="4" // Doubled from 2
            />
            
            <circle
                cx="144" // Doubled from 72
                cy="84"  // Doubled from 42
                r="36"   // Doubled from 18
                fill={isRed ? '#ff0000' : '#660000'}
                opacity={isRed ? 1 : 0.3}
            />
            
            <circle
                cx="144" // Doubled from 72
                cy="144" // Doubled from 72
                r="36"   // Doubled from 18
                fill={isOrange ? '#ffa500' : '#805300'}
                opacity={isOrange ? 1 : 0.3}
            />
            
            <circle
                cx="144" // Doubled from 72
                cy="204" // Doubled from 102
                r="36"   // Doubled from 18
                fill={isGreen ? '#4caf50' : '#006600'}
                opacity={isGreen ? 1 : 0.3}
            />
        </SvgIcon> 
    );
};

export default TrafficLightIcon;