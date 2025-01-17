(function() {
    class BelgianEidBridge {
        constructor() {
            this.initialized = false;
            this.middleware = null;
            // Définir l'URL de l'API
            this.apiUrl = 'http://127.0.0.1:3100'; // URL du backend
        }

        async initialize() {
            try {
                // Vérifier si le middleware est déjà initialisé
                if (this.initialized) {
                    return true;
                }

                // Détecter le middleware via différentes méthodes
                if (typeof window.BeID !== 'undefined') {
                    this.middleware = window.BeID;
                    this.initialized = true;
                    return true;
                }

                // Vérifier via l'API Smartcard
                if (navigator.smartcard || window.navigator.smartcard) {
                    this.middleware = navigator.smartcard || window.navigator.smartcard;
                    this.initialized = true;
                    return true;
                }

                // Vérification via un appel au backend
                const response = await fetch(`${this.apiUrl}/api/signatures/check-system`);
                const status = await response.json();
                
                if (status.success) {
                    console.log('Statut du système:', status);
                    this.initialized = true;
                }
                return status.success;
            } catch (error) {
                console.error('Erreur initialisation eID:', error);
                return false;
            }
        }

        async getReaders() {
            try {
                if (this.middleware && this.middleware.getReaders) {
                    return await this.middleware.getReaders();
                }

                if (navigator.smartcard && navigator.smartcard.getReaders) {
                    return await navigator.smartcard.getReaders();
                }

                // Si pas d'accès direct, vérifier via le backend
                const response = await fetch(`${this.apiUrl}/api/signatures/check-system`);
                const status = await response.json();
                return status.readerStatus ? ['Lecteur détecté'] : [];
            } catch (error) {
                console.error('Erreur lecture des lecteurs:', error);
                return [];
            }
        }

        async getStatus() {
            try {
                await this.initialize();

                // Vérifier le statut via le backend
                const response = await fetch(`${this.apiUrl}/api/signatures/check-system`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const status = await response.json();
                console.log('Réponse brute du serveur:', status);

                return {
                    ready: status.ready,
                    middleware: status.middlewareStatus,
                    reader: status.readerStatus,
                    card: status.cardStatus,
                    details: status.details || []
                };
            } catch (error) {
                console.error('Erreur vérification statut:', error);
                return {
                    ready: false,
                    middleware: false,
                    reader: false,
                    card: false,
                    details: [`Erreur: ${error.message}`]
                };
            }
        }

        async sign(data) {
            if (!this.initialized) {
                await this.initialize();
            }

            try {
                // Vérifier d'abord le statut
                const status = await this.getStatus();
                if (!status.ready) {
                    throw new Error('Le système eID n\'est pas prêt pour la signature');
                }

                // Faire la signature via le backend
                const response = await fetch(`${this.apiUrl}/api/signatures/sign`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data })
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la signature');
                }

                return await response.json();
            } catch (error) {
                console.error('Erreur lors de la signature:', error);
                throw error;
            }
        }
    }

    // Créer et exposer l'instance
    window.beID = new BelgianEidBridge();

    // Log pour debug
    console.log('Bridge eID initialisé, vérification du système...');
    
    // Vérification initiale
    window.beID.getStatus().then(status => {
        console.log('Statut initial du système eID:', status);
    }).catch(error => {
        console.error('Erreur lors de la vérification initiale:', error);
    });
})();