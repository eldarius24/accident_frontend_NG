import React, { useState, useEffect } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useUserConnected } from '../Hook/userConnected';

const EIDSystemChecker = ({ onStatusChange }) => {
    const [status, setStatus] = useState({
        middlewareInstalled: false,
        readerConnected: false,
        cardPresent: false,
        checking: true
    });

    const { isDeveloppeur } = useUserConnected();

    const checkMiddleware = async () => {
        try {
            // Vérifier la présence de l'API eID via les différentes méthodes possibles
            const hasEidApi = !!(window.eID || window.beID);
            const hasSmartcard = !!(navigator.smartcard || window.navigator.smartcard);
            const hasPkcs11 = !!window.pkcs11;

            if (isDeveloppeur) {
                console.log('État des APIs:', {
                    eID: hasEidApi,
                    smartcard: hasSmartcard,
                    pkcs11: hasPkcs11
                });
            }

            // Si l'une des APIs est disponible, on considère que le middleware est installé
            return hasEidApi || hasSmartcard || hasPkcs11;
        } catch (error) {
            console.warn('Erreur vérification middleware:', error);
            return false;
        }
    };

    const checkReader = async () => {
        try {
            let hasReader = false;

            // Méthode 1: via Smartcard API
            if (navigator.smartcard || window.navigator.smartcard) {
                const smartcard = navigator.smartcard || window.navigator.smartcard;
                try {
                    const readers = await smartcard.getReaders();
                    hasReader = readers.length > 0;
                    if (isDeveloppeur) {
                        console.log('Lecteurs trouvés via Smartcard API:', readers);
                    }
                } catch (e) {
                    console.warn('Erreur Smartcard API:', e);
                }
            }

            // Méthode 2: via PKCS11
            if (!hasReader && window.pkcs11) {
                try {
                    const slots = await window.pkcs11.C_GetSlotList(true);
                    hasReader = slots.length > 0;
                    if (isDeveloppeur) {
                        console.log('Slots trouvés via PKCS11:', slots);
                    }
                } catch (e) {
                    console.warn('Erreur PKCS11:', e);
                }
            }

            return hasReader;
        } catch (error) {
            console.warn('Erreur vérification lecteur:', error);
            return false;
        }
    };

    const checkCard = async () => {
        try {
            let hasCard = false;

            // Méthode 1: via Smartcard API
            if (navigator.smartcard || window.navigator.smartcard) {
                const smartcard = navigator.smartcard || window.navigator.smartcard;
                try {
                    const readers = await smartcard.getReaders();
                    for (const reader of readers) {
                        try {
                            const status = await reader.getStatus();
                            if (status && status.cards && status.cards.length > 0) {
                                hasCard = true;
                                break;
                            }
                        } catch (e) {
                            console.warn('Erreur lecture carte:', e);
                        }
                    }
                } catch (e) {
                    console.warn('Erreur Smartcard API:', e);
                }
            }

            // Méthode 2: via PKCS11
            if (!hasCard && window.pkcs11) {
                try {
                    const slots = await window.pkcs11.C_GetSlotList(true); // true = only slots with tokens
                    hasCard = slots.length > 0;
                } catch (e) {
                    console.warn('Erreur PKCS11:', e);
                }
            }

            return hasCard;
        } catch (error) {
            console.warn('Erreur vérification carte:', error);
            return false;
        }
    };

    const checkEIDSystem = async () => {
        try {
            if (isDeveloppeur) {
                console.log('Vérification système eID...');
            }

            const [middlewareInstalled, readerConnected, cardPresent] = await Promise.all([
                checkMiddleware(),
                checkReader(),
                checkCard()
            ]);

            if (isDeveloppeur) {
                console.log('Résultats vérification:', {
                    middlewareInstalled,
                    readerConnected,
                    cardPresent
                });
            }

            const newStatus = {
                middlewareInstalled,
                readerConnected,
                cardPresent,
                checking: false
            };

            setStatus(newStatus);

            if (onStatusChange) {
                onStatusChange({
                    success: middlewareInstalled && readerConnected && cardPresent,
                    ready: middlewareInstalled && readerConnected && cardPresent,
                    details: [
                        middlewareInstalled ? '✅ Middleware eID détecté' : '❌ Middleware eID non détecté',
                        readerConnected ? '✅ Lecteur de carte détecté' : '❌ Lecteur de carte non détecté',
                        cardPresent ? '✅ Carte eID détectée' : '❌ Carte eID non détectée'
                    ],
                    issues: getSystemIssues(newStatus)
                });
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du système eID:', error);
            setStatus(prev => ({ ...prev, checking: false }));
        }
    };

    const getSystemIssues = (status) => {
        const issues = [];
        
        if (!status.middlewareInstalled) {
            issues.push({
                type: 'middleware',
                message: 'Le middleware eID n\'est pas détecté',
                hint: 'Veuillez vérifier que le middleware eID est bien installé et redémarrer votre navigateur'
            });
        }
        
        if (!status.readerConnected) {
            issues.push({
                type: 'reader',
                message: 'Aucun lecteur de carte détecté',
                hint: 'Veuillez vérifier que votre lecteur est bien connecté et reconnu par Windows'
            });
        }
        
        if (!status.cardPresent && status.readerConnected) {
            issues.push({
                type: 'card',
                message: 'Aucune carte eID détectée',
                hint: 'Veuillez insérer votre carte eID dans le lecteur'
            });
        }
        
        return issues;
    };

    useEffect(() => {
        checkEIDSystem();
        const interval = setInterval(checkEIDSystem, 2000);
        return () => clearInterval(interval);
    }, []);

    if (status.checking) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <Typography>Vérification du système eID...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {!status.middlewareInstalled && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    Le middleware eID n'est pas détecté. 
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                            1. Installez le middleware depuis{' '}
                            <a
                                href="https://eid.belgium.be"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                eid.belgium.be
                            </a>
                        </Typography>
                        <Typography variant="body2">
                            2. Redémarrez votre navigateur après l'installation
                        </Typography>
                    </Box>
                </Alert>
            )}
            
            {!status.readerConnected && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    Aucun lecteur de carte détecté.
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Vérifiez que votre lecteur est bien connecté et reconnu dans le gestionnaire de périphériques Windows.
                    </Typography>
                </Alert>
            )}
            
            {!status.cardPresent && status.readerConnected && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Aucune carte eID détectée.
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Veuillez insérer votre carte eID dans le lecteur.
                    </Typography>
                </Alert>
            )}
            
            {status.middlewareInstalled && status.readerConnected && status.cardPresent && (
                <Alert severity="success">
                    Système eID prêt pour la signature
                </Alert>
            )}
        </Box>
    );
};

export default EIDSystemChecker;