class SignatureClient {
    constructor() {
        this.baseUrl = 'http://localhost:3200';
        this.eventListeners = new Map();
    }

    async checkStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/status`);
            if (!response.ok) {
                throw new Error('Service non disponible');
            }
            const status = await response.json();
            this._notifyListeners('status', status);
            return status;
        } catch (error) {
            const errorStatus = {
                success: false,
                ready: false,
                middleware: false,
                reader: false,
                card: false,
                details: ['❌ Service de signature non disponible']
            };
            this._notifyListeners('status', errorStatus);
            return errorStatus;
        }
    }

    async signData(data) {
        try {
            // Convertir les données en Base64 si nécessaire
            const base64Data = data instanceof Uint8Array 
                ? this._arrayBufferToBase64(data) 
                : data;

            const response = await fetch(`${this.baseUrl}/sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: base64Data })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur de signature');
            }

            return await response.json();
        } catch (error) {
            this._notifyListeners('error', {
                code: 'SIGN_ERROR',
                message: error.message
            });
            throw error;
        }
    }

    _arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);

        // Configurer les écouteurs IPC pour les événements Electron
        if (this.electron) {
            this.electron.on(`signature:${event}`, (_, data) => {
                this._notifyListeners(event, data);
            });
        }
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).delete(callback);
        }
        // Retirer les écouteurs IPC
        if (this.electron) {
            this.electron.removeAllListeners(`signature:${event}`);
        }
    }

    _notifyListeners(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Erreur dans le listener:', error);
                }
            });
        }
    }

    startMonitoring(interval = 5000) {
        if (this.monitoringInterval) {
            this.stopMonitoring();
        }
        this.monitoringInterval = setInterval(() => {
            this.checkStatus();
        }, interval);
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
}

export default SignatureClient;