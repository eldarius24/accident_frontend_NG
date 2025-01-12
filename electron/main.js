const { app, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');

// Configuration Express
const serverApp = express();
serverApp.use(cors());
serverApp.use(express.json({ limit: '50mb' }));
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

// Route de test pour la signature (simulation)
serverApp.post('/sign', (req, res) => {
    res.json({
        success: true,
        signature: 'simulation_signature_' + Date.now(),
        certificate: 'simulation_certificate_' + Date.now()
    });
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