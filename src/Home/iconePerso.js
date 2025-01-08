import AssessmentIcon from '@mui/icons-material/Assessment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TimelineIcon from '@mui/icons-material/Timeline';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import DescriptionIcon from '@mui/icons-material/Description';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';

import GestureIcon from '@mui/icons-material/Gesture';
import DrawIcon from '@mui/icons-material/Draw';
import VerifiedIcon from '@mui/icons-material/Verified';

import { useTheme } from '../Hook/ThemeContext.js';
import { Badge } from '@mui/material';

export const VehicleManagementIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <BuildIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem',
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <SettingsIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem',
                        }}
                    />
                }
            >
                <DirectionsCarFilledIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};

export const PreventionDocsIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <DescriptionIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem',
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <HealthAndSafetyIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem',
                        }}
                    />
                }
            >
                <FolderSpecialIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};

export const ActionPlanIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <EventNoteIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem',
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <CheckCircleIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem',
                        }}
                    />
                }
            >
                <AssignmentIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};

export const WorkAccidentStatsIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <BarChartIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem',
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <TimelineIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem',
                        }}
                    />
                }
            >
                <PersonOffIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};


export const WorkAccidentIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <ReportProblemIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem',
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <LocalHospitalIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem',
                        }}
                    />
                }
            >
                <PersonOffIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};


export const VehicleStatsIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    // Aligner avec le '3rem' des autres icônes
    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <AssessmentIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem', // 60% de la taille principale
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <TimelineIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem', // 60% de la taille principale
                        }}
                    />
                }
            >
                <DirectionsCarIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};

export const ElectronicSignatureIcon = ({ size = "medium" }) => {
    const { darkMode } = useTheme();

    const iconStyles = {
        fontSize: '3rem',
        color: darkMode ? '#ffffff' : '#000000',
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <DrawIcon
                    sx={{
                        ...iconStyles,
                        fontSize: '1.8rem',
                    }}
                />
            }
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <VerifiedIcon
                        sx={{
                            ...iconStyles,
                            fontSize: '1.8rem',
                        }}
                    />
                }
            >
                <GestureIcon sx={iconStyles} />
            </Badge>
        </Badge>
    );
};

