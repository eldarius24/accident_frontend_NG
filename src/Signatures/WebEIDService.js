// src/services/WebEIDService.js

class WebEIDService {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        try {
            if (!window.beID) {
                throw new Error('Le middleware eID n\'est pas installé');
            }
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Erreur d\'initialisation WebEID:', error);
            return false;
        }
    }

    async checkStatus() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const status = await window.beID.getStatus();
            return {
                success: true,
                ready: status.ready,
                details: [
                    status.middleware ? '✅ Middleware eID détecté' : '❌ Middleware eID non détecté',
                    status.reader ? '✅ Lecteur détecté' : '❌ Lecteur non détecté',
                    status.card ? '✅ Carte eID détectée' : '❌ Carte non détectée'
                ],
                issues: this.getIssues(status)
            };
        } catch (error) {
            return {
                success: false,
                ready: false,
                details: ['❌ Service eID non disponible'],
                issues: [{
                    type: 'middleware',
                    message: 'Veuillez installer le middleware eID',
                    link: 'https://eid.belgium.be/fr'
                }]
            };
        }
    }

    getIssues(status) {
        const issues = [];
        if (!status.middleware) {
            issues.push({
                type: 'middleware',
                message: 'Le middleware eID doit être installé',
                link: 'https://eid.belgium.be/fr'
            });
        }
        if (!status.reader) {
            issues.push({
                type: 'reader',
                message: 'Aucun lecteur de carte détecté'
            });
        }
        if (!status.card) {
            issues.push({
                type: 'card',
                message: 'Veuillez insérer votre carte eID'
            });
        }
        return issues;
    }

    async signPDF(pdfBuffer) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Vérifier le statut avant la signature
            const status = await this.checkStatus();
            if (!status.ready) {
                throw new Error(status.details.filter(d => d.includes('❌')).join('\n'));
            }

            // Créer un hash du document
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', pdfBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Signer avec la carte eID
            const signatureResult = await window.beID.sign({
                algorithm: 'SHA256withRSA',
                data: hashHex
            });

            return {
                success: true,
                signature: signatureResult.signature,
                certificate: signatureResult.certificate
            };

        } catch (error) {
            console.error('Erreur de signature:', error);
            throw new Error(error.message || 'Erreur lors de la signature');
        }
    }
}

export default new WebEIDService();