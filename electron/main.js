const { app, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');

// Configuration Express
const serverApp = express();
serverApp.use(cors());
serverApp.use(express.json({ limit: '50mb' }));
// Ajouter un middleware pour les données binaires
serverApp.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

const PORT = 3200;

// Simulation du statut eID en mode développement
const mockEidStatus = {
    success: true,
    ready: true,
    middleware: true,
    reader: true,
    card: true,
    details: [
        '✅ Mode développement actif',
        '✅ Simulation du lecteur de carte',
        '✅ Simulation de la carte eID'
    ]
};

// Routes Express
serverApp.get('/status', (req, res) => {
    res.json(mockEidStatus);
});

// Route de signature modifiée pour gérer les données binaires
serverApp.post('/sign', (req, res) => {
    try {
        // En mode développement, on simule toujours une signature réussie
        const simulatedSignature = Buffer.from('simulation_signature_' + Date.now()).toString('base64');
        const simulatedCertificate = Buffer.from('simulation_certificate_' + Date.now()).toString('base64');

        res.json({
            success: true,
            signature: simulatedSignature,
            certificate: simulatedCertificate
        });
    } catch (error) {
        console.error('Erreur lors de la signature:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la signature'
        });
    }
});

// Démarrage de l'application
app.whenReady().then(() => {
    // Créer une fenêtre cachée pour maintenir l'application en vie
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });

    // Démarrer le serveur Express
    serverApp.listen(PORT, () => {
        console.log(`✅ Service de signature démarré sur le port ${PORT}`);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});