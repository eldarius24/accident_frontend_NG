class PDFSignatureService {
    async checkMiddleware() {
        // Vérifier si le middleware est installé via l'existence de l'API eID
        return typeof window.beID !== 'undefined' || 
               (navigator.smartcard || window.navigator.smartcard) !== undefined;
    }

    async getReaderStatus() {
        try {
            const smartcard = navigator.smartcard || window.navigator.smartcard;
            if (!smartcard) {
                return { hasReader: false, hasCard: false };
            }

            const readers = await smartcard.getReaders();
            const hasReader = readers.length > 0;

            let hasCard = false;
            if (hasReader) {
                for (const reader of readers) {
                    const status = await reader.getStatus();
                    if (status && status.cards && status.cards.length > 0) {
                        hasCard = true;
                        break;
                    }
                }
            }

            return { hasReader, hasCard };
        } catch (error) {
            console.error('Erreur lors de la vérification du lecteur:', error);
            return { hasReader: false, hasCard: false };
        }
    }

    async signPDF(pdfBuffer, signerInfo) {
        try {
            // 1. Vérifier le middleware
            const hasMiddleware = await this.checkMiddleware();
            if (!hasMiddleware) {
                throw new Error('Le middleware eID n\'est pas installé');
            }

            // 2. Vérifier le lecteur et la carte
            const { hasReader, hasCard } = await this.getReaderStatus();
            if (!hasReader) {
                throw new Error('Aucun lecteur de carte détecté');
            }
            if (!hasCard) {
                throw new Error('Aucune carte eID détectée');
            }

            // 3. Créer le hash du document
            const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // 4. Signer avec eID
            if (!window.beID) {
                throw new Error('L\'API eID n\'est pas disponible');
            }

            const signatureResult = await window.beID.sign({
                algorithm: 'SHA256withRSA',
                data: hashHex
            });

            return {
                success: true,
                signature: signatureResult.signature,
                certificate: signatureResult.certificate,
                signerInfo,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Erreur lors de la signature:', error);
            throw new Error('Erreur lors de la signature: ' + error.message);
        }
    }

    async verifyCertificate() {
        try {
            if (!window.beID) {
                throw new Error('L\'API eID n\'est pas disponible');
            }

            const status = await window.beID.getStatus();
            return {
                success: true,
                hasValidCertificate: status.card && status.certificate,
                details: status
            };
        } catch (error) {
            console.error('Erreur lors de la vérification du certificat:', error);
            return {
                success: false,
                hasValidCertificate: false,
                error: error.message
            };
        }
    }
}

export default new PDFSignatureService();